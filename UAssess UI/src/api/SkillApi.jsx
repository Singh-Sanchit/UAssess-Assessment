import axios from "axios";
const header = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
};

export const GetSkillsApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/get-skills",
      {
        token: localStorage.getItem("token"),
        active: true
      },
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SkillApi in GetSkillsApi() for Fetching Skills",
        error
      )
    );
};

export const CreateSkillApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/create-skills",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SkillApi in CreateSkillApi() for Adding New Skills",
        error
      )
    );
};

export const UpdateSkillApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-skill",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SkillApi in UpdateSkillApi() for Updating Skills",
        error
      )
    );
};

export const UpdateSkillStatusApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-skill-status",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SkillApi in UpdateSkillStatusApi() for Updating Skills Status",
        error
      )
    );
};
