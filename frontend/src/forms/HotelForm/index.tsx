import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitesSection";
import GuestsSection from "./GuestsSection";
import ImageSection from "./ImageSection";

export type HotelType = {
  name: string;
  city: string;
  country: string;
  description: string;
  type: string;
  adultCount: number;
  childCount: number;
  facilities: string[];
  pricePerNight: number;
  imageFiles: FileList;
  starRating: number;
};

const HotelForm = () => {
  const formMethods = useForm<HotelType>();
  const { handleSubmit } = formMethods;
  const onSubmit = handleSubmit((formData: HotelType) => {
    
  })
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10">
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue:500 text-xl "
          >
            Save
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default HotelForm;
