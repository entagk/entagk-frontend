import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { getTemplatesForUser, CHANGE_CURRENT_PAGE } from '../../actions/templates';
import { AiOutlinePlus } from 'react-icons/ai';

import Loading from '../../utils/Loading/Loading';
import Message from '../../utils/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';

import './style.css';

import TemplateTasksHeader from './TemplateTasks/TemplateTasksHeader';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Template = lazy(() => import('./Template/Template.js'));
const TemplateTasks = lazy(() => import('./TemplateTasks/TemplateTasks'))
const TemplateForm = lazy(() => import('./TemplateForm/TemplateForm.js'))
const SearchBar = lazy(() => import('./SearchBar/SearchBar'));
const PaginationBar = lazy(() => import('./PaginationBar/PaginationBar'));

function Templates() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ message: "", type: "" })
  const [isLoadingTemp, setIsLoadingTemp] = useState(null);
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTodo, setShowTodo] = useState('');
  const { userTemplates: { templates, total, numberOfPages, currentPage }, isLoading } = useSelector(state => state?.templates) || { userTemplates: {} };
  const { active, activites } = useSelector(state => state.timer);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      if (total === undefined && templates === undefined) {
        const sort = searchParams.get('sort') || 'updatedAt'
        dispatch(getTemplatesForUser(sort, searchParams.get('search'), 1, setMessage));
      }
    }
    // eslint-disable-next-line
  }, [total]);

  if (templates === undefined && localStorage.getItem('token')) {
    return (
      <>
        {(!message.message.includes('Network Error')) ?
          (
            <>
              <Loading
                size="100"
                strokeWidth="5"
                backgroud="transperent"
                color="#ffffff"
              />
            </>
          ) : (
            <>
              {(message.message && !message.message.includes('Network Error')) ? (
                <Message {...message} setMessage={setMessage} />
              ) : (
                <NetworkError />
              )}
            </>
          )
        }
      </>
    )
  }

  if (!localStorage.getItem('token')) {
    return (
      <NoLogin />
    )
  }

  const changePage = (page) => {
    if (!templates[page - 1] || searchParams.get('search')) {
      dispatch(getTemplatesForUser(searchParams.get('sort'), searchParams.get('search'), page, setMessage));
    } else {
      dispatch({ type: CHANGE_CURRENT_PAGE, data: { type: "userTemplates", page } })
    }
  }

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
      {showTodo !== "" && (
        <>
          <div className='glass-container'>
            <div className='glass-effect template-tasks'>
              <TemplateTasksHeader
                template={templates[currentPage - 1].filter(t => t._id === showTodo)[0]}
                setOpenTodo={setShowTodo}
              />
              <Suspense fallback={<>
                <Loading
                  size="100"
                  strokeWidth="4"
                  backgroud="white"
                  color={activites[active]?.color}
                />
              </>
              }>
                <TemplateTasks
                  templateId={showTodo}
                  setOpenTodo={setShowTodo}
                  message={message}
                  setMessage={setMessage}
                />
              </Suspense>
            </div>
          </div>
        </>
      )}
      <Suspense fallback={
        <Loading
          size="100"
          strokeWidth="5px"
          backgroud="transperent"
          color="#ffffff"
        />
      }>
        <NavBar />
        <div className='templates container'>
          {(templates[currentPage - 1]?.length > 0 || searchParams.get('search')) ? (
            <>
              <SearchBar
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                setOpenFormForNew={setOpenFormForNew}
              />
              {isLoading ? (
                <div style={{
                  width: "100%",
                  margin: "30px",
                }}>
                  <Loading
                    size="100"
                    strokeWidth="5"
                    backgroud="transperent"
                    color="#ffffff"
                  />
                </div>
              ) : (
                <div className='templates-container'>
                  <>
                    {searchParams.get('search') && (
                      <p className='search-result'>
                        <span>{total}</span> results for tempaltes matching <span>{searchParams.get('search')}</span>
                      </p>
                    )}
                    {templates[currentPage - 1]?.map((temp) => (
                      <Template
                        {...temp}
                        key={temp._id}
                        setShowTodo={setShowTodo}
                        isLoading={isLoadingTemp}
                        setIsLoading={setIsLoadingTemp}
                        setMessage={setMessage}
                      />
                    ))}
                  </>
                </div>
              )}
              {(numberOfPages > 1) && (
                <PaginationBar
                  numberOfPages={numberOfPages}
                  currentPage={currentPage}
                  changePage={changePage}
                />
              )}
            </>
          ) : templates[currentPage - 1]?.length > 0 && !searchParams.get('search') && (
            <div className='no-templates'>
              <h2>
                No templates
              </h2>
              <p>Add your first template</p>
              <button aria-label='New template' className='add-temp' onClick={() => setOpenFormForNew(true)}>
                <span className='icon'>
                  <AiOutlinePlus />
                </span>
                <span className='text'>
                  Add Template
                </span>
              </button>
            </div>
          )}
        </div>
        {openFormForNew && (
          <Suspense fallback={
            <div className="glass-container">
              <div className="glass-effect temp-form">
                <Loading
                  size="100"
                  strokeWidth="4"
                  backgroud="#e7e7e7"
                  color={activites[active]?.color}
                />
              </div>
            </div>
          }>
            <TemplateForm
              setOpen={setOpenFormForNew}
              oldData={null}
              isLoading={isLoadingTemp}
              setIsLoading={setIsLoadingTemp}
              setMessage={setMessage}
            />
          </Suspense>
        )}
      </Suspense>
    </>
  );
}

export default Templates;
