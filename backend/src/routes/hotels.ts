import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types";
import { param, validationResult } from "express-validator";
import Stripe from "stripe";
import { verifyToken } from "../middleware/auth";

// Initialized stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY! as string);

const router = express.Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = constructSearchQuery(req.query);
    let sortOptions = {};
    switch (req.query.sortOption) {
      case "starRating":
        sortOptions = { starRating: -1 };
        break;
      case "pricePerNightAsc":
        sortOptions = { pricePerNight: 1 };
        break;
      case "pricePerNightDesc":
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : "1"
    );
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    res.json(response);
  } catch (error) {
    console.log("error " + error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send({ message: errors.array() });
      }
      const id = req.params.id.toString();

      const hotel = await Hotel.findById(id);
      if (!hotel) {
        return res.status(404).send({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      console.log("error " + error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

// Creating payment intent
router.post(
  "/:hotelId/booking/payment-intent",
  verifyToken,
  async (req: Request, res: Response) => {
    // 1. totalCost
    // 2. hotelId
    // 3. userId
    try {
      const { numberOfNights } = req.body;
      const hotelId = req.params.hotelId;
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return res.status(404).send({ message: "Hotel not found" });
      }
      const totalCost = Number(hotel.pricePerNight) * Number(numberOfNights);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "usd",
        metadata: {
          hotelId,
          userId: req.userId as string,
        },
      });

      if (!paymentIntent.client_secret) {
        return res.status(500).send({ message: "Internal server error" });
      }

      const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost: totalCost,
      };

      res.json(response);
    } catch (error) {
      console.log("error " + error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

// Creating a booking
router.post(
  "/:hotelId/bookings",
  verifyToken,
  async (req: Request, res: Response) => {
    try {
      const paymentIntentId = req.body.paymentIntentId;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string
      );

      if (!paymentIntent) {
        return res.status(404).send({ message: "Payment intent not found" });
      }

      if (
        paymentIntent.metadata.userId !== req.userId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(403).send({ message: "Forbidden" });
      }

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).send({
          message: "Payment not successful. Status:" + paymentIntent.status,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId as string,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking }, // push the new booking to the bookings array
        }
      );

      if(!hotel) {
        return res.status(404).send({ message: "Hotel not found" });
      }

      await hotel.save();
      res.status(201).send({ message: "Booking created successfully" });

    } catch (error) {
      console.log("error " + error);
      res.status(500).send({ message: "Internal server error" });
    }
  }
);

const constructSearchQuery = (queryParams: any) => {
  let constructedQuery: any = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export default router;
