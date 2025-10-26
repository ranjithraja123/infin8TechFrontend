import React, { useState } from 'react';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTableColumns,
  faSquarePollVertical,
  faGear,
  faRightFromBracket,
  faStore,
} from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { logout } from '../ReduxSlice/authSlice';
import { GrUserAdmin } from "react-icons/gr";
import { FaBars, FaTimes } from "react-icons/fa"; // 👈 hamburger + close icons
import MerchantModal from '../Components/MerchantModal/MerchantModal';

const Navbar = () => {
  const user = useSelector((state) => state?.auth?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openMerchantModal, setOpenMerchantModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // 👈 mobile menu toggle

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || null;

  const handleLogout = async () => {
    try {
      const response = await axios.post(`http://localhost:3000/api/auth/logout`, {
        userid: userInfo?.wallid
      });

      if (response.status === 200) {
        sessionStorage.clear();
        dispatch(logout());
        toast.success(response?.data?.message);
        navigate('/');
      }
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <div className="w-full bg-green-800 flex items-center justify-between px-6 py-4 shadow-lg fixed top-0 left-0 z-50">
      {/* Logo */}
      <h2 className="text-3xl italic font-bold bg-gradient-to-r from-white via-gray-600 to-yellow-600 bg-clip-text text-transparent">
        exp.wall
      </h2>

      {/* Desktop Menu */}
      <ul className="hidden md:flex items-center gap-8">
        <li className="text-white text-lg hover:text-yellow-300 cursor-pointer" onClick={() => setOpenMerchantModal(true)}>
          <FontAwesomeIcon icon={faStore} /> Add Merchant
        </li>
        <Link to='/home/expenses' className="text-white text-lg hover:text-yellow-300">
          <FontAwesomeIcon icon={faGear} /> Expense
        </Link>
        <li className="text-white text-lg hover:text-yellow-300 cursor-pointer">
          <FontAwesomeIcon icon={faTableColumns} /> Dashboard
        </li>
        <Link to="/inventory" className="text-white text-lg hover:text-yellow-300">
          <FontAwesomeIcon icon={faSquarePollVertical} /> Inventory
        </Link>
        <Link to="/statistics" className="text-white text-lg hover:text-yellow-300">
          <FontAwesomeIcon icon={faSquarePollVertical} /> Statistics
        </Link>
        <Link to='/home/recepies' className="text-white text-lg hover:text-yellow-300">
          <FontAwesomeIcon icon={faGear} /> Recepies
        </Link>
        <Link to='/home/tables' className="text-white text-lg hover:text-yellow-300">
          <FontAwesomeIcon icon={faGear} /> Tables
        </Link>
        <Link to='/home/requests' className="flex items-center gap-2 text-white text-lg hover:text-yellow-300">
          <GrUserAdmin />
          <span>Requests</span>
        </Link>
      </ul>

      {/* Right side - Profile + Logout (desktop) */}
      <div className="hidden md:flex items-center gap-6">
        <div className="flex items-center gap-3">
         
          <span className="text-white font-semibold">Hi, Ranjith</span>
        </div>
        <h2
          className="text-yellow-400 font-semibold cursor-pointer hover:text-yellow-600"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faRightFromBracket} /> Logout
        </h2>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-green-600 flex flex-col items-center gap-6 py-6 md:hidden z-40">
          <li className="text-white text-lg hover:text-yellow-300 cursor-pointer" onClick={() => { setOpenMerchantModal(true); setMenuOpen(false); }}>
            <FontAwesomeIcon icon={faStore} /> Add Merchant
          </li>
          <Link to='/home/expenses' onClick={() => setMenuOpen(false)} className="text-white text-lg hover:text-yellow-300">
            <FontAwesomeIcon icon={faGear} /> Expense
          </Link>
          <Link to="/inventory" onClick={() => setMenuOpen(false)} className="text-white text-lg hover:text-yellow-300">
            <FontAwesomeIcon icon={faSquarePollVertical} /> Inventory
          </Link>
          <Link to="/statistics" onClick={() => setMenuOpen(false)} className="text-white text-lg hover:text-yellow-300">
            <FontAwesomeIcon icon={faSquarePollVertical} /> Statistics
          </Link>
          <Link to='/home/recepies' onClick={() => setMenuOpen(false)} className="text-white text-lg hover:text-yellow-300">
            <FontAwesomeIcon icon={faGear} /> Recepies
          </Link>
          <Link to='/home/tables' onClick={() => setMenuOpen(false)} className="text-white text-lg hover:text-yellow-300">
            <FontAwesomeIcon icon={faGear} /> Tables
          </Link>
          <Link to='/home/requests' onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-white text-lg hover:text-yellow-300">
            <GrUserAdmin />
            <span>Requests</span>
          </Link>
          <div className="flex flex-col items-center gap-3 mt-4">
            <img
              className="rounded-full bg-gray-500 w-10 h-10"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNjyPJaqjGEjkumCW-YLx8E0LJQuqoCxIIew&s"
              alt="User"
            />
            <span className="text-white font-semibold">Hi, Ranjith</span>
            <h2
              className="text-yellow-400 font-semibold cursor-pointer hover:text-yellow-600"
              onClick={handleLogout}
            >
              <FontAwesomeIcon icon={faRightFromBracket} /> Logout
            </h2>
          </div>
        </div>
      )}

      <MerchantModal open={openMerchantModal} handleModal={setOpenMerchantModal} />
    </div>
  );
};

export default Navbar;
