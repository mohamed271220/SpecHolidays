import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import * as apiClient from "../../api-client";
import HotelForm from "../../forms/HotelForm";
import { useAppContext } from "../../contexts/AppContext";

const EditHotel = () => {
  const { id } = useParams();
  const { showToast } = useAppContext();
  const { data: hotel } = useQuery(
    "fetMyHotelById",
    async () => apiClient.fetchMyHotelById(id || ""),
    {
      enabled: !!id, // only fetch when id is available
    }
  );

  const { mutate, isLoading } = useMutation(apiClient.updateMyHotelById, {
    onSuccess: () => {
      showToast({ message: "Hotel saved!", type: "SUCCESS" });
    },
    onError: () => {
      showToast({ message: "Error Saving Hotel", type: "ERROR" });
    },
  });

  const handleSave = (formData: FormData) => {
    mutate(formData);
  };
  return <HotelForm onSave={handleSave} hotel={hotel} isLoading={isLoading} />;
};

export default EditHotel;
