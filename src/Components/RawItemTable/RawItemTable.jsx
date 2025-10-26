import * as React from 'react';
// import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
// import { Button } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdDelete } from "react-icons/md";

import { Paper, Button } from '@mui/material';

const columns = [
    { id: 'itemName', label: 'Item', minWidth: 170 },
    { id: 'category', label: 'Category', minWidth: 100 },
    {
        id: 'quantity',
        label: 'Quantity',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'purchasePrice',
        label: 'Price',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'minimumStock',
        label: 'Min.Stock',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'sgst',
        label: 'SGST%',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
    {
        id: 'cgst',
        label: 'CGST%',
        minWidth: 170,
        align: 'right',
        format: (value) => value.toFixed(2),
    },
];



export default function RawItemTable({ addedData, setAddedData, selectedItem }) {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

    const [addedDataArray, setAddedDataArray] = React.useState([]);
    React.useEffect(() => {
        console.log(addedData, "addedData")
    }, [addedData])


    const handleClick = () => {
        console.log(addedData, "addedData")
        const formattedData = addedData.map((arr) => ({
            itemid: arr.itemName.id,
            orgid: userInfo.orgid,
            rcatid: arr.category.id,
            minimumstock: arr.minimumStock,
            minsunit: arr.minStockUnit,
            maximumstock: arr.maximumStock,
            maxunit: arr.maxStockUnit,
            sgst: Number(arr.sgst),
            cgst: Number(arr.cgst),
            createdby: userInfo.wallid,
            createdon: new Date(),
            timezone: "Asia/Calcutta",
            state: arr.state,
            description: arr.description,
            hsnCode: arr.hsnCode,
            isExpiry: arr.isExpiry,
            isPrivate: arr.isPrivate,
            nLoss: arr.nLoss,
            purchaseUnit: arr.purchaseUnit,
            subCategory: arr.subcategory.id
        }));

        setAddedDataArray(formattedData);
        // setAddedData([]);
        localStorage.removeItem('rawTabledata')

    };

    const addRawMaterials = async () => {
        try {
            console.log(addedDataArray, "addedDataArray")
            if (addedDataArray.length !== 0) {
                const response = await axios.post('http://localhost:3000/api/rawmaterials/newRawMaterials', addedDataArray)
                if (response.data.failedMaterials.length > 0) {
                    toast.warn("Failed to add some Raw Materials")
                    return
                }
                toast.success(response.data.message)
                setAddedData([])

            }
        } catch (error) {
            toast.error(error.message)

        }
    }


    const handleDelete = (id) => {

        const stored = localStorage.getItem('rawTabledata');
        let data = stored ? JSON.parse(stored) : [];
        data.splice(id, 1)
        localStorage.setItem('rawTabledata', JSON.stringify(data));
        const updatestored = localStorage.getItem('rawTabledata');
        // const newData = addedData.filter((item, index) => index !== id);
        setAddedData(JSON.parse(updatestored));

    }


    React.useEffect(() => {
        addRawMaterials()
    }, [addedDataArray]);


    return (


        <div className='flex flex-col gap-4 text-center'>

            {/* Scrollable container */}
            <div
                className="overflow-y-auto  p-2"
                style={{
                    maxHeight: '700px', // adjust this height as needed
                    scrollbarWidth: 'thin',
                }}
            >
                <div className="flex flex-col gap-4">
                    {addedData.map((row, index) => (
                        <Paper
                            key={index}
                            elevation={3}
                            className="p-4 rounded-2xl shadow-md bg-[#f9fbe7] hover:shadow-lg transition-all"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-lg font-semibold text-green-900">{row.itemName.name}</div>
                                <MdDelete
                                    className="text-gray-600 hover:text-red-600 cursor-pointer"
                                    onClick={() => handleDelete(index)}
                                    size={24}
                                />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-700">
                                <div>
                                    <span className="font-semibold text-gray-900">Category:</span> {row.category.name}
                                </div>
                                {/* <div>
                                    <span className="font-semibold text-gray-900">Purchase unit:</span>{" "}
                                    {row.category.purchaseUnit.map((item, idx) => (
                                        <span>
                                            { item.toLowerCase()).join(",")}
                                            
                                        </span>
                                    ))}
                                </div> */}
                                <div>
                                    <span className="font-semibold text-gray-900 text-left">Subcategory:</span> {row.subcategory.name}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Quantity:</span> {row.state} {row.quantityUnit}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Normal Loss:</span> {row.nLoss}%
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Purchase Unit: </span> {row.purchaseUnit.join(",")}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Is Private:</span> {row.isPrivate === true ? "Yes" : "No"}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">Track Expiry:</span> {row.isExpiry === true ? "Yes" : "No"}
                                </div>
                                {/* <div>
                                <span className="font-semibold text-gray-900">Purchase Price:</span> ₹{row.purchasePrice}
                            </div> */}
                                {/* <div>
                                <span className="font-semibold text-gray-900">Minimum Stock:</span> {row.minimumStock} {row.minStockUnit}
                            </div> */}
                                <div>
                                    <span className="font-semibold text-gray-900">SGST:</span> {row.sgst}%
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900">CGST:</span> {row.cgst}%
                                </div>
                            </div>
                        </Paper>
                    ))}
                </div>
            </div>

            <Button
                sx={{
                    display: 'block',
                    mx: 'auto',
                    mt: 2,
                    backgroundColor: '#065f46',
                    color: '#fff',
                    width: '350px',
                    fontWeight: 500,
                    px: 6,
                    py: 1.5,
                    borderRadius: '6px',
                    transition: 'all 0.3s',
                    '&:hover': {
                        backgroundColor: '#047857',
                    },
                }}
                onClick={handleClick}
            >
                Confirm to Inventory
            </Button>
        </div>

    );
}
