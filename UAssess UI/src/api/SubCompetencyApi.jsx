import axios from "axios";
const header = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
};

export const GetSubCompetenciesApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/get-sub-competencies",
      {
        token: localStorage.getItem("token"),
        active: true
      },
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SubCompetencyApi in GetSubCompetenciesApi() for Fetching Sub-Competencies",
        error
      )
    );
};

export const CreateSubCompetencyApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/create-sub-competencies",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SubCompetencyApi in CreateSubCompetencyApi() for Adding New SubCompetency",
        error
      )
    );
};

export const UpdateSubCompetencyApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-sub-competencies",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/SubCompetencyApi in UpdateSubCompetencyApi() for Updating SubCompetency",
        error
      )
    );
};

export const UpdateSubCompetencyStatusApi = data => {
  return axios
  .post(
    process.env.REACT_APP_PATH_URL_3001_v1 + "/update-subcompetency-status",
    data,
    header
  )
  .then(res => res.data)
  .catch(error =>
    console.log(
      "parsing failed at src/api/SubCompetencyApi in UpdateSubCompetencyStatusApi() for Updating SubCompetency Status",
      error
    )
  );
}
