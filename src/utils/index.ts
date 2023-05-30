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

// function to get the element by query selector
const getElementByQuerySelector = (id: string) => {
  const element = document.querySelector(`#${id}`);
  return element;
};

export { createElement, getElementByQuerySelector };
