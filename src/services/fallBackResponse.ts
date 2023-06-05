import { createElement } from "../utils/index";

export const fallBackResponse = (message: string) => {
  const fallbackMessage = createElement("div", {
    className: "fallback-message-container chatbot-text",
    innerHTML: `<p>${message}</p>
  <h4>Support Team Contact Information:</h4>
  <ul>
    <li>Phone: 9874563210</li>
    <li>Email: support@example.com</li>
    <li><a href="#">Connect With Support Team</a></li>
  </ul>`,
  });
  return fallbackMessage;
};
