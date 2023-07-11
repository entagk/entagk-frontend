import axios from "axios";
import jwt_decode from 'jwt-decode';

const API = axios.create({ baseURL: "http://localhost:5500/api" }); // http://localhost:5500/api

// Add a request interceptor
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  const decodedToken = token ? jwt_decode(token) : {};
  if (token) {
    if (decodedToken?.exp * 1000 < new Date().getTime()) {
      localStorage.clear();
      // console.log(decodedToken.exp * 1000 < new Date().getTime());
      window.location.reload();
    }
  }

  if (token && config.url !== '/user/verify_reset_id') {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    if (localStorage.getItem("rest-token")) {
      config.headers.Authorization = `Bearer ${localStorage.getItem("reset-token")}`;
    }
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
  if (error?.response?.status === 401) {
    localStorage.clear();
    // window.location.reload();
  }
  return Promise.reject(error);
});

/* Start the user api */
export const signIn = (formData) => API.post('/user/signin', formData);

export const signUp = (formData) => API.post('/user/signup', formData);

export const googleLogin = (token) => API.post('/user/google_login/', token);

export const getUserData = () => API.get("/user/user_info");

export const forgetPassword = (formData) => API.post("/user/forgot_password", formData);

export const VerifyResetToken = () => API.post('/user/verify_reset_id');

export const resetPassword = (formData, token) => API.post("/user/reset_password", formData, { headers: { Authorization: `Bearer ${token}` } });

export const updateUser = (formData) => API.patch("/user/update_user", formData);

export const deleteUser = () => API.delete("/user/delete_user");

export const getRefreshToken = () => API.get("/user/refresh_token");
/* End the user api */

/* Start the task api */
export const getAllTasks = (page) => API.get(`/task/?page=${page}`);

export const addTask = (taskData) => API.post("/task/add/", taskData);

export const addMultipleTasks = (tasksData) => API.post("/task/add_multiple_tasks", tasksData);

export const updateTask = (taskData, id) => API.patch(`/task/update/${id}`, taskData);

export const deleteTask = (id) => API.delete(`/task/delete/${id}`);

export const checkTask = (id) => API.post(`/task/check/${id}`);

export const clearAllTasks = () => API.delete("/task/clear_all");

export const clearActTasks = () => API.delete("/task/clear_act/");

export const clearFinishedTasks = () => API.delete("/task/clear_finished/");

export const increaseAct = (id) => API.post(`/task/increase_act/${id}`);
/* End the task api */

/* start the setting api */
export const getAllSetting = () => API.get("/setting/");

export const updateSetting = (settingData) => API.post("/setting/update/", settingData);
/* end the setting api */

/* start the template api */
export const getTempsForUser = (sort, page) => API.get(`/template/user/?sort=${sort}&page=${page}`);

export const searchTemplatesForUser = (page, sort, query) => API.get(`/template/user/search?query=${query}&page=${page}&sort=${sort}`);

export const getTasksForOne = (id, page) => API.get(`/template/one/tasks/private/${id}?page=${page}`);

export const getTasksForTodoTemp = (id, page) => API.get(`/template/todo/tasks/${id}?page=${page}`);

export const deleteTemplate = (id) => API.delete(`/template/${id}`);

export const addToTodo = (id) => API.post(`/template/todo/${id}`);

export const addTemplate = (formData) => API.post(`/template/add/`, formData);

export const modifyTemplate = (id, formData) => API.patch(`/template/${id}`, formData);

/* end the template api */
