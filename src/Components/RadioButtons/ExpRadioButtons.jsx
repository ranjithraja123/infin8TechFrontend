import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';

export default function ExpRadioButtons(props) {
    const { options, onChange } = props;
    const [value, setValue] = useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        console.log(newValue,"NEWVALL")
        if (onChange) {
            onChange(newValue);
        }
    };
    // const handleChange = (event) => {
    //     console.log(event.target, "JUSTFORTEST")
    //     setAge(event.target.value);
    //     onChange(event.target.value);
    //   };

    useEffect(() => {
        if (options.length > 0 && value === '') {
            setValue(options[0].value);
            if (onChange) {
                onChange(options[0].value);
            }
        }
    }, [options, onChange, value]);
    

    return (
        <Box sx={{ width: '100%'}}>
            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="experience tabs"
                sx={{ '& .MuiTab-root': { minWidth: 90, fontWeight: 600 } }}
            >
                {options.map((opt) => (
                    <Tab key={opt.value} label={opt.label} value={opt.value} />
                ))}
            </Tabs>
        </Box>
    );
}
