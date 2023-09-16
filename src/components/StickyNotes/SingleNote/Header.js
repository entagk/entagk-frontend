import React, { lazy, useState, Suspense } from 'react';

import Loading from '../../../utils/Loading/Loading';
import CircularMenu from "../../../icons/circularMenu/CircularMenu";

import { CgClose } from 'react-icons/cg';
import { MdDelete } from 'react-icons/md';

const Button = lazy(() => import('../../../utils/Button/Button'));
const Menu = lazy(() => import('../../../utils/Menu/Menu'));

const Header = ({ setHasChanged, closeNote, setOpenDelete, ...props }) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleDelete = () => {

  }

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
          </Button>
        </Menu>
        <Button
          className="close-note"
          style={{
            color: "#000"
          }}
          variant='single-icon'
          onClick={closeNote}
          startIcon={<CgClose />}
        />
      </Suspense>
    </div>
  )
}

export default Header;
