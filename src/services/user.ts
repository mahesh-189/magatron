import { RegisterUser } from "../interface/user.interface";
import AxiosInstances from "./index";

export const registerUser = (data: RegisterUser) => {
  return AxiosInstances.post("/users/create", data);
};
