import React, { useState } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: '5px',
    boxShadow: '4px'
};

export default function MerchantModal({ open, handleModal }) {
    const [fields, setFields] = useState([
        { orgid: "", createdby: "", merchant: "" }
    ]);
    const [errors, setErrors] = useState([]);

    const user = JSON.parse(sessionStorage.getItem('userInfo'));

    const handleClose = () => {
        handleModal(false);
        setFields([{ orgid: "", createdby: "", merchant: "" }]);
        setErrors([]);
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFields = [...fields];
        updatedFields[index] = {
            ...updatedFields[index],
            orgid: user?.orgid || "",
            createdby: user?.wallid || "",
            [name]: value,
        };
        setFields(updatedFields);

        const updatedErrors = [...errors];
        if (updatedErrors[index]) {
            updatedErrors[index][name] = "";
            setErrors(updatedErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        const hasErrors = validationErrors.some(error => Object.keys(error).length > 0);
        if (hasErrors) {
            setErrors(validationErrors);
            return;
        }
        try {
            const response = await axios.post('http://localhost:3000/api/organization/addMerchant', { fields })
            console.log(response, "RESPONSE")
            if (response.status === 207) {
                toast.warn(response?.data?.message)
            }
            if (response.status === 200) {
                toast.success(response?.data?.message)
            }
            handleModal(false);
            setFields([{ orgid: "", createdby: "", merchant: "" }]);
            setErrors([]);
        } catch (error) {
            console.error(error);
        }

    };

    const handleAddMore = () => {
        setFields([...fields, { orgid: "", createdby: "", merchant: "" }]);
        setErrors([...errors, {}]);
    };

    const handleRemove = (index) => {
        const updatedFields = fields.filter((_, i) => i !== index);
        const updatedErrors = errors.filter((_, i) => i !== index);
        setFields(updatedFields);
        setErrors(updatedErrors);
    };

    const validate = () => {
        return fields.map(field => {
            const error = {};
            if (!field.merchant || field.merchant.trim() === "") {
                error.merchant = "Merchant is required";
            }
            return error;
        });
    };

    return (
        <Modal
            open={open}
            aria-labelledby="merchant-modal-title"
            aria-describedby="merchant-modal-description"
        >
            <Box sx={style}>
                <div className='flex justify-between p-4'>
                    <Typography id="merchant-modal-title" variant="h6" component="h2">
                        Add Merchant
                    </Typography>
                    <Button onClick={handleClose} sx={{ color: '#047857' }}>Close</Button>
                </div>

                {fields.map((field, index) => (
                    <div key={index}>
                        <div className='p-3 flex items-center gap-2'>
                            <TextField
                                fullWidth
                                label="Merchant"
                                variant="outlined"
                                name="merchant"
                                onChange={(e) => handleChange(index, e)}
                                value={field.merchant}
                                error={!!(errors[index] && errors[index].merchant)}
                                helperText={errors[index]?.merchant}
                            />
                            <Button
                                onClick={() => handleRemove(index)}
                                disabled={fields.length === 1}
                                sx={{ minWidth: 0, padding: '6px', color: '#dc2626' }}
                            >
                                <FontAwesomeIcon icon={faXmark} />
                            </Button>
                        </div>
                    </div>
                ))}

                <div className='flex justify-center p-2 gap-3'>
                    <Button variant="contained" sx={{ backgroundColor: '#047857' }} onClick={handleSubmit}>
                        Save Merchant
                    </Button>
                    <Button sx={{ color: '#047857' }} onClick={handleAddMore}>Add More</Button>
                </div>
            </Box>
        </Modal>
    );
}
