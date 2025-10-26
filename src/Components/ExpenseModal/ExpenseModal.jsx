import * as React from 'react';
import {
  Box,
  Button,
  Typography,
  Modal,
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ExpRadioButtons from '../RadioButtons/ExpRadioButtons';
import ExpDatePicker from '../DatePicker/ExpDatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { getCategories } from '../../ReduxSlice/categorySlice';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1700,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
};

export default function ExpenseModal(props) {
  let { handleCloseModal, setSaveData } = props
  const [currency, setCurrency] = React.useState('INR');
  const [category, setCategory] = React.useState('');
  const [reimbursable, setReimbursable] = React.useState(true);
  const [attendees, setAttendees] = React.useState(['You']);
  const [report, setReport] = React.useState('(automatic)');
  const [file, setFile] = React.useState(null);
  const [multiple, setMultiple] = React.useState(false)
  const [fields, setFields] = React.useState([{ ReceiptName: "", Receipt: "", ExpenseDate: null, merchant: "", total: "", category: "", description: "", reimbursable: false, report: "A", currency: "" }]);
  const [savedData, setSavedData] = React.useState();
  let user = JSON.parse(sessionStorage.getItem('userInfo'));


  // const categories = [
  //   'Uncategorized',
  //   'Advertising & Marketing',
  //   'Bank Charges',
  //   'Employee Wages',
  //   'Travel & Lodging',
  //   'Utilities',
  //   'Software Subscriptions',
  //   'Office Supplies',
  // ];

  const currencies = [
    'INR',
    'USD',
    'EUR'
  ];

  const dispatch = useDispatch()
  React.useEffect(() => {
    dispatch(getCategories())
  }, [])

  const handleFileChange = (index, e) => {
    e.preventDefault()
    const file = e.target.files[0];
    setFields(prev => {
      const newFields = [...prev];
      newFields[index] = {
        ...newFields[index],
        Receipt: file,
        ReceiptName: file.name
      };
      return newFields;
    });
  };

  const options = [
    { value: 'single', label: 'Single' },
    { value: 'multiple', label: 'Multiple' },
  ]

  const handleOptionChange = (e) => {


    setMultiple(e === 'multiple');

  }

  const handleChange = (index, event) => {
    const { name, value } = event.target
    const updatedFields = [...fields];
    updatedFields[index][name] = value;
    setFields(updatedFields);

  }

  const handleAdd = () => {
    setFields([...fields, { Receipt: "", ExpenseDate: null, merchant: "", total: "", category: "", description: "", reimbursable: false, report: "A", currency: "" }]);
  }


  const handleDateChange = (index, newValue) => {
    setFields(prev => {
      const newFields = [...prev];
      newFields[index] = {
        ...newFields[index],
        ExpenseDate: newValue ? newValue.toISOString() : null, // or newValue.format('YYYY-MM-DD') if you want a string
      };
      return newFields;
    });
  };

  const handleSelectChange = (index, reimbursable) => {
    setFields(prev => {
      const newFields = [...prev];
      newFields[index] = {
        ...newFields[index],
        reimbursable, // directly use the value passed
      };
      return newFields;
    });
  };



  React.useEffect(() => {
    console.log(fields, "FIELDS")
  }, [fields])


  const handleDelete = (index) => {
    let updatedFields = [...fields]
    updatedFields.splice(index, 1)
    setFields(updatedFields)
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(fields, "fields147")

    const updatedData = fields.map((field) => ({
      ...field,
      userid: user.wallid,
      orgid: user.orgid,
    }));

    const formData = new FormData();
    formData.append('expArr', JSON.stringify(updatedData));

    fields.forEach((field) => {
      if (field.Receipt && field.Receipt.name) {
        // Use the file's name as the field key
        formData.append(field.Receipt.name, field.Receipt);
      }
    });

    setSaveData(formData);

    // try {
    //   let user = JSON.parse(sessionStorage.getItem('userInfo'));

    //   const response = await axios.post(
    //     `http://localhost:3000/api/expense/saveExpense/${user.wallid}/${user.orgid}`,
    //     formData
    //   );
    //   console.log(response, 'expresp');
    // } catch (error) {
    //   console.error('Error submitting form:', error);
    // }
  };


  React.useEffect(() => {
    console.log(savedData, "SAVED DATA")
  }, [savedData])

  const handleButton = () => {
    handleCloseModal(false)
  }
  const merchants = useSelector((state) => state.merchants.data);
  const categories = useSelector((state) => state.category.categories);

  return (
    <Modal
      open={props.handleOpenModal}
      onClose={props.handleCloseModal}
      aria-labelledby="modal-modal-title"
    >
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" gutterBottom>
            Add Expense
          </Typography>

          <Button variant="contained" color="success" onClick={handleButton}>
            Close
          </Button>

        </Box>

        <Box sx={{
          display: 'flex',
          gap: 2,
          flex: 2,
          mt: 3
        }}>
          <ExpRadioButtons options={options} onChange={handleOptionChange} />

          {multiple && (
            <Button onClick={handleAdd}>
              Add
            </Button>
          )}
        </Box>
        {!multiple && (
          <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 4,
                  mt: 2,
                }}
              >
                {/* Left: Form */}
                <Box
                  component="div"
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    flex: 2,
                  }}
                >





                  <FormControl fullWidth>
                    <InputLabel>Merchant</InputLabel>
                    <Select label="Merchant" name="merchant"
                      value={fields[index]?.merchant || ''}
                      onChange={(e) => handleChange(index, e)}>

                      {merchants.map((opt) => (
                        <MenuItem key={opt._id} value={opt._id}>
                          {opt.merchant}
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>

                  {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Date" slotProps={{ textField: { variant: 'outlined' } }} name="ExpenseDate" onChange={(newValue) => handleDateChange(index, newValue)}
                    />                  </LocalizationProvider> */}

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date & Time"
                      value={fields[index]?.ExpenseDate ? dayjs(fields[index].ExpenseDate) : null}
                      onChange={(newValue) => handleDateChange(index, newValue)}
                      slotProps={{ textField: { variant: 'outlined' } }}
                    />
                  </LocalizationProvider>


                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField fullWidth label="Total" variant="outlined" name='total' onChange={(e) => handleChange(index, e)}
                      value={field[index]?.total} />
                    <FormControl fullWidth>
                      <InputLabel>Currency</InputLabel>
                      <Select label="Currency" name="currency"
                        value={fields[index]?.currency || ''}
                        onChange={(e) => handleChange(index, e)}>

                        {currencies.map((cur) => (
                          <MenuItem key={cur} value={cur}>
                            {cur}
                          </MenuItem>
                        ))}

                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>

                    <Checkbox
                      id="reimbursed"
                      name="reimbursable"
                      checked={fields[index]?.reimbursable || false}
                      onChange={(e) => handleSelectChange(index, e.target.checked)}
                    />
                    <InputLabel htmlFor="reimbursed">Reimbursable</InputLabel>
                  </Box>

                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select

                      label="Category"
                      name="category"
                      value={fields[index]?.category || ''}
                      onChange={(e) => handleChange(index, e)}
                      MenuProps={{
                        PaperProps: {
                          sx: {
                            maxHeight: 200,            // control dropdown height
                            '& .MuiMenuItem-root': {
                              fontSize: '0.875rem',    // smaller font size
                              minHeight: '32px',       // reduce row height
                            },
                          },
                        },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>


                  <TextField fullWidth label="Description" variant="outlined" name='description' onChange={(e) => handleChange(index, e)} value={field[index]?.description} />

                  <FormControl fullWidth>
                    <InputLabel>Report</InputLabel>
                    <Select
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      label="Report"
                    >
                      <MenuItem value="(automatic)">Auto</MenuItem>
                      <MenuItem value="May Report">Do not add</MenuItem>
                      <MenuItem value="Q2 Report">Q2 Report</MenuItem>
                    </Select>
                  </FormControl>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>

                    {fields.length > 0 &&
                      <Button variant="contained" color="success" type="submit">
                        Save Expense
                      </Button>}
                  </Box>



                </Box>

                {/* Right: File Upload */}
                <Box
                  sx={{
                    flex: 1,
                    border: '2px dashed #ccc',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                  }}
                >
                  <CloudUploadIcon fontSize="large" color="action" />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Upload Receipt or File
                  </Typography>
                  <Button variant="outlined" component="label" sx={{ mt: 2 }}>
                    Choose File
                    <input hidden type="file" onChange={(e) => handleFileChange(index, e)}
                    />
                  </Button>
                  {fields[index] && (
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      Selected: {fields[index].Receipt.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </form>
        )}


        {multiple &&
          <form onSubmit={handleSubmit}>


            {fields.map((field, index) => (

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date & Time"
                      value={fields[index]?.ExpenseDate ? dayjs(fields[index].ExpenseDate) : null}
                      onChange={(newValue) => handleDateChange(index, newValue)}
                      slotProps={{ textField: { variant: 'outlined' } }}
                    />
                  </LocalizationProvider>
                </Box>

                <FormControl sx={{ minWidth: 200 }}>
                  <InputLabel>Merchant</InputLabel>
                  <Select
                    label="Merchant"
                    name="merchant"
                    value={fields[index]?.merchant || ''}
                    onChange={(e) => handleChange(index, e)}
                  >
                    {merchants.map((opt) => (
                      <MenuItem key={opt._id} value={opt._id}>
                        {opt.merchant}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>



                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField label="Total" variant="outlined" name='total' onChange={(e) => handleChange(index, e)}
                    value={field[index]?.total} />
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select label="Currency" name="currency"
                      value={fields[index]?.currency || ''}
                      onChange={(e) => handleChange(index, e)}>

                      {currencies.map((cur) => (
                        <MenuItem key={cur} value={cur}>
                          {cur}
                        </MenuItem>
                      ))}

                    </Select>
                  </FormControl>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                  <Checkbox
                    id="reimbursed"
                    name="reimbursable"
                    checked={fields[index]?.reimbursable || false}
                    onChange={(e) => handleSelectChange(index, e.target.checked)}
                  />
                  <InputLabel htmlFor="reimbursed">Reimbursable</InputLabel>
                </Box>

                <FormControl sx={{ width: '150px' }}>
                  <InputLabel>Category</InputLabel>
                  <Select

                    label="Category"
                    name="category"
                    value={fields[index]?.category || ''}
                    onChange={(e) => handleChange(index, e)}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200,            // control dropdown height
                          '& .MuiMenuItem-root': {
                            fontSize: '0.875rem',    // smaller font size
                            minHeight: '32px',       // reduce row height
                          },
                        },
                      },
                    }}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>


                <TextField label="Description" variant="outlined" name='description' onChange={(e) => handleChange(index, e)} value={field[index]?.description} />

                <TextField
                  type="file"
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleFileChange(index, e)}
                />
                <Button onClick={() => handleDelete(index)}>
                  <FontAwesomeIcon icon={faCircleXmark} size="xl" />
                </Button>

              </Box>


            ))}

            {fields.length > 0 &&

              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 4,
                mt: 2,
                justifyContent: 'center'
              }}>
                <Button type='submit'>Save</Button>
              </Box>
            }

          </form>
        }





      </Box>

    </Modal>
  );
}
