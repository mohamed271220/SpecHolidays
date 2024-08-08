import { HotelType } from "@shared/types";

type Props = {
  checkIn: Date;
  checkOut: Date;
  adultCount: number;
  childCount: number;
  numberOfNights: number;
  hotel: HotelType;
};

const BookingDetailSummery = ({
  checkIn,
  checkOut,
  adultCount,
  childCount,
  numberOfNights,
  hotel,
}: Props) => {
  return (
    <div className="grid gap-4 rounded-lg border border-slate-400 p-5 h-fit">
      <h1 className="text-xl font-bold">Your Booking Details</h1>
      <div className="border-b py-2">
        Location:
        <div className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</div>
      </div>
      <div className="flex justify-between">
        <div>
          Check-in
          <div className="font-bold">{checkIn.toDateString()}</div>
        </div>

        <div>
          Check-out
          <div className="font-bold">{checkOut.toDateString()}</div>
        </div>
      </div>

      <div className="border-b py-2">
        Total Length of Stay:
        <div className="font-bold">
          {numberOfNights} {numberOfNights > 1 ? "nights" : "night"}
        </div>
      </div>

      <div className="border-b py-2">
        Number of Guests:
        <div className="font-bold">{`${adultCount} adult & ${childCount} child`}</div>
      </div>
      
    </div>
  );
};

export default BookingDetailSummery;
