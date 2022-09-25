import React, { useState } from "react";

import { useSelector } from "react-redux";

import { AiOutlinePlus } from 'react-icons/ai';
import { HiMenu } from "react-icons/hi";
import { MdDelete } from 'react-icons/md';
import { BsCheckLg } from 'react-icons/bs';
import { FiSave } from "react-icons/fi";

const Menu = () => {
  const { tasks } = useSelector(state => state.tasks);
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="menu">
      <button aria-label="toggle the task list menu" className="toggle-menu" onClick={() => setOpenMenu(om => !om)} style={{ fontSize: 25, color: "#fff" }} disabled={tasks?.length === 0}>
        <HiMenu />
      </button>
      {openMenu && (
        <div className="menu-content">
          <div className="row">
            <button aria-label="delete all finished tasks"><MdDelete /> <p>clear finished tasks</p></button>
            <button aria-label="clear all act pomodoros tasks"><BsCheckLg /> <p>clear act pomodoros</p></button>
            <button aria-label="save the task list as templete"><FiSave /> <p>save as templete</p></button>
            <button aria-label="add task from templets"><AiOutlinePlus /> <p>add from templetes</p></button>
            <button aria-label="clear all tasks"><MdDelete /> <p>clear all tasks</p></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu;