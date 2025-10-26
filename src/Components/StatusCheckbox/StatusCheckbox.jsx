import React, { useEffect, useState } from 'react';
import './StatusCheckbox.css';
import {
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Paper,
    Typography
} from '@mui/material';

const StatusCheckbox = (props) => {
    const { onChange } = props
    const [value, setValue] = useState('');

    const handleChange = (selectedValue) => {
        setValue(prev => prev === selectedValue ? '' : selectedValue);
    }

    useEffect(() => {
        onChange(value)

    }, [value])


    return (
        <div className='w-md'>
            <FormControl component="fieldset" sx={{ width: '100%' }}>

                <RadioGroup
                    row // makes it horizontal
                    name="status-radio-group"
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 3
                    }}
                    value={value}
                // onChange={handleChange}
                >
                    <FormControlLabel
                        value="approved"
                        control={<Radio sx={{ color: '#4caf50', '&.Mui-checked': { color: '#4caf50' } }} onClick={() => handleChange('approved')}
                        />}
                        label={<Typography sx={{ fontWeight: 500 }}>Approved</Typography>}
                    />
                    <FormControlLabel
                        value="unApproved"
                        control={<Radio sx={{ color: '#f44336', '&.Mui-checked': { color: '#f44336' } }} onClick={() => handleChange('unApproved')} />}
                        label={<Typography sx={{ fontWeight: 500 }}>UnApproved</Typography>}
                    />
                    <FormControlLabel
                        value="reimbursed"
                        control={<Radio sx={{ color: '#2196f3', '&.Mui-checked': { color: '#2196f3' } }} onClick={() => handleChange('reimbursed')} />}
                        label={<Typography sx={{ fontWeight: 500 }}>Reimbursed</Typography>}
                    />
                </RadioGroup>
            </FormControl>
        </div>
    );
};

export default StatusCheckbox;
