import React, { lazy, useState, Suspense } from 'react';
import Loading from '../../../utils/Loading/Loading';
import CircularMenu from "../../../icons/circularMenu/CircularMenu";
import { CgClose } from 'react-icons/cg';

const Button = lazy(() => import('../../../utils/Button/Button'));
const Menu = lazy(() => import('../../../utils/Menu/Menu'));

const Header = (props) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className='sticky-note-header' {...props}>
      <Suspense
        fallback={
          <Loading
            size="small"
            color={"#fff"}
            backgroud="transparent"
            className="center-fullpage"
          />
        }
      >
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
            />
          }>
          {/* {((props?.template?.todo && props?.template) || (!props?.template && props?.tasks?.length === 0)) ? (
            <>
              {(!setting?.autoStartNextTask) ? (
                <Button
                  aria-label="check button"
                  onClick={handleCheck}
                  variant="none"
                  startIcon={
                    <>
                      {!props.check ? (
                        <>
                          {
                            (props?.template !== null) ? (
                              <>
                                <RiCheckboxCircleFill />
                              </>
                            ) : (
                              <>
                                <ImCheckboxChecked />
                              </>
                            )
                          }
                        </>
                      ) : (
                        <>
                          {props.template !== null ? (
                            <>
                              <RiCheckboxBlankCircleLine />
                            </>
                          ) : (
                            <>
                              <ImCheckboxUnchecked />
                            </>
                          )}
                        </>
                      )}
                    </>
                  }
                >
                  {!props.check ? (
                    <>
                      Check
                    </>
                  ) : (
                    <>
                      Uncheck
                    </>
                  )}
                </Button>
              ) : (<></>)}
            </>
          ) : (<></>)}
          <Button
            variant="none"
            aria-label="edit button"
            onClick={toggleEdit}
            startIcon={
              <FiEdit3 />
            }
          >
            <>Edit</>
          </Button>
          <Button
            variant="none"
            aria-label="delet button"
            onClick={toggleDelete}
            style={{ color: 'red' }}
            className="delete"
            startIcon={
              <MdDelete />
            }
          >
            <>Delete</>
          </Button> */}
        </Menu>
        <Button
          className="close-note"
          style={{
            color: "#000"
          }}
          variant='single-icon'
          startIcon={<CgClose />}
        />
      </Suspense>
    </div>
  )
}

export default Header;
