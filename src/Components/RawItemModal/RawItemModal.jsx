import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, Button, TextField } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { toast } from 'react-toastify';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // ✅ Responsive width
  maxWidth: 500, // ✅ Limit max size
  bgcolor: 'background.paper',
  p: 2,
  borderRadius: '8px',
  boxShadow: 24,
};

export default function RawItemModal({ open, handleModal, refresh, refreshState }) {
  const [item, setItem] = useState('');
  const [itemUnit, setItemUnit] = useState('');
  const [maxStock, setmaxStock] = useState('');
  const [minStock, setminStock] = useState('');
  const [errors, setErrors] = useState({});

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));

  const handleClose = () => handleModal(false);

  const handleSave = async () => {
    try {
      const newErrors = {};

      if (!item) newErrors.item = 'Please enter Item';
      if (!itemUnit) newErrors.itemUnit = 'Please select Unit';
      if (!maxStock) newErrors.maxStock = 'Please enter Maximum stock';
      if (!minStock) newErrors.minStock = 'Please enter Minimum stock';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const itemResponse = await axios.post(
        `http://localhost:3000/api/rawmaterials/addItems`,
        {
          orgid: userInfo.orgid,
          item,
          createdBy: userInfo.wallid,
          unit: itemUnit,
          minimumstock: minStock,
          maximumstock: maxStock,
        }
      );

      if (itemResponse?.status === 200) {
        toast.success(itemResponse.data.message);
      } else {
        toast.error('Something went wrong!');
      }

      refresh(!refreshState);
      handleClose();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Error saving item');
    }
  };

  const handleFieldChange = (setter, field) => (e) => {
    setter(e.target.value);
    setErrors((prev) => ({ ...prev, [field]: '' })); // ✅ clears error properly
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {/* Header */}
        <div className="flex justify-between items-center p-2">
          <Typography variant="h6">Add Item</Typography>
          <Button sx={{ color: '#dc2626' }} onClick={handleClose}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>

        {/* Item Name */}
        <div className="p-2 flex flex-col gap-1">
          <TextField
            fullWidth
            label="Item Name"
            variant="outlined"
            value={item}
            onChange={handleFieldChange(setItem, 'item')}
          />
          {errors.item && <p className="text-sm text-red-500">{errors.item}</p>}
        </div>

        {/* Unit */}
        <div className="p-2 flex flex-col gap-1">
          <FormControl fullWidth>
            <InputLabel id="select-unit-label">Cons. Unit</InputLabel>
            <Select
              labelId="select-unit-label"
              id="select-unit"
              name="quantityUnit"
              value={itemUnit}
              onChange={handleFieldChange(setItemUnit, 'itemUnit')}
              label="Cons. Unit"
              MenuProps={{
                PaperProps: {
                  style: { maxHeight: 48 * 5 + 8 },
                },
              }}
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
          {errors.itemUnit && <p className="text-sm text-red-500">{errors.itemUnit}</p>}
        </div>

        {/* Max Stock */}
        <div className="p-2 flex flex-col gap-1">
          <TextField
            fullWidth
            label="Maximum Stock"
            variant="outlined"
            type="number"
            value={maxStock}
            onChange={handleFieldChange(setmaxStock, 'maxStock')}
          />
          {errors.maxStock && <p className="text-sm text-red-500">{errors.maxStock}</p>}
        </div>

        {/* Min Stock */}
        <div className="p-2 flex flex-col gap-1">
          <TextField
            fullWidth
            label="Minimum Stock"
            variant="outlined"
            type="number"
            value={minStock}
            onChange={handleFieldChange(setminStock, 'minStock')}
          />
          {errors.minStock && <p className="text-sm text-red-500">{errors.minStock}</p>}
        </div>

        {/* Save */}
        <div className="flex justify-center gap-3 mt-4">
          <Button
            variant="contained"
            sx={{ backgroundColor: '#047857', '&:hover': { backgroundColor: '#065f46' } }}
            onClick={handleSave}
          >
            Save Item
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
