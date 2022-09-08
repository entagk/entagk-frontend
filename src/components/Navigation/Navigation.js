import React, { useState } from "react";
import { AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import { HiUser, HiOutlineDocumentReport } from "react-icons/hi";
import { FaMoneyCheck } from "react-icons/fa";
import { MdLogout, MdLogin, MdDelete } from "react-icons/md";

const Navigation = ({ user }) => {
  const [open, setOpen] = useState(false);

  const taggleMenu = () => {
    setOpen((o) => !o);
  }

  return (
    <div className="navigation">
      <h1>Entagk</h1>
      <div style={{ position: "relative" }}>
        <button className="toggle-menu" onClick={taggleMenu}>
          {user?.avatar ?
            (
              <>
                <img src={user?.avatar} alt="avatar" />
              </>
            ) : (
              <>
                <AiOutlineUser />
              </>
            )
          }
        </button>
        {open && (
          <div className="profile-menu">
            <div className="row">
              <button>
                {user ? (
                  <HiUser />
                ) : (<MdLogin />)}
                <p style={{ marginLeft: 10 }}>
                  {user ? "Profile" : "Login"}
                </p>
              </button>
              {user && (
                <button>
                  <FaMoneyCheck />
                  <p style={{ marginLeft: 10 }}>
                    Subsecription
                  </p>
                </button>
              )}
              <button>
                <AiOutlineSetting />
                <p style={{ marginLeft: 10 }}>
                  Setting
                </p>
              </button>
              <button>
                <HiOutlineDocumentReport />
                <p style={{ marginLeft: 10 }}>
                  Report
                </p>
              </button>
              {user && (
                <button>
                  <MdLogout />
                  <p style={{ marginLeft: 10 }}>
                    Logout
                  </p>
                </button>
              )}
            </div>
            {user && (
              <div className="row">
                <button>
                  <MdDelete />
                  <p style={{ marginLeft: 10 }}>Delete Account</p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navigation;