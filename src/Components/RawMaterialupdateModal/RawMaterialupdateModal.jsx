import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Modal,
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Chip,
    OutlinedInput,
    Checkbox,
    ListItemText
} from '@mui/material';
import { unitCombinations } from '../../Combinations/data';
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

export default function RawMaterialupdateModal({ open, handleModal, row, materials }) {
    const initialForm = {
        minstock: row?.itemid?.minStock,
        maxstock: row?.itemid?.maxStock,
        consunit: row?.itemid?.consumUnit?.toUpperCase() || "",
        sgst: row?.sgst,
        cgst: row?.cgst,
        state: row?.state,
        isprivate: row?.isPrivate ? "yes" : "no",
        expiryTrack: row?.isExpiry ? "yes" : "no",
        natloss: row?.nLoss,
        units: row?.purchaseUnit || []   // ✅ use units consistently
    };

    // useEffect(() => {
    //     console.log(materials, "materials")
    // }, [materials])


    useEffect(() => {

        if (row) {
            setFormData({
                minstock: row?.itemid?.minStock || "",
                maxstock: row?.itemid?.maxStock || "",
                consunit: row?.itemid?.consumUnit?.toUpperCase() || "",
                sgst: row?.sgst || "",
                cgst: row?.cgst || "",
                state: row?.state || "",
                isprivate: row?.isPrivate ? "yes" : "no",
                expiryTrack: row?.isExpiry ? "yes" : "no",
                natloss: row?.nLoss || "",
                units: row?.purchaseUnit || []   // ✅ consistent
            });

            setSelectedUnits(row?.purchaseUnit || []);   // ✅ match
        }
    }, [row, open]);




    const [formData, setFormData] = useState(initialForm);
    const [selectedCombinations, setCombinations] = useState([]);
    const [selectedUnits, setSelectedUnits] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, "name")

        if (name === 'consunit') {
            setSelectedUnits([])
        }
        setFormData({ ...formData, [name]: value });
    };

    const handleUnitsChange = (event) => {
        const {
            target: { value },
        } = event;

        setFormData((prev) => ({
            ...prev,
            units: typeof value === "string" ? value.split(",") : value, // ✅ update correct key
        }));
    };
    const rawmaterialUpdate = async () => {
        try {
            let updatedData = { ...formData, rawmat_id: row._id, itemid: row.itemid._id, purunits: formData.units }

            const response = await axios.post('http://localhost:3000/api/rawmaterials/updateRawMaterials', updatedData)
            console.log(response, "pdared")
            if (response?.status === 200) {
                toast.success(response.data.message)
            }
            handleModal(false);

        } catch (error) {
            toast.error("Update failed")

        }
    }

    const handleSubmit = () => {
        console.log('Form Data:', { ...formData, purchaseUnits: selectedUnits });
        // axios.post("/api/rawmaterial/update", { ...formData, purchaseUnits: selectedUnits })
        //   .then(() => toast.success("Updated successfully"))
        //   .catch(() => toast.error("Update failed"));
        rawmaterialUpdate()
    };

    const handleClose = () => {
        handleModal(false);
    };

    useEffect(() => {
        console.log(formData?.consunit, "formData?.consunit")
        if (formData?.consunit) {
            const key = formData.consunit.toString().toUpperCase();
            const combination = unitCombinations[key] || [];
            setCombinations(combination);
        } else {
            setCombinations([]);
        }
    }, [formData.consunit]);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250
            }
        }
    };



    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="rawmaterial-modal-title"
            aria-describedby="rawmaterial-modal-description"
        >
            <Box sx={style}>
                <div className="flex justify-between p-4">
                    <Typography id="rawmaterial-modal-title" variant="h6" component="h2">
                        Update Raw Material
                    </Typography>
                    <Button onClick={handleClose} sx={{ color: '#047857' }}>
                        Close
                    </Button>
                </div>

                <div className="p-3 flex flex-col gap-3">
                    <TextField
                        type="number"
                        fullWidth
                        label="Min Stock"
                        variant="outlined"
                        name="minstock"
                        value={formData.minstock}
                        onChange={handleChange}
                        disabled={row.isHistory === 1}
                    />
                    <TextField
                        type="number"
                        fullWidth
                        label="Max Stock"
                        variant="outlined"
                        name="maxstock"
                        value={formData.maxstock}
                        onChange={handleChange}
                        disabled={row.isHistory === 1}

                    />
                    <FormControl fullWidth>
                        <InputLabel id="select-unit-label">Cons. Unit</InputLabel>
                        <Select
                            labelId="select-unit-label"
                            id="select-unit"
                            name="consunit"
                            value={formData.consunit}
                            onChange={handleChange}
                            label="Cons. Unit"
                            MenuProps={{
                                PaperProps: {
                                    style: { maxHeight: 48 * 5 + 8 }
                                }
                            }}
                            disabled={row.isHistory === 1}

                        >
                            {/* Volume */}
                            <MenuItem value="L">L</MenuItem>
                            <MenuItem value="ML">ML</MenuItem>
                            {/* Weight */}
                            <MenuItem value="KG">KG</MenuItem>
                            <MenuItem value="G">G</MenuItem>
                            <MenuItem value="MG">MG</MenuItem>
                            {/* Count */}
                            <MenuItem value="PCS">PCS</MenuItem>
                            <MenuItem value="NO">NO</MenuItem>
                            <MenuItem value="PKT">PKT</MenuItem>
                            <MenuItem value="BOX">BOX</MenuItem>
                            <MenuItem value="DOZEN">DOZEN</MenuItem>
                            {/* Packaging */}
                            <MenuItem value="BOTTLE">BOTTLE</MenuItem>
                            <MenuItem value="JAR">JAR</MenuItem>
                            <MenuItem value="CAN">CAN</MenuItem>
                            <MenuItem value="ROLL">ROLL</MenuItem>
                            <MenuItem value="TUB">TUB</MenuItem>
                            <MenuItem value="SACHET">SACHET</MenuItem>
                            <MenuItem value="BAG">BAG</MenuItem>
                            {/* Length */}
                            <MenuItem value="M">M</MenuItem>
                            <MenuItem value="CM">CM</MenuItem>
                            <MenuItem value="MM">MM</MenuItem>
                            <MenuItem value="TRAY">TRAY</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        type="number"
                        fullWidth
                        label="SGST %"
                        variant="outlined"
                        name="sgst"
                        value={formData.sgst}
                        onChange={handleChange}
                    />
                    <TextField
                        type="number"
                        fullWidth
                        label="CGST %"
                        variant="outlined"
                        name="cgst"
                        value={formData.cgst}
                        onChange={handleChange}
                    />
                    <TextField
                        select
                        fullWidth
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        disabled={row.isHistory === 1}

                    >
                        <MenuItem value="Solid">SOLID</MenuItem>
                        <MenuItem value="Liquid">LIQUID</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Is Private"
                        name="isprivate"
                        value={formData.isprivate}
                        onChange={handleChange}

                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </TextField>
                    <TextField
                        select
                        fullWidth
                        label="Expiry Track"
                        name="expiryTrack"
                        value={formData.expiryTrack}
                        onChange={handleChange}
                    >
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                    </TextField>
                    <TextField
                        type="number"
                        fullWidth
                        label="Natural Loss (%)"
                        variant="outlined"
                        name="natloss"
                        value={formData.natloss}
                        onChange={handleChange}

                    />

                    <FormControl fullWidth>
                        <InputLabel id="purchase-units-label">Purchase Units</InputLabel>
                        <Select
                            labelId="purchase-units-label"
                            id="purchase-units"
                            multiple
                            value={formData.units}   // ✅ bind to units
                            onChange={handleUnitsChange}
                            input={<OutlinedInput label="Purchase Units" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            name="units"
                            disabled={row.isHistory === 1}

                        >
                            {selectedCombinations.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={formData.units.includes(name)} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>



                </div>

                <div className="flex justify-center p-2 gap-3">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: '#047857' }}
                        onClick={handleSubmit}
                    >
                        Update
                    </Button>
                    <Button sx={{ color: '#047857' }} onClick={() => setFormData(initialForm)}>
                        Reset
                    </Button>
                </div>
            </Box>
        </Modal>
    );
}
