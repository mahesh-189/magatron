import { CDN_IMAGE } from "../config";
import { createElement } from "../utils/index";

const courseCard = (courseData: any) => {
  const card = createElement("div", {
    className: "course-card-element",
    innerHTML: `<img src=${CDN_IMAGE}${
      courseData?.img
    } alt="Course Thumbnail Image">
  <div class="course-card-element-body">
    <h3 class="course-card-element-body-heading">${courseData?.title}</h3>
    <p class="course-card-element-body-description course-card-description-toggle">${
      courseData?.description
    } </p><span class="course-card-element-body-description-btn">Show More</span>
    
    <details class="more-class-details">
      <summary class="more-class-details-summary">
        Class Details
      </summary>
      ${
        courseData?.classTimings?.batchName
          ? `<p>Batch Name: ${courseData.classTimings.batchName}</p>`
          : ""
      }
${
  courseData?.classTimings?.doubtClearing
    ? `<p>Doubt Clearing: ${courseData.classTimings.doubtClearing}</p>`
    : ""
}
${
  courseData?.classTimings?.startDate
    ? `<p>Start Date: ${courseData.classTimings.startDate}</p>`
    : ""
}
${
  courseData?.classTimings?.timings
    ? `<p>Timing: ${courseData.classTimings.timings}</p>`
    : ""
}

    </details>

    <div class="course-card-element-price"><h4>Course Price : &#8377;${Math.floor(
      courseData?.pricing?.IN -
        (courseData?.pricing?.IN * courseData?.pricing?.discount) / 100
    )}</h4> <s>&#8377;${courseData?.pricing?.IN}</s> </div>
  </div>`,
  });

  return card;
};

export default courseCard;
