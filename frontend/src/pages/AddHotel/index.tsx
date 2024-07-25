import { useMutation } from "react-query";
import HotelForm from "../../forms/HotelForm";
import { useAppContext } from "../../contexts/AppContext";
import * as apiClient from "../../api-client";
import { useNavigate } from "react-router-dom";

const AddHotel = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate()
  const { mutate, isLoading } = useMutation(apiClient.addHotel, {
    onSuccess: () => {
      showToast({ message: "Hotel added successfully", type: "SUCCESS" });
      navigate("/");
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
