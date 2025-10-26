import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button, TextField, InputLabel, MenuItem, FormControl, Select } from '@mui/material';
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
    boxShadow: '4px',
};

const cuisines = [
    "Indian", "Chinese", "Italian", "French", "Mexican", "Thai", "Japanese",
    "Korean", "Mediterranean", "American", "Continental", "Spanish", "Turkish",
    "Middle Eastern", "Vietnamese", "Greek", "Lebanese", "British", "Caribbean",
    "Fusion", "African", "German", "Brazilian", "Russian", "Portuguese", "Moroccan",
    "Indonesian", "Malaysian", "Ethiopian", "Persian", "Filipino",
    "North Indian", "South Indian", "Punjabi", "Gujarati", "Rajasthani", "Bengali",
    "Maharashtrian", "Kashmiri", "Goan", "Kerala", "Andhra", "Telangana",
    "Tamil Nadu", "Udupi", "Hyderabadi", "Awadhi (Lucknowi)", "Bihari",
    "Oriya (Odia)", "Nagaland", "Assamese", "Manipuri", "Meghalayan", "Mizo",
    "Tripuri", "Sikkimese"
];

export default function FoodModal({ open, handleModal, food }) {
    let user = JSON.parse(sessionStorage.getItem('userInfo'));

    const [formData, setFormData] = useState({
        itemName: '',
        description: '',
        servings: '',
        cuisine: '',
        difficulty: '',
        price: ''
    });
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState({});

    // ✅ Autofill form if food exists
    useEffect(() => {
        console.log(food, "food${user.wallid}")
        if (food) {
            setFormData({
                itemName: food.title || '',
                description: food.description || '',
                servings: food.servings || '',
                cuisine: food.cuisine || '',
                difficulty: food.difficulty || '',
                price: food.price || ''
            });
        } else {
            setFormData({
                itemName: '',
                description: '',
                servings: '',
                cuisine: '',
                difficulty: '',
                price: ''
            });
            setFile(null);
        }
    }, [food, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        try {
            const newErrors = {};
            if (!formData?.itemName) newErrors.itemName = 'Please enter the name';
            if (!formData?.description) newErrors.description = 'Please enter the description';
            if (!formData?.servings) newErrors.servings = 'Please enter the servings';
            if (!formData?.difficulty) newErrors.difficulty = 'Please enter the difficulty';
            if (!formData?.cuisine) newErrors.cuisine = 'Please select a cuisine';
            if (!formData?.price) newErrors.price = 'Please enter a price';

            if (Object.keys(newErrors).length > 0) {
                setErrors(newErrors);
                return;
            }

            const data = new FormData();
            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });
            if (file) {
                data.append('image', file);
            }
            console.log(formData, "formdata")
            console.log(data, "formdata")


            let res;
            if (food?._id) {
                // ✅ Update existing
                res = await axios.post(
                    `http://localhost:3000/api/recepie/updateFood/${user.orgid}/${user.wallid}/${food._id}`,
                    data,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            } else {
                // ✅ Add new
                res = await axios.post(
                    `http://localhost:3000/api/recepie/addFood/${user.orgid}/${user.wallid}`,
                    data,
                    { headers: { 'Content-Type': 'multipart/form-data' } }
                );
            }

            if (res.status === 200) {
                toast.success(food?._id ? 'Food updated successfully!' : 'Food saved successfully!');
            }

            setFile(null);
            setFormData({
                itemName: '',
                description: '',
                servings: '',
                cuisine: '',
                difficulty: '',
                price: ''
            });

            handleModal(false);
        } catch (err) {
            console.error(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <Modal open={open} aria-labelledby="food-modal-title" aria-describedby="food-modal-description">
            <Box sx={style}>
                {/* Header */}
                <div className="flex justify-between p-4">
                    <Typography id="food-modal-title" variant="h6" component="h2">
                        {food ? 'Edit Food' : 'Add Food'}
                    </Typography>
                    <Button sx={{ color: '#047857' }} onClick={() => handleModal(false)}>
                        Close
                    </Button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                    <div className="p-3 flex flex-col gap-3">
                        <TextField
                            fullWidth
                            label="Name"
                            variant="outlined"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                        />
                        {errors.itemName && <p className="text-sm text-red-500">{errors.itemName}</p>}

                        <TextField
                            fullWidth
                            label="Description"
                            variant="outlined"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}

                        <TextField
                            fullWidth
                            label="Servings"
                            variant="outlined"
                            name="servings"
                            type="number"
                            value={formData.servings}
                            onChange={handleChange}
                        />
                        {errors.servings && <p className="text-sm text-red-500">{errors.servings}</p>}

                        <FormControl fullWidth>
                            <InputLabel>Cuisine</InputLabel>
                            <Select
                                label="Cuisine"
                                name="cuisine"
                                value={formData.cuisine}
                                onChange={handleChange}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            maxHeight: 200,
                                            '& .MuiMenuItem-root': {
                                                fontSize: '0.875rem',
                                                minHeight: '32px',
                                            },
                                        },
                                    },
                                }}
                            >
                                {cuisines.map((cus, index) => (
                                    <MenuItem key={index} value={cus}>
                                        {cus}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {errors.cuisine && <p className="text-sm text-red-500">{errors.cuisine}</p>}

                        <TextField
                            fullWidth
                            label="Difficulty"
                            variant="outlined"
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        />
                        {errors.difficulty && <p className="text-sm text-red-500">{errors.difficulty}</p>}

                        <TextField
                            fullWidth
                            label="Price"
                            variant="outlined"
                            name="price"
                            type="number"
                            value={formData.price}
                            onChange={handleChange}
                        />
                        {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}

                        {/* Upload Field */}
                        <Button variant="outlined" component="label" sx={{ textTransform: 'none' }}>
                            {file ? file.name : food?.image?.filepath ? 'Change Image' : 'Upload Image'}
                            <input type="file" hidden onChange={handleFileChange} />
                        </Button>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-center p-2 gap-3">
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#047857' }}>
                            {food ? 'Update Food' : 'Save Food'}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}
