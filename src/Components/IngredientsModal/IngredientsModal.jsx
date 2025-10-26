import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    ListItemText
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    p: 2,
    borderRadius: '5px',
    boxShadow: '4px',
};

export default function IngredientsModal({ open, handleModal, food }) {
    let user = JSON.parse(sessionStorage.getItem('userInfo'));

    const [ingredientList, setIngredientList] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]); // now stores only IDs
    const [ingredientDetails, setIngredientDetails] = useState({});     // keyed by ID

    useEffect(() => {
        if (food?.ingredients?.length && ingredientList.length) {
            const ids = food.ingredients.map((ing) => ing.itemId);

            setSelectedIngredients(ids);

            let details = {};
            food.ingredients.forEach((ing) => {
                const item = ingredientList.find((i) => i._id === ing.itemId);

                details[ing.itemId] = {
                    quantity: ing.quantity || '',   // ✅ use saved quantity (e.g., 4)
                    unit: ing.unit || item?.itemid?.consumUnit || '' // ✅ fallback to DB only if missing
                };
            });

            setIngredientDetails(details);
        }
    }, [food, ingredientList]);
    // depends on food & ingredient list


    const handleSelectChange = (event) => {
        const {
            target: { value },
        } = event;

        console.log(value, "VALUEEECHANGE")

        setSelectedIngredients(value);

        // initialize missing ingredient details
        let newDetails = { ...ingredientDetails };
        value.forEach((id) => {
            if (!newDetails[id]) {
                const ing = ingredientList.find((i) => i._id === id);
                newDetails[id] = { quantity: '', unit: ing?.itemid.consumUnit || '' };
            }
        });

        // remove details for deselected ingredients
        Object.keys(newDetails).forEach((id) => {
            if (!value.includes(id)) {
                delete newDetails[id];
            }
        });
        console.log(newDetails, "newDetails")

        setIngredientDetails(newDetails);
    };

    const handleDetailChange = (id, field, value) => {
        setIngredientDetails((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("food", food)

        try {
            let list = selectedIngredients.map((id) => {
                const ing = ingredientList.find((i) => i._id === id);
                return {

                    itemId: id,
                    name: ing?.itemid.items,
                    quantity: ingredientDetails[id]?.quantity,
                    unit: ingredientDetails[id]?.unit,
                };
            });
            let payload = {
                recid: food._id,
                ingredients: list
            }
            console.log(payload, "pay")

            // validation
            // for (let item of payload) {
            //     if (!item.quantity || !item.unit) {
            //         toast.error(`Please fill quantity & unit for ${item.ingredientName}`);
            //         return;
            //     }
            // }

            const res = await axios.post(
                `http://localhost:3000/api/recepie/updateAvailableIngredients/${user.orgid}/${user.wallid}`,
                payload
            );

            if (res.status === 200) {
                toast.success('Ingredients added successfully!');
            }

            // reset form
            setSelectedIngredients([]);
            setIngredientDetails({});
            handleModal(false);
        } catch (err) {
            console.error(err.response?.data?.message || err.message);
            toast.error(err.response?.data?.message || 'Something went wrong');
        }
    };

    const getRawMaterials = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/api/recepie/getAvailableIngredients/${user.orgid}/${user.wallid}`
            );
            if (response.status === 200) {
                setIngredientList(response.data.getIngredients);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        getRawMaterials();
    }, []);

    const handleModalInternal = () => {
        setSelectedIngredients([]);
        handleModal(false);
    };

    return (
        <Modal open={open} aria-labelledby="ingredient-modal-title">
            <Box sx={style}>
                {/* Header */}
                <div className="flex justify-between p-4">
                    <Typography id="ingredient-modal-title" variant="h6" component="h2">
                        {`Add Ingredients for ${food?.title || ""}`}
                    </Typography>
                    <Button sx={{ color: '#047857' }} onClick={handleModalInternal}>
                        X
                    </Button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-3 flex flex-col gap-3">
                        {/* Ingredient Multi Select with Checkboxes */}
                        <FormControl fullWidth>
                            <InputLabel id="ingredient-checkbox-label">Select Ingredients</InputLabel>
                            <Select
                                label="Select Ingredients"
                                labelId="ingredient-checkbox-label"
                                multiple
                                value={selectedIngredients}
                                onChange={handleSelectChange}
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => {
                                            const ing = ingredientList.find((i) => i._id === id);
                                            return ing?.itemid.items;
                                        })
                                        .join(', ')
                                }
                            >
                                {ingredientList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        <Checkbox checked={selectedIngredients.includes(item._id)} />
                                        <ListItemText primary={item.itemid.items} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* For each selected ingredient → show quantity + unit fields */}
                        {selectedIngredients.map((id) => {
                            const ing = ingredientList.find((i) => i._id === id);
                            return (
                                <Box key={id} sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                    <TextField
                                        label={`${ing.itemid.items} Quantity`}
                                        type="number"
                                        value={ingredientDetails[id]?.quantity || ''}
                                        onChange={(e) => handleDetailChange(id, 'quantity', e.target.value)}
                                    />
                                    <TextField
                                        label="Unit"
                                        type="string"
                                        value={ingredientDetails[id]?.unit || ''}
                                        disabled
                                    />
                                </Box>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-center p-2 gap-3">
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#047857' }}>
                            Save Ingredients
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
}
