import React, {
  lazy,
  Suspense,
  useEffect,
  useState
} from 'react';

import Loading from '../../utils/Components/Loading/Loading';
import Message from '../../utils/Components/Message/Message';
import NetworkError from '../NetworkError/NetworkError';

import './style.css';
import { useDispatch, useSelector } from 'react-redux';

import { getLeaderboard } from '../../actions/leaderboard';

import User from './User';
import Button from '../../utils/Components/Button/Button';
import { Link } from 'react-router-dom';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Logo = lazy(() => import("../../icons/entagkLogo/logo"));

function Achivments() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ message: "", type: "" });

  const {
    total,
    users,
    isLoading,
    currentPage,
    numberOfPages,
  } = useSelector(state => state.leaderboard);

  useEffect(() => {
    document.body.classList.remove('home');

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (!total) {
      dispatch(getLeaderboard(1));
    }

    // eslint-disable-next-line
  }, [total, users]);

  return (
    <>
      {message.message && (
        <>
          {(!message.message.includes('Network Error')) ? (
            <Message {...message} setMessage={setMessage} />
          ) : (
            <NetworkError />
          )}
        </>
      )}
      <Suspense fallback={
        <div className='center-fullpage' style={{ color: "#fff" }}>
          <div className='home-loading'>
            <Logo style={{ fontSize: "12rem" }} />
            <p>loading...</p>
          </div>
        </div>
      }>
        <div className='container'>
          <NavBar setMessage={setMessage} />
          <div className='inner-container'>
            {(isLoading && !total) ? (
              <Loading
                size="big"
                backgroud="transperent"
                color="#ffffff"
                style={{
                  width: "100%",
                  margin: "30px",
                }}
              />
            ) : (
              <>
                {
                  users.length === 0 && total === 0 ? (
                    <div className='no-users'>
                      <h1>No users yet!</h1>
                      <div>
                        <Button component={Link} to="/auth" aria-label="sign up">
                          Signup
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='users'>
                      <>
                        {users?.map((user, index) => (
                          <User
                            user={user}
                            number={index + 1}
                          />
                        ))
                        }
                      </>
                    </div>
                  )
                }
                {isLoading && (
                  <Loading
                    size="big"
                    backgroud="transperent"
                    color="#ffffff"
                    style={{
                      width: "100%",
                      margin: "30px",
                    }}
                  />
                )}
                {(numberOfPages !== currentPage && !isLoading) && (
                  <div>
                    <Button onClick={(e) => {
                      dispatch(getLeaderboard(currentPage + 1))
                    }}>
                      Load more
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Suspense>
    </>
  );
}

export default Achivments;
