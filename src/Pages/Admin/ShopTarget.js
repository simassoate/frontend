import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
import { toast } from "react-toastify";
import { formatDate } from "Utils/DateUtils";

function ShopTarget() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [shopData, setShopData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedShop, setSelectedShop] = useState('');
    const [selectedTargetItem, setSelectedTargetItem] = useState('');
    const [TargetAmount, setTargetAmount] = useState('');
    const targetItems = ["All", "Salt", "Tea"];

    const token = user.token;
    const userId = user.userId;

    useEffect(() => {
        const fetchData = async () => {
            try {
                
                const shopDataResponse = await fetch(
                    `http://localhost:5003/api/shopDetails/get/allShopDetails?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                        }),
                    }
                );
                if (!shopDataResponse.ok ) {
                    throw new Error("Network response was not ok");
                }

                const shopJson = await shopDataResponse.json();
                setShopData(shopJson);
                
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [token, user.storeID, user.token]);

    const handleSave  = async (e) => {
        e.preventDefault();

        // Calculate the first and last date of the selected month
        const selectedYear = new Date(selectedMonth).getFullYear();
        const selectedMonthIndex = new Date(selectedMonth).getMonth();
        const firstDayOfMonth = new Date(selectedYear, selectedMonthIndex, 1);
        const lastDayOfMonth = new Date(selectedYear, selectedMonthIndex + 1, 0);

        const formattedFirstDayOfMonth = formatDate(firstDayOfMonth);
        const formattedLastDayOfMonth = formatDate(lastDayOfMonth);

        let targetMode = 'Item'
        if(selectedTargetItem === "All"){
            targetMode = "Amount"
        }
        const targetDetails = {
            Target_From:formattedFirstDayOfMonth,
            Target_To:formattedLastDayOfMonth,
            Target_Mode:targetMode,
            Item_Name:selectedTargetItem,
            Amount:TargetAmount,
            Shop_No:user.shopNo,
            Store_ID:user.storeID
        }

        const response = await fetch(`http://localhost:5003/api/targetDetails/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(targetDetails),
        });

        if(response.ok){
            if (response.status === 200){
                toast.success("Target Fixed for the Shop");
                navigate('/ShopDashboard')
            }
        }
        // Handle the form submission logic here
    };

    return (
        <div className="card shadow mb-5">
            <div className="card-header py-3">
                <p className="text-primary m-0 fw-bold" style={{ fontSize: '20px' }}>
                    <Icon.ArrowLeft onClick={() => navigate('/ShopDashboard')} className="edit-icon" />&nbsp; Target Details
                </p>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={handleSave}>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="month" style={{ color: 'rgb(0,0,0)', marginTop: '11px' }}>
                                    <strong>Month and Year</strong>
                                </label>
                                <input
                                    className="form-control"
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    style={{ borderRadius: '14.6px' }}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="shop" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Select Shop</strong>
                                </label>
                                <select
                                    className="form-control"
                                    value={selectedShop}
                                    onChange={(e) => setSelectedShop(e.target.value)}
                                    style={{ borderRadius: '14.6px' }}
                                >
                                    <option value="">Select Shop</option>
                                    {shopData.map((shop) => (
                                        <option key={shop.Shop_No} value={shop.Shop_No}>
                                            {shop.Shop_No}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="targetItem" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Target Item</strong>
                                </label>
                                <select
                                    className="form-control"
                                    value={selectedTargetItem}
                                    onChange={(e) => setSelectedTargetItem(e.target.value)}
                                    style={{ borderRadius: '14.6px' }}
                                >
                                    <option value="">Select Target Item</option>
                                    {targetItems.map((item) => (
                                        <option key={item} value={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="targetValue" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Target Value</strong>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    style={{ borderRadius: '14.6px' }}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <button
                                    className="btn btn-primary btn-sm"
                                    type="submit"
                                    style={{ width: '223px', marginTop: '11px', fontSize: '20px', background: 'var(--bs-teal)', fontWeight: 'bold', borderRadius: '15px', borderWidth: '0px' }}
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopTarget;
