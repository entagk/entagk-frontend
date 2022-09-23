import { combineReducers } from "redux";

import timer from "./timer";
import tasks from "./tasks";

export default combineReducers({ timer, tasks });