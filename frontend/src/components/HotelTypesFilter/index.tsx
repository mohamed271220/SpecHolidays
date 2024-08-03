import { hotelTypes } from "../../config/hotel-options-config";

type Props = {
  selectedHotelTypes: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const HotelTypesFilter = ({ selectedHotelTypes, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h1 className="text-md font-semibold mb-2">Hotel types</h1>
      {hotelTypes.map((hotel) => (
        <label htmlFor="" className="flex items-center space-x-2">
          <input
            type="checkbox"
            name=""
            className="rounded"
            value={hotel}
            checked={selectedHotelTypes.includes(hotel)}
            onChange={onChange}
          />
          <span>{hotel}</span>
        </label>
      ))}
    </div>
  );
};

export default HotelTypesFilter;
