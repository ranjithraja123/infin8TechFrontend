import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { AiFillLike } from "react-icons/ai";
import { ImCross } from "react-icons/im";
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
import axios from 'axios';
import { toast } from 'react-toastify';



function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];




export default function RequestsTable() {


  const [requests, setRequests] = React.useState([]);
  const [selected, setSelected] = React.useState({
    value: "",
    label: ""
  })

  const type = [{ value: "C", name: "Colleague" }, { value: "A", name: "Admin" }]

  const [input, setInput] = React.useState({
    name: '',
    type: '',
    email: '',
    password: '',
  })



  const handleClick = async (index) => {
    console.log("HERE");
    const request = requests[index];
    console.log(request, "RERERE");

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', request);
      console.log(response);

      if (response.status === 200) {
        toast.success('Colleague added successfully');

        // Attempt to delete the request from the server
        const delResponse = await axios.post('http://localhost:3000/api/organization/deleteRequest', {
          reqid: request.reqid
        });

        if (delResponse.status === 200) {
          // Remove the request from local state
          const updatedRequests = [...requests];
          updatedRequests.splice(index, 1);
          setRequests(updatedRequests);
        } else {
          toast.error('Failed to delete request from server');
        }
      }
    } catch (error) {
      console.log(error);

      // Optionally still remove from UI if registration fails
      const updatedRequests = [...requests];
      updatedRequests.splice(index, 1);
      setRequests(updatedRequests);

      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };



  const handleRejected = async (index) => {
    
    const request = requests[index];

    try {

      const delResponse = await axios.post('http://localhost:3000/api/organization/deleteRequest', {
        reqid: request.reqid
      });

      if (delResponse.status === 200) {
          toast.success('Unapproved');
        const updatedRequests = [...requests];
        updatedRequests.splice(index, 1);
        setRequests(updatedRequests);
      } else {
        toast.error('Failed to delete request from server');
      }

    } catch (error) {

      toast.error(
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Something went wrong"
      );
    }
  };





  const handleSelect = (index, event) => {
    const { name, value } = event.target
    console.log(value, 'ALVA')
    const updatedRequest = [...requests]
    updatedRequest[index].type = value
    let user = JSON.parse(sessionStorage.getItem('userInfo'));
    updatedRequest[index].orgid = user.orgid
    setRequests(updatedRequest);

  }

  const getOrganizationRequests = async () => {
    try {
      let user = JSON.parse(sessionStorage.getItem('userInfo'));
      const response = await axios.get(`http://localhost:3000/api/organization/getOrganizationRequest/${user.orgid}`);
      console.log(response.data.user)
      setRequests(response.data.user)
    } catch (error) {
      console.log(error, "error")
    }
  }



  React.useEffect(() => {
    getOrganizationRequests()
  }, [])

  return (
    <>
      {requests.length != 0 ?
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Password</TableCell>
                <TableCell align="center">Access</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((row, index) => (
                <TableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" name='name'>
                    {row.username}
                  </TableCell>
                  <TableCell align="center" name='email'>{row.email}</TableCell>
                  <TableCell align="center" name='password'>{row.password}</TableCell>
                  <TableCell align="center">
                    <FormControl className="w-35">

                      <InputLabel>Type</InputLabel>

                      <Select className='w-35' label="Type" name="userType" value={row.type || ''} onChange={(e) => handleSelect(index, e)}
                      >
                        {type.map((typ, index) => (
                          <MenuItem key={index} value={typ.value}>
                            {typ.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    <div className='flex justify-end gap-2' align="right" onClick={() => handleRejected(index)}>

                      <Button variant="contained" color="error">
                        <ImCross /></Button>
                      <Button variant="contained" color="success" onClick={() => handleClick(index)}>
                        <AiFillLike size='25px' />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> :
        <div class="p-6 bg-white rounded-lg shadow-lg flex justify-center">
          <span class="text-xl font-bold">No Requests</span>
        </div>

      }

    </>
  );
}
