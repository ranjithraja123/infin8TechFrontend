import * as React from 'react';
import dayjs from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';

export default function ExpDatePicker(props) {
  const{fromonChange,toonChange} = props
  const [fromDate, setFromDate] = React.useState(dayjs())
  const [toDate, setToDate] = React.useState(dayjs())
  const handleFromChange = (value) => {
    setFromDate(value)
    console.log("From Date:", dayjs(value).format('YYYY-MM-DD'));
    fromonChange(dayjs(value).format('YYYY-MM-DD'))

  }
  const handleToChange = (value) => {
    setToDate(value);
    console.log("To Date:", dayjs(value).format('YYYY-MM-DD'));
    toonChange(dayjs(value).format('YYYY-MM-DD'))
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer
        components={[
          'DatePicker',
          'MobileDatePicker',
          'DesktopDatePicker',
          'StaticDatePicker',
        ]}
      >
        <div className='flex gap-3'>
          <div className='flex flex-col'>

            <label className='text-xl'>From</label>
            <DemoItem>
              <DatePicker defaultValue={dayjs()} value={fromDate} onChange={handleFromChange} />
            </DemoItem>
          </div>

          <div className='flex flex-col'>

            <label className='text-xl'>To</label>
            <DemoItem>
              <DatePicker defaultValue={dayjs()} value={toDate} onChange={handleToChange} />
            </DemoItem>
          </div>
        </div>


      </DemoContainer>
    </LocalizationProvider>
  );
}
