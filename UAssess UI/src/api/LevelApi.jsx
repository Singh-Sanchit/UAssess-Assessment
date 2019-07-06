import axios from "axios";
const header = {
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "Access-Control-Allow-Origin": "*"
  }
};

export const GetLevelApi = () => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/get-Levels",
      {
        token: localStorage.getItem("token"),
        active: true
      },
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/LevelApi in GetLevelApi() for Fetching Level",
        error
      )
    );
};

export const CreateLevelApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/create-Level",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/LevelApi in CreateLevelApi() for Adding New Level",
        error
      )
    );
};

export const UpdateLevelApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3001_v1 + "/update-level",
      data,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/LevelApi in UpdateLevelApi() for Updating Level",
        error
      )
    );
};

export const UpdateLevelStatusApi = data => {
  return axios
  .post(
    process.env.REACT_APP_PATH_URL_3001_v1 + "/update-level-status",
    data,
    header
  )
  .then(res => res.data)
  .catch(error =>
    console.log(
      "parsing failed at src/api/LevelApi in UpdateLevelStatusApi() for Updating Level Status",
      error
    )
  );
}
