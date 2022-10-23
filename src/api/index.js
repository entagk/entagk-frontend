import axios from "axios";

const API = axios.create({ baseURL: "https://entagk-pomodoro.herokuapp.com/api" });

// Add a request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  console.error("Error : " + error);
  return Promise.reject(error);
});

// Add a response interceptor
API.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data

  return response;
}, (error) => {
  console.error("Error : " + error);
  return Promise.reject(error);
});

/* Start the user api */
export const signIn = (formData) => API.post('/user/signin', formData);

export const signUp = (formData) => API.post('/user/signup', formData);

export const getUserData = () => API.get("/user/user_info");

export const forgetPassword = (formData) => API.post("/user/forgot_password", formData);

export const resetPassword = (formData) => API.post("/user/reset_password", formData);

export const updateUser = (formData) => API.patch("/user/update_user", formData);

export const deleteUser = () => API.delete("/user/delete_user");
/* End the user api */

/* Start the task api */
export const getAllTasks = () => API.get("/task/");

export const addTask = (taskData) => API.post("/task/add/", taskData);

export const updateTask = (taskData, id) => API.patch(`/task/update/${id}`, taskData);

export const deleteTask = (id) => API.delete(`/task/delete/${id}`);
/* End the task api */

/* start the setting api */
export const getAllSetting = () => API.get("/setting/");

export const updateSetting = (settingData) => API.post("/setting/update/", settingData);
/* end the setting api */

