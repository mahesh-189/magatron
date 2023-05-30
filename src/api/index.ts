import AxiosInstances from "../helper/index";
import { RegisterUser } from "../interface/user.interface";

// function to get initial response
export const getInitalResponse = async () => {
  const res = await AxiosInstances.get("/services");
  return res.data;
};

// function to register the user
export const registerUser = async (data: RegisterUser) => {
  const res = await AxiosInstances.post("/users/create", data);
  return res.data;
};
