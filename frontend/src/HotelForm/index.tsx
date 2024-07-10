import { FormProvider, useForm } from "react-hook-form";

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
  return (
    <FormProvider {...formMethods}>
      <form>
        <DetailsSection/>
      </form>
    </FormProvider>
  );
};

export default HotelForm;
