import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material';
import { getExpenses } from '../../ReduxSlice/expenseTableSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faBan, faRegistered, faRotateLeft } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../Loader/loader.css'
import ExpenseImagemodal from '../ExpenseImageModal/ExpenseImagemodal';

const ExpensesTable = (props) => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expense.expenses);
  let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  const [changes, setChanges] = useState(false)
  const [openmodal, setopenModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null);


  const convertUTCToLocal = (utcDateStr) => {
    const date = new Date(utcDateStr);
    const options = {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };
  const approvalChange = async (status, index) => {
    try {
            console.log(index,"in")

      console.log(expenses[index])
      const response = await axios.post('http://localhost:3000/api/expense/approvalChange', {
        expid: expenses[index]._id,
        userid: expenses[index].userId,
        orgid: expenses[index].orgid,
        status: status
      })
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      setChanges(!changes)
      console.log(response, "RES PONSE")
    } catch (error) {
      toast.error(error.message)
      setChanges(!changes)

    }
  }
  React.useEffect(() => {
    dispatch(getExpenses());
  }, [changes, props.refreshData, dispatch]);

  // useEffect(() => {

  // },[])

  const handleOpenModal = (image) => {
    setSelectedImage(image);
    setopenModal(true);
  };


  return (
    <div>
      <TableContainer component={Paper}>
        <Typography variant="h6" sx={{ m: 2 }}>
          Expense Records
        </Typography>

        <Table>
          <TableHead className='bg-gray-400'>
            <TableRow>
              <TableCell>  <div className="font-bold">Date</div>
              </TableCell>
              <TableCell><div className="font-bold">Merchant / Individual</div></TableCell>
              <TableCell><div className="font-bold">Category</div></TableCell>
              <TableCell><div className="font-bold">Description</div></TableCell>
              <TableCell><div className="font-bold">Receipts</div></TableCell>
              <TableCell><div className="font-bold">Amount</div></TableCell>
              <TableCell><div className="font-bold">Raised By</div></TableCell>
              <TableCell align='center'><div className="font-bold">Status</div></TableCell>
              <TableCell align='center'><div className="font-bold">Action</div></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {expenses && expenses.length > 0 ? (
              expenses.map((exp, index) => (
                <TableRow key={index}>
                  <TableCell>{convertUTCToLocal(exp.expdate)}</TableCell>
                  <TableCell>{exp?.merchantData?.merchant}</TableCell>
                  <TableCell>{exp?.categoryData?.category}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>
                    {exp.receipt ? (
                      <img
                        src={`http://localhost:3000/uploads/${userInfo.orgid}/${userInfo.wallid}/${exp.receipt}`}
                        alt="Preview"
                        style={{
                          width: '100px',
                          height: 'auto',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOpenModal(`http://localhost:3000/receipts/${userInfo.orgid}/${userInfo.wallid}/${exp.receipt}`)}
                      />

                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>{exp.total}</TableCell>
                  <TableCell>{exp.user.userName}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap justify-center gap-3">

                      {exp.status === "A" && (
                        <button className="min-w-[120px] border border-green-700 bg-green-700 text-white px-4 py-2 rounded-xl shadow-sm hover:brightness-110 transition duration-200">
                          Approved
                        </button>
                      )}

                      {exp.status === "UA" && (
                        <button className="min-w-[120px] border border-red-700 bg-red-700 text-white px-4 py-2 rounded-xl shadow-sm hover:brightness-110 transition duration-200">
                          Unapproved
                        </button>
                      )}

                      {exp.status === "R" && (
                        <button className="min-w-[120px] border border-amber-700 bg-amber-700 text-white px-4 py-2 rounded-xl shadow-sm hover:brightness-110 transition duration-200">
                          Reimbursed
                        </button>
                      )}
                      {exp.status === "O" && (
                        <button className="min-w-[120px] bg-white text-black px-4 py-2 rounded-xl shadow-sm hover:brightness-110 transition duration-200">
                          -
                        </button>
                      )}

                    </div>


                  </TableCell>

                  <TableCell align="center">
                    <div className="flex flex-wrap justify-center gap-3">



                      {(exp?.status === "UA" || (exp?.status === "O" && exp?.reimbursable !== true)) && (
                        <button
                          className="min-w-[50px] border border-green-700 text-green-700 hover:bg-green-700 hover:text-white px-4 py-2 rounded-xl shadow-sm transition duration-200"
                          title="Approve"
                          onClick={() => approvalChange("A", index)}
                        >
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                      )}

                      {exp.reimbursable === true && exp.status !== "R" && (
                        <button
                          className="min-w-[50px] border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-4 py-2 rounded-xl shadow-sm transition duration-200"
                          title="Mark as Reimbursed"
                          onClick={() => approvalChange("R", index)}
                        >
                          <FontAwesomeIcon icon={faRegistered} />
                        </button>
                      )}

                      {exp.status === "R" && (
                        <button
                          className="min-w-[50px] border border-amber-700 text-amber-700 hover:bg-amber-700 hover:text-white px-4 py-2 rounded-xl shadow-sm transition duration-200"
                          title="Revert Reimbursement"
                          onClick={() => approvalChange("O", index)}

                        >
                          <FontAwesomeIcon icon={faRotateLeft} />
                        </button>
                      )}

                      {exp.reimbursable === false && exp.status !== "UA" && (
                        <button
                          onClick={() => approvalChange("UA", index)}
                          className="min-w-[50px] border border-red-700 text-red-700 hover:bg-red-700 hover:text-white px-4 py-2 rounded-xl shadow-sm transition duration-200"
                          title="Reject"
                        >
                          <FontAwesomeIcon icon={faBan} />
                        </button>
                      )}
                    </div>

                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No expenses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {openmodal && (
        <ExpenseImagemodal
          open={openmodal}
          onClose={() => setopenModal(false)}
          image={selectedImage}
        />
      )}
    </div>
  );
};

export default ExpensesTable;
