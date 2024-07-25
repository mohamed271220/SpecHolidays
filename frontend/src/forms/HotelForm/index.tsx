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

type Props = {
  onSave: (hotelData: FormData) => void;
  isLoading: boolean;
};

const HotelForm = ({ onSave, isLoading }: Props) => {
  const formMethods = useForm<HotelType>();
  const { handleSubmit } = formMethods;
  const onSubmit = handleSubmit((formDataJson: HotelType) => {
    const formData = new FormData();
    formData.append("name", formDataJson.name);
    formData.append("city", formDataJson.city);
    formData.append("country", formDataJson.country);
    formData.append("description", formDataJson.description);
    formData.append("type", formDataJson.type);
    formData.append("adultCount", String(formDataJson.adultCount));
    formData.append("childCount", String(formDataJson.childCount));
    formData.append("pricePerNight", String(formDataJson.pricePerNight));
    formData.append("starRating", String(formDataJson.starRating));

    formDataJson.facilities.forEach((facility, i) => {
      formData.append(`facilities[${i}]`, facility);
    });

    Array.from(formDataJson.imageFiles).forEach((file) => {
      formData.append("imageFiles", file);
    });

    onSave(formData);
  });
  return (
    <FormProvider {...formMethods}>
      <form className="flex flex-col gap-10" onSubmit={onSubmit}>
        <DetailsSection />
        <TypeSection />
        <FacilitiesSection />
        <GuestsSection />
        <ImageSection />
        <span className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="bg-blue-600 text-white p-2 font-bold hover:bg-blue:500 text-xl disabled:bg-gray-500 "
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </span>
      </form>
    </FormProvider>
  );
};

export default HotelForm;
