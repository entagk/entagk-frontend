import React, { lazy, Suspense, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { HiMenu } from "react-icons/hi";
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { clearFinishedTasks, clearAct, clearAllTasks } from "../../../actions/tasks";

import Loading from "../../../utils/Loading";

const DeletePopup = lazy(() => import("./../../../utils/DeletePopup/DeletePopup"));

const Menu = ({ setMessage }) => {
  const { tasks } = useSelector(state => state.tasks);
  const { active, activites } = useSelector(state => state.timer);
  const [openMenu, setOpenMenu] = useState(false);
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
    setOpenMenu(om => !om);
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
      <div className="menu">
        <button
          aria-label="toggle the task list menu"
          className="toggle-menu"
          onClick={() => setOpenMenu(om => !om)}
          disabled={tasks?.length === 0}>
          <HiMenu />
        </button>
        {openMenu && (
          <div className="menu-content">
            <div className="row">
              <button
                aria-label="clear all act pomodoros tasks"
                onClick={() => handleClear('act')} type='button'
                disabled={tasks.filter(t => t.act > 0).length === 0}
              ><BsCheckLg /> <p>clear act pomodoros</p></button>
              <button
                aria-label="delete all finished tasks"
                onClick={() => handleClear('finished')} type='button'
                disabled={tasks.filter(t => t.check).length === 0}
              ><MdDelete /> <p>clear finished tasks</p></button>
              <button
                type='button'
                aria-label="clear all tasks"
                onClick={() => handleClear('all')}
              ><MdDelete /> <p>clear all tasks</p></button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Menu;
