import { createElement } from "../utils/index";

const chatbotLoader = () => {
  const loader = createElement("div", { className: "chatbot-loader" });
  const dot1 = createElement("div", { className: "chatbot-loader-dot" });
  const dot2 = createElement("div", { className: "chatbot-loader-dot" });
  const dot3 = createElement("div", { className: "chatbot-loader-dot" });
  loader.append(dot1, dot2, dot3);
  return loader;
};

export default chatbotLoader;
