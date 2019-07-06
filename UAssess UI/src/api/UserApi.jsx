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

export const getMyProfileApi = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3000_v1 + "/get-my-profile",
      data ? data : getbody,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/getMyProfileApi/ in GetMyProfile() for Fetching User ID",
        error
      )
    );
};
