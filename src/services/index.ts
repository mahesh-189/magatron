import {
  getInitalResponse,
  getPillsData,
  getRecommendedCourses,
  getResume,
  getServiceByID,
  registerUser,
} from "../api/index";
import courseCard from "../component/courseCard";
import courseInputForm from "../component/courseInputForm";
import chatbotLoader from "../component/loader";
import { createElement, getBrowserAndOS, isNewUser } from "../utils/index";
import { chatgpt } from "./chatgpt";
import { fallBackResponse } from "./fallBackResponse";

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
        chatbotInputField.setAttribute("required", "true");

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

  // checking for the offline system
  window.addEventListener("offline", () => {
    chatbotBody.appendChild(
      fallBackResponse(
        "Oops! Something went wrong. Please check your network connection and try again later."
      )
    );
  });

  // hiding the chat bot input form
  chatbotInputForm.classList.add("chatbot-form-hidden");

  // displaying the loader
  const myLoader = chatbotLoader();
  chatbotBody.appendChild(myLoader);

  // getting the initial response
  const initialData = await getInitalResponse();
  if (!initialData?.success) {
    const errorMessage = fallBackResponse(
      "Oops! Something went wrong. Please check your network connection and try again later."
    );

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
        console.log(element);
        if (element.innerText === "Counselor") {
          // adding the loader
          const botLoader = chatbotLoader();
          chatbotBody.appendChild(botLoader);
          // getting the service data
          const serviceData = await getServiceByID(
            element.getAttribute("data-id"),
            element.innerText
          );
          const pillsResponse = serviceData?.data?.data?.options;
          localStorage.setItem("pillsResponse", JSON.stringify(pillsResponse));

          // calling the function to create pills response
          const myLoader = document.querySelector("#myChatbotLoader");
          chatbotBody.removeChild(myLoader);
          await displayPillsResponse();
        } else if (element.innerText === "QnA") {
          // calling the chat gpt for starting the conversation
          chatgpt(element.getAttribute("data-id"));
        } else if (element.innerText === "Resume") {
          const res = await getResume();
          console.log(res);
        }
      });
    } else {
      console.log(element);
      if (element.innerText === "Counselor") {
        // adding the loader
        const botLoader = chatbotLoader();
        chatbotBody.appendChild(botLoader);
        // getting the service data
        const serviceData = await getServiceByID(
          element.getAttribute("data-id"),
          element.innerText
        );
        const pillsResponse = serviceData?.data?.data?.options;
        localStorage.setItem("pillsResponse", JSON.stringify(pillsResponse));

        // calling the function to create pills response
        const myLoader = document.querySelector("#myChatbotLoader");
        chatbotBody.removeChild(myLoader);
        await displayPillsResponse();
      } else if (element.innerText === "QnA") {
        // calling the chat gpt for starting the conversation
        chatgpt(element.getAttribute("data-id"));
      } else if (element.innerText === "Resume") {
        const myLoader = chatbotLoader();
        chatbotBody.appendChild(myLoader);
        const res = await getResume();
        console.log(res);
        const loader = document.querySelector("#myChatbotLoader");
        chatbotBody.removeChild(loader);
        const message = createElement("p", {
          className: "chatbot-text",
          innerHTML: `Please visit the link to preview and download your resume. <br> <a href=${res?.data?.pdfUrl} target="_blank">Resume Link</a>`,
        });
        chatbotBody.appendChild(message);
      }
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

  // event listener to get final course in counselor
  const selectCourseForm = courseInputForm(category, language);
  chatbotBody.append(selectCourseForm);
  selectCourseForm.addEventListener("submit", handleFormSubmitSubmission);

  // function for handling the final course event listner
  async function handleFormSubmitSubmission(event: any) {
    event.preventDefault();

    if (event.target) {
      const response = await getRecommendedCourses(
        event.target[0].value,
        event.target[1].value
      );
      console.log(response);
      // removing the form from the chat bot body
      const selectCourseForm = document.querySelector(".chatbot-course-form");
      chatbotBody.removeChild(selectCourseForm);

      if (response?.data?.data.length === 0) {
        const message = createElement("div", {
          className: "chatbot-text",
          innerText: "Sorry! There is no course",
        });
        chatbotBody.appendChild(message);
      } else {
        const courses = response.data.data;
        const chatbotCourseCard = createElement("div", "chatbot-course-card");
        chatbotBody.append(chatbotCourseCard);
        // displaying the first course
        const newCourseCard = courseCard(courses[0]);
        chatbotBody.appendChild(newCourseCard);
        const showMoreButtons = document.querySelectorAll(
          ".course-card-element-body-description-btn"
        );
        Array.from(showMoreButtons).map((card) => {
          card.addEventListener("click", (event) => {
            event.stopImmediatePropagation();
            event.stopPropagation();
            const element = event.target as HTMLButtonElement;
            const desc = element.previousElementSibling;
            if (!desc.classList.contains("course-card-description-toggle")) {
              element.innerText = "Show More";
            } else {
              element.innerText = "Show Less";
            }
            desc.classList.toggle("course-card-description-toggle");
          });
        });

        // removing the event listner from the form
        event.target.removeEventListener("submit", handleFormSubmitSubmission);

        // displaying the all courses
        // courses.map((course: any) => {
        //   console.log(course);

        //   const newCourseCard = courseCard(course);
        //   chatbotBody.appendChild(newCourseCard);

        //   //   adding the event listner for the description collapse
        //   const showMoreButtons = document.querySelectorAll(
        //     ".course-card-element-body-description-btn"
        //   );

        //   const myBtns = Array.from(showMoreButtons);
        //   for (let i = 0; i < myBtns.length; i++) {
        //     myBtns[i].addEventListener("click", (e) => {
        //       e.stopImmediatePropagation();
        //       e.stopPropagation();
        //       const element = e.target as HTMLButtonElement;

        //       const desc = element.previousElementSibling;
        //       console.log(desc);
        //       if (!desc.classList.contains("course-card-description-toggle")) {
        //         element.innerText = "Show More";
        //       } else {
        //         element.innerText = "Show Less";
        //       }
        //       desc.classList.toggle("course-card-description-toggle");
        //     });
        //   }
        // });
      }
      // adding the form again for the user to check more courses
      const newSelectCourseForm = courseInputForm(category, language);
      chatbotBody.append(newSelectCourseForm);
      newSelectCourseForm.addEventListener(
        "submit",
        handleFormSubmitSubmission
      );
    }
    try {
    } catch (error) {
      console.log(error);
    }
  }
}
