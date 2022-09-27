import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { AiOutlinePlus } from 'react-icons/ai';
import { HiMenu } from "react-icons/hi";
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { FiSave } from "react-icons/fi";
import { clearFinishedTasks, clearAct, clearAllTasks } from "../../../actions/tasks";

const Menu = () => {
  const { tasks } = useSelector(state => state.tasks);
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();

  const handleClearFinishedTasks = () => {
    setOpenMenu(om => !om);
    dispatch(clearFinishedTasks());
  } 
  
  const handleClearAct = () => {
    setOpenMenu(om => !om);
    dispatch(clearAct());
  } 
  
  const handleClearTasks = () => {
    setOpenMenu(om => !om);
    dispatch(clearAllTasks());
  }

  return (
    <div className="menu">
      <button aria-label="toggle the task list menu" className="toggle-menu" onClick={() => setOpenMenu(om => !om)} style={{ fontSize: 25, color: "#fff" }} disabled={tasks?.length === 0}>
        <HiMenu />
      </button>
      {openMenu && (
        <div className="menu-content">
          <div className="row">
            <button 
              aria-label="delete all finished tasks" 
              onClick={handleClearFinishedTasks} 
              disabled={tasks.filter(t => t.check).length === 0}
            ><MdDelete /> <p>clear finished tasks</p></button>
            <button 
              aria-label="clear all act pomodoros tasks" 
              onClick={handleClearAct} 
              disabled={tasks.filter(t => t.act > 0).length === 0}
              ><BsCheckLg /> <p>clear act pomodoros</p></button>
            <button 
              aria-label="save the task list as templete"
              ><FiSave /> <p><mark>save as templete</mark></p></button>
            <button 
              aria-label="add task from templets"
              ><AiOutlinePlus /> <p><mark>add from templetes</mark></p></button>
            <button 
              aria-label="clear all tasks" 
              onClick={handleClearTasks}
              ><MdDelete /> <p>clear all tasks</p></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu;