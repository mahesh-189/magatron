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

// function to get the recommended courses
export const getRecommendedCourses = async (
  language: string,
  category: string
) => {
  const res = await AxiosInstances.get(
    `/recommend-course/?language=${language}&category=${category}`
  );
  return res;
};

// function for chat gpt chat
export const startChatGpt = async (id: string, question: string) => {
  const res = await AxiosInstances.post(`/services/${id}`, {
    sender: "user",
    action: "chatgpt",
    response: question,
  });
  return res;
};

// function to register the user response
export const registerUserResponse = async (
  answerID: string,
  isSatisfied: boolean
) => {
  const res = await AxiosInstances.post(`/conversations/${answerID}/feedback`, {
    isSatisfied,
  });
  return res;
};

// function to get the resume
export const getResume = async () => {
  const res = await AxiosInstances.get("/resume");
  return res;
};

// function to get previous conversations
export const getConversations = async () => {
  const res = await AxiosInstances.get("/conversations");
  return res;
};
