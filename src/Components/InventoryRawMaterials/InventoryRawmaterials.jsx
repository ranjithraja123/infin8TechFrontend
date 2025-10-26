import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';
import { Button, Typography,Box } from '@mui/material';

export default function InventoryRawmaterials({data,setSelected}) {
  // const userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
  // const [data, setData] = React.useState([]);

  // const fetchInventory = async () => {
  //   const response = await axios.get(`http://localhost:3000/api/inventory/overallinventoryProducts/${userInfo.orgid}`);
  //   console.log(response, "RESPONSE");
  //   setData(response.data.data);
  // };

  // React.useEffect(() => {
  //   fetchInventory();
  // }, []);

  const onSelect = (itemid,catid,states) => {
    setSelected({itemid,catid,states})
  }

  return (



<TableContainer
  component={Paper}
  sx={{
    maxWidth: 850,
    mt: 6,
    mx: 'auto',
    borderRadius: 4,
    boxShadow: 4,
    overflow: 'hidden',
    border: '1px solid #dcedc8',
  }}
>
  {/* Header Title */}
  <Typography
    variant="h6"
    align="center"
    sx={{
      backgroundColor: '#33691e', // Deep Elegant Green
      color: 'white',
      py: 2,
      fontWeight: 600,
      fontSize: '1.3rem',
      letterSpacing: 1,
    }}
  >
    Inventory - Raw Materials
  </Typography>

  {/* Table */}
  <Table>
    {/* Table Head */}
    <TableHead>
      <TableRow sx={{ backgroundColor: '#dcedc8' }}> {/* Soft Lime Green */}
        {['Item', 'Category', 'Total Quantity', 'Status', 'Actions'].map((heading, index) => (
          <TableCell
            key={index}
            align={index === 0 ? 'left' : 'right'}
            sx={{
              fontWeight: 600,
              color: '#2e7d32', // Elegant medium green
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
      {data.map((row) => (
        <TableRow
          key={row.itemid}
          sx={{
            '&:hover': {
              backgroundColor: '#f9fbe7', // very light green
              transition: '0.3s ease',
            },
            '&:last-child td': { borderBottom: 0 },
          }}
        >
          <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
            {row.items}
          </TableCell>

          <TableCell align="right">{row.rcat}</TableCell>

          <TableCell align="right">
            <strong>{row.unitQuantity}</strong> {row.unit.toUpperCase()}
          </TableCell>

          <TableCell align="right">
            <Box
              sx={{
                display: 'inline-block',
                backgroundColor: '#c5e1a5', // soft green badge
                color: '#1b5e20',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontWeight: 600,
                fontSize: '0.8rem',
              }}
            >
              In Stock
            </Box>
          </TableCell>

          <TableCell align="right">
            <Button
              size="small"
              variant="contained"
              sx={{
                backgroundColor: '#66bb6a',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 500,
                px: 2,
                '&:hover': {
                  backgroundColor: '#558b2f',
                },
              }}
              onClick={() => onSelect(row.itemid, row.rcatid, row.states)}
            >
              Details
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


  );
}
