import { initialResponse } from "./services/index";
import { createElement, isNewUser } from "./utils/index";

// function for the chatbot card
export const createChatbot = () => {
  // main chatbot container
  const chatbotContainer = createElement("div", {
    className: "chatbot-container",
    id: "chatbotContainer",
  });

  // chatbot header
  const chatbotHeader = createElement("div", { className: "chatbot-header" });

  const chatbotAvatar = createElement("div", { className: "chatbot-avatar" });

  // chatbot image avatar
  const chatbotImageAvatar = createElement("img", {
    src: "https://st3.depositphotos.com/8950810/17657/v/600/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    alt: "chatbot-avatar",
  });

  chatbotAvatar.append(chatbotImageAvatar);
  chatbotHeader.append(chatbotAvatar);

  // chatbot info
  const chatbotInfo = createElement("div", { className: "chatbot-info" });

  const chatbotName = createElement("h3");
  chatbotName.textContent = "Megatron";

  chatbotInfo.append(chatbotName);

  const chatbotStatus = createElement("span");
  chatbotStatus.textContent = "Online";

  chatbotInfo.append(chatbotStatus);

  chatbotHeader.append(chatbotInfo);

  // chatbot close and reset button
  const headerBtnGroup = createElement("div", {
    className: "header-btn-group",
  });
  const chatbotClose = createElement("button", {
    className: "chatbot-header-btn",
    id: "chatbotCloseBtn",
  });
  chatbotClose.innerHTML = "&times;";
  headerBtnGroup.appendChild(chatbotClose);

  const chatbotReset = createElement("button", {
    className: "chatbot-header-btn",
    id: "chatbotRestartBtn",
  });
  chatbotReset.innerHTML = "&#8634;";
  headerBtnGroup.appendChild(chatbotReset);
  chatbotHeader.appendChild(headerBtnGroup);

  // adding event listner on reset btn for widget reload
  chatbotReset.addEventListener("click", () => {
    initialResponse();
  });

  // adding event listner on close btn to close the chat bot card
  chatbotClose.addEventListener("click", () => {
    chatbotContainer.classList.remove("chatbot-show-container");
  });

  // appending header to container
  chatbotContainer.append(chatbotHeader);

  // Chatbot message body
  const chatbotBody = createElement("div", {
    className: "chatbot-body",
    id: "chatbotBody",
  });

  // welcome message
  const chatbotWelcomeMsg = createElement("p", {
    className: "chatbot-welcome-msg",
  });

  chatbotWelcomeMsg.textContent = "Hi There 👋";
  chatbotBody.append(chatbotWelcomeMsg);

  // appending chatbot message body to main container
  chatbotContainer.append(chatbotBody);

  // chatbot input section
  const chatbotInputForm = createElement("form", {
    className: "chatbot-input",
    id: "chatbotInputForm",
  });

  const chatbotInput = createElement("input", {
    type: "text",
    placeholder: "Type your message",
    id: "chatbotInputField",
    required: true,
  });

  chatbotInputForm.append(chatbotInput);

  const chatbotSendButton = createElement("button", {
    textContent: "Send",
    type: "submit",
  });

  chatbotInputForm.append(chatbotSendButton);

  // appending chatbot input form to main container
  chatbotContainer.append(chatbotInputForm);
  document.body.append(chatbotContainer);

  // displaying the initial response
  initialResponse();
};

// function for the chat bot icon
export const chatbotIcon = () => {
  const chatbotMegatronIcon = createElement("div", {
    className: "chatbot-megatron-icon",
  });

  // chatbot image avatar
  const chatbotImageIcon = createElement("img", {
    src: "https://st3.depositphotos.com/8950810/17657/v/600/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg",
    alt: "Chat bot logo",
  });

  chatbotMegatronIcon.append(chatbotImageIcon);

  document.body.append(chatbotMegatronIcon);

  chatbotMegatronIcon.addEventListener("click", openChatbot);

  async function openChatbot() {
    const chatbotContainer = document.querySelector("#chatbotContainer");
    if (!chatbotContainer.classList.contains("chatbot-show-container")) {
      chatbotContainer.classList.add("chatbot-show-container");
    } else {
      chatbotContainer.classList.remove("chatbot-show-container");
    }
  }
};
