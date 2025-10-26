import React, { useEffect, useState } from 'react'
import './expense.css'
import ExpDatePicker from '../DatePicker/ExpDatePicker'
import ExpDropdown from '../DropDown/ExpDropdown'
import ExpRadioButtons from '../RadioButtons/ExpRadioButtons'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import StatusCheckbox from '../StatusCheckbox/StatusCheckbox'
import './expense.css'
import { useSelector, useDispatch } from 'react-redux';
import { fetchMerchants } from '../../ReduxSlice/merchantSlice'
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { getExpenses } from '../../ReduxSlice/expenseTableSlice'
import ExpTypeDropDown from '../DropDown/ExpTypeDropDown'
import ExpSubmission from '../DropDown/ExpSubmission'
import dayjs from 'dayjs'


const Expense_Filter = () => {
    const options = [
        { value: 'all', label: 'All' },
        { value: 'billable', label: 'Billable' },
        { value: 'reimbursable', label: 'Reimbursable' },
    ]

    const submission = [
        { value: 'myExpense', label: 'My Expense' },
        { value: 'otherSubmitters', label: 'Other Submitters' },
        { value: 'allSubmitters', label: 'All Submitters' },

    ]

    const businessExpenseCategories = [
        { label: 'Uncategorized', value: 'Uncategorized' },
        { label: 'Advertising & Marketing', value: 'Advertising & Marketing' },
        { label: 'Bank Charges', value: 'Bank Charges' },
        { label: 'Benefits', value: 'Benefits' },
        { label: 'Business Meals', value: 'Business Meals' },
        { label: 'Car & Vehicle Expenses', value: 'Car & Vehicle Expenses' },
        { label: 'Charity Donations', value: 'Charity Donations' },
        { label: 'Cleaning & Janitorial', value: 'Cleaning & Janitorial' },
        { label: 'Commissions & Fees', value: 'Commissions & Fees' },
        { label: 'Consulting Services', value: 'Consulting Services' },
        { label: 'Contract Labor', value: 'Contract Labor' },
        { label: 'Dues & Subscriptions', value: 'Dues & Subscriptions' },
        { label: 'Education & Training', value: 'Education & Training' },
        { label: 'Employee Wages', value: 'Employee Wages' },
        { label: 'Entertainment', value: 'Entertainment' },
        { label: 'Equipment Purchase', value: 'Equipment Purchase' },
        { label: 'Fuel & Oil', value: 'Fuel & Oil' },
        { label: 'Insurance', value: 'Insurance' },
        { label: 'Interest Expense', value: 'Interest Expense' },
        { label: 'Internet & Phone', value: 'Internet & Phone' },
        { label: 'Legal & Professional Fees', value: 'Legal & Professional Fees' },
        { label: 'Licenses & Permits', value: 'Licenses & Permits' },
        { label: 'Maintenance & Repairs', value: 'Maintenance & Repairs' },
        { label: 'Meals & Entertainment', value: 'Meals & Entertainment' },
        { label: 'Miscellaneous', value: 'Miscellaneous' },
        { label: 'Office Supplies', value: 'Office Supplies' },
        { label: 'Packaging', value: 'Packaging' },
        { label: 'Payroll Expenses', value: 'Payroll Expenses' },
        { label: 'Postage & Delivery', value: 'Postage & Delivery' },
        { label: 'Printing & Stationery', value: 'Printing & Stationery' },
        { label: 'Rent or Lease', value: 'Rent or Lease' },
        { label: 'Repairs', value: 'Repairs' },
        { label: 'Sales Tax', value: 'Sales Tax' },
        { label: 'Security Services', value: 'Security Services' },
        { label: 'Software Subscriptions', value: 'Software Subscriptions' },
        { label: 'Taxes & Licenses', value: 'Taxes & Licenses' },
        { label: 'Travel & Lodging', value: 'Travel & Lodging' },
        { label: 'Utilities', value: 'Utilities' },
        { label: 'Waste Disposal', value: 'Waste Disposal' }
    ];
    const [merchantstate, setMerchant] = useState("")
    const [filter, setFilter] = useState({
        category: "",
        merchant: "",
        status: "",
        submitters: "",
        approval: "",
        from: "",
        to: "",
    })
    const [value, setValue] = useState('')
    const handleChange = (event) => {
        setMerchant(event.target.value);
        setFilter((prev) => ({ ...prev, merchant: event.target.value }));
        if (event.target.value === "All") {
            setFilter((prev) => ({ ...prev, merchant: '' }));
        }

    };

    const dispatch = useDispatch();
    const merchants = useSelector((state) => state.merchants.data);
    useEffect(() => {
        dispatch(fetchMerchants());
    }, [])

    useEffect(() => {
        const payload = {
            ...filter,
            category: filter.category === 'Cat1' ? '' : filter.category
        };

        dispatch(getExpenses(payload));
    }, [filter]);
    const [selectedFromDate, setSelectedFromDate] = useState(dayjs());
    const [selectedToDate, setSelectedToDate] = useState(dayjs());

    const handleClick = () => {
        setSelectedFromDate(dayjs())
        setSelectedToDate(dayjs())
        setFilter((prev) => ({
            category: "",
            merchant: "",
            status: "",
            submitters: "",
            approval: "",
            from: "",
            to: ""

        }));
    };

    useEffect(() => {
        console.log(filter, "filly")
    }, [filter])

    return (
        <div>

            {/* Date Filter */}
            <div className='flex p-2.5 justify-between'>
                {/* <ExpDatePicker /> */}
                <ExpDatePicker fromDate={selectedFromDate}
                    toDate={selectedToDate} fromonChange={(value) => setFilter((prev) => ({ ...prev, from: value }))} toonChange={(value) => setFilter((prev) => ({ ...prev, to: value }))} />

                <Button onClick={handleClick}>Reset</Button>

            </div>
            {/* Merchant,(ALL,billable,Reimbusble),(Ecpenses,Receipts,documents),(ALL Expenses,My Submittters,Other submitters) */}
            <div className='flex p-2.5 w-full gap-4'>

                <Box
                    component="form"
                    sx={{ '& > :not(style)': { width: '35ch' } }}
                    noValidate
                    autoComplete="off"
                >
                    {/* <TextField id="outlined-basic" label="Merchant" variant="outlined" /> */}


                    <FormControl fullWidth>
                        <InputLabel>Merchant</InputLabel>

                        <Select
                            label="Merchant" name="merchant"
                            id="demo-simple-select"
                            value={merchantstate}
                            onChange={handleChange}
                            MenuProps={{
                                PaperProps: {
                                    style: {
                                        maxHeight: 400, // Adjust this value to control dropdown height
                                    },
                                },
                            }}
                        >
                            <MenuItem value="All" onChange={handleChange}>All</MenuItem>

                            {merchants.map((opt) => (
                                <MenuItem key={opt._id} value={opt._id}>
                                    {opt.merchant}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>




                </Box>
                <div className='radio'>

                    <ExpRadioButtons options={options} onChange={(value) => setFilter((prev) => ({ ...prev, status: value }))} />
                </div>
                {/* <ExpTypeDropDown options={{ list: types, label: "types" }} /> */}
                {/* <ExpDropdown options={submission} /> */}
                <ExpDropdown options={{ list: businessExpenseCategories, label: "categories" }} onChange={(value) => setFilter((prev) => ({ ...prev, category: value }))} />
                <ExpSubmission options={{ list: submission, label: "submission" }} onChange={(value) => setFilter((prev) => ({ ...prev, submitters: value }))} />


            </div>

            {/* categories, workspaces */}
            <div className='flex p-2.5 w-full gap-4'>
                {/* <ExpDropdown options={{ list: submission, label: "submission" }} /> */}

            </div>

            <div className="flex p-2.5 gap-2 flex-wrap">
                <StatusCheckbox color="#15803d" onChange={(value) => setFilter((prev) => ({ ...prev, approval: value }))} />
                {/* <StatusCheckbox label="Reimbursed" color="#166534" />
                <StatusCheckbox label="Unapproved" color="#0f3d22" /> */}



            </div>


        </div>
    )
}

export default Expense_Filter
