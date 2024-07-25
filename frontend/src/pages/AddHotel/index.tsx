import { useMutation } from "react-query";
import HotelForm, { HotelType } from "../../forms/HotelForm";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const { mutate, isLoading } = useMutation(apiClient.addHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel added successfully", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Failed to add hotel", type: "ERROR" });
    },
  });

  const handleSave = (hotelFormData: FormData) => {
    mutate(hotelFormData);
  };
  return <HotelForm onSave={handleSave} isLoading={isLoading} />;
};

export default AddHotel;
