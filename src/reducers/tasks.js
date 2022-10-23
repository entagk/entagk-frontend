import {
  CHANGE_ACTIVE_TASK,
  CHECK_TASK,
  DELETE_TASK,
  GET_TASKS,
  MODIFY_TASK,
  NEW_TASK,
  CLEAR_FINISHED_TASKS,
  CLEAR_ACT_FROM_TASKS,
  CLEAR_ALL_TASKS,
} from "../actions/tasks";
import { CHANGE_ACTIVE, PERIOD, MODITY_SETTING } from "../actions/timer";
import { nanoid } from "nanoid";

const initialData = {
  name: "",
  est: 1,
  act: 0,
  notes: "",
  project: "",
  check: false,
};

// eslint-disable-next-line
export default (
  state = {
    activeId: null,
    tasks: null,
    act: 0,
    est: 0,
    autoStartNextTask: false,
  },
  action
) => {
  let all;
  switch (action.type) {
    case GET_TASKS:
      if (!localStorage.getItem("token")) {
        const setting = JSON.parse(localStorage?.getItem("setting")) || {};
        const finishedTasks = action.data.all.filter(t => t.check);
        const unfinishedTasks = action.data.all.filter(t => !t.check);
        return {
          ...state,
          tasks: unfinishedTasks.concat(finishedTasks),
          est: action.data.est,
          act: action.data.act,
          autoStartNextTask: setting?.autoStartNextTask,
          activeId: setting?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?.id
            : null,
          activeName: setting?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?.name
            : null,
        };
      } else {
        return { ...state };
      }

    case MODITY_SETTING:
      if (!localStorage.getItem("token")) {
        return {
          ...state,
          autoStartNextTask: action.data.autoStartNextTask,
          activeId: action?.data?.autoStartNextTask
            ? state?.tasks?.filter((t) => !t.check)[0]?.id
            : state.activeId,
          activeName: action?.data?.autoStartNextTask
            ? state?.tasks?.filter((t) => !t.check)[0]?.name
            : state.activeName,
        };
      } else {
        return { ...state };
      }

    case CHANGE_ACTIVE_TASK:
      return {
        ...state,
        activeId: action.data.id,
        activeName: action.data.name,
      };

    case CHANGE_ACTIVE:
      let realAct = state.act,
        newEst = state.est,
        newActive =
          state.activeId
            ? state.tasks.find((t) => t.id === state.activeId)
            : { id: null, name: null };
      if (!localStorage.getItem("token")) {

        if (state.activeId && action.data === PERIOD) {
          // const task = state.tasks.find(t => t.id === state.activeId);
          const taskIndex = state.tasks.findIndex(
            (t) => t.id === state.activeId
          );
          state.tasks.find((t) => t.id === state.activeId).act++;
          if (state.tasks[taskIndex].act === state.tasks[taskIndex].est) {
            state.tasks.find((t) => t.id === state.activeId).check = true;
            newEst = state.est - state.tasks[taskIndex].est;
          }

          realAct = realAct + 1;
          localStorage.setItem("act", realAct);
          localStorage.setItem("est", newEst);
          localStorage.setItem("tasks", JSON.stringify(state.tasks));
          console.log(realAct, state.tasks);

          newActive =
            state.tasks[taskIndex].act === state.tasks[taskIndex].est
              ? state.tasks[taskIndex + 1]
              : state.tasks[taskIndex];
        }

        return {
          ...state,
          tasks: state.tasks,
          act: realAct,
          est: newEst,
          activeId: newActive?.id,
          activeName: newActive?.name,
        };
      } else {
        return { ...state, };
      }

    case NEW_TASK:
      if (!localStorage.getItem("token")) {
        let all = state.tasks;
        const finishedTasks = all.filter(t => t.check);
        const unfinishedTasks = all.filter(t => !t.check);
        const newTask = Object.assign(
          { id: nanoid(), ...initialData },
          action.data
        );

        localStorage.setItem("tasks", JSON.stringify([...unfinishedTasks, newTask, ...finishedTasks]));
        localStorage.setItem("est", state.est + action.data.est);

        return {
          ...state,
          tasks: [...unfinishedTasks, newTask, ...finishedTasks],
          est: state.est + action.data.est,
          activeId: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.id : state.activeId,
          activeName: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.name : state.activeName
        };
      } else {
        return { ...state, tasks: all, est: newEst };
      }

    case CHECK_TASK:
      if (!localStorage.getItem("token")) {
        const all = state.tasks;
        const task = all.find((t) => t.id === action.data);
        task.check = !task.check;

        localStorage.setItem("tasks", JSON.stringify(all));
        const newEst = task.check
          ? state.est - task.est + task.act
          : state.est + task.est - task.act;

        localStorage.setItem("est", newEst);

        return {
          ...state,
          est: newEst,
          tasks: all,
          activeId: all.filter(t => !t.check)[0]?.id || null,
          activeName: all.filter(t => !t.check)[0]?.name || null
        };
      } else {
        return { ...state };
      }

    case DELETE_TASK:
      if (!localStorage.getItem("token")) {
        all = state.tasks;
        const task = all.find((t) => t.id === action.data);
        const newAll = all.filter((task) => task.id !== action.data);

        // save the tasks in localStorage
        localStorage.setItem("tasks", JSON.stringify(newAll));

        let oldEst = state.est;

        // if the task is checked,
        // the est is updated to equal to (totalEst - task.est)
        // so we don't need to minus the task est from totalEst

        const newEst = !task.check ? oldEst - task.est : oldEst,
          newAct = state.act - task.act;

        if (state.tasks.length === 0) {
          localStorage.removeItem("est");
          localStorage.removeItem("act");
        } else {
          localStorage.setItem("est", newEst);
          localStorage.setItem("act", newAct);
        }

        return {
          ...state,
          est: newEst,
          act: newAct,
          tasks: newAll,
          activeId: state.activeId === task.id ? null : state.activeId,
          activeName: state.activeName === task.name ? null : state.activeName,
        };
      } else {
        return { ...state };
      }

    case MODIFY_TASK:
      if (!localStorage.getItem("token")) {
        const { act, est } = state.tasks.find((t) => t.id === action.data.id);
        const taskIndex = state.tasks.findIndex((t) => t.id === action.data.id);
        const newTask = Object.assign({ act, est }, action.data);
        const newActive = { id: null, name: null };

        newTask.check = newTask.est === newTask.act;

        const all = state.tasks.filter((t) => t.id !== action.data.id);
        if (newTask.check && state.autoStartNextTask) {
          all.push(newTask);
          newActive.id = all.filter((t) => !t.check)[0]?.id || null;
          newActive.name = all.filter((t) => !t.check)[0]?.name || null;
        } else {
          state.tasks[taskIndex] = newTask;
          newActive.id = state.tasks.filter((t) => !t.check)[0]?.id || null;
          newActive.name = state.tasks.filter((t) => !t.check)[0]?.name || null;
        }

        localStorage.setItem(
          "tasks",
          JSON.stringify(
            newTask.check && state.autoStartNextTask ? all : state.tasks
          )
        );

        let newAct = state.act,
          newEst = state.est;

        if (est !== action.data.est) {
          newEst = state.est + (action.data.est - est);
          localStorage.setItem("est", newEst);
        }

        if (act !== action.data.act) {
          newAct = state.act + action.data.act - act;
          localStorage.setItem("act", newAct);
        }

        return {
          ...state,
          tasks: newTask.check && state.autoStartNextTask ? all : state.tasks,
          activeId: state.autoStartNextTask ? newActive.id : state.activeId,
          activeName: state.autoStartNextTask ? newActive.name : state.activeName,
          act: newAct,
          est: newEst,
        };
      } else {
        return { ...state };
      }

    case CLEAR_FINISHED_TASKS:
      if (!localStorage.getItem("token")) {
        all = state.tasks;
        const finishedTasks = all.filter((task) => task.check);
        const unfinishedTasks = all.filter((task) => !task.check);

        const newAct =
          state.act - finishedTasks.reduce((total, cur) => total + cur.act, 0);

        localStorage.setItem("tasks", JSON.stringify(unfinishedTasks));
        localStorage.setItem("act", newAct);

        return { ...state, act: newAct, tasks: unfinishedTasks };
      } else {
        return { ...state, tasks: all };
      }

    case CLEAR_ACT_FROM_TASKS:
      if (!localStorage.getItem("token")) {
        const finishedTasks = state.tasks
          .filter((t) => t.check)
          .map((t) => {
            return { ...t, act: 0, check: false };
          });
        const unfinishedTasks = state.tasks.filter((t) => !t.check);

        const all = state.autoStartNextTask
          ? [...finishedTasks, ...unfinishedTasks]
          : state.tasks.map((t) => {
            return { ...t, act: 0, check: false };
          });

        localStorage.setItem("tasks", JSON.stringify(all));

        const newAct = 0;
        localStorage.setItem("act", 0);

        return {
          ...state,
          act: newAct,
          tasks: all,
          activeId: all[0].id,
          activeName: all[0].name,
        };
      } else {
        return { ...state, tasks: all };
      }

    case CLEAR_ALL_TASKS:
      if (!localStorage.getItem("token")) {
        localStorage.setItem("tasks", JSON.stringify([]));
        localStorage.setItem("act", 0);
        localStorage.setItem("est", 0);

        return { ...state, tasks: [], act: 0, est: 0 };
      } else {
        return { ...state };
      }

    default:
      return state;
  }
};
