import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';  // <-- fixed here

import { getExpenses } from '../../ReduxSlice/expenseTableSlice';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../../ReduxSlice/categorySlice';

export default function ExpSubmission(props) {
  const { options, onChange } = props
  const categories = useSelector((state) => state.category.categories);

  let defaultValue
  const [age, setAge] = React.useState(defaultValue);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    console.log(event.target, "JUSTFORTEST")
    setAge(event.target.value);
    onChange(event.target.value);
  };

  useEffect(() => {
    defaultValue = categories[0]?.category;
    setAge(defaultValue);
    console.log(defaultValue, "CHECK")
  }, [categories])
  // useEffect(() => {
  //   if (age !== defaultValue) {
  //     dispatch(getExpenses(age))
  //   } else {
  //     console.log("NO CHANGE")
  //     dispatch(getExpenses(""))

  //   }
  // }, [age])

  React.useEffect(() => {
    console.log(options.list,"LIST42")
    dispatch(getCategories())
  }, [])


  return (
    <Box sx={{ minWidth: 400 }}>
      <FormControl fullWidth>
        <InputLabel id="categories-label">Sumissions</InputLabel>
        <Select
          labelId="categories-label"
          id="demo-simple-select"
          value={age}
          label="Categories"
          onChange={handleChange}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 400, // Adjust this value to control dropdown height
              },
            },
          }}
        >
          {options?.list?.map((opt) => (
            <MenuItem key={opt.value} label={opt.label} value={opt.value}>
                {opt.label}            
            </MenuItem>
           ))}
        </Select>
      </FormControl>
    </Box>

  );
}
