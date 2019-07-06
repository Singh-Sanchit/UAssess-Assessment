import axios from "axios";
const header = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
};

const getbody = {
  token: localStorage.getItem("token"),
  active: true
};

export const CreateQuestionApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3002_v1 + "/create-question",
      data ? data : getbody,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/QuestionApi/ in CreateQuestionApi() for Adding New Question",
        error
      )
    );
};

export const GetAllQuestionsApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3002_v1 + "/get-questions",
      data ? data : getbody,
      header
    )
    .then(res => {
      return res.data;
    })
    .catch(error =>
      console.log(
        "parsing failed at src/api/QuestionApi/ in GetAllQuestionsApi() for Fetching All Question",
        error
      )
    );
};

export const UpdateQuestionApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3002_v1 + "/update-question",
      data ? data : getbody,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/QuestionApi/ in UpdateQuestionApi() for Updating Existing Question",
        error
      )
    );
};

export const UpdateQuestionStatusApi = data => {
  return axios
  .post(
    process.env.REACT_APP_PATH_URL_3002_v1 + "/update-question-status",
    data,
    header
  )
  .then(res => res.data)
  .catch(error =>
    console.log(
      "parsing failed at src/api/SkillApi in UpdateQuestionStatusApi() for Updating Skills Status",
      error
    )
  );
}
