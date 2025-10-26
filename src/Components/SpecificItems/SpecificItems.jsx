import * as React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, Chip
} from '@mui/material';

const rows = [
  { quantity: '10 kg', merchant: 'FreshMart', price: '₹500', date: '2025-06-29' },
  { quantity: '5 L', merchant: 'GreenGrocer', price: '₹300', date: '2025-06-28' },
  { quantity: '2 kg', merchant: 'AgroStore', price: '₹150', date: '2025-06-27' },
];

export default function SpecificItems({ specific }) {
  React.useEffect(() => {
    console.log(specific[0]?.items, "SPE")
  }, [specific])
  return (
    <TableContainer
  component={Paper}
  sx={{
    maxWidth: 900,
    mx: 'auto',
    mt: 6,
    borderRadius: 3,
    boxShadow: 5,
    overflow: 'hidden',
    border: '1px solid #c5e1a5',
  }}
>
  {/* Header */}
  <Typography
    variant="h6"
    align="center"
    sx={{
      background: 'linear-gradient(to right, #2e7d32, #66bb6a)',
      color: 'white',
      py: 2,
      fontWeight: 'bold',
      letterSpacing: 1,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    }}
  >
    {!!specific[0] ? `${specific[0]?.items} of ${specific[0]?.rcat}` : 'Specific Data'}
  </Typography>

  {/* Table */}
  <Table>
    {/* Table Head */}
    <TableHead>
      <TableRow sx={{ backgroundColor: '#e8f5e9' }}>
        {['Quantity', 'Merchant', 'Purchase Price', 'Imported On'].map((heading, index) => (
          <TableCell
            key={index}
            align={index === 0 ? 'left' : 'right'}
            sx={{
              fontWeight: 'bold',
              color: '#1b5e20',
              fontSize: '0.95rem',
              py: 1.5,
            }}
          >
            {heading}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    {/* Table Body */}
    <TableBody>
      {specific.length > 0 ? (
        specific.map((row, index) => (
          <TableRow
            key={index}
            sx={{
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#f1f8e9',
              },
            }}
          >
            <TableCell sx={{ fontWeight: 500 }}>{row.quantity}</TableCell>
            <TableCell align="right">{row.merchant}</TableCell>
            <TableCell align="right">₹ {row.purchase_price}</TableCell>
            <TableCell align="right">{row.createdon}</TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell
            colSpan={4}
            align="center"
            sx={{
              py: 4,
              fontStyle: 'italic',
              color: 'gray',
              backgroundColor: '#f9fbe7',
            }}
          >
            No specific items available.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

  );
}
