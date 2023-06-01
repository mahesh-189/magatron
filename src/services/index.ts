import { getInitalResponse, getServiceByID, registerUser } from "../api/index";
import { chatbotLoader } from "../component/loader";
import { TOKEN } from "../config";
import { createElement, getBrowserAndOS, isNewUser } from "../utils/index";

// function to get user data
export const getUserData = async (requestType: string): Promise<void> => {
  const chatbotBody = document.querySelector("#chatbotBody");
  const chatbotInputForm = document.querySelector("#chatbotInputForm");
  const chatbotInputField = document.querySelector("#chatbotInputField");

  // clearing the chat bot body on load
  chatbotBody.innerHTML = "";
  chatbotInputForm.classList.remove("chatbot-form-hidden");

  const userDetails = ["", "", ""];
  let currentIndex = 0;

  const messageFlow = [
    {
      message: "Please enter your name",
      type: "text",
      minLength: 3,
      required: true,
    },
    {
      message: "Please enter your phone number",
      type: "number",
      required: true,
      pattern: "",
    },
    {
      message: "Please enter your email id",
      type: "email",
      required: true,
      pattern: "",
    },
  ];

  const welcomeMessage = createElement("div", { className: "chatbot-text" });
  const message = createElement("div", { className: "chatbot-text" });

  // displaying the welcome message and first response
  welcomeMessage.innerText =
    "Please provide us these details for better assitance";
  chatbotBody.appendChild(welcomeMessage);
  message.innerText = messageFlow[currentIndex].message;
  chatbotBody.appendChild(message);
  chatbotInputField.setAttribute("minLength", "3");

  // adding the event listner for the form
  chatbotInputForm.addEventListener("submit", handleFormSubmit);

  // function to handle form submit
  async function handleFormSubmit(event: Event | SubmitEvent) {
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

    // changing the input fields attributes as per request
    if (currentIndex === 1) {
      const regexPhoneNumber = /^[6789]\d{9}$/;
      chatbotInputField.setAttribute("pattern", regexPhoneNumber.source);
      chatbotInputField.setAttribute("type", "tel");
      chatbotInputField.setAttribute("maxlength", "10");
    } else if (currentIndex === 2) {
      chatbotInputField.removeAttribute("minLength");
      chatbotInputField.removeAttribute("maxlength");
      chatbotInputField.setAttribute("type", "email");
      const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      chatbotInputField.setAttribute("pattern", regexEmail.source);
    } else {
      chatbotInputForm.removeEventListener("submit", handleFormSubmit);
      chatbotInputForm.classList.add("chatbot-form-hidden");

      // setting the input fields to its default values
      chatbotInputField.removeAttribute("minLength");
      chatbotInputField.removeAttribute("pattern");
      chatbotInputField.setAttribute("type", "text");

      // creating user data for creating account
      const { browser, os } = getBrowserAndOS();
      const data = {
        fullName: userDetails[0],
        phoneNumber: userDetails[1],
        email: userDetails[2],
        source: "web",
        os: os,
        browser: browser,
        type: requestType,
      };

      // calling the function to create the user account
      const res = await registerUser(data);
      // setting the token inside the local storage
      localStorage.setItem(TOKEN, res?.data?.userData?.jwtToken);
      console.log(res);
      return;
    }

    const message = createElement("div", { className: "chatbot-text" });
    message.innerText = messageFlow[currentIndex].message;
    chatbotBody.appendChild(message);
  }

  // calling the callback function to indicate completion
  // callback()
};

// function to show initial response
export const initialResponse = async () => {
  // getting the element from dom
  const chatbotBody = document.querySelector("#chatbotBody");
  const chatbotInputForm = document.querySelector("#chatbotInputForm");

  // clearing the chat bot body
  chatbotBody.innerHTML = "";

  // hiding the chat bot input form
  chatbotInputForm.classList.add("chatbot-form-hidden");

  // displaying the loader
  const myLoader = chatbotLoader();
  myLoader.setAttribute("id", "myChatbotLoader");
  chatbotBody.appendChild(myLoader);

  // getting the initial response
  const initialData = await getInitalResponse();
  console.log(initialData);
  if (!initialData?.success) {
    const errorMessage = createElement("div", {
      className: "chatbot-text",
      innerHTML:
        "<p>Oops! Failed to load data :(</p><p>Please connect to our support team</p><p>Support Team : 9087654321</p>",
    });

    // removing the loader from chat window
    const myLoader = document.querySelector("#myChatbotLoader");
    chatbotBody.removeChild(myLoader);

    // displaying the customized error message
    chatbotBody.appendChild(errorMessage);
    return;
  }

  // displaying the welcome message and first response
  const welcomeMessage = createElement("div", {
    className: "chatbot-text",
    innerText: "Please select an option to proceed",
  });
  const message = createElement("div", { className: "chatbot-text" });

  // removing the loader from chat window
  const botLoader = document.querySelector("#myChatbotLoader");
  chatbotBody.removeChild(botLoader);

  // displaying the welcome message to the user
  chatbotBody.appendChild(welcomeMessage);

  // creating the pills of the initial response
  const initialResponseSection = createElement("div", {
    className: "chatbot-initial-prompts",
  });
  chatbotBody.appendChild(initialResponseSection);

  initialData?.data.map((pill: any) => {
    const newPill = createElement("p", {
      innerText: pill?.serviceName,
    });
    newPill.setAttribute("data-id", pill?._id);
    initialResponseSection.appendChild(newPill);

    // adding the event listner on pill for getting further response
    newPill.addEventListener("click", handleBtnClick);
  });

  // function to handle the button click functionality
  async function handleBtnClick(event: MouseEvent) {
    const element = event.target as HTMLDivElement;
    console.log(element, element.getAttribute("data-id"));
    const id = element.getAttribute("data-id");

    // removing other pills from initialResponseSection
    const initialResponseSection = document.querySelector(
      ".chatbot-initial-prompts"
    );
    initialResponseSection.innerHTML = "";
    initialResponseSection.appendChild(element);

    // checking that the user is already exist or not
    const newUser = isNewUser();
    // getting the details from the new user
    if (newUser) {
      // console.log("inside new user");
      // await getUserData(element.innerText);
      // return new Promise<void>((resolve, reject) => {
      //   getUserData(element.innerText,()=>{
      //     resolve()
      //   });
      // }).then(async () => {
      //   const serviceData = await getServiceByID(
      //     element.getAttribute("data-id"),
      //     element.innerText
      //   );
      //   console.log(serviceData);
      // });
    }

    // testing

    // getting the service data
    // const serviceData = await getServiceByID(
    //   element.getAttribute("data-id"),
    //   element.innerText
    // );
    // console.log(serviceData);

    // removing the event listner from btn
    event.target.removeEventListener("click", handleBtnClick);
  }
};
