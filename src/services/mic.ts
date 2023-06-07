import { createElement } from "../utils/index";

export const micInput = (event: Event) => {
  event.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
  // getting the required elements from dom
  const micBtn = document.querySelector("#micBtn") as HTMLButtonElement;
  const chatbotInputField = document.querySelector(
    "#chatbotInputField"
  ) as HTMLInputElement;
  chatbotInputField.value = "";
  const chatbotBody = document.querySelector("#chatbotBody");

  //   adding the listening to the body
  let voiceMessage = "";
  const listenMessage = createElement("p", {
    id: "listenMessage",
    className: "chatbot-text",
    innerText: "Listening...",
  });
  chatbotBody.appendChild(listenMessage);

  if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
    // web speech is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = "en-US";

    // starting the voice recording
    recognition.start();
    micBtn.disabled = true;

    // for getting the voice result when finished
    recognition.addEventListener("result", (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const recognizedText = lastResult[0].transcript;
      voiceMessage = recognizedText;
    });

    // for identifying the end of voice recognition
    recognition.addEventListener("end", () => {
      micBtn.disabled = false;
      const listenMessage = document.querySelector("#listenMessage");
      chatbotBody.removeChild(listenMessage);
      chatbotInputField.value = voiceMessage;
    });

    // for handling the error while listening
    recognition.addEventListener("error", () => {
      const message = createElement("p", {
        className: "chatbot-text",
        innerText:
          "Sorry:( SpeechRecognition API is not supported in this browser.",
      });
      chatbotBody.appendChild(message);
    });
  } else {
    // web speech is not supported
    const message = createElement("p", {
      className: "chatbot-text",
      innerText:
        "Sorry:( SpeechRecognition API is not supported in this browser.",
    });
    chatbotBody.appendChild(message);
  }
};
