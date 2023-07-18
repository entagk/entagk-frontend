import React, { lazy, Suspense, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { HiMenu } from "react-icons/hi";
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { clearFinishedTasks, clearAct, clearAllTasks } from "../../../actions/tasks";

import Loading from "../../../utils/Loading/Loading";

const Menu = lazy(() => import("../../../utils/Menu/Menu"));
const MenuItem = lazy(() => import("../../../utils/Menu/MenuItem"));

const DeletePopup = lazy(() => import("./../../../utils/DeletePopup/DeletePopup"));

const TasksMenu = ({ setMessage }) => {
  const { tasks } = useSelector(state => state.tasks);
  const { active, activites } = useSelector(state => state.timer);
  const dispatch = useDispatch();
  const [clear, setClear] = useState("");

  const handleClearFinishedTasks = () => {
    setClear('');
    dispatch(clearFinishedTasks(setMessage));
  }

  const handleClearAct = () => {
    setClear('');
    dispatch(clearAct(setMessage));
  }

  const handleClearTasks = () => {
    setClear('');
    dispatch(clearAllTasks(setMessage));
  }

  const handleClear = (type) => {
    setClear(type)
  }

  return (
    <>
      <Suspense fallback={
        <Loading
          size="100"
          strokeWidth="5"
          color={activites[active].color}
          backgroud="transparent"
        />
      }>
        {clear !== "" && (
          <DeletePopup
            type={
              <>
                <span>
                  {
                    clear === 'finished' ?
                      'all finished tasks' :
                      clear === 'act' ?
                        'act promodors' :
                        'all tasks'
                  }
                </span>
              </>
            }
            onOk={
              clear === 'finished' ?
                handleClearFinishedTasks :
                clear === 'act' ?
                  handleClearAct :
                  handleClearTasks
            }
            onCancel={
              () => setClear("")
            }
          />
        )}
      </Suspense>
      <Suspense fallback={<></>}>
        <Menu
          MainButton={
            <button
              aria-label="toggle the task list menu"
              className="toggle-menu"
              disabled={tasks?.length === 0}>
              <HiMenu />
            </button>
          }
        >
          <MenuItem
            type='button'
            onClick={() => handleClear('act')}
            aria-label="clear all act pomodoros tasks"
            disabled={tasks?.filter(t => t.act > 0).length === 0}
          >
            <BsCheckLg /> <span>clear act pomodoros</span>
          </MenuItem>
          <MenuItem
            type='button'
            onClick={() => handleClear('finished')}
            aria-label="delete all finished tasks"
            disabled={tasks?.filter(t => t.check).length === 0}
          >
            <MdDelete /> <span>clear finished tasks</span>
          </MenuItem>
          <MenuItem
            type='button'
            aria-label="clear all tasks"
            onClick={() => handleClear('all')}
          >
            <MdDelete /> <span>clear all tasks</span>
          </MenuItem>
        </Menu>
      </Suspense>
    </>
  )
}

export default TasksMenu;
