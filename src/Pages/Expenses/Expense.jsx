import React, { useEffect, useState } from 'react'
import Expense_Filter from '../../Components/Filter/Expense_Filter'
import './expense.css'
import Button from '@mui/material/Button';
import ExpenseTable from '../../Components/ExpenseTable/ExpenseTable';
import ExpenseModal from '../../Components/ExpenseModal/ExpenseModal';
import axios from 'axios';

const Expense = () => {
  const [show, setShow] = useState(true)
  const [savedData, setSaveData] = useState()
  const [refreshData, setRefreshData] = useState(false);
  const handleClick = () => {
    setShow(!show)
  }
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => {
    setOpenModal(true)
  }

  const handleCloseModal = (bool) => {
    setOpenModal(bool)
  }

  const saveData = async (data) => {
    try {
      const user = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
      if (!user.wallid || !user.orgid) {
        console.error('Invalid user info');
        return;
      }

      const response = await axios.post(
        `http://localhost:3000/api/expense/saveExpense/${user.wallid}/${user.orgid}`,
        data
      );
      console.log(response, "res")
      if (response.status === 200) {
        console.log("HERE")
        setRefreshData(!refreshData); // trigger refresh
      }
      console.log(response.data, 'Expense saved successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  useEffect(() => {
    if (savedData) {
      saveData(savedData);
    }

  }, [savedData]);



  return (
    <div className='expense'>

      <div>
        <div className=''>

          <div className='flex justify-between p-4'>

            <p className='font-bold text-4xl'>Expense</p>
            <div className='flex'>

              <button class="bg-green-800 hover:bg-green-500 text-white font-bold py-0 px-4 rounded-full" onClick={handleOpenModal}>
                New Expense
              </button>
              <div className='flex justify-end p-3'>
                <Button variant="outlined" className='bg-green-800 hover:bg-green-500 text-white' onClick={handleClick}>
                  {!!show ? "Hide Filter" : "Show Filter"}</Button>
              </div>
            </div>
          </div>

          {!!show && <Expense_Filter />}


        </div>

        <div className='p-4'>

          <ExpenseTable setRefreshData={setRefreshData} refreshData={refreshData} />
        </div>
        {
          openModal &&
          <ExpenseModal setSaveData={setSaveData} handleOpenModal={handleOpenModal} handleCloseModal={handleCloseModal} />
        }

      </div>
    </div>
  )
}

export default Expense
