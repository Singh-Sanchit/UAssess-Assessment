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

export const Login = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3000_v1 + "/login",
      data ? data : getbody,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/AuthenticationApi in Login() for Login",
        error
      )
    );
};

export const Register = data => {
  return axios
    .post(
      process.env.REACT_APP_PATH_URL_3000_v1 + "/register",
      data ? data : getbody,
      header
    )
    .then(res => res.data)
    .catch(error =>
      console.log(
        "parsing failed at src/api/AuthenticationApi in Register() for Registration",
        error
      )
    );
};
