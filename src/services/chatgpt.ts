import { startChatGpt } from "../api/index";
import chatbotLoader from "../component/loader";
import { createElement } from "../utils/index";

export const chatgpt = (id: string) => {
  console.log("inside the chat gpt");

  const chatbotBody = document.querySelector("#chatbotBody");
  const chatbotInputForm = document.querySelector("#chatbotInputForm");
  const chatbotInputField = document.querySelector("#chatbotInputField");
  chatbotInputForm.classList.remove("chatbot-form-hidden");
  let isFetchingData = false;

  //sending the welcome message
  const message = createElement("div", {
    className: "chatbot-text",
    innerText: "Please enter your query in chat",
  });
  chatbotBody.appendChild(message);

  //   adding the event listner on the form submit
  chatbotInputForm.addEventListener(
    "submit",
    async (event: Event | SubmitEvent) => {
      event.stopImmediatePropagation();
      event.stopPropagation();
      event.preventDefault();

      //   checking that the reponse is pending or not
      if (isFetchingData) {
        return;
      }
      isFetchingData = true;
      const question =
        event.target &&
        (event.target as HTMLFormElement).querySelector("input");
      const questionValue = question.value;
      const userResponse = createElement("div", {
        className: "user-text",
        innerText: question.value,
      });
      chatbotBody.appendChild(userResponse);
      question.value = "";

      // adding the loader
      const loader = chatbotLoader();
      chatbotBody.appendChild(loader);

      //   getting the chat gpt answer
      console.log("inside the chat gpt");
      const answer = await startChatGpt(id, questionValue);
      const answerData = answer?.data?.data?.response;
      const botResponse = createElement("div", {
        className: "chatbot-text",
        innerText: answerData,
      });

      //   removing the loader and fetching
      chatbotBody.removeChild(loader);
      chatbotBody.appendChild(botResponse);
      isFetchingData = false;
    }
  );
};
