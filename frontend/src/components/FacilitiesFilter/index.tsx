import { hotelFacilities } from "../../config/hotel-options-config";

type Props = {
  selectedFacilities: string[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const FacilitiesFilter = ({ selectedFacilities, onChange }: Props) => {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h1 className="text-md font-semibold mb-2">Facilities types</h1>
      {hotelFacilities.map((facility) => (
        <label htmlFor="" className="flex items-center space-x-2">
          <input
            type="checkbox"
            name=""
            className="rounded"
            value={facility}
            checked={selectedFacilities.includes(facility)}
            onChange={onChange}
          />
          <span>{facility}</span>
        </label>
      ))}
    </div>
  );
};

export default FacilitiesFilter;

