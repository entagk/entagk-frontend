import React, { lazy, useState, Suspense, useEffect } from "react";

import { useDispatch } from "react-redux";
import { addNewTask, modifyTask } from "../../../actions/tasks";

import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';

import "./style.css";

import Loading from "../../../utils/Loading/Loading";
import Button from "../../../utils/Button/Button";
const MoreSetting = lazy(() => import("./MoreSetting"));

const initialData = {
  name: "",
  est: 1,
  notes: "",
  project: ""
}

const TaskForm = ({
  oldData,
  setOpen,
  isLoading,
  setIsLoading,
  setMessage,
  template,
  setTemplateData
}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(oldData === null ? initialData : oldData);
  const [openNotes, setOpenNotes] = useState(data.notes === "" ? false : true);
  const [openProject, setOpenProject] = useState(data.project === "" ? false : true);
  const [moreDetails, setMoreDetails] = useState(false);
  const required = oldData?.tasks?.length > 0 ? ['name',] : ['name', 'est'];
  const [formErrors, setFormErrors] = useState({});
  const validations = {
    name: (v) => {
      setFormErrors(pFE => (
        {
          ...pFE,
          name: v.trim().length === 0 ?
            "This field is required" :
            v.trim().length > 50 ? "The name length is more than 50 characters." : ""
        }));
      return v.trim().length === 0 || v.trim().length > 50
    },
    est: (v) => {
      setFormErrors(pFE => (
        { ...pFE, est: v <= 0 ? "The est shouldn't be negative number." : "" }
      ))
      return v <= 0;
    },
    act: (a, e) => {
      console.log(a, e);
      console.log(a < 0 || a > e)
      setFormErrors(pFE => (
        {
          ...pFE,
          act: a < 0 ?
            "The act shouldn't be negative number." :
            a > e ?
              "The act shouldn't be more than est" : ""
        }
      ))
      return a < 0 || a > e;
    },
    notes: (v) => {
      setFormErrors(pFE => (
        {
          ...pFE,
          notes: v > 500 ?
            "The notes length is more than 500 characters." :
            ""
        }
      ))
      return v > 500;
    }
  };

  const [setting, setSetting] = useState(oldData === null && oldData?.tasks?.length > 0 ? null : oldData?.setting);
  const requiredSetting = [["LONG", "PERIOD", "SHORT"], "longInterval", "alarmRepet"];
  const [settingErrors, setSettingErrors] = useState({
    time: {
      "LONG": "",
      "PRIOD": "",
      "SHORT": ""
    }
  });
  const [settingValidations, setSettingValidations] = useState({});

  useEffect(() => {
    if (oldData?.tasks?.length > 0) {
      requiredSetting[0].forEach((t) => {
        setSettingValidations((pV) => ({
          ...pV,
          time: {
            ...pV?.time,
            [t]: (tL) => {
              setSettingErrors(pFE => ({
                ...pFE,
                time: {
                  ...pFE?.time,
                  [t]: tL < 1 || tL > 3600 ?
                    'invalid time' :
                    ""
                }
              }))
              return tL < 1 || tL > 3600;
            },
          },
          [requiredSetting[1]]: (pLI) => {
            setSettingErrors(pFE => ({
              ...pFE,
              [requiredSetting[1]]:
                pLI < 2 ?
                  "The long interval must be more than 2" :
                  ""
            }))
            return pLI < 2;
          },
          'alarmRepet': (ar) => {
            setFormErrors(pFE => ({
              ...pFE,
              'alarmRepet': ar < 0 || ar > 60 ?
                "Alarm repet should be in range 0-60 seconds" :
                ""
            }))
            return ar < 0 || ar > 60;
          }
        }));
      });
    }

    // eslint-disable-next-line
  }, [oldData?.tasks?.length])

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'est' || name === 'act') {
      setData({ ...data, [name]: Number(value) });
    } else {
      setData({ ...data, [name]: value });
    }

    if (
      value !== ''
    ) {
      setFormErrors(fep => ({ ...fep, [name]: '' }));
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (value === '' && required.includes(name)) {
      setFormErrors(fep => ({ ...fep, [name]: 'This field is required' }));
    } else {
      validations[name](value);
    }
  }

  const handleSave = (e) => {
    e.preventDefault();

    const errors = Object.entries({ ...formErrors, ...settingErrors }).filter(([k, v]) => v.length > 0);
    if (oldData?.tasks?.length > 0) {
      requiredSetting?.forEach((f) => {
        console.log(f);
        if (Array.isArrray(f)) {
          f.forEach(t => {
            if (settingValidations.time[t](setting.time[t])) {
              errors.push([f]);
            };
          })
        } else {
          if (settingValidations[f](setting[f])) {
            errors.push([f])
          };
        }
      })
    }

    Object.keys(data).forEach(f => {
      if (f === 'act') {
        if (validations?.[f]?.(data[f], data.est)) {
          errors.push([f])
        };
      } else {
        if (validations?.[f]?.(data[f])) {
          errors.push([f])
        };
      }
    })

    if (template) {
      data.template = template;
    }

    if (errors.length === 0) {
      setOpen(ot => !ot);
      if (template !== 'new') {
        if (!oldData) {
          dispatch(addNewTask(data, setIsLoading, setMessage));
        } else {
          dispatch(modifyTask({ ...data, setting }, oldData._id, setIsLoading, setMessage));
        }
      } else {
        if (!oldData) {
          setTemplateData(t => ({ ...t, tasks: t.tasks.concat([{ ...data, id: t.tasks.length + 1 }]) }));
        } else {
          setTemplateData(t => ({ ...t, tasks: [...t.tasks.filter(task => task.id !== data.id), data] }))
        }
      }
    }
  }

  const requiredForEveryStatus = {
    setting: setting,
    setSetting: setSetting,
    formErrors: settingErrors,
    setFormErrors: setSettingErrors,
    required: requiredSetting,
    validations: settingValidations,
  }

  return (
    <>
      {isLoading === data?._id && (
        <Loading
          size="big"
          color={"#fff"}
          backgroud="transparent"
          className="center-fullpage"
        />
      )}
      <form
        className="task-form zoom-in"
        style={{ margin: oldData !== null && "20px 0 20px" }}
        onSubmit={handleSave}
      >
        <div className="form-container">
          <div className="form-inner-container">
            <div className="block">
              <div style={{ position: "relative" }}>
                <input
                  autoFocus
                  className={`${formErrors.name && 'error'} name`}
                  maxLength="50"
                  required
                  name="name"
                  type="text"
                  value={data.name}
                  placeholder="What is task title?"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="text-counter" style={{ color: `${50 - data?.name?.length > 10 ? "#0effe9" : "#ff002f"}` }}>
                  <p
                    style={{ fontSize: "16px", fontWeight: "500", marginBottom: "15px" }}
                  >{50 - data?.name?.length}</p>
                </div>
              </div>
              {formErrors.name && (
                <span className="error-text">
                  {formErrors.name}
                </span>
              )}
            </div>
            <div className="block">
              <p>
                {(!data.template?.todo && data.template) ? (<></>) : (
                  <>
                    {data.act >= 0 && <>act / </>}
                  </>
                )}
                est pomodoros
              </p>
              <div className="pomodoros">
                {(!data.template?.todo && data.template) ? (<></>) : (
                  <>
                    {data.act >= 0 && (
                      <div className="input-number">
                        <input
                          name="act"
                          className={`${formErrors.act && 'error'} act`}
                          type="number"
                          min='0'
                          max="1000"
                          defaultValue={data.act}
                          disabled={data?.tasks?.length > 0}
                          onChange={handleChange}
                        />
                      </div>
                    )}
                    {data.act >= 0 && (<p>/</p>)}
                  </>
                )}
                <div className="input-number">
                  <input
                    name="est"
                    required
                    className={`${formErrors.est && 'error'}`}
                    type="number"
                    min='1'
                    max="1000"
                    disabled={data?.tasks?.length > 0}
                    defaultValue={data.est}
                    onChange={handleChange}
                  />
                </div>
              </div>
              {(formErrors.est || formErrors.act) && (
                <span className="error-text">
                  {(formErrors.est || formErrors.act)}
                </span>
              )}
            </div>
            <div className="block">
              {openNotes && (
                <div className="notes">
                  <textarea
                    name="notes"
                    type='text'
                    maxLength="500"
                    onChange={handleChange}
                    value={data.notes}
                  ></textarea>
                  <div className="text-counter" style={{ color: `${500 - data?.notes?.length > 100 ? "#0effe9" : "#ff002f"}` }}>
                    <p style={{ fontSize: "16px", fontWeight: "500" }}>{500 - data?.notes?.length}</p>
                  </div>
                  {formErrors.notes && (
                    <span className="error-text">
                      {formErrors.notes}
                    </span>
                  )}
                </div>
              )}
              {(openProject) && (
                <div className="project">
                  <input name="project" type="text" onChange={handleChange} value={data.project} />
                </div>
              )}
              <div className="add-buttons">
                {!openNotes && (
                  <Button
                    aria-label="add notes button"
                    type="button"
                    onClick={() => setOpenNotes(on => !on)}
                    variant="none"
                  >
                    + add notes
                  </Button>
                )}
                {(!openProject) && (
                  <Button
                    aria-label="add project button"
                    type="button"
                    onClick={() => setOpenProject(on => !on)}
                    variant="none"
                  >+ add project</Button>
                )}
              </div>
            </div>
            {data?.tasks?.length > 0 && (
              <>
                <Suspense fallback={
                  <Loading
                    size="medium"
                    color="white"
                    backgroud="transparent"
                  />
                }>
                  {moreDetails && (
                    <MoreSetting
                      {...requiredForEveryStatus}
                    />
                  )}
                </Suspense>
                <div className="block more-details-container">
                  <Button
                    className="more-details"
                    aria-label="more details template"
                    type="button"
                    onClick={() => setMoreDetails(s => !s)}
                    endIcon={
                      <>
                        {moreDetails ? (
                          <MdOutlineKeyboardArrowUp size="20" />
                        ) : (
                          <MdOutlineKeyboardArrowDown size="20" />
                        )}
                      </>
                    }
                    variant="outlined"
                  >
                    {moreDetails ? "Less Details" : "More Details"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="task-footer">
          <Button
            aria-label="submit form button"
            type="submit"
            className="save"
            disabled={Object.entries({ ...formErrors, ...settingErrors }).filter(([k, v]) => v.length > 0).length > 0}
            variant='contained'
            color="main"
          >save</Button>
          <Button
            aria-label="cancel form button"
            type="button"
            onClick={() => setOpen(o => !o)}
            variant="outlined"
          >cancel</Button>
        </div>
      </form>
    </>
  )
}

export default TaskForm;
