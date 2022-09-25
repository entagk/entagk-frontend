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
      <button className="toggle-menu" onClick={() => setOpenMenu(om => !om)} style={{ fontSize: 25, color: "#fff" }} disabled={tasks?.length === 0}>
        <HiMenu />
      </button>
      {openMenu && (
        <div className="menu-content">
          <div className="row">
            <button><MdDelete /> <p>clear finished tasks</p></button>
            <button><BsCheckLg /> <p>clear act pomodoros</p></button>
            <button><FiSave /> <p>save as templete</p></button>
            <button><AiOutlinePlus /> <p>add from templetes</p></button>
            <button><MdDelete /> <p>clear all tasks</p></button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Menu;