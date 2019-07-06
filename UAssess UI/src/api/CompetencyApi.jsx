import axios from "axios";
const header = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
};

export const GetCompetenciesApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/get-competencies",
      {
        token: localStorage.getItem("token"),
        active: true
      },
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/CompetencyApi in GetCompetenciesApi() for Fetching Competencies",
        error
      )
    );
};

export const CreateCompetencyApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/create-competencies",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/CompetencyApi in CreateCompetencyApi() for Adding New Competency",
        error
      )
    );
};

export const UpdateCompetencyApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-competency",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/CompetencyApi in UpdateCompetencyApi() for Updating Competency",
        error
      )
    );
};

export const UpdateCompetencyStatusApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-competency-status",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/CompetencyApi in UpdateCompetencyStatusApi() for Updating Competency Status",
        error
      )
    );
};
