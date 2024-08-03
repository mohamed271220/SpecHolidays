type Props = {
  selectedPrice: number | undefined;
  onChange: (value?: number) => void;
};

const PriceFilter = ({ selectedPrice, onChange }: Props) => {
  return (
    <div>
      <h4 className="text-md font-semibold mb-2">Max Price</h4>
      <select
        value={selectedPrice}
        onChange={(event) => {
          event.preventDefault();
          onChange(
            event.target.value ? parseInt(event.target.value) : undefined
          );
        }}
        className="p-2 border rounded-md w-full"
      >
        <option value="">Select Max Price</option>
        {[100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((price) => (
          <option key={price} value={price}>
            ${price}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PriceFilter;
