import { getInitalResponse } from "./api/index";
import { createElement, getElementByQuerySelector } from "./utils/index";

// function for the chatbot card
export const createChatbot = () => {
  // main chatbot container
  const chatbotContainer = createElement("div", {
    id: "chatbot-container",
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

  const chatbotClose = createElement("button", { className: "chatbot-close" });
  chatbotClose.innerHTML = "&times;";

  chatbotHeader.append(chatbotClose);

  // appending header to container

  chatbotContainer.append(chatbotHeader);

  // Chatbot message body

  const chatbotBody = createElement("div", { className: "chatbot-body" });

  // welcome message
  const chatbotWelcomeMsg = createElement("p", {
    className: "chatbot-welcome-msg",
  });

  chatbotWelcomeMsg.textContent = "Welcome Message";

  chatbotBody.append(chatbotWelcomeMsg);

  // chatbot initial prompts

  const chatbotInitialPrompts = createElement("div", {
    className: "chatbot-initial-prompts",
  });

  chatbotBody.append(chatbotInitialPrompts);

  // appending chatbot message body to main container

  chatbotContainer.append(chatbotBody);

  // chatbot input section

  const chatbotInputForm = createElement("form", {
    className: "chatbot-input",
  });

  const chatbotInput = createElement("input", {
    type: "text",
    placeholder: "Type your message",
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

  function openChatbot() {
    const chatbotContainer = getElementByQuerySelector("chatbot-container");
    if (!chatbotContainer.classList.contains("chatbot-show-container")) {
      chatbotContainer.classList.add("chatbot-show-container");
      // chatbotContainer.querySelector(".chatbot-body")?.append(loader());
      getInitalResponse();
    } else {
      chatbotContainer.classList.remove("chatbot-show-container");
    }
  }

  // chatbotClose.addEventListener("click", () => {
  //   chatbotContainer.classList.remove("chatbot-show-container");
  // });
};
