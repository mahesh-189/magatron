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

export { createElement };
