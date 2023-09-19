import { React } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "Authentication/UserAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap';


import Login from "Pages/Login";
import ShopDashboard from "Pages/Shops/dashbaord";
import PurchaseEntry from "Pages/PrimaryStore/PurchaseEntry"
import SalesEntry from "Pages/Shops/SalesEntry";
import RequestPage from "Pages/Shops/RequestPage";
import ShopTarget from "Pages/Admin/ShopTarget";
import ShopTableView from "Pages/Shops/ShopTableView";
import AdminDashboard from "Pages/Admin/Admindashboard";
import CreateItem from "Pages/PrimaryStore/CreateItem";
import AdminTableView from "Pages/Admin/AdminTableView";
import PrimaryStoreDashboard from "Pages/PrimaryStore/PrimaryStoreDashboard";
import PrimaryStoreTableView from "Pages/PrimaryStore/PrimaryStoreTableView";
import CreateLogin from "Pages/Admin/CreateLogin";
const Router = () => {
    const { isLoggedIn, login } = useAuth();

    return (
        <>
            <ToastContainer position="top-center"/>
            <BrowserRouter>
                <Routes>
                    {isLoggedIn ? (
                        <>
                            <Route path="/ShopDashboard" element={<ShopDashboard />} />
                            <Route path="/PurchaseEntry" element={<PurchaseEntry />} />
                            <Route path="/SalesEntry" element={<SalesEntry />} />
                            <Route path="/RequestPage" element={<RequestPage />} />
                            <Route path="/ShopTarget" element={<ShopTarget />} />
                            <Route path="/ShopTableView" element={<ShopTableView />} />
                            <Route path="/AdminDashboard" element={<AdminDashboard />} />
                            <Route path="/CreateItem" element={<CreateItem />} />
                            <Route path="/AdminTableView" element={<AdminTableView />} />
                            <Route path="/PrimaryStoreDashboard" element={<PrimaryStoreDashboard />} />
                            <Route path="/PrimaryStoreTableView" element={<PrimaryStoreTableView />} />
                            <Route path="/CreateLogin" element={<CreateLogin />} />
                        </>
                    ) : (
                        <>
                            <Route
                                path="/"
                                element={<Login onLogin={login} />}
                            />
                            <Route
                                path="/Dashboard"
                                element={<Navigate to="/" replace />}
                            />
                        </>
                    )}
                </Routes>
            </BrowserRouter>
        </>
    )

};

export default Router;
