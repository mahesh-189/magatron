import { getInitalResponse } from "../api/index";
import { chatbotLoader } from "../component/loader";
import { createElement } from "../utils/index";

// function to get user data
export const getUserData = () => {
  const chatbotBody = document.querySelector("#chatbotBody");
  const chatbotInputForm = document.querySelector("#chatbotInputForm");

  // clearing the chat bot body on load
  chatbotBody.innerHTML = "";

  const userDetails = ["", "", ""];
  let currentIndex = 0;

  const messageFlow = [
    { message: "Please enter your name" },
    { message: "Please enter your phone number" },
    { message: "Please enter your email id" },
  ];

  const welcomeMessage = createElement("div", { className: "chatbot-text" });
  const message = createElement("div", { className: "chatbot-text" });

  // displaying the welcome message and first response
  welcomeMessage.innerText =
    "Please provide us these details for better assitance";
  chatbotBody.appendChild(welcomeMessage);
  message.innerText = messageFlow[currentIndex].message;
  chatbotBody.appendChild(message);

  // adding the event listner for the form
  chatbotInputForm.addEventListener("submit", handleFormSubmit);

  // function to handle form submit
  function handleFormSubmit(event: Event | SubmitEvent) {
    event.preventDefault();
    const myInput =
      event.target && (event.target as HTMLFormElement).querySelector("input");
    userDetails[currentIndex] = myInput.value;

    // diplaying user response
    const userResponse = createElement("p", { className: "user-text" });
    userResponse.innerText = myInput.value;
    chatbotBody.appendChild(userResponse);

    // clearing the input value
    myInput.value = "";

    // sending the next response
    currentIndex++;
    if (currentIndex >= messageFlow.length) {
      chatbotInputForm.removeEventListener("submit", handleFormSubmit);
      chatbotInputForm.classList.add("chatbot-form-hidden");

      return;
    }
    const message = createElement("div", { className: "chatbot-text" });
    message.innerText = messageFlow[currentIndex].message;
    chatbotBody.appendChild(message);
  }

  // function to create user data for creating account
  function createUserData() {
    const data = {
      fullName: "",
      email: "",
      phoneNumber: "",
      source: "",
      os: "",
      browser: "",
      type: "",
    };

    const { browser, os } = getBrowserAndOS();
    data.fullName = userDetails[0];
    data.phoneNumber = userDetails[1];
    data.email = userDetails[2];
    data.browser = browser;
    data.os = os;
    data.source = "web";
    data.type = "pill";

    // function for getting os and browser details
    function getBrowserAndOS() {
      const userAgent = navigator.userAgent;

      // Browser name
      let browserName: string;
      if (userAgent.indexOf("Firefox") > -1) {
        browserName = "Mozilla Firefox";
      } else if (userAgent.indexOf("Chrome") > -1) {
        browserName = "Google Chrome";
      } else if (userAgent.indexOf("Safari") > -1) {
        browserName = "Apple Safari";
      } else if (userAgent.indexOf("Opera") > -1) {
        browserName = "Opera";
      } else if (userAgent.indexOf("Edge") > -1) {
        browserName = "Microsoft Edge";
      } else if (userAgent.indexOf("Trident") > -1) {
        browserName = "Internet Explorer";
      } else {
        browserName = "Unknown";
      }

      // Operating system name
      let osName: string;
      if (userAgent.indexOf("Windows") > -1) {
        osName = "Windows";
      } else if (userAgent.indexOf("Mac") > -1) {
        osName = "MacOS";
      } else if (userAgent.indexOf("Linux") > -1) {
        osName = "Linux";
      } else if (userAgent.indexOf("Android") > -1) {
        osName = "Android";
      } else if (userAgent.indexOf("iOS") > -1) {
        osName = "iOS";
      } else {
        osName = "Unknown";
      }

      return {
        browser: browserName,
        os: osName,
      };
    }
  }
};

// function to show initial response
export const initialResponse = async () => {
  // getting the initial response
  const initialData = await getInitalResponse();
  console.log(initialData);

  // getting the element from dom
  const chatbotBody = document.querySelector("#chatbotBody");
  const chatbotInputForm = document.querySelector("#chatbotInputForm");

  // clearing the chat bot body
  chatbotBody.innerHTML = "";

  // hiding the chat bot input form
  chatbotInputForm.classList.add("chatbot-form-hidden");

  // displaying the welcome message and first response
  const welcomeMessage = createElement("div", {
    className: "chatbot-text",
    innerText: "Please select an option to proceed",
  });
  const message = createElement("div", { className: "chatbot-text" });
  chatbotBody.appendChild(welcomeMessage);
  chatbotBody.appendChild(chatbotLoader());
};
