import React, { useEffect, useState } from "react";
import RouteNav from "../components/RouteNav";
import ListCard from "../components/ListCard";
import { useGlobalContext } from "../../../context";
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import RawCategoryModal from "../../../Components/RawCategoryModal/rawCategoryModal";
import RawItemModal from "../../../Components/RawItemModal/RawItemModal";
import { toast } from "react-toastify";
import axios from "axios";
import RawItemTable from "../../../Components/RawItemTable/RawItemTable";
import { useSelector, useDispatch } from 'react-redux';
import { fetchMerchants } from "../../../ReduxSlice/merchantSlice";
import '../inventory.css'
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { unitCombinations } from "../../../Combinations/data";


const AddItem = () => {
  const { rawMaterials, setRawMaterials } = useGlobalContext();
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [addedData, setAddedData] = useState([]);
  const [addTableData, setAddTableData] = useState([])
  const [openCategoryModal, setopenCategoryModal] = useState(false);
  const [openSubcategory, setopenSubcategory] = useState(false);
  const [openItemModal, setItemModal] = useState(false);
  const [dataItems, setDataItems] = useState([])
  const [dataCategories, setDataCategories] = useState([])
  const [dataSubCategories, setDataSubCategories] = useState([])
  const [selectedItem, setSelectedItem] = useState([])

  const [selectedCobinations, setCombinations] = useState([])
  const [dataSubcategories, setDataSubcategories] = useState([])
  const [refresh, setRefresh] = useState(false)
  const [catDet, setCatDet] = useState({})
  const merchants = useSelector((state) => state.merchants.data);
  useEffect(() => {
    dispatch(fetchMerchants());
  }, [])

  const [selectedUnits, setSelectedUnits] = useState([]);
  useEffect(() => {
    console.log(formInput.itemName, "formInput")
    console.log(selectedItem, "selectedItem")

  }, [dataItems, selectedItem])

  const handleChange = (event) => {
    const { target: { value } } = event;
    setSelectedUnits(
      typeof value === 'string' ? value.split(',') : value
    );
    delete errors.purchaseUnit;

  };

  useEffect(() => {
    setFormInput(prev => {
      let updatedUnits = [...prev.purchaseUnit];

      selectedUnits.forEach(unit => {
        if (!updatedUnits.includes(unit)) {
          updatedUnits.push(unit);
        }
      });

      updatedUnits = updatedUnits.filter(unit => selectedUnits.includes(unit));

      return {
        ...prev,
        purchaseUnit: updatedUnits
      };
    });
  }, [selectedUnits]);



  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  const [formInput, setFormInput] = useState({
    itemid: "",
    itemName: "",
    catid: "",
    category: "",
    quantity: "",
    state: "",
    quantityUnit: "",
    purchasePrice: "",
    minimumStock: 0,
    minStockUnit: "",
    maximumStock: 0,
    maxStockUnit: "",
    sgst: "",
    cgst: "",
    merchantId: "",
    subcategory: "",
    description: "",
    purchaseUnit: [],
    nLoss: 0,
    hsnCode: "",
    isPrivate: false,
    isExpiry: false
  });

  const numberFields = ['quantity', 'purchasePrice', 'minimumStock', 'maximumStock', 'sgst', 'cgst', 'nLoss'];







  const getItemById = async (itemObj) => {
    console.log(itemObj, "itemObj")
    try {
      const url = `http://localhost:3000/api/rawmaterials/getItemById/${userInfo.orgid}/${itemObj.id}`;
      const response = await axios.get(url);
      if (response.status === 200) {
        console.log(response, "response.status")
        setSelectedItem(response.data.data)
        console.log(response.data.data, "SIMP")

        console.log(response.data.data.consumUnit, "SIMPU")
        setFormInput(prev => ({
          ...prev,
          minimumStock: response.data.data.minStock,
          maximumStock: response.data.data.maxStock,
          minStockUnit: response.data.data.consumUnit,
          maxStockUnit: response.data.data.consumUnit,
        }))
      } else {
        toast.error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        toast.error(`Error: ${error.response.data.message || 'Failed to fetch item'}`);
      } else if (error.request) {
        // Request was made but no response received
        toast.error('No response from server');
      } else {
        // Other error (e.g., in setting up the request)
        toast.error('Error setting up request');
      }
    }
  };



  useEffect(() => {
    console.log(formInput, "formInput")
    if (formInput?.itemName) {
      getItemById(formInput.itemName)
    }
    console.log(selectedItem)
  }, [formInput.itemName])


  useEffect(() => {
    if (selectedItem?.consumUnit) {
      const key = selectedItem.consumUnit.toString().toUpperCase();
      const combination = unitCombinations[key] || [];
      setCombinations(combination);
    } else {
      setCombinations([]); // reset if no unit
    }
  }, [selectedItem]);


  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log(e, "e.target")

    if (name === "itemName") {
      const parsed = JSON.parse(value)
      setFormInput({
        ...formInput,
        itemName: parsed,
        purchaseUnit: [],
      })
      setSelectedUnits([])

      delete errors.itemName;
    } else if (name === "category") {
      const parsed = JSON.parse(value)
      setFormInput({
        ...formInput,
        category: parsed,
      })
      delete errors.category;

    } else if (name === 'subcategory') {
      const parsed = JSON.parse(value)
      console.log("parsed", parsed)
      setFormInput({
        ...formInput,
        subcategory: parsed,
      })
      delete errors.subcategory;


    } else if (name === "merchantId") {
      const parsed = JSON.parse(value)
      setFormInput({
        ...formInput,
        merchantId: parsed,
      })
      delete errors.merchantId;

    }
    else if (name === "state") {
      setFormInput((prev) => ({
        ...prev,
        [name]: value,
        // quantityUnit: "",
        // maxStockUnit: "",
        // minStockUnit: ""
      }))
      delete errors.state;

    }
    else if (name === "isPrivate") {
      const parsedVal = value === "true" ? true : false
      setFormInput(prev => ({
        ...prev,
        [name]: parsedVal
      }
      ))
    }
    else if (name === "isExpiry") {
      const parsedVal = value === "true" ? true : false
      setFormInput(prev => ({
        ...prev,
        [name]: parsedVal
      }
      ))
    }
    else {
      console.log(e.target.name, "ETARNAME")
      console.log(errors, "errro")

      setFormInput({ ...formInput, [e.target.name]: numberFields.includes(e.target.name) ? Number(e.target.value) : e.target.value });
      delete errors[e.target.name];

    }



  };

  const saveItemDetails = () => {
    const newErrors = {};

    if (!formInput?.itemName || formInput.itemName === "") {
      console.log("8")

      newErrors.itemName = "Please enter item name";
    }

    if (!formInput?.category || formInput.category === "") {

      console.log("9")

      newErrors.category = "Please enter category";
    }


    if (!formInput?.subcategory || formInput.subcategory === "") {
      console.log("4")

      newErrors.subcategory = "Please enter subcategory";
    }
    if (!formInput?.state || formInput.state === "") {
      newErrors.state = "Please enter state";
    }
    if (!formInput?.sgst || formInput.sgst === "") {
      console.log("3")

      newErrors.sgst = "Please enter sgst";
    }
    if (!formInput?.cgst || formInput.cgst === "") {
      console.log("2")

      newErrors.cgst = "Please enter cgst";
    }

    if (!formInput?.purchaseUnit || formInput.purchaseUnit.length < 1) {
      console.log("2")

      newErrors.purchaseUnit = "Please enter purchaseUnit";
    }
    if (!formInput?.nLoss) {
      console.log("2")

      newErrors.nLoss = "Please enter nLoss";
    }
    if (!formInput?.hsnCode || formInput.hsnCode === "") {
      console.log("1")
      newErrors.hsnCode = "Please enter hsnCode";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({
        ...prev,
        ...newErrors,
      }));
      return;
    }

    const updatedData = [...addedData, { ...formInput }]

    console.log(updatedData, "updatedData")

    setAddedData(updatedData);

    localStorage.setItem('rawTabledata', JSON.stringify(updatedData));

    setFormInput({
      itemName: "",
      category: "",
      quantity: "",
      quantityUnit: "",
      purchasePrice: "",
      minimumStock: "",
      minStockUnit: "",
      maximumStock: "",
      maxStockUnit: "",
      merchantId: "",
      sgst: "",
      cgst: "",
      isPrivate: false,
      isExpiry: false,
      subcategory: "",
      description: "",
      purchaseUnit: [],
      nLoss: 0,
      hsnCode: "",
    })

  };

  useEffect(() => {
    const savedData = localStorage.getItem('rawTabledata');
    if (savedData) {
      setAddedData(JSON.parse(savedData));
    }
  }, []);

  const saveData = () => {
    if (addedData.length > 0) {
      setRawMaterials([...addedData, ...rawMaterials]);
      setAddedData([]);
    }
  };

  const handleModal = () => {
    setopenCategoryModal(!openCategoryModal)
  }

  const handlesubcategoryModal = () => {
    setopenSubcategory(!openSubcategory)

  }

  const handleItemModal = () => {
    setItemModal(!openItemModal)
  }

  const getItems = async () => {
    try {
      const itemgetResponse = await axios.get(`http://localhost:3000/api/rawmaterials/getItems/${userInfo.orgid}`);
      if (itemgetResponse?.status === 200) {
        setDataItems(itemgetResponse?.data?.data)
      } else {
        toast.success('Something went wrong !')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const getRawCategories = async () => {
    try {
      const categoriesgetResponse = await axios.get(`http://localhost:3000/api/rawmaterials/getCategories/${userInfo.orgid}`);
      if (categoriesgetResponse?.status === 200) {
        setDataCategories(categoriesgetResponse?.data?.data)
      } else {
        toast.success('Something went wrong !')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const getRawSubCategories = async () => {
    try {
      const subcategoriesgetResponse = await axios.get(`http://localhost:3000/api/rawmaterials/getSubcategories/${userInfo.orgid}/${formInput.category.id}`);
      if (subcategoriesgetResponse?.status === 200) {
        setDataSubCategories(subcategoriesgetResponse?.data?.data)
      } else {
        toast.success('Something went wrong !')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  useEffect(() => {
    console.log(formInput, "formInput123")
    if (formInput?.category && formInput.category !== "") {
      getRawSubCategories();
    }
  }, [formInput?.category])


  useEffect(() => {
    getItems()
    getRawCategories()
  }, [refresh])


  const handleSubmit = (e) => {
    e.preventDefault();
    saveItemDetails();
  }



  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };


  return (
    <div className="inventory min-h-screen flex flex-col px-0 sm:px-8 py-6">
      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        <section className="bg-[#F0F2BD] rounded-lg shadow-md w-full lg:w-1/2 overflow-auto p-6 thin-scrollbar">


          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Inventory Materials
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4 max-h-5"
          >
            {formInput.itemName && selectedItem &&
              <div className="flex justify-between">
                <div>
                  <p>Item: {selectedItem.items}</p>
                </div>
                <div>
                  <p>Min. Stock: {selectedItem.minexact} {selectedItem.consumUnit}</p>
                </div>
                <div>
                  <p>Max. Stock: {selectedItem.maxexact} {selectedItem.consumUnit}</p>
                </div>
              </div>

            }

            {/* Item Name */}
            {/* Item Name Select */}
            <div className="flex bg-[#9EBC8A] rounded-md p-2 justify-end">
              <p className="font-bold"> Item Classification</p>
            </div>
            <div className="w-full">

              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  '& label.Mui-focused': {
                    color: 'green',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'green',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'green',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: 'green',
                  },
                }}
              >
                <InputLabel id="item-name-label">Item Name</InputLabel>
                <Select
                  labelId="item-name-label"
                  id="item-name"
                  name="itemName"
                  value={formInput.itemName ? JSON.stringify(formInput.itemName) : ""}
                  onChange={handleInputChange}
                  label="Item Name"
                >
                  {dataItems.map((item) => (
                    <MenuItem
                      key={item._id}
                      value={JSON.stringify({ id: item._id, name: item.items })}
                    >
                      {item.items}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {errors.itemName && (
                <p className="text-sm text-red-500 mt-1">{errors.itemName}</p>
              )}

              <div className="flex justify-end mt-2">
                <Button
                  variant="outlined"
                  sx={{
                    color: 'green',
                    borderColor: 'green',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 128, 0, 0.1)',
                      borderColor: 'green',
                      color: 'green',
                    },
                  }}
                  onClick={handleItemModal}
                >
                  Add Item
                </Button>
              </div>
            </div>

            {/* Category Select */}
            <div className="w-full">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  '& label': {
                    color: 'rgba(0, 0, 0, 0.6)',
                  },
                  '& label.Mui-focused': {
                    color: 'green',
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'green',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'green',
                    },
                  },
                  '& .MuiSelect-icon': {
                    color: 'green',
                  },
                }}
              >
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={formInput.category ? JSON.stringify(formInput.category) : ""}
                  onChange={handleInputChange}
                  label="Category"
                >
                  {dataCategories.map((cat) => (
                    <MenuItem
                      key={cat.rcatid}
                      value={JSON.stringify({ id: cat._id, name: cat.category })}
                    >
                      {cat.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {errors.category && (
                <p className="text-sm text-red-500 mt-1">{errors.category}</p>
              )}

              <div className="flex justify-end mt-2">
                <Button
                  variant="outlined"
                  sx={{
                    color: 'green',
                    borderColor: 'green',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 128, 0, 0.1)',
                      borderColor: 'green',
                      color: 'green',
                    },
                  }}
                  onClick={handleModal}
                >
                  Add Category
                </Button>
              </div>
            </div>

            {/* Subcategory */}

            <div className="w-full">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  '& label': { color: 'rgba(0, 0, 0, 0.6)' },
                  '& label.Mui-focused': { color: 'green' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                    '&:hover fieldset': { borderColor: 'green' },
                    '&.Mui-focused fieldset': { borderColor: 'green' },
                  },
                  '& .MuiSelect-icon': { color: 'green' },
                }}
              >
                <InputLabel id="subcategory-label">Subcategory</InputLabel>
                <Select
                  labelId="subcategory-label"
                  id="subcategory"
                  name="subcategory"
                  // value={formInput.subcategory || ""}
                  onChange={handleInputChange}
                  label="Subcategory"
                >
                  {!formInput.category ? (
                    <MenuItem disabled value="">
                      Please select the category
                    </MenuItem>
                  ) : (
                    dataSubCategories.map((subcat) => (
                      <MenuItem key={subcat.rsubcatid} value={JSON.stringify({ id: subcat._id, name: subcat.subcatname })}
                      >
                        {subcat.subcatname}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>

              {errors.subcategory && (
                <p className="text-sm text-red-500 mt-1">{errors.subcategory}</p>
              )}

              {formInput?.category && (

                <div className="flex justify-end mt-2">
                  <Button
                    variant="outlined"
                    sx={{
                      color: 'green',
                      borderColor: 'green',
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 128, 0, 0.1)',
                        borderColor: 'green',
                        color: 'green',
                      },
                    }}
                    onClick={handlesubcategoryModal}
                  >
                    Add Subcategory
                  </Button>
                </div>)}
            </div>

            <div className="w-full">
              <FormControl
                fullWidth
                variant="outlined"
                sx={{
                  '& label': { color: 'rgba(0, 0, 0, 0.6)' },
                  '& label.Mui-focused': { color: 'green' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'rgba(0, 0, 0, 0.23)' },
                    '&:hover fieldset': { borderColor: 'green' },
                    '&.Mui-focused fieldset': { borderColor: 'green' },
                  },
                  '& .MuiSelect-icon': { color: 'green' },
                }}
              >
                <InputLabel id="state-label">State</InputLabel>
                <Select
                  labelId="state-label"
                  id="state"
                  name="state"
                  value={formInput.state || ""}
                  onChange={handleInputChange}
                  label="State"
                >
                  <MenuItem value="Solid">Solid</MenuItem>
                  <MenuItem value="Liquid">Liquid</MenuItem>
                </Select>
              </FormControl>
              {errors.state && (
                <p className="text-sm text-red-500 mt-1">{errors.state}</p>
              )}

            </div>

            {/* Description Textarea */}
            <div className="flex w-full">
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Description"
                className="w-full border border-gray-400 rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-green-800 focus:border-green-800 hover:border-green-700 transition duration-300"
                onChange={handleInputChange}
                name="description"
              />
            </div>

            <div className="flex bg-[#9EBC8A] rounded-md p-2 justify-end">
              <p className="font-bold"> Price Details </p>
            </div>

            <div className="flex gap-2 w-full">
              {/* Purchase Units (2/3 width) */}
              <div className="w-full flex flex-col">
                <FormControl fullWidth>
                  <InputLabel id="purchase-units-label">Purchase Units</InputLabel>
                  <Select
                    labelId="purchase-units-label"
                    id="purchase-units"
                    name="purchaseUnit"
                    multiple
                    value={selectedUnits}
                    onChange={handleChange}
                    input={<OutlinedInput label="Purchase Units" />}
                    renderValue={(selected) => selected.join(', ')}
                    MenuProps={MenuProps}
                  >
                    {selectedCobinations.map((name) => (
                      <MenuItem key={name} value={name}>
                        <Checkbox checked={selectedUnits.indexOf(name) > -1} />
                        <ListItemText primary={name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.purchaseUnit && (
                  <p className="text-sm text-red-500 mt-1">{errors.purchaseUnit}</p>
                )}
              </div>


            </div>




            {/* Reconciliation price */}
            <div className="flex">
              <div className="flex flex-col w-full">

                <TextField
                  fullWidth
                  id="outlined-normalloss"
                  name="nLoss"
                  type="number"
                  label="Normal Loss(%)"
                  variant="outlined"
                  value={formInput.nLoss}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'green',
                      },
                    },
                    '& label.Mui-focused': {
                      color: 'green',
                    },
                  }}
                />
                {errors.nLoss && (
                  <p className="text-sm text-red-500 mt-1">{errors.nLoss}</p>
                )}              </div>
            </div>


            {/* GST */}
            <div className="flex  gap-2">
              <div className="flex flex-col w-2xl">

                <TextField
                  fullWidth
                  id="outlined-puchasedPrice"
                  name="sgst"
                  type="number"
                  label="SGST in %"
                  variant="outlined"
                  value={formInput.sgst}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'green',
                      },
                    },
                    '& label.Mui-focused': {
                      color: 'green',
                    },
                  }}
                />
                {errors.sgst && <p className="text-sm text-red-500 mt-1">{errors.sgst}</p>}
              </div>

              <div className="flex flex-col w-2xl">

                <TextField
                  fullWidth
                  id="outlined-puchasedPrice"
                  name="cgst"
                  type="number"
                  label="CGST in %"
                  variant="outlined"
                  value={formInput.cgst}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'green',
                      },
                    },
                    '& label.Mui-focused': {
                      color: 'green',
                    },
                  }}
                />
                {errors.cgst && <p className="text-sm text-red-500 mt-1">{errors.cgst}</p>}
              </div>
            </div>

            <div className="flex bg-[#9EBC8A]  rounded-md p-2 justify-end">
              <p className="font-bold">Compliance & Regulatory</p>
            </div>
            {/* isPrivate */}
            <div className="flex flex-col gap-2">
              <div className="flex flex-col w-full">

                <TextField
                  fullWidth
                  id="outlined-puchasedPrice"
                  name="hsnCode"
                  type="string"
                  label="HSN Code"
                  variant="outlined"
                  value={formInput.hsnCode}
                  onChange={handleInputChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: 'green',
                      },
                    },
                    '& label.Mui-focused': {
                      color: 'green',
                    },
                  }}
                />
                {errors.hsnCode && <p className="text-sm text-red-500 mt-1">{errors.hsnCode}</p>}
              </div>

              <div>
                <p>
                  Is this item restricted for internal use only and not visible to floor or kitchen staff?
                </p>
              </div>
              <div>
                <FormControl>
                  {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="isPrivate"
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="For Private use" />
                    <FormControlLabel value="false" control={<Radio />} label="Public" />
                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/* will Expire */}
            <div className="flex flex-col gap-2">

              <div>
                <p>
                  Does this item have an expiry date that needs to be tracked?
                </p>
              </div>
              <div>
                <FormControl>
                  {/* <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel> */}
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="isExpiry"
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="true" control={<Radio />} label="Yes" />
                    <FormControlLabel value="false" control={<Radio />} label="No" />

                  </RadioGroup>
                </FormControl>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-green-800 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-md transition cursor-pointer"
              >
                Add Details
              </button>
            </div>
          </form>
        </section>

        {/* Added Data Section */}
        <section
          className="bg-[#F0F2BD] p-6 rounded-lg shadow-md w-full lg:w-1/2"
        >
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Added Data
          </h2>

          {addedData.length !== 0 ? <RawItemTable addedData={addedData} setAddedData={setAddedData} selectedItem={selectedItem} /> : <div>No Data</div>}

        </section>
      </div>

      {(openCategoryModal || openSubcategory) && (
        <RawCategoryModal
          open={openCategoryModal || openSubcategory}
          handleModal={setopenCategoryModal}
          openCategoryModal={openCategoryModal}
          setopenSubcategory={setopenSubcategory}
          openSubcategory={openSubcategory}
          refresh={setRefresh}
          refreshState={refresh}
          categoryObject={formInput.category}
        />
      )}

      {openItemModal && <RawItemModal open={openItemModal} handleModal={setItemModal} refresh={setRefresh} refreshState={refresh} />}


    </div>
  );
};

export default AddItem;
