import AxiosInstances from "../helper/index";
import { RegisterUser } from "../interface/user.interface";

// function to get initial response
export const getInitalResponse = async () => {
  try {
    const res = await AxiosInstances.get("/services");
    return res.data;
  } catch (error) {
    return { success: false, message: "Failed to fetch the data", error };
  }
};

// function to register the user
export const registerUser = async (data: RegisterUser) => {
  try {
    const res = await AxiosInstances.post("/users/create", data);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

// function to get services by id
export const getServiceByID = async (id: string, serviceName: string) => {
  const res = await AxiosInstances.post(`/services/${id}`, {
    sender: "user",
    response: serviceName,
  });
  return res;
};

// function to get the respective pills data
export const getPillsData = async (id: string, serviceName: string) => {
  const res = await AxiosInstances.post(`/services/${id}`, {
    sender: "user",
    response: serviceName,
  });
  return res;
};
