import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    IconButton
} from "@mui/material";
// import {
//   Box,
//   Collapse,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Paper,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import FoodModal from "../FoodModal/FoodModal";
// import IngredientModal from "../IngredientModal/IngredientModal"; // import IngredientModal
import axios from "axios";
import { toast } from "react-toastify";
import IngredientsModal from "../IngredientsModal/IngredientsModal";
import SwitchComp from "../Switch/Switch";
// import IngredientsModalModal from "../IngredientsModal/IngredientsModal";

export default function AnimatedMenu() {
    let user = JSON.parse(sessionStorage.getItem("userInfo"));

    const [menu, setMenu] = useState([]);
    const [openFoodModal, setOpenFoodModal] = useState(false);
    const [openIngredientModal, setOpenIngredientModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);

    const getFood = async () => {
        try {
            const res = await axios.get(
                `http://localhost:3000/api/recepie/getOrgFoods/${user.orgid}/${user.wallid}`, { headers: { "Cache-Control": "no-cache" } }
            );
            if (res.status === 200) {
                setMenu(res.data.data);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => {
        if (!openFoodModal && !openIngredientModal) {
            getFood();
        }
    }, [openFoodModal, openIngredientModal]);
    useEffect(() => {
        console.log("SE", selectedFood)

    }, [selectedFood])

    const handleDelete = async (id) => {
        try {
            console.log(id, "recidrecid")
            const res = await axios.post(
                `http://localhost:3000/api/recepie/deleteFood/${user.orgid}/${user.wallid}`, {
                recid: id,
                status: "IA"
            }, { headers: { "Cache-Control": "no-cache" } }
            );
            console.log(res, "resres")
            if (res.status === 200) {
                toast.error('Updated to inactive')
                getFood();

            }
        } catch (error) {
            toast.error('Unable to delete')
        }
    }

    const handleEdit = async (food) => {
        setSelectedFood(food);   // store food to edit

        setOpenFoodModal(true)
    }

    const handleOpenmodal = async () => {
        setSelectedFood(null);
        setOpenFoodModal(true)
    }

    return (
        <Box
            sx={{
                // background: "linear-gradient(135deg, #f9f7f7, #e3e6e9, #d4cfcf)",
                backgroundAttachment: "fixed",
                minHeight: "100vh",
                py: 6,
                px: 2,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ px: { xs: 2, md: 4 }, mb: 4 }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        color: "#2e7d32",
                        fontWeight: "bold",
                        letterSpacing: "1px",
                        textShadow: "2px 2px 6px rgba(0,0,0,0.15)",
                    }}
                >
                    🍃 Signature Menu
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        color: "#4caf50",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "0.3s",
                        "&:hover": { transform: "scale(1.2)", color: "#2e7d32" },
                    }}
                    onClick={handleOpenmodal}
                >
                    +
                </Typography>
            </Box>

            {/* Menu Grid */}
            <Grid container spacing={3} sx={{ px: { xs: 2, sm: 4 } }}>
                {menu.map((item, index) => {
                    const isInactive = item.status === "IA"; // check inactive

                    return (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                            <SwitchComp id={item._id} isActive={item.status} getFood={getFood}/>
                            <motion.div whileHover={!isInactive ? { scale: 1.05 } : {}} whileTap={!isInactive ? { scale: 0.95 } : {}}>
                                <Card
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        height: "100%",
                                        backgroundColor: isInactive ? "#f5f5f5" : "#fff",
                                        opacity: isInactive ? 0.6 : 1,
                                        pointerEvents: isInactive ? "none" : "auto", // block clicks
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                                        transition: "0.3s",
                                        "&:hover": {
                                            boxShadow: isInactive ? "0 6px 20px rgba(0,0,0,0.1)" : "0 10px 30px rgba(0,0,0,0.2)",
                                        },
                                    }}
                                >
                                    {/* Food Image */}
                                    <Box
                                        component="img"
                                        src={
                                            item.image?.filepath
                                                ? `http://localhost:3000/api/uploads/${item.image.filepath}`
                                                : "https://via.placeholder.com/400x250"
                                        }
                                        alt={item.title}
                                        sx={{ width: "100%", height: 180, objectFit: "cover" }}
                                    />

                                    {/* Card Content */}
                                    <CardContent sx={{ flexGrow: 1, p: 2 }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                            <Typography
                                                variant="h6"
                                                sx={{ fontWeight: "bold", color: "#1b5e20", mb: 1 }}
                                            >
                                                {item.title}
                                            </Typography>
                                            <Box sx={{ display: "flex" }}>
                                                <IconButton onClick={() => handleDelete(item._id)} disabled={isInactive}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton onClick={() => handleEdit(item)} disabled={isInactive}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{ color: "text.secondary", mb: 2 }}
                                            noWrap
                                        >
                                            {item.description}
                                        </Typography>
                                    </CardContent>

                                    {/* Price & Add Ingredients */}
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            p: 2,
                                            borderTop: "1px solid #eee",
                                            backgroundColor: "#fafafa",
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{ color: "#2e7d32", fontWeight: "bold" }}
                                        >
                                            ₹{item.price}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            disabled={isInactive}
                                            sx={{
                                                background: isInactive
                                                    ? "grey"
                                                    : "linear-gradient(45deg, #66bb6a, #43a047)",
                                                "&:hover": {
                                                    background: isInactive
                                                        ? "grey"
                                                        : "linear-gradient(45deg, #43a047, #2e7d32)",
                                                },
                                                borderRadius: "20px",
                                                textTransform: "none",
                                                px: 2,
                                            }}
                                            onClick={() => {
                                                if (!isInactive) {
                                                    setSelectedFood(item);
                                                    setOpenIngredientModal(true);
                                                }
                                            }}
                                        >
                                            +
                                        </Button>
                                    </Box>
                                </Card>
                            </motion.div>
                        </Grid>
                    );
                })}

            </Grid>

            {/* Modals */}
            <FoodModal open={openFoodModal} handleModal={setOpenFoodModal} food={selectedFood} />
            <IngredientsModal
                open={openIngredientModal}
                handleModal={setOpenIngredientModal}
                food={selectedFood} // pass selected food
            />
        </Box>
    );
}
