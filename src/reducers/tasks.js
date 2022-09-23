import { CHANGE_ACTIVE_TASK, CHECK_TASK, DELETE_TASK, GET_TASKS, MODIFY_TASK, NEW_TASK } from "../actions/tasks";
import { CHANGE_ACTIVE, PERIOD } from "../actions/timer";
import { nanoid } from "nanoid";

const initialData = {
  name: "",
  est: 1,
  act: 0,
  notes: "",
  project: "",
  check: false,
}

// eslint-disable-next-line
export default (state = { activeId: null, tasks: null, act: 0, est: 0, finishing: 0 }, action) => {
  let newEst, all;
  switch (action.type) {
    case GET_TASKS:
      if (!localStorage.getItem('token')) {
        const all = JSON.parse(localStorage.getItem("tasks")) || [];
        const est = Number(localStorage.getItem("est"));
        const act = Number(localStorage.getItem("act"));

        return { ...state, tasks: all, est: est, act: act };
      } else {
        return { ...state };
      }


    case CHANGE_ACTIVE_TASK:
      return { ...state, activeId: action.data.id, activeName: action.data.name };

    case CHANGE_ACTIVE:
      let realAct = state.act;
      if (!localStorage.getItem("token"))
        if (state.activeId !== null && action.data === PERIOD) {
          const task = state.tasks.find(t => t.id === state.activeId);
          state.tasks.find(t => t.id === state.activeId).act++;
          state.tasks.find(t => t.id === state.activeId).check = task.act === task.est;

          realAct = realAct + 1;
          localStorage.setItem("act", realAct);
          console.log(state.tasks);
          localStorage.setItem("tasks", JSON.stringify(state.tasks));
        }

      return { ...state, tasks: state.tasks, act: action.data === PERIOD ? state.act + 1 : state.act };
    case NEW_TASK:
      newEst = state.est + action.data.est;

      if (!localStorage.getItem('token')) {
        let all = state.tasks;
        const newTask = Object.assign({id: nanoid(), ...initialData}, action.data);
        console.log(newTask);
        console.log(state.tasks);
 
        all.push(newTask);
        console.log(all);

        localStorage.setItem("tasks", JSON.stringify(all));
        localStorage.setItem("est", newEst);

        return { ...state, tasks: all, est: newEst };
      } else {
        return { ...state, tasks: all, est: newEst };
      }
    case CHECK_TASK:
      if (!localStorage.getItem('token')) {
        const all = state.tasks;
        const task = all.find((t) => t.id === action.data);
        task.check = !task.check;
  
        localStorage.setItem("tasks", JSON.stringify(all));
        console.log(state.est);
        const newEst = task.check ? state.est - task.est + task.act : state.est + task.est - task.act;
  
        localStorage.setItem("est", newEst);

        return { ...state, est: newEst, tasks: all };
      } else {
        return { ...state };
      }

    case DELETE_TASK:
      if (!localStorage.getItem('token')) {
        all = state.tasks;
        const task = all.find(t => t.id === action.data);
        const newAll = all.filter((task) => task.id !== action.data);

        // save the tasks in localStorage
        localStorage.setItem('tasks', JSON.stringify(newAll));

        let oldEst = state.est;

        // if the task is checked, 
        // the est is updated to equal to (totalEst - task.est) 
        // so we don't need to minus the task est from totalEst
        
        let newEst = !task.check ? oldEst - task.est : oldEst;
        let newAct = state.act - task.act;

        if (state.tasks.length === 0) {
          localStorage.removeItem("est");
          localStorage.removeItem("act");
        } else {
          localStorage.setItem("est", newEst);
          localStorage.setItem("act", newAct);
        }

        return { ...state, est: newEst, tasks: newAll, act: newAct };
      } else {

        return { ...state };
      }

    case MODIFY_TASK:
      if (!localStorage.getItem('token')) {
        const { act, est } = state.tasks.find(t => t.id === action.data.id);
        const taskIndex = state.tasks.findIndex(t => t.id === action.data.id);
        const newTask = Object.assign({ act, est }, action.data);

        state.tasks[taskIndex] = newTask;

        localStorage.setItem("tasks", JSON.stringify(state.tasks));

        let newAct = state.act, newEst = state.est;

        if (est !== action.data.est) {
          newEst = state.est + (action.data.est - est);
          localStorage.setItem("est", newEst);
        }

        if (act !== action.data.act) {
          newAct = state.act + action.data.act - act;
          localStorage.setItem("act", newAct);
        }

        return { ...state, tasks: state.tasks, act: newAct, est: newEst };
      } else {
        return { ...state }
      }

    default:
      return state;
  }
}