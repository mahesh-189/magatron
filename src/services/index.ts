import {
  getInitalResponse,
  getPillsData,
  getRecommendedCourses,
  getServiceByID,
  registerUser,
} from "../api/index";
import courseCard from "../component/courseCard";
import chatbotLoader from "../component/loader";
import { createElement, getBrowserAndOS, isNewUser } from "../utils/index";

// function to get user data
export const getUserData = async (requestType: string) => {
  return new Promise((resolve, reject) => {
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
        event.target &&
        (event.target as HTMLFormElement).querySelector("input");
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
        localStorage.setItem("token", res?.data?.userData?.jwtToken);
        res && resolve("");
        return;
      }

      const message = createElement("div", { className: "chatbot-text" });
      message.innerText = messageFlow[currentIndex].message;
      chatbotBody.appendChild(message);
    }
  });
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
      getUserData(element.innerText).then(async () => {
        // getting the service data
        const serviceData = await getServiceByID(
          element.getAttribute("data-id"),
          element.innerText
        );
        const pillsResponse = serviceData?.data?.data?.options;
        localStorage.setItem("pillsResponse", JSON.stringify(pillsResponse));

        // calling the function to create pills response
        await displayPillsResponse();
      });
    } else {
      // getting the service data
      const serviceData = await getServiceByID(
        element.getAttribute("data-id"),
        element.innerText
      );
      const pillsResponse = serviceData?.data?.data?.options;
      localStorage.setItem("pillsResponse", JSON.stringify(pillsResponse));

      // calling the function to create pills response
      await displayPillsResponse();
    }

    // displaying the pills response to the user
    async function displayPillsResponse() {
      const chatbotPillContainer = createElement("div", {
        className: "chatbot-pill-container",
      });
      const pillsResponse = JSON.parse(localStorage.getItem("pillsResponse"));
      console.log(pillsResponse);

      pillsResponse &&
        pillsResponse.map((element: any) => {
          const pill = createElement("p", {
            className: "chatbot-pill-item",
            innerText: element?.serviceName,
          });
          pill.setAttribute("data-id", element?._id);
          pill.addEventListener("click", handlePillClick);
          chatbotPillContainer.appendChild(pill);
        });
      // adding the pills container in chatbot body
      chatbotBody.appendChild(chatbotPillContainer);

      // function to handle the pill click
      async function handlePillClick(event: MouseEvent) {
        const element = event.target as HTMLParagraphElement;
        const res = await getPillsData(
          element.getAttribute("data-id"),
          element.innerText
        );
        console.log(res);
        selectCategoryAndLang(
          res?.data?.data?.categoriesList,
          res?.data?.data?.languages
        );
        element.removeEventListener("click", handlePillClick);
      }
    }

    // removing the event listner from btn
    event.target.removeEventListener("click", handleBtnClick);
  }
};

// category and language selction
function selectCategoryAndLang(
  category: { title: string; _id: string }[],
  language: string[]
) {
  const chatbotBody = document.querySelector("#chatbotBody");
  const selectCourseForm = createElement("form", {
    className: "chatbot-course-form",
  });

  const selectLang = createElement("select", {
    className: "chatbot-select-btn",
  });
  selectLang.name = "language";
  language.map((lang: string) => {
    const option = createElement("option");
    option.innerText = lang;
    option.value = lang;
    selectLang.append(option);
  });
  selectCourseForm.append(selectLang);

  const selectCategory = createElement("select", {
    className: "chatbot-select-btn",
  });
  selectCategory.name = "category";
  category.map((cat: { title: string; _id: string }) => {
    const option = createElement("option");
    option.innerText = cat.title;
    option.value = cat._id;
    selectCategory.append(option);
  });
  selectCourseForm.append(selectCategory);

  const courseInfoSubmit = createElement("button", "lang");
  courseInfoSubmit.type = "submit";
  courseInfoSubmit.textContent = "SUBMIT";
  selectCourseForm.append(courseInfoSubmit);

  chatbotBody.append(selectCourseForm);

  // event listener to get final course in counselor
  selectCourseForm.addEventListener("submit", async (event: any) => {
    event.preventDefault();

    if (event.target) {
      const response = await getRecommendedCourses(
        event.target[0].value,
        event.target[1].value
      );
      console.log(response);

      const courses = response.data.data;
      // if (courses.length !== 0) {
      //   (event.target as HTMLButtonElement)?.remove();
      // }
      const chatbotCourseCard = createElement("div", "chatbot-course-card");
      chatbotBody.append(chatbotCourseCard);
      courses.map((course: any) => {
        console.log(course);

        const newCourseCard = courseCard(course);
        chatbotBody.appendChild(newCourseCard);
      });
    }
    try {
    } catch (error) {
      console.log(error);
    }
  });
}
