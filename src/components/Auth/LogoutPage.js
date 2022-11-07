import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { LOGOUT } from '../../actions/auth';

function LogoutPage() {

  const dispatch = useDispatch();

  const logout = () => {
    dispatch({ type: LOGOUT })
  }
  return (
    <div>
      <div>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#fff"
        }}>
          <h1>You are log in.</h1>
          <div className='buttons' style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
          }}>
            <button aria-label="logout button" onClick={logout} style={{
              background: "rgb(0 0 0 / 19%)",
              padding: "10px 20px",
              marginTop: "20px",
              borderRadius: "4px",
              fontSize: "20px",
              fontWeight: "600",
              boxShadow: "0 0 10px 5px #bdbdbd61",
              color: "#fff",
            }}>Log out</button>
            <Link to="/" aria-label='go home' style={{
              background: "rgb(0 0 0 / 19%)",
              padding: "10px 20px",
              marginTop: "20px",
              borderRadius: "4px",
              fontSize: "20px",
              fontWeight: "600",
              boxShadow: "0 0 10px 5px #bdbdbd61",
              color: "#fff",
            }}>Go Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogoutPage;