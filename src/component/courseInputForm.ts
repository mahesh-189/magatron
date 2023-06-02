import { createElement } from "../utils/index";

const courseInputForm = (
  category: { title: string; _id: string }[],
  language: string[]
) => {
  const selectCourseForm = createElement("form", {
    className: "chatbot-course-form",
  });

  const selectLang = createElement("select", {
    className: "chatbot-select-btn",
  });
  selectLang.name = "language";
  language.map((lang: string) => {
    const option = createElement("option");
    option.innerText = lang;
    option.value = lang;
    selectLang.append(option);
  });
  selectCourseForm.append(selectLang);

  const selectCategory = createElement("select", {
    className: "chatbot-select-btn",
  });
  selectCategory.name = "category";
  category.map((cat: { title: string; _id: string }) => {
    const option = createElement("option");
    option.innerText = cat.title;
    option.value = cat._id;
    selectCategory.append(option);
  });
  selectCourseForm.append(selectCategory);

  const courseInfoSubmit = createElement("button", "lang");
  courseInfoSubmit.type = "submit";
  courseInfoSubmit.textContent = "Get Course Details";
  selectCourseForm.append(courseInfoSubmit);
  return selectCourseForm;
};

export default courseInputForm;
