import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Modal,
    Button,
    TextField,
    Divider,
    InputLabel,
    Select,
    MenuItem,
    FormControl,
    Grid
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { fetchMerchants } from "../../ReduxSlice/merchantSlice";


const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    p: 3,
    borderRadius: "12px",
    boxShadow: 24,
};

export default function MaterialModal({ open, handleModal, row }) {

    const unitConversion = (from, to) => {
        const factors = {
            kg: 1000,   // 1 kg = 1000 g
            g: 1,       // base for weight
            mg: 0.001,  // 1 mg = 0.001 g
            l: 1000,    // 1 l = 1000 ml
            ml: 1       // base for volume
        };

        // Check if conversion is possible (weight to weight, volume to volume)
        const isWeight = ["kg", "g", "mg"].includes(from) && ["kg", "g", "mg"].includes(to);
        const isVolume = ["l", "ml"].includes(from) && ["l", "ml"].includes(to);

        if (!isWeight && !isVolume) return null; // incompatible units

        return factors[from] / factors[to];
    };

    const user = JSON.parse(sessionStorage.getItem("userInfo"));

    const [input, setInput] = useState({
        itemName: row?.itemid?.items || "",
        categoryName: row?.rcatid?.category || "",
        subcategoryName: row?.subCategory?.subcatname || "",
        date: "",
        invoice: "",
        merchantName: "",
        quantity: "",
        unit: "",
        total: "",
        sgst: "",
        cgst: "",
        consumptionUnit: row?.minsunit || "",
        maxStock: row?.itemid?.maxStock || "",
        minStock: row?.itemid?.minStock || "",
        quantityAsConsumption: "",
    });

    useEffect(() => {
        console.log(row, "row")
    }, [])

    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const merchants = useSelector((state) => state.merchants.data);
    useEffect(() => {
        dispatch(fetchMerchants());
    }, [])

    const handleClose = () => {
        handleModal(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setInput((prev) => {
            let updated = { ...prev, [name]: value };

            // Auto conversion if unit changes
            if (name === "unit" && prev.consumptionUnit) {
                const unitValue = value?.toLowerCase();
                const consumptionUnitValue = prev.consumptionUnit?.toLowerCase();

                console.log(unitValue, consumptionUnitValue, "prev.consumptionUnit");

                const factor = unitConversion(unitValue, consumptionUnitValue);

                if (factor !== null) {
                    updated.quantityAsConsumption = factor;
                } else {
                    updated.quantityAsConsumption = "";
                    // toast.warn("Incompatible units selected");
                }
            }


            return updated;
        });
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target
        console.log(value, "valur")
        const parsed = JSON.parse(value)
        setInput({
            ...input,
            merchantName: parsed,
        })
        //   delete errors.category;
    };
    const handleSubmit = async () => {
        try {
            console.log(input, "inpuuu")
            if (!input.date || !input.quantity) {
                toast.warn("Please fill all required fields.");
                return;
            }

            setLoading(true);

            const payload = {
                ...input,
                rawmatid: row._id,
                orgid: user?.orgid,
                createdBy: user?.wallid,
                item: row?.itemid?._id,
                category: row?.rcatid?._id,
                subcategory: row?.subCategory?._id,
                date: new Date(input.date).toISOString(),
                merchant: input.merchantName.id

            };

            const res = await axios.post(
                "http://localhost:3000/api/rawmaterials/addMaterials",
                payload
            );
            console.log(res, "resresres")

            if (res.status === 200) {
                toast.success(res.data?.message || "Material added successfully!");
                handleClose();
            } else {
                toast.warn(res.data?.message || "Something went wrong.");
            }
        } catch (err) {
            toast.error("Failed to add material.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="material-modal-title"
            aria-describedby="material-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    borderRadius: 2,
                    width: 550,
                    maxHeight: "90vh",
                    overflowY: "auto",
                    p: 4,
                }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <Typography id="material-modal-title" variant="h6" fontWeight="bold">
                        Add Material
                    </Typography>
                    <Button onClick={handleClose} sx={{ color: "red" }}>
                        ✕
                    </Button>
                </div>

                <Divider sx={{ mb: 3 }} />

                {/* Material Details */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Material Details
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                        <TextField fullWidth label="Item" name="item" value={input.itemName} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Category" name="category" value={input.categoryName} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Subcategory" name="subcategory" value={input.subcategoryName} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="datetime-local"
                            label="Date & Time"
                            name="date"
                            value={input.date}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>

                </Grid>

                <Grid item xs={6} sx={{ mb: 2 }}>
                    <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Merchant</InputLabel>
                        <Select
                            name="merchantName"
                            label="Merchant"
                            value={input.merchantName ? JSON.stringify(input.merchantName) : ""}
                            onChange={handleInputChange}
                        >
                            {merchants.map((opt) => (
                                <MenuItem key={opt._id}
                                    value={JSON.stringify({ id: opt._id, name: opt.merchant })}>
                                    {opt.merchant}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>


                {/* Quantity & Unit */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Quantity & Unit
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Quantity" name="quantity" value={input.quantity} onChange={handleChange} />
                    </Grid>
                    {/* <Grid item xs={6}>
                        <TextField fullWidth label="Unit" name="unit" value={input.unit} onChange={handleChange} />
                    </Grid> */}


                    <Grid item xs={6}>
                        <FormControl sx={{ minWidth: 225 }}>
                            <InputLabel>Unit</InputLabel>
                            <Select
                                name="unit"
                                label="Unit"
                                value={input.unit || ""}
                                onChange={handleChange}
                            >
                                {row.purchaseUnit.map((opt) => (
                                    <MenuItem value={opt}>
                                        {opt}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>



                </Grid>

                {/* Tax Info */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Tax Info
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={4}>
                        <TextField fullWidth label="Total" name="total" value={input.total} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth label="SGST" name="sgst" value={input.sgst} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField fullWidth label="CGST" name="cgst" value={input.cgst} onChange={handleChange} />
                    </Grid>
                </Grid>

                {/* Stock Info */}
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                    Stock Info
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Consumption Unit"
                            name="consumptionUnit"
                            value={input.consumptionUnit}
                            onChange={handleChange}
                            disabled
                        />


                        {/* 
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel>Consumption Unit</InputLabel>
                            <Select
                                name="merchant"
                                value={input.merchant || ""}
                                onChange={handleChange}
                            >
                                {merchants.map((opt) => (
                                    <MenuItem key={opt._id || opt.merchant} value={opt.merchant}>
                                        {opt.merchant}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl> */}





                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Max Stock" name="maxStock" value={input.maxStock} onChange={handleChange} disabled />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField fullWidth label="Min Stock" name="minStock" value={input.minStock} onChange={handleChange} disabled />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label={`How many ${input.consumptionUnit} in 1 ${input.unit}`}

                            name="quantityAsConsumption"
                            value={input.quantityAsConsumption}
                            onChange={handleChange}
                        />
                    </Grid>

                </Grid>

                {/* Footer */}
                <div className="flex justify-center gap-3 mt-6">
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: "#047857",
                            borderRadius: "8px",
                            px: 3,
                            "&:hover": { backgroundColor: "#065f46" },
                        }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Material"}
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            borderRadius: "8px",
                            borderColor: "#047857",
                            color: "#047857",
                            px: 3,
                            "&:hover": { borderColor: "#065f46", color: "#065f46" },
                        }}
                        onClick={() =>
                            setInput({
                                ...input,
                                date: "",
                                invoice: "",
                                merchant: "",
                                quantity: "",
                                unit: "",
                                total: "",
                                sgst: "",
                                cgst: "",
                                // consumptionUnit: "",
                                // maxStock: "",
                                // minStock: "",
                                quantityAsConsumption: "",
                            })
                        }
                    >
                        Reset
                    </Button>
                </div>
            </Box>
        </Modal>


    );
}
