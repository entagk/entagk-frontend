import { combineReducers } from "redux";

import timer from "./timer";
import tasks from "./tasks";
import auth from './auth';
import templates from "./templates";

export default combineReducers({ timer, tasks, auth, templates });
