import * as React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import MaterialModal from "../../Components/MaterialModal/MaterialModal";
import { Chip } from "@mui/material";
import RawMaterialupdateModal from "../../Components/RawMaterialupdateModal/RawMaterialupdateModal";

function Row({ row, addMaterials, onDeleteRow }) {
  const [open, setOpen] = React.useState(false);
  const [openMerchantModal, setOpenMerchantModal] = React.useState(false);
  const [openUpdateModal, setopenUpdateModal] = React.useState(false);

  const [materials, setMaterials] = React.useState([])

  const handleModal = (val) => {
    setOpenMerchantModal(val);
  };

  const handleEdit = (val) => {
    setopenUpdateModal(val);
  };


  const fetchAddedMaterialData = async () => {
    try {
      const itemResponse = await axios.post(`http://localhost:3000/api/rawmaterials/getaddedMaterials`, {
        "item": row.itemid._id,
        "category": row.rcatid._id,
        "subcategory": row.subCategory._id,
        "orgid": row.orgid._id
      });
      console.log(itemResponse.data.data, "itemResponse.data.data")
      if (itemResponse.status === 200) {
        setMaterials(itemResponse.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {

    if (open === true) {
      fetchAddedMaterialData()
    }

  }, [open])


  const handlematerialDelete = async (id) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/rawmaterials/deleteMaterialsByid`,
        { materialId: id }
      );

      if (response.status === 200) {
        setMaterials((prev) => prev.filter((mat) => mat._id !== id));
      }
    } catch (err) {
      console.error("Error deleting material:", err);
    }
  };


  const handleDelete = async (id) => {
    console.log(id, "rawid")
    try {
      const response = await axios.post(
        `http://localhost:3000/api/rawmaterials/deleteInventoryRawMaterials`,
        { rawmaterialid: id }
      );

      if (response.status === 200) {
        onDeleteRow(id)
      }
    } catch (err) {
      console.error("Error deleting Raw-material:", err);
    }
  }

  return (
    <>
      <TableRow
        className="bg-gray-200"
        sx={{
          "& > *": { borderBottom: "unset", padding: "8px 12px" },
          "&:hover": { backgroundColor: "#f5f5f5" },
        }}
      >
        {/* Expand / Collapse Button */}
        <TableCell align="center" sx={{ width: 40 }}>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* Data Fields */}
        <TableCell>{row?.itemid.items}</TableCell>
        <TableCell align="center">{row?.rcatid?.category}</TableCell>
        <TableCell align="center">{row?.subCategory.subcatname}</TableCell>
        <TableCell align="center">{row?.itemid.minStock}</TableCell>
        <TableCell align="center">{row?.itemid.maxStock}</TableCell>
        <TableCell align="center">{row?.minsunit}</TableCell>
        <TableCell align="center">{row?.sgst}%</TableCell>
        <TableCell align="center">{row?.cgst}%</TableCell>
        <TableCell align="center">{row?.state}</TableCell>
        {/* <TableCell align="center">{row?.hsnCode}</TableCell> */}
        <TableCell align="center">
          {row?.isPrivate ? "Yes" : "No"}
        </TableCell>
        <TableCell align="center">{row?.nLoss}%</TableCell>
        <TableCell align="center">
          {Array.isArray(row?.purchaseUnit)
            ? row?.purchaseUnit.join(", ")
            : row?.purchaseUnit}
        </TableCell>
        {/* <TableCell align="center">
          <Chip
            label="In Stock"
            size="small"
            color="success"
            variant="outlined"
          />
        </TableCell> */}

        {row?.totalMaterialAvailable < row?.itemid.minStock ?
          <TableCell align="center">
            <Chip
              label="Out Of Stock"
              size="small"
              color="danger"
              variant="outlined"
            />
          </TableCell> : <TableCell align="center">
            <Chip
              label="In Stock"
              size="small"
              color="success"
              variant="outlined"
            />
          </TableCell>

        }



        {/* Actions */}
        <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
          <IconButton color="primary" onClick={() => handleEdit(true)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(row._id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton color="secondary" onClick={() => handleModal(true)}>
            <AddIcon fontSize="small" />
          </IconButton>
        </TableCell>
      </TableRow>


      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={16}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, transition: "ease-in-out 0.3s" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                fontWeight={600}
              >
                Purchase History
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    {/* <TableCell>Invoice No.</TableCell> */}
                    <TableCell>Merchant</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Unit Price</TableCell>
                    <TableCell>Total Amount</TableCell>
                    <TableCell>SGST</TableCell>
                    <TableCell>CGST</TableCell>
                    <TableCell>Payment</TableCell>
                    <TableCell>In Cons. Unit</TableCell>
                    <TableCell>Price/cons. unit</TableCell>
                    <TableCell>Remaining</TableCell>
                    <TableCell>Action</TableCell>

                  </TableRow>
                </TableHead>


                <TableBody>
                  {/* Example static rows */}
                  {materials.map((mat) => (
                    <TableRow>
                      <TableCell>
                        {new Date(mat.date).toLocaleString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      {/* <TableCell>{mat.invoiceNumber === "" ? "-" : mat.invoiceNumber}</TableCell> */}
                      <TableCell>{mat.merchant.merchant}</TableCell>
                      <TableCell>{mat.quantity}</TableCell>
                      <TableCell>{mat.unit}</TableCell>
                      <TableCell>{mat.unitPrice}</TableCell>
                      <TableCell>{mat.totalAmount}</TableCell>
                      <TableCell>{mat.sgst}</TableCell>
                      <TableCell>{mat.cgst}</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>{mat.inConsumUnit} {row.itemid.consumUnit}</TableCell>
                      <TableCell>{mat.pricePerConsumptionUnit}</TableCell>
                      <TableCell>{mat.remainingQuantity} {row.itemid.consumUnit}</TableCell>

                      <TableCell> <IconButton onClick={() => handlematerialDelete(mat._id)}>
                        <DeleteIcon />
                      </IconButton></TableCell>

                    </TableRow>
                  ))}

                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>

        {/* Your modal */}

      </TableRow>
      <MaterialModal
        open={openMerchantModal}
        handleModal={setOpenMerchantModal}
        row={row}
      />

      <RawMaterialupdateModal open={openUpdateModal} handleModal={setopenUpdateModal} row={row} materials={materials} />
    </>

  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};

export default function AddProducts() {
  const [materials, setMaterials] = React.useState([]);
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const [input, setInput] = React.useState({
    date: "",
    invoice: "",
    merchant: "",
    quantity: "",
    unit: "",
    total: "",
    sgst: "",
    cgst: "",
    consumptionUnit: "",
    maxStock: "",
    minStock: "",
    quantityAsConsumption: null

  })

  // const [openMerchantModal, setOpenMerchantModal] = React.useState(false);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchMaterialData = async () => {
    try {
      let materialResponse = await axios.get(
        `http://localhost:3000/api/rawmaterials/getMaterials/${userInfo.orgid}`
      );
      if (materialResponse.status) {
        setMaterials(materialResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  React.useEffect(() => {
    fetchMaterialData();
  }, []);

  const addMaterials = (e) => {

  }


  const onDeleteRow = async (id) => [
    setMaterials((prev) => prev.filter((mat) => mat._id !== id))

  ]



  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ borderRadius: 2, overflowX: "auto" }}
    >
      <Table aria-label="collapsible table" size={isMobile ? "small" : "medium"}>
        <TableHead className="bg-green-900">
          <TableRow>
            <TableCell />
            <TableCell sx={{ color: "#fff" }}>Item</TableCell>
            <TableCell align="right" sx={{ color: "#fff" }}>
              Category
            </TableCell>
            {!isMobile && (
              <>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Subcategory
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Min. Stock
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Max. Stock
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Cons. Unit
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  SGST
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  CGST
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  State
                </TableCell>
                {/* <TableCell align="right" sx={{ color: "#fff" }}>
                  HSN Code
                </TableCell> */}
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Private
                </TableCell>
                <TableCell align="right" sx={{ color: "#fff" }}>
                  Nat. Loss
                </TableCell>
                <TableCell align="center" sx={{ color: "#fff" }}>
                  Units
                </TableCell>
              </>
            )}
            <TableCell align="center" sx={{ color: "#fff" }}>
              Status
            </TableCell>
            <TableCell align="center" sx={{ color: "#fff" }}>
              Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materials.map((row) => (
            <Row key={row.rawid} row={row} addMaterials={addMaterials} onDeleteRow={onDeleteRow} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
