import React, {
  lazy,
  Suspense,
  useEffect,
  useState
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { getTemplatesForUser, CHANGE_CURRENT_PAGE } from '../../actions/templates';
import { AiOutlinePlus } from 'react-icons/ai';
import { CgClose } from 'react-icons/cg';

import Loading from '../../utils/Components/Loading/Loading';
import Message from '../../utils/Components/Message/Message';
import NetworkError from '../NetworkError/NetworkError';
import NoLogin from '../NoLogin/NoLogin';
import Button from '../../utils/Components/Button/Button';
import Header from '../../utils/Components/GlassEffectHeader/header';

import './style.css';

const NavBar = lazy(() => import('../NavBar/NavBar'));
const Template = lazy(() => import('./Template/Template.js'));
const TemplateTasks = lazy(() => import('./TemplateTasks/TemplateTasks'))
const TemplateForm = lazy(() => import('./TemplateForm/TemplateForm.js'))
const SearchBar = lazy(() => import('./SearchBar/SearchBar'));
const PaginationBar = lazy(() => import('../../utils/Components/PaginationBar/PaginationBar'));

function Templates() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState({ message: "", type: "" })
  const [isLoadingTemp, setIsLoadingTemp] = useState(null);
  const [openFormForNew, setOpenFormForNew] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showTodo, setShowTodo] = useState('');
  const { user } = useSelector(state => state.auth);
  const {
    userTemplates: {
      templates,
      total,
      numberOfPages,
      currentPage,
      hasTemps
    },
    isLoading
  } = useSelector(state => state?.templates) || { userTemplates: {} };

  useEffect(() => {
    document.body.classList.remove('home');

    // eslint-disable-next-line
  }, [])

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
                size="verybig"
                backgroud="transperent"
                color="#ffffff"
                className='center-fullpage'
              />
            </>
          ) : (
            <>
              {(
                message.message &&
                !message.message.includes('Network Error')
              ) ? (
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

  if (!localStorage.getItem('token') || (!user?._id && !localStorage.getItem('token'))) {
    return (
      <NoLogin />
    )
  }

  const changePage = (page) => {
    if (!templates[page - 1] || searchParams.get('search')) {
      dispatch(
        getTemplatesForUser(
          searchParams.get('sort'),
          searchParams.get('search'),
          page,
          setMessage
        )
      );
    } else {
      dispatch({
        type: CHANGE_CURRENT_PAGE,
        data: { type: "userTemplates", page }
      })
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
              <Header
                title={templates[currentPage - 1].filter(t => t._id === showTodo)[0]?.name + " Tasks"}
                RightButton={
                  <Button
                    aria-label='close tasks'
                    className="close"
                    type='button'
                    onClick={() => setShowTodo("")}
                    variant='none'
                    startIcon={
                      <CgClose />
                    }
                  />
                }
              />
              <Suspense fallback={
                <>
                  <Loading
                    size="big"
                    backgroud="transparant"
                    color="white"
                  />
                </>
              }>
                <TemplateTasks
                  templateId={showTodo}
                  setMessage={setMessage}
                />
              </Suspense>
            </div>
          </div>
        </>
      )}
      <Suspense fallback={
        <Loading
          size="verybig"
          backgroud="transperent"
          color="#ffffff"
          className='center-fullpage'
        />
      }>
        <div className='templates container'>
          <NavBar />
          {!hasTemps || (!hasTemps && !isLoading) ? (
            <div className='no-templates'>
              <h2>
                No templates
              </h2>
              <p>Add your first template</p>
              <Button
                aria-label='New template'
                className='add-temp'
                onClick={() => setOpenFormForNew(true)}
                startIcon={
                  <AiOutlinePlus />
                }
                variant='contained'
                style={{
                  border: 'none'
                }}
              >
                Add Template
              </Button>
            </div>
          ) : (
            <>
              <SearchBar
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                setOpenFormForNew={setOpenFormForNew}
              />
              {isLoading ? (
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
          )}
        </div>
      </Suspense>
      {openFormForNew && (
        <Suspense fallback={
          <div className="glass-container">
            <div className="glass-effect temp-form">
              <Loading
                size="big"
                backgroud="transparant"
                color="white"
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
    </>
  );
}

export default Templates;
