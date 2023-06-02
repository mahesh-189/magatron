import { CDN_IMAGE } from "../config";
import { createElement } from "../utils/index";

const courseCard = (courseData: any) => {
  const card = createElement("div", {
    className: "course-card-element",
    innerHTML: `<img src=${CDN_IMAGE}${
      courseData?.img
    } alt="Course Thumbnail Image">
  <div class="course-card-element-body">
    <h2 class="course-card-element-body-heading">${courseData?.title}</h2>
    <p class="course-card-element-body-description">${
      courseData?.description
    } <span class="course-card-element-body-description-btn">Show More</span></p>
    
    <details class="more-class-details">
      <summary class="more-class-details-summary">
        <p>Batch Name : ${courseData?.classTimings?.batchName}</p>
        <p>Doubt Clearing : ${courseData?.classTimings?.doubtClearing}</p>
        <p>Start Date : ${courseData?.classTimings?.startDate}</p>
        <p>Timing : ${courseData?.classTimings?.timings}</p>
      </summary>
    </details>

    <div class="course-card-element-price"><h4>Course Price : ${
      (courseData?.pricing?.IN * courseData?.pricing?.discount) / 100
    }</h4> <s>${courseData?.pricing?.IN}</s> </div>
  </div>`,
  });
  return card;
};

export default courseCard;
