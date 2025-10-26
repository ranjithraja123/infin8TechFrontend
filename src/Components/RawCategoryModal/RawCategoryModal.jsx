import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import axios from 'axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: '8px',
    boxShadow: 24,
};

export default function RawCategoryModal({
    open,
    handleModal,
    refresh,
    refreshState,
    openSubcategory,
    catDet,
    setopenSubcategory,
    openCategoryModal,
    categoryObject
}) {
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

    const handleClose = () => {
        handleModal(false);
        setopenSubcategory(false);
        setCategory('');
        setSubcategory('');
    };

    const handleSave = async () => {
        try {
            let response;

            console.log(openSubcategory,"openSubcategory")
            console.log(categoryObject.id, "catDet")
            console.log(subcategory, "subcategory")

            if (openSubcategory && categoryObject) {



                // Save subcategory
                response = await axios.post(`http://localhost:3000/api/rawmaterials/addSubCategories`, {
                    orgid: userInfo.orgid,
                    rcatid: categoryObject.id,
                    rsubcat: subcategory,
                    createdBy: userInfo.wallid,
                });
            } else {
                // Save category
                response = await axios.post(`http://localhost:3000/api/rawmaterials/newRawCategories`, {
                    orgid: userInfo.orgid,
                    rcat: category,
                    createdBy: userInfo.wallid,
                });
            }

            if (response?.status === 200) {
                toast.success(response.data.message);
                refresh(!refreshState);
                handleClose();
            } else {
                toast.error('Something went wrong!');
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || 'Error occurred');
        }
    };

    useEffect(() => {
        console.log(setopenSubcategory, "setopenSubcategory")
    }, [setopenSubcategory])


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <div className="flex justify-between items-center p-2">
                    <Typography variant="h6">
                        {openSubcategory ? 'Add Subcategory' : 'Add Category'}
                    </Typography>
                    <Button sx={{ color: '#dc2626' }} onClick={handleClose}>
                        <FontAwesomeIcon icon={faXmark} />
                    </Button>
                </div>

                {!!openCategoryModal ? (
                    <div className="p-3 flex items-center gap-2">
                        <TextField
                            fullWidth
                            label="Category"
                            variant="outlined"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>
                ) : (
                    <>
                        <div className="p-3 flex items-center gap-2">
                            <TextField
                                fullWidth
                                label="Category"
                                variant="outlined"
                                value={categoryObject?.name || ''}
                                disabled
                            />
                        </div>
                        <div className="p-3 flex items-center gap-2">
                            <TextField
                                fullWidth
                                label="Subcategory"
                                variant="outlined"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                            />
                        </div>
                    </>
                )}

                <div className="flex justify-center gap-3 mt-4">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#047857' }}
                        onClick={handleSave}
                    >
                        {openSubcategory ? 'Save Subcategory' : 'Save Category'}
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
