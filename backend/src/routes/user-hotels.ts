import express, { Request, Response } from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { verifyToken } from "../middleware/auth";
import { body } from "express-validator";
import { HotelType } from "../shared/types";
const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // no larger than 25mb
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    let dataURI = `data:${image.mimetype};base64,${b64}`;
    const response = await cloudinary.v2.uploader.upload(dataURI);
    return response.secure_url;
  });
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}

router.post(
  "/",
  verifyToken,
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("adultCount").notEmpty().withMessage("Adult count is required"),
    body("childCount").notEmpty().withMessage("Child count is required"),
    body("facilities")
      .notEmpty()
      .isArray()
      .withMessage("Facilities array required and must be an array"),
    body("pricePerNight")
      .notEmpty()
      .isNumeric()
      .withMessage("Price per night is required and must be a number"),
  ],
  upload.array("imageFiles", 6),
  async (req: Request, res: Response) => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;
      // upload the images to cloudinary
      const imageUrls = await uploadImages(imageFiles);
      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId ?? "";
      if (!newHotel.userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const hotel = new Hotel(newHotel);
      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      console.error(
        "Error Creating hotels " +
          (error as Error) +
          " " +
          (error as Error).message
      );
      res.status(500).json({ message: "Something went wrong", error });
    }
  }
);

router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    console.error(
      "Error getting hotels " +
        (error as Error) +
        " " +
        (error as Error).message
    );
    res.status(500).json({ message: "Error fetching hotels" });
  }
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
  try {
    const hotel = await Hotel.findOne({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.json(hotel);
  } catch (error) {
    console.error(
      "Error getting hotel " + (error as Error) + " " + (error as Error).message
    );
    res.status(500).json({ message: "Error fetching hotel" });
  }
});

router.put(
  "/:id",
  verifyToken,
  upload.array("imageFiles"),
  async (req: Request, res: Response) => {
    try {
      const updatedHotel: HotelType = req.body;
      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        updatedHotel,
        { new: true }
      );
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      hotel.lastUpdated = new Date();

      const files = req.files as Express.Multer.File[];
      const updatedImagesUrls = await uploadImages(files);

      hotel.imageUrls = [
        ...updatedImagesUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();
      res.status(201).json(hotel);
    } catch (error) {
      console.error(
        "Error updating hotel " +
          (error as Error) +
          " " +
          (error as Error).message
      );
      res.status(500).json({ message: "Error updating hotel" });
    }
  }
);

export default router;
