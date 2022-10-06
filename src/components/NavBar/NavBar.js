import React, { useCallback, useState } from "react";
import { AiOutlineUser, AiOutlineSetting, AiOutlineClose } from "react-icons/ai";
import { HiMenu, HiUser, HiOutlineDocumentReport } from "react-icons/hi";
import { FaMoneyCheck } from "react-icons/fa";
import { MdLogout, MdLogin, MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const NavBar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { started } = useSelector(state => state.timer);

  const toggleMenu = useCallback(() => {
    if (open) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
    setOpen((o) => !o);
    // eslint-disable-next-line
  }, [open]);

  return (
    <div className="nav-bar">
      <Link to="/">
        <h1 style={{ color: "#fff" }}>Entagk</h1>
      </Link>
      <div>
        <button aria-label="toggle menu button" className="toggle-menu" onClick={toggleMenu} disabled={started}>
          <HiMenu />
        </button>
      </div>
      {open && (
        <div className="menu-overflow">
          <div className="menu-content">
            <div className="close-container">
              <button
                aria-label="close button for menu"
                className="close-button"
                onClick={toggleMenu}
              >
                <AiOutlineClose />
              </button>
            </div>
            {user && (
              <div className="user-data">
                <div className="user-avatar">
                  {user?.avatar ?
                    (
                      <img src={user?.avatar} alt="avatar" />
                    ) : (
                      <AiOutlineUser />
                    )
                  }
                </div>
                <p>{user?.name}</p>
              </div>
            )}
            <div className="row">
              <Link to={`${user ? "/profile" : "/auth"}`} onClick={toggleMenu} aria-label="user button in menu">
                {user ? (
                  <HiUser />
                ) : (<MdLogin />)}
                <p style={{ marginLeft: 10 }}>
                  {user ? "Profile" : "Login"}
                </p>
              </Link>
              {user && (
                <Link to="/subsecription" onClick={toggleMenu} aria-label="subsecription button in menu">
                  <FaMoneyCheck />
                  <p style={{ marginLeft: 10 }}>
                    Subsecription
                  </p>
                </Link>
              )}
              <Link to="/setting" onClick={toggleMenu} aria-label="setting button in menu">
                <AiOutlineSetting />
                <p style={{ marginLeft: 10 }}>
                  Setting
                </p>
              </Link>
              <Link to="/report" onClick={toggleMenu} aria-label="report button in menu">
                <HiOutlineDocumentReport />
                <p style={{ marginLeft: 10 }}>
                  Report
                </p>
              </Link>
              {user && (
                <button onClick={toggleMenu} aria-label="logout button in menu">
                  <MdLogout />
                  <p style={{ marginLeft: 10 }}>
                    Logout
                  </p>
                </button>
              )}
            </div>
            {user && (
              <div className="row">
                <button aria-label="delete account button">
                  <MdDelete />
                  <p style={{ marginLeft: 10 }}>Delete Account</p>
                </button>
              </div>
            )}
          </div>
          <div onClick={toggleMenu} style={{
            height: "100%",
            width: "100%"
          }}></div>
        </div>
      )}
    </div>
  )
}

export default NavBar;