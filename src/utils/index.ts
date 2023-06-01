import { TOKEN } from "../config";

// function to create an element
const createElement = <T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attributes?: Partial<HTMLElementTagNameMap[T]>
): HTMLElementTagNameMap[T] => {
  const element = document.createElement(tagName);

  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element[key as keyof HTMLElementTagNameMap[T]] = value;
    });
  }

  return element;
};

// function to check user is new or not
const isNewUser = () => {
  const token = localStorage.getItem(TOKEN);
  if (token) {
    return false;
  } else {
    return true;
  }
};

// function for getting os and browser details
const getBrowserAndOS = () => {
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
};

export { createElement, isNewUser, getBrowserAndOS };
