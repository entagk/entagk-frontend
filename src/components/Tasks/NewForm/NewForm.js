import React, { useState } from "react";

import { useDispatch } from "react-redux";
import { addNewTask, modifyTask } from "../../../actions/tasks";

const initialData = {
  name: "",
  est: 1,
  notes: "",
  project: ""
}

const NewForm = ({ oldData, setOpen }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(oldData === null ? initialData : oldData);
  const [openNotes, setOpenNotes] = useState(data.notes === "" ? false : true);
  const [openProject, setOpenProject] = useState(data.project === "" ? false : true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.name === 'est' || e.target.name === 'act') {
      setData({ ...data, [e.target.name]: Number(e.target.value) });
    } else {
      setData({ ...data, [e.target.name]: e.target.value });
    }
  }

  const handleSave = (e) => {
    e.preventDefault();
    console.log(data);
    setOpen(ot => !ot);
    if (!data.name || !data.est) {
      setError("Error at name or est");
    }

    if(!oldData) {
      dispatch(addNewTask(data, setError));
    } else {
      dispatch(modifyTask(data, setError));
    }
  }

  return (
    <form className="task-form" style={{margin: oldData !== null && "20px 0 20px"}} onSubmit={handleSave}>
      <div className="form-container">
        <div className="form-inner-container">
          <div className="block">
            <input className="name" required name="name" type="text" value={data.name} placeholder="What are you working on?" onChange={handleChange} />
          </div>
          <div className="block">
            <p>
              {data.act >= 0 && <>act / </>}
              est pomodoros
            </p>
            <div className="pomodoros">
              {data.act >= 0 && (
                <div className="input-number">
                  <input name="act" className="act" type="number" min='0' inputMode="numeric" pattern="\d*" value={data.act} onChange={handleChange} />
                </div>
              )}
              {data.act >= 0 && (<>/</>)}
              <div>
                <input name="est" required className="est" type="number" min='1' inputMode="numeric" pattern="\d*" value={data.est} onChange={handleChange} />
              </div>
            </div>
          </div>
          <div className="block">
            {openNotes && (
              <div className="notes">
                <textarea name="notes" type='text' onChange={handleChange} value={data.notes}></textarea>
              </div>
            )}
            {(openProject) && (
              <div className="project">
                <input name="project" type="text" onChange={handleChange} value={data.project} />
              </div>
            )}
            <div className="add-buttons">
              {!openNotes && (
                <button aria-label="add notes button" onClick={() => setOpenNotes(on => !on)}>+ add notes</button>
              )}
              {(!openProject) && (
                <button aria-label="add project button" onClick={() => setOpenProject(on => !on)}>+ add project</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="task-footer">
        <button type="button" onClick={() => setOpen(o => !o)}>cancel</button>
        <div>
          <button type="sumbit" className="save" disabled={!data.name || !data.est}>save</button>
        </div>
      </div>
    </form>
  )
}

export default NewForm;