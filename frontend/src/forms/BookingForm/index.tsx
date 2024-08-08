import { PaymentIntentResponse, UserType } from "@shared/types";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useForm } from "react-hook-form";
import { useSearchContext } from "../../contexts/SearchContext";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "react-query";
import * as apiClient from "../../api-client";
import { useAppContext } from "../../contexts/AppContext";

type Props = {
  currentUser: UserType;
  paymentIntent: PaymentIntentResponse;
};

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  hotelId: string;
  checkIn: string;
  checkOut: string;
  adultCount: number;
  childCount: number;
  paymentIntentId: string;
  totalCost: number;
};

const BookingForm = ({ currentUser, paymentIntent }: Props) => {
  const search = useSearchContext();
  const { hotelId } = useParams();

  const navigate = useNavigate()

  const { showToast } = useAppContext();

  const { mutate: bookRoom, isLoading } = useMutation(
    apiClient.createRoomBooking,
    {
      onSuccess: () => {
        showToast({ message: "Booking Saved!", type: "SUCCESS" });
        navigate("/my-booking");
      },
      onError: () => {
        showToast({ message: "Error saving booking", type: "ERROR" });
      },
    }
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      adultCount: search.adultCount,
      childCount: search.childCount,
      checkIn: search.checkIn?.toISOString(),
      checkOut: search.checkOut?.toISOString(),
      hotelId: hotelId,
      paymentIntentId: paymentIntent.paymentIntentId,
      totalCost: paymentIntent.totalCost,
    },
  });

  //enable stripe features
  const stripe = useStripe();
  const elements = useElements();
  const onSubmit = async (data: BookingFormData) => {
    if (!stripe || !elements) return;
    // complete the payment with the card details
    const result = await stripe.confirmCardPayment(paymentIntent.clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement) as StripeCardElement,
      },
    });

    // handle the payment result
    if (result.paymentIntent?.status === "succeeded") {
      bookRoom({ ...data, paymentIntentId: result.paymentIntent.id });
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit(onSubmit)}
      className="gird grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            type="text"
            readOnly
            disabled
            {...register("firstName")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
          />
        </label>
        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            type="text"
            readOnly
            disabled
            {...register("lastName")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
          />
        </label>

        <label htmlFor="" className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            type="text"
            readOnly
            disabled
            {...register("email")}
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your price summary</h2>
        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">
            Total Price: {paymentIntent.totalCost.toFixed(2)} USD
          </div>

          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Payment Details</h3>
        <CardElement
          id="payment-element"
          className="border border-slate-300 rounded-md p-2 text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-sm disabled:bg-gray-500"
        >
          {isLoading ? "Booking..." : "Confirm Booking"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
