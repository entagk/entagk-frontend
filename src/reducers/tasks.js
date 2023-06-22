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
  ADD_LOCAL_TASKS,
  CLEAR_CONGRATS,
  GET_TEMPLATE_TASKS
} from "../actions/tasks";
import { INCREASE_ACT, PERIOD, MODITY_SETTING, GET_SETTING } from "../actions/timer";
import { nanoid } from "nanoid";
import { LOGOUT, START_LOADING, END_LOADING, DELETE_USER } from "../actions/auth";

const initialData = {
  name: "",
  est: 1,
  act: 0,
  notes: "",
  project: "",
  check: false,
};

const initialState = {
  activeId: null,
  tasks: undefined,
  act: 0,
  est: 0,
  autoStartNextTask: false,
  isLoading: false,
  congrats: "",
  tempTasks: {}
}

// eslint-disable-next-line
export default (
  state = initialState,
  action
) => {
  let all;
  let finishedTasks, unfinishedTasks;
  // eslint-disable-next-line
  let newEst, newAct, newActive;
  switch (action.type) {
    case START_LOADING:
      return {
        ...state,
        isLoading: action.data === 'tasks' ? true : state.isLoading
      };

    case END_LOADING:
      return { ...state, isLoading: action.data === 'tasks' ? false : state.isLoading };

    case GET_SETTING:
      return {
        ...state,
        autoStartNextTask: action.data.autoStartNextTask
      };

    case ADD_LOCAL_TASKS:
      const tasks = action.data;
      localStorage.removeItem('tasks');
      localStorage.removeItem('act');
      localStorage.removeItem('est');
      return { ...state, tasks: tasks };

    case GET_TASKS:
      const page = action.data?.currentPage;
      const numberOfPages = action.data?.numberOfPages;
      const total = action.data?.total;
      all = Number(page) > 1 ? state.tasks.concat(action.data.all) : action.data.all;
      finishedTasks = all.filter(t => t?.check);
      unfinishedTasks = all.filter(t => !t?.check).sort((task, nextTask) => nextTask.est - task.est);

      if (!localStorage.getItem("token")) {
        return {
          ...state,
          tasks: unfinishedTasks.concat(finishedTasks),
          est: action.data.est,
          act: action.data.act,
          activeId: state?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?._id
            : null,
          activeName: state?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?.name
            : null,
        };
      } else {
        localStorage.setItem('total', total);
        localStorage.setItem('currentPage', page);
        localStorage.setItem('tasksLen', all.length);
        const tempTasks = all.filter(t => t.tasks.length > 0).map(t => t._id).reduce((pre, newT) => ({ [newT]: {}, ...pre }), {});

        return {
          ...state,
          currentPage: page,
          numberOfPages: numberOfPages,
          total: total,
          tasks: all,
          tempTasks: { ...state.tempTasks, ...tempTasks },
          est: all.length > 0 ? all.reduce((total, task) => total + task.est, 0) : 0,
          act: all.length > 0 ? all.reduce((total, task) => total + task.act, 0) : 0,
          activeId: state?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?._id
            : null,
          activeName: state?.autoStartNextTask
            ? action.data.all.filter((t) => !t.check)[0]?.name
            : null,
        };
      };

    // todo
    case MODITY_SETTING:
      unfinishedTasks = state?.tasks?.filter((t) => !t.check);
      if (!localStorage.getItem("token")) {
        const autoStart = action.data.autoStartNextTask;
        return {
          ...state,
          autoStartNextTask: action.data.autoStartNextTask,
          activeId: !autoStart
            ? state.activeId : unfinishedTasks?.length > 0 ? unfinishedTasks[0]?._id : null,
          activeName: !autoStart
            ? state.activeName : unfinishedTasks?.length > 0 ? unfinishedTasks[0]?.name : null,
        };
      } else {
        const autoStart = action.data.autoStartNextTask;
        return {
          ...state,
          autoStartNextTask: autoStart,
          activeId: !autoStart
            ? state.activeId : unfinishedTasks?.length > 0 ? unfinishedTasks[0]?._id : null,
          activeName: !autoStart
            ? state.activeName : unfinishedTasks?.length > 0 ? unfinishedTasks[0]?.name : null,
        };
      };

    case CHANGE_ACTIVE_TASK:
      const tId = action.data?._id?.split(',');
      const tName = tId?.length === 2 ? state.tasks.filter(t => t._id === tId[0])[0].name + " > " + action.data.name : action.data.name;

      return {
        ...state,
        activeId: '_id' in action.data ? tId.at(-1) : "",
        activeName: 'name' in action.data ? tName : "",
      };

    case INCREASE_ACT:
      let newActive =
        Boolean(state.activeId)
          ? state.tasks.find((t) => t._id === state.activeId)
          : { _id: null, name: null };
      let realAct = state.act;
      let congrats = '';
      if (!localStorage.getItem("token")) {
        if (Boolean(state.activeId) && action.data === PERIOD) {
          const taskIndex = state.tasks.findIndex(
            (t) => t._id === state.activeId
          );

          state.tasks[taskIndex].act++;

          if (state.tasks[taskIndex].act === state.tasks[taskIndex].est) {
            state.tasks[taskIndex].check = true;
            congrats = state.tasks[taskIndex].name;
          }

          realAct = realAct + 1;
          localStorage.setItem("act", realAct);
          localStorage.setItem("tasks", JSON.stringify(state.tasks));
          console.log(realAct, state.tasks);

          newActive =
            !state.tasks[taskIndex].check
              ? state.tasks[taskIndex]
              : state.autoStartNextTask ? state.tasks[taskIndex + 1] : { _id: null, name: null };
        }

        return {
          ...state,
          tasks: state.tasks,
          act: realAct,
          activeId: newActive?._id,
          activeName: newActive?.name,
          congrats: congrats
        };
      } else {
        if (Boolean(state.activeId) && action.data.active === PERIOD) {
          const task = action.data.task;

          const taskIndex = state.tasks.findIndex(
            (t) => t._id === task.template._id || t._id === task._id
          );

          state.tasks[taskIndex] = task.template?._id ? { ...state.tasks[taskIndex], act: state.tasks[taskIndex].act + 1 } : task;

          if (task.template?._id) {
            const realTaskIndex = state.tempTasks[task.template._id].tasks.findIndex(t => t._id === task._id);
            state.tempTasks[task.template._id].tasks[realTaskIndex] = task;
          }
          congrats = task.check ? task.name : "";

          realAct = realAct + 1;

          newActive =
            !task?.check
              ? state.tasks[taskIndex]
              : state.autoStartNextTask ? state.tasks[taskIndex + 1] : { _id: null, name: null };
        }
        return {
          ...state,
          tasks: state.tasks,
          act: realAct,
          activeId: newActive?._id,
          activeName: newActive?.name,
          congrats: congrats
        };
      };

    case CLEAR_CONGRATS:
      return { ...state, congrats: "" };

    case NEW_TASK:
      all = state.tasks;
      finishedTasks = all.filter(t => t.check);
      unfinishedTasks = all.filter(t => !t.check);
      if (!localStorage.getItem("token")) {
        const newTask = Object.assign(
          { _id: nanoid(), ...initialData },
          action.data
        );
        localStorage.setItem("tasks", JSON.stringify([...unfinishedTasks, newTask, ...finishedTasks]));
        localStorage.setItem("est", state?.est + action.data.est);

        unfinishedTasks.push(newTask);

        return {
          ...state,
          tasks: [...unfinishedTasks, ...finishedTasks],
          est: state.est + action.data.est,
          activeId: state.autoStartNextTask ? unfinishedTasks[0]?._id : state.activeId,
          activeName: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.name : state.activeName
        };
      } else {
        const task = action.data;
        state.est += task.est;

        if (task?.template?._id) {
          const oldTasks = state.tempTasks[task.template?._id].tasks;
          state.tempTasks[task?.template?._id].tasks = oldTasks.concat([task]);
          const tempIndex = state.tasks.findIndex(temp => temp._id === task.template._id);
          state.tasks[tempIndex].est += task.est;
          state.tasks[tempIndex].check = false;
          state.tasks[tempIndex].tasks.push(task._id)
        } else {
          unfinishedTasks.push(action.data)
        }

        return {
          ...state,
          tasks: [...unfinishedTasks, ...finishedTasks],
          total: state.total + 1,
          activeId: state.autoStartNextTask ? all.filter(t => !t.check)[0]?._id : state.activeId,
          activeName: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.name : state.activeName,
        };
      };

    case CHECK_TASK:
      all = state.tasks;
      if (!localStorage.getItem("token")) {
        const task = all.find((t) => t._id === action.data);
        task.check = !task.check;
        task.act = task.check ? task.est : 0;

        localStorage.setItem("tasks", JSON.stringify(all));

        newAct = task.check ? state.act + task.est : state.act - task.est;

        localStorage.setItem('act', newAct);

        return {
          ...state,
          act: newAct,
          tasks: all,
          activeId: state.autoStartNextTask ? all.filter(t => !t.check)[0]?._id : state.activeId,
          activeName: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.name : (state.activeName || null)
        };
      } else {
        const taskData = action.data;

        if (taskData.template?._id) {
          const tempTask = all?.find((t) => t._id === taskData.template._id);
          const task = state.tempTasks[taskData.template._id].tasks.find(t => t._id === taskData._id);

          tempTask.check = tempTask.act + taskData.act === tempTask.est;
          tempTask.act = taskData.check ? tempTask.act - task.act + taskData.act : tempTask.act - task.est;

          task.check = !task.check;
          state.act = taskData.check ? state.act - task.act + task.est : state.act - task.act;
          task.act = taskData.check ? taskData.est : 0;
        } else {
          const task = all.find((t) => t._id === taskData._id);
          const old = Object.freeze({ act: task.act, est: task.est });

          task.check = !task.check;
          task.act = task.check ? task.est : 0;

          state.act = task.check ? state.act - old.act + old.est : state.act - old.act;
        }

        return {
          ...state,
          tasks: all,
          activeId: state.autoStartNextTask ? all.filter(t => !t.check)[0]?._id : state.activeId,
          activeName: state.autoStartNextTask ? all.filter(t => !t.check)[0]?.name : (state.activeName || null)
        };
      };

    case DELETE_TASK:
      all = state.tasks;
      const tIndex = action.data?.template ? all.findIndex((t) => t._id === action.data?.template?._id) : all.findIndex((t) => t._id === action.data.id);
      console.log(tIndex);
      const task = all[tIndex];
      let newAll = task.tasks.length > 1 ? all.filter((task) => task._id !== action.data || task._id !== action.data?.id) : all.filter(t => t._id !== task._id);

      if (!localStorage.getItem("token")) {
        const newEst = state.est - task.est;
        newAct = task.check ? state.act - task.act : state.act;
        const unfinishedTasks = all.filter(t => !t.check)
        // save the tasks in localStorage
        localStorage.setItem("tasks", JSON.stringify(newAll));

        if (state.tasks.length === 0) {
          localStorage.removeItem("est");
          localStorage.removeItem("act");
        } else {
          localStorage.setItem("est", newEst);
          localStorage.setItem("act", newAct);
        }
        console.log(state.activeId !== task._id);
        console.log(state.activeName !== task.name);

        return {
          ...state,
          est: newEst,
          act: newAct,
          tasks: newAll,
          activeId: state.activeId !== task._id ? state.activeId : state.autoStartNextTask ? null : unfinishedTasks.length > 0 ? unfinishedTasks[0]._id : null,
          activeName: state.activeName !== task.name ? state.activeName : state.autoStartNextTask ? null : unfinishedTasks.length > 0 ? unfinishedTasks[0].name : null,
        };
      } else {
        const realTask = action.data.template ? state.tempTasks[task._id].tasks.filter(t => t._id === action.data.id)[0] : null;
        newEst = action.data?.template ? state.est - realTask.est : state.est - task.est;
        newAct = action.data?.template ? state.act - realTask.act : state.act - task.act;
        const unfinishedTasks = all.filter(t => !t.check);

        if (action.data?.template && task.tasks.length > 1) {
          console.log(task);
          console.log(state.tempTasks[task._id]);
          state.tempTasks[task._id].tasks = state.tempTasks[task._id].tasks.filter(t => t._id !== action.data.id);

          newAll[tIndex] = { ...task, tasks: task.tasks.filter(t => t !== action.data.id), act: task.act - realTask.act, est: task.est - realTask.est };
          console.log(newAll);
        }

        return {
          ...state,
          est: newEst,
          act: newAct,
          tasks: newAll,
          total: state.total - 1,
          activeId: state.activeId !== task._id ? state.activeId : state.autoStartNextTask ? null : unfinishedTasks.length > 0 ? unfinishedTasks[0]._id : null,
          activeName: state.activeName !== task.name ? state.activeName : state.autoStartNextTask ? null : unfinishedTasks.length > 0 ? unfinishedTasks[0].name : null
        };
      };

    case GET_TEMPLATE_TASKS:
      const data = action.data;
      const tempTasks = data.currentPage === 1 ? data.tasks : data.tasks.concat(state.tempTasks[data.id]?.tasks);

      localStorage.setItem(`${data.id}-total`, data.total);
      localStorage.setItem(`${data.id}-currentPage`, Number(data?.currentPage));
      localStorage.setItem(`${data.id}-tasksLen`, tempTasks.length);

      return { ...state, tempTasks: { ...state.tempTasks, [data.id]: { ...data, tasks: tempTasks } } }

    /**
     * Update task data
    */
    case MODIFY_TASK:
      const taskIndex = action.data?.template ? state.tempTasks[action.data.template._id].tasks.findIndex((t) => t._id === action.data._id) : state.tasks.findIndex((t) => t._id === action.data._id);
      const { act, est } = action.data?.template ? state.tempTasks[action.data.template._id].tasks[taskIndex] : state.tasks[taskIndex];
      newAct = state.act + action.data.act - act;
      newEst = state.est + action.data.est - est;

      if (!localStorage.getItem("token")) {
        const newActive = { _id: null, name: null };
        const newTask = Object.assign({ act, est }, action.data);

        newTask.check = newTask.est === newTask.act;

        const all = state.tasks.filter((t) => t._id !== action.data._id);

        if (newTask.check && state.autoStartNextTask) {
          all.push(newTask);
          newActive._id = all.filter((t) => !t.check)[0]?._id || null;
          newActive.name = all.filter((t) => !t.check)[0]?.name || null;
        } else {
          state.tasks[taskIndex] = newTask;
        }

        localStorage.setItem(
          "tasks",
          JSON.stringify(
            newTask.check && state.autoStartNextTask ? all : state.tasks
          )
        );
        localStorage.setItem("est", newEst);
        localStorage.setItem("act", newAct);

        return {
          ...state,
          tasks: newTask.check && state.autoStartNextTask ? all : state.tasks,
          activeId: state.autoStartNextTask && newTask.check ? newActive._id : newTask.check ? null : state.activeId,
          activeName: state.autoStartNextTask && newTask.check ? newActive.name : newTask.check ? null : state.activeName,
          act: newAct,
          est: newEst,
        };
      } else {
        const newActive = { _id: null, name: null };
        const newTask = Object.assign({ act, est }, action.data);

        if (action.data.template) {
          state.tempTasks[action.data.template._id].tasks[taskIndex] = newTask;
          const tempIndex = state.tasks.findIndex(t => t._id === action.data.template._id);
          const temp = state.tasks[tempIndex];
          state.tasks[tempIndex] = {
            ...temp,
            act: temp.act - act + action.data.act,
            est: temp.est - est + action.data.est,
            check: (temp.est - est + action.data.est) === (temp.act - act + action.data.act)
          };

          if (newTask.check && state.autoStartNextTask) {
            newActive._id = null;
            newActive.name = null;
          }
        } else {
          const all = state.tasks.filter((t) => t._id !== action.data._id);
          if (newTask.check) {
            all.push(newTask);
            console.log(all)
            if (state.autoStartNextTask) {
              newActive._id = all.filter((t) => !t.check)[0]?._id || null;
              newActive.name = all.filter((t) => !t.check)[0]?.name || null;
            }
          } else {
            state.tasks[taskIndex] = newTask;
          }
        }

        return {
          ...state,
          tasks: newTask.check ? all : state.tasks,
          activeId: state.autoStartNextTask && newTask.check ? newActive._id : newTask.check ? null : state.activeId,
          activeName: state.autoStartNextTask && newTask.check ? newActive.name : newTask.check ? null : state.activeName,
          act: newAct,
          est: newEst,
        };
      };

    /**
     * filter the tasks from tasks that is checked
     * and then reduce the total act
     */

    case CLEAR_FINISHED_TASKS:
      all = state.tasks;  
      finishedTasks = all.filter((task) => task.check);
      unfinishedTasks = all.filter((task) => !task.check);

      newAct = state.act - finishedTasks.reduce((total, cur) => total + cur.act, 0);
      newEst = state.est - finishedTasks.reduce((total, cur) => total + cur.est, 0);

      if (!localStorage.getItem("token")) {
        localStorage.setItem("tasks", JSON.stringify(unfinishedTasks));
        localStorage.setItem("act", newAct);
        localStorage.setItem('est', newEst)
      } else {
        if (Object.values(state.tempTasks).length > 0) {
          const tempTasks = Object.entries(state.tempTasks).filter(tt => unfinishedTasks.find(t => t._id === tt[0]) !== undefined);
          const newTempTasks = tempTasks.map(([k, v]) => {
            if (v?.tasks) {
              console.log([k, v])
              const unfinishedTT = v?.tasks?.filter(t => !t.check);
              const finishedTT = v?.tasks?.filter(t => t.check);

              const template = unfinishedTasks.find(t => t._id === unfinishedTT[0].template._id);

              template.act = unfinishedTT.reduce((total, currentTask) => total + currentTask.act, 0);
              template.est = unfinishedTT.reduce((total, currentTask) => total + currentTask.est, 0);

              newAct = newAct - finishedTT.reduce((total, currnetTask) => total + currnetTask.act, 0);
              newEst = newEst - finishedTT.reduce((total, currnetTask) => total + currnetTask.est, 0);

              return [k, { ...v, tasks: unfinishedTT }];
            } else {
              return [k, v];
            }
          })

          state.tempTasks = newTempTasks;
        }
      }

      return {
        ...state,
        act: newAct,
        est: newEst,
        tasks: unfinishedTasks,
        total: state.total - finishedTasks.length
      };

    /**
     * loop through the tasks to 
     * make the act equal to zero and change check to false
     */
    // fix it
    case CLEAR_ACT_FROM_TASKS:
      all = state.tasks
        .map((t) => {
          return { ...t, act: 0, check: false };
        })
      if (!localStorage.getItem("token")) {

        localStorage.setItem("tasks", JSON.stringify(all));

        localStorage.setItem("act", 0);
      } else {
        // state.tempTasks = new Object()
      }

      return {
        ...state,
        act: 0,
        tasks: all,
        activeId: state.autoStartNextTask && Boolean(state.activeId) === true ? all[0]._id : state.activeId,
        activeName: state.autoStartNextTask && Boolean(state.activeId) === true ? all[0].name : state.activeName,
      };

    // fix it
    case CLEAR_ALL_TASKS:
      if (!localStorage.getItem("token")) {
        localStorage.setItem("tasks", JSON.stringify([]));
        localStorage.setItem("act", 0);
        localStorage.setItem("est", 0);
      } else {

      }

      return { ...initialState, tasks: [], total: 0, act: 0, est: 0 };

    case LOGOUT:
    case DELETE_USER:
      return { ...initialState, tasks: [] };

    default:
      return state;
  }
};
