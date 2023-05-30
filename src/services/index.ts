import { createElement, getElementByQuerySelector } from "../utils/index";

// function to get user data
export const getUserData = () => {
  const chatbotBody = getElementByQuerySelector("chatbotBody");
  const formInputBox = getElementByQuerySelector("formInputBox");
  const formSubmitBtn = getElementByQuerySelector("formSubmitBtn");

  const userDetails = { name: "", number: "", email: "" };
  const messageFlow = [{ message: "Please enter your name" }];
  const message = createElement("div", { className: "chatbot-text" });
  message.innerText = "Please provide us these details for better assitance";
  chatbotBody.appendChild(message);

  console.log(formInputBox, formSubmitBtn);
};
