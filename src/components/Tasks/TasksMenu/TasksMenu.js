import React, { lazy, Suspense, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { HiMenu } from "react-icons/hi";
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { clearFinishedTasks, clearAct, clearAllTasks } from "../../../actions/tasks";

import Loading from "../../../utils/Loading/Loading";

const Menu = lazy(() => import("../../../utils/Menu/Menu"));
const Button = lazy(() => import('../../../utils/Button/Button'))

const DeletePopup = lazy(() => import("./../../../utils/DeletePopup/DeletePopup"));

const TasksMenu = ({ setMessage }) => {
  const { tasks } = useSelector(state => state.tasks);
  const dispatch = useDispatch();
  const [clear, setClear] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

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
    setOpenMenu(false);
  }

  return (
    <>
      <Suspense fallback={
        <Loading
          size="big"
          strokeWidth="5"
          color={"var(--main-color)"}
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
      <Suspense fallback={
        <Loading
          size="small"
          strokeWidth="5px"
          color={"#fff"}
          backgroud="transparent"
          style={{ margin: 0 }}
        />
      }>
        <Menu
          open={openMenu}
          setOpen={setOpenMenu}
          MainButton={
            <Button
              aria-label="toggle the task list menu"
              className="toggle-menu"
              disabled={tasks?.length === 0}
              startIcon={
                <HiMenu />
              }
              variant="single-icon"
            />
          }
        >
          <Button
            type='button'
            onClick={() => handleClear('act')}
            aria-label="clear all act pomodoros tasks"
            disabled={tasks?.filter(t => t.act > 0).length === 0}
            startIcon={
              <BsCheckLg />
            }
            variant="none"
          >
            <>clear act pomodoros</>
          </Button>
          <Button
            type='button'
            onClick={() => handleClear('finished')}
            aria-label="delete all finished tasks"
            disabled={tasks?.filter(t => t.check).length === 0}
            startIcon={
              <MdDelete />
            }
            variant="none"
          >
            <>clear finished tasks</>
          </Button>
          <Button
            type='button'
            aria-label="clear all tasks"
            onClick={() => handleClear('all')}
            startIcon={
              <MdDelete />
            }
            variant="none"
          >
            <>clear all tasks</>
          </Button>
        </Menu>
      </Suspense>
    </>
  )
}

export default TasksMenu;
