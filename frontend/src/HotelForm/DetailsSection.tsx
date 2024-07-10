import { useFormContext } from "react-hook-form";

const DetailsSection = () => {
  const { register } = useFormContext();
  return <div className="flex flex-col gap-4">
    <h1 className="text-3xl font-bold mb-3">Add Hotel</h1>
  </div>;
};

export default DetailsSection;
