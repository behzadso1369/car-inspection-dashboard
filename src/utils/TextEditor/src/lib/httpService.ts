import axios from "axios";

axios.defaults.baseURL = "https://api-gateway.okcs.com/portal/admin/v1";
axios.defaults.headers.common = {
  Authorization: localStorage.getItem("token"),
};
// axios.defaults.withCredentials = false;
const http = {
  get: axios.get,
  post: axios.post,
  delete: axios.delete,
  put: axios.put,
};
export default http;
