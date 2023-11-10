import React, { lazy } from 'react';

const Select = lazy(() => import("../../../utils/Components/Select/Select"));

const TypesMenu = ({ data, setData, }) => {
  const types = [
    { name: "Work", code: "\\u1F4BC" },
    { name: "Sport", code: "\\u26BD" },
    { name: "Entertainment", code: "\\u1F389" },
    { name: "Gaming", code: "\\u1F3AE" },
    { name: "Shopping", code: "\\u1F6CD" },
    { name: "Social networking", code: "\\u1F310" },
    { name: "Read", code: "\\u1F4DA" },
    { name: "Study", code: "\\u1F4D6" },
    { name: "Coding", code: "\\u1F4BB" },
    { name: "Designing", code: "\\u1F3A8" },
    { name: "Planning", code: "\\u1F4C5" }
  ];

  return (
    <>
      <Select
        options={types}
        data={data}
        type="type"
        setData={setData}
        width="100px"
        setChange={() => { }}
      />
    </>
  )
}

export default TypesMenu;
