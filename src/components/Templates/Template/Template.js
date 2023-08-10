import React, { lazy, Suspense, useState } from 'react';

import { updatedAt } from '../../../utils/helper';

import { FiEdit3 } from 'react-icons/fi';
import { MdDelete, MdAddTask } from 'react-icons/md';
import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import Loading from '../../../utils/Loading/Loading';

import './style.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToTodo, deleteTemplate } from '../../../actions/templates';
import Button from '../../../utils/Button/Button';

const Menu = lazy(() => import('../../../utils/Menu/Menu'));

const TodoList = lazy(() => import('../../../icons/list/TodoList'));
const DeletePopup = lazy(() => import("../../../utils/DeletePopup/DeletePopup"));
const TemplateForm = lazy(() => import('../TemplateForm/TemplateForm'));

function Template({ isLoading, setIsLoading, setMessage, setShowTodo, ...props }) {
  const dispatch = useDispatch();
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const { user } = useSelector(state => state.auth);
  const { currentPage, numberOfPages, templates } = useSelector(state => state.templates.userTemplates);
  const [showMore, setShowMore] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const hours = ((
    (props.time.PERIOD * props.est) +
    (props.time.SHORT * (props.est - Math.floor(props.est / props.longInterval))) +
    (props.time.LONG * Math.floor(props.est / props.longInterval))
  ) / 60 / 60);

  const [updated, setUpdated] = useState(updatedAt(props?.updatedAt));

  setInterval(() => {
    setUpdated(updatedAt(props?.updatedAt));
  }, 10000);

  const hadnleAddToTodo = () => {
    setOpenMenu(false);
    dispatch(addToTodo(props._id, setIsLoading, setMessage));
  }

  const toggleDelete = () => {
    setOpenDelete(true);
    setOpenMenu(false);
  }

  const handleDelete = () => {
    setOpenDelete(false);
    dispatch(deleteTemplate(
      props._id,
      templates[currentPage - 1].length,
      currentPage,
      numberOfPages,
      setIsLoading,
      setMessage
    ));
  }

  const handleOpenEdit = () => {
    setOpenEdit(true);
    setOpenMenu(false);
  }

  const handleShowingTasks = () => {
    setShowTodo(props._id);
    setOpenMenu(false);
  }

  return (
    <>
      {openEdit && (
        <Suspense fallback={
          <div className="glass-container">
            <Loading
              size="big"
              backgroud="transparant"
              color="white"
              className="glass-effect temp-form"
            />
          </div>
        }>
          <TemplateForm
            oldData={props}
            setOpen={setOpenEdit}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </Suspense>
      )}
      {openDelete && (
        <Suspense fallback={
          <div className="glass-container">
            <Loading
              size="medium"
              color={"#fff"}
              backgroud="transparant"
              className="glass-effect delete-popup"
            />
          </div>
        }>
          <DeletePopup
            type={<><span>{props.name}</span> template</>}
            onCancel={() => setOpenDelete(false)}
            onOk={handleDelete}
          />
        </Suspense>
      )}
      <div className='template'>
        {isLoading === props._id && (
          <Loading
            size="medium"
            color={"#fff"}
            backgroud="transparent"
            style={{ margin: 0 }}
          />
        )}
        <div className='temp-upper'>
          <p className='temp-name'>
            {props.name}
          </p>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
            <p className='temp-est'>
              {props.est}
            </p>
            <Suspense fallback={
              <Loading
                size="small"
                color={"#fff"}
                backgroud="transparent"
                style={{ paddingBlock: '0', margin: 0 }}
              />
            }>
              <Menu
                open={openMenu}
                setOpen={setOpenMenu}
                MainButton={
                  <Button
                    aria-label="toggle the task list menu"
                    className="toggle-menu"
                    startIcon={
                      <CircularMenu />
                    }
                    variant="single-icon"
                    style={{ margin: 0 }}
                  />
                }>
                <Button
                  aria-label='show todo'
                  onClick={handleShowingTasks}
                  startIcon={
                    <Suspense fallback={
                      <Loading
                        size="small"
                        color={"#fff"}
                        backgroud="transparent"
                      />
                    }>
                      <TodoList />
                    </Suspense>
                  }
                  variant='none'
                >
                  <>Todo</>
                </Button>
                {!user ? (
                  <>
                    <div style={{ padding: 10 }}>
                      <Loading
                        size="small"
                        color={"#ccc"}
                        backgroud="transparent"
                        paddingBlock='0'
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      aria-label='add to todo list'
                      onClick={hadnleAddToTodo}
                      startIcon={
                        <MdAddTask />
                      }
                      variant='none'
                    >
                      <>Add to todo</>
                    </Button>
                    {user._id === props.userId && (
                      <>
                        <Button
                          aria-label="edit button"
                          onClick={handleOpenEdit}
                          variant='none'
                          startIcon={
                            <FiEdit3 />
                          }
                        >
                          <>Edit</>
                        </Button>
                        <Button
                          aria-label="delet button"
                          onClick={toggleDelete}
                          style={{ color: 'red' }}
                          className="delete"
                          variant='none'
                          startIcon={
                            <MdDelete />
                          }
                        >
                          <>Delete</>
                        </Button>
                      </>
                    )}
                  </>
                )}
              </Menu>
            </Suspense>
          </div>
        </div>
        <div className='temp-desc'>
          <p>
            {(props.desc.length > 200 && !showMore) ? `${props.desc.slice(0, 196)}...` : props.desc}
            {(props.desc.length > 200 && !showMore) ?
              <Button
                aria-label="see mroe"
                className='show-more'
                onClick={() => setShowMore(true)}
                variant='none'
              >see more</Button> :
              <>
                {showMore && (
                  <Button
                    aria-label="see mroe"
                    className='show-more'
                    onClick={() => setShowMore(false)}
                    variant='none'
                  >see less</Button>
                )}
              </>
            }
          </p>
        </div>
        <div className='temp-lower'>
          <span>{hours.toFixed(1)} Hours</span>
          <span>{updated}</span>
        </div>
      </div>
    </>
  );
}

export default Template;
