import AxiosInstances from "../services/index";

// function to get initial response
export const getInitalResponse = async () => {
  const res = await AxiosInstances.get("/services");
  return res.data;
};
