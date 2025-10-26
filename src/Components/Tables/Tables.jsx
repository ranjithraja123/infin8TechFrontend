import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Grid,
  Button,
  IconButton,
  Badge,
  MenuItem,
  Select,
  Tooltip,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";

const Tables = () => {
  const initialTables = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Table ${i + 1}`,
    capacity: [2, 4, 6, 8][i % 4],
  }));

  const [tables] = useState(initialTables);
  const [orders, setOrders] = useState({});
  const [menu, setMenu] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});

  const user = JSON.parse(sessionStorage.getItem("userInfo"));

  const calculateBill = (tableId) => {
    const items = orders[tableId] || [];
    return items.reduce((sum, item) => sum + item.price, 0);
  };

  const served = async (tableId, idx) => {

    const item = orders[tableId]?.[idx];

    if (!item || !item._id) return;

    const servingsArr = item.ingredients.map((ingredient) => ({
      rawmaterial: ingredient.itemId,
      orgid: item.orgid,
      unitstoreduce: ingredient.quantity
    }))

    const res = await axios.post(
      `http://localhost:3000/api/rawmaterials/served`,
      { servingsArr }, // send as array inside body
      { headers: { "Content-Type": "application/json" } }
    );
    if (res.status === 200) {
      setOrders((prev) => {
        const updated = [...(prev[tableId] || [])];
        updated[idx] = { ...updated[idx], served: true };
        return { ...prev, [tableId]: updated };
      });
    } else {
      alert("Failed to mark as served");
    }
  };

  const deleteItem = (tableId, idx) => {
    setOrders((prev) => {
      const updated = [...(prev[tableId] || [])];
      updated.splice(idx, 1);
      return { ...prev, [tableId]: updated };
    });
  };

  const getFood = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/recepie/getOrgFoods/${user.orgid}/${user.wallid}`,
        { headers: { "Cache-Control": "no-cache" } }
      );
      if (res.status === 200) {
        setMenu(res.data.data.filter((item) => item.status === "A"));
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    getFood();
  }, []);

  const handleAddItem = (tableId, itemId) => {
    const item = menu.find((m) => m._id === itemId);
    if (!item) return;
    setOrders((prev) => {
      const prevItems = prev[tableId] || [];
      return { ...prev, [tableId]: [...prevItems, { ...item }] };
    });
    setSelectedItem({ ...selectedItem, [tableId]: "" });
  };

  return (
    <Box sx={{ p: 3, background: "#f5f5f5", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
        🍽️ Table Management
      </Typography>

      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={3} key={table.id}>
            <Card sx={{ p: 2, borderRadius: 3, background: "#fff" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Box>
                  <Typography variant="h6">{table.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Capacity: {table.capacity}
                  </Typography>
                </Box>
                <Badge
                  color={
                    (orders[table.id]?.some((o) => !o.served) && "warning") ||
                    (orders[table.id]?.length > 0 && "success") ||
                    "default"
                  }
                  badgeContent={orders[table.id]?.length || 0}
                />
              </Box>

              {/* Menu Selector */}
              <Select
                fullWidth
                size="small"
                value={selectedItem[table.id] || ""}
                displayEmpty
                onChange={(e) => handleAddItem(table.id, e.target.value)}
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>
                  ➕ Add Item
                </MenuItem>
                {menu.map((item) => (
                  <MenuItem key={item._id} value={item._id}>
                    {item.title} - ₹{item.price}
                  </MenuItem>
                ))}
              </Select>

              {/* Orders List */}
              <Box sx={{ maxHeight: 220, overflowY: "auto", mb: 2 }}>
                {orders[table.id]?.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      borderRadius: 2,
                      background: item.served ? "#e0e0e0" : "#e8f5e9",
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ textDecoration: item.served ? "line-through" : "none" }}
                    >
                      {item.title}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Typography variant="body2">₹{item.price}</Typography>
                      {!item.served && (
                        <Tooltip title="Mark as Served">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() => served(table.id, idx)}
                          >
                            <DoneIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => deleteItem(table.id, idx)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Footer */}
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Total: ₹{calculateBill(table.id)}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{ background: "#1976d2" }}
                onClick={() => alert(`Bill Generated: ₹${calculateBill(table.id)}`)}
              >
                Generate Bill
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Tables;
