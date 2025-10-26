import React from 'react';
import './App.css';
import Navbar from './Navbar/Navbar';
import Dashboard from './Pages/Dashboard/Dashboard.jsx';
import Login from './Pages/Login/Login';
import { Route, Routes } from 'react-router-dom';
import Signup from './Pages/Signup/Signup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Expense from './Pages/Expenses/Expense';
import { Outlet } from 'react-router-dom';
import Requests from './Pages/Requests/Requests';
import Inventory from './Pages/inventory/Inventory';
import RawMaterials from './Pages/inventory/pages/RawMaterials';
import AddItem from './Pages/inventory/pages/AddItem';
import AddPurchaseItem from './Pages/inventory/pages/AddPurchaseItem';
import PurchaseOrder from './Pages/inventory/pages/PurchaseOrder';
import SalesPage from './Pages/inventory/pages/SalesPage';
import AddRecipiesForm from './Pages/inventory/pages/AddRecipiesForm';
import AddSalesForm from './Pages/inventory/pages/AddSalesForm';
import Recepies from './Components/Recepies/Recepies.jsx';
import Tables from './Components/Tables/Tables.jsx';

function App() {
  return (
    <div className="w-screen h-screen">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<DashboardLayOut />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expense />} />
          <Route path="requests" element={<Requests />} />
          <Route path="recepies" element={<Recepies />} />
          <Route path="tables" element={<Tables />} />
        </Route>

        <Route path="/inventory" element={<DashboardLayOut />}>
          <Route index element={<Inventory />} />
          <Route path="raw-materials">
            <Route index element={<RawMaterials />} />
            <Route path="add-item" element={<AddItem />} />
          </Route>
          <Route path="purchase-order">
            <Route index element={<PurchaseOrder />} />
            <Route path="add-item/:itemIdP" element={<AddPurchaseItem />} />
          </Route>
          <Route path="sales">
            <Route index element={<SalesPage />} />
            <Route path="add-recipe" element={<AddRecipiesForm />} />
            <Route path="add-sales" element={<AddSalesForm />} />
          </Route>
        </Route>
      </Routes>
      <ToastContainer />
    </div>
  );
}

function DashboardLayOut() {
  return (
    <div className="flex flex-col w-screen h-screen">
      {/* Navbar fixed at top */}
      <Navbar />
      {/* Main content with padding to avoid overlap */}
      <div className="flex-1 overflow-auto pt-20 px-4">
        <Outlet /> {/* Child routes render here */}
      </div>
    </div>
  );
}

export default App;
