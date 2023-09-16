import { combineReducers } from "redux";

import timer from "./timer";
import tasks from "./tasks";
import auth from './auth';
import templates from "./templates";
import leaderboard from './leaderboard';
import activities from './activities';
import notes from "./notes";

export default combineReducers({
  timer,
  tasks,
  auth,
  templates,
  leaderboard,
  activities,
  notes
});
