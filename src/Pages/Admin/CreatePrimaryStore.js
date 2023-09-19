import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
import { toast } from "react-toastify"
//import useAuthorization from "Authentication/Authorization"
import { formatDate } from "Utils/DateUtils";
import PrimaryStoreNavbar from "Components/PrimaryStore/PrimaryStoreNavbar";

function PurchaseEntry() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [shopData, setShopData] = useState([]);
    const [itemData, setItemData] = useState([]);

    // Input Details
    const [purchaseNo, setPurchaseNo] = useState("");
    const [selectedShop, setSelectedShop] = useState("");
    const [selectedItem, setSelectedItem] = useState("");
    const [purchaseQuantity, setPurchaseQuantity] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [totalPurchaseAmount, setTotalPurchaseAmount] = useState(""); // Initialize to an empty string
    const [description, setDescription] = useState("");
    const [date, setDate] = useState(formatDate(new Date())); // Initialize with the current date

    const token = user.token;
    const userId = user.userId;

    // Calculate total purchase amount whenever purchase quantity or item rate changes
    useEffect(() => {
        if (purchaseQuantity !== "" && sellingPrice !== "") {
            const totalAmount = parseFloat(purchaseQuantity) * parseFloat(sellingPrice);
            setTotalPurchaseAmount(totalAmount.toFixed(2));
        } else {
            setTotalPurchaseAmount(""); // Reset total amount if either input is empty
        }
    }, [purchaseQuantity, sellingPrice]);
    // Loading the required Details
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
                const itemDataResponse = await fetch(
                    `http://localhost:5003/api/items/get/allItemDetails?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Required_Details: "All",
                            Required_Status: "True"
                        }),
                    }
                );
                const purchaseNoResponse = await fetch(
                    `http://localhost:5003/api/purchasedItem/get/purchasedNo?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Required_Details: "All",
                            Required_Status: "True"
                        }),
                    }
                );

                if (shopDataResponse.status === 401) {
                    navigate('/'); // Redirect to the login page
                    // Display a message to inform the user to log in again
                    toast.error('Your session has expired. Please log in again.');
                }

                if (!shopDataResponse.ok || !itemDataResponse.ok || !purchaseNoResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const shopJson = await shopDataResponse.json();
                setShopData(shopJson);
                const itemJson = await itemDataResponse.json();
                setItemData(itemJson);
                const purchaseNo = await purchaseNoResponse.json();
                setPurchaseNo(purchaseNo);
                console.log("purchaseNo:", purchaseNo);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate, token, user.storeID, user.token]);
    //Submit the purchase entry.
    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Date:", date);
        console.log("Selected Shop:", selectedShop);
        console.log("Selected Item:", selectedItem);
        console.log("Purchase Quantity:", purchaseQuantity);
        console.log("Selling Price:", sellingPrice);
        console.log("Total Purchase Amount:", totalPurchaseAmount);

        const inputDetails = {
            Purchase_No: purchaseNo.purchaseNo,
            Date_of_Entry: date,
            Shop_No: selectedShop,
            Item_Name: selectedItem,
            Quantity: purchaseQuantity,
            Selling_Price: sellingPrice,
            Total_Amount: totalPurchaseAmount,
            Description: description,
            User_ID: userId,
            Store_ID: user.storeID,
        };

        // Send a POST request to the login endpoint
        const response = await fetch(`http://localhost:5003/api/purchasedItem/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });

        if (response.ok) {
            if (response.status === 200) {
                toast.success('Successfuly Saved Purchase Item');
            }
        }
        else {
            // Handle login error
            const errorData = await response.json();
            console.log('error:', errorData);
            toast.error(errorData);
            // Display error message or perform other actions
        }
        // Redirect or perform other actions as needed
        //navigate('/PrimaryStoreDashboard'); // Redirect to a specific route after submission
    };

    return (
        <>
            <PrimaryStoreNavbar />
            <div className="card shadow  container-fluid mt-5" style={{ borderWidth: '1px' }}>
                <div className="card-header py-3">
                    <p className="text-primary m-0 fw-bold" style={{ fontSize: '20px' }}>
                        <Icon.ArrowLeft
                            onClick={() =>
                                navigate('/PrimaryStoreDashboard')
                            }
                            className="edit-icon"
                            style={{ cursor: 'pointer' }}
                        />&nbsp; Purchase Entry
                    </p>
                </div>
                <div className="card-body" style={{ borderRadius: '19px' }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="date" style={{ color: 'rgb(0,0,0)', marginTop: '11px' }}>
                                            <strong>Date *</strong>
                                        </label>
                                        <input
                                            className="form-control"
                                            type="date"
                                            id="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ borderRadius: '14.6px' }}
                                        />
                                        <label className="form-label" htmlFor="shop" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                            <strong>Shop No *</strong>
                                        </label>
                                        <div className="dropdown">
                                            <select
                                                className="form-select"
                                                id="shop"
                                                value={selectedShop}
                                                onChange={(e) => setSelectedShop(e.target.value)}
                                                style={{ borderRadius: '14.6px' }}
                                                required
                                            >
                                                <option value="">Select a shop</option>
                                                {shopData.map((shop) => (
                                                    <option key={shop.Shop_No} value={shop.Shop_No}>
                                                        {shop.Shop_No}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <label className="form-label" htmlFor="item" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                            <strong>Item Name *</strong>
                                        </label>
                                        <div className="dropdown">
                                            <select
                                                className="form-select"
                                                id="item"
                                                value={selectedItem}
                                                onChange={(e) => setSelectedItem(e.target.value)}
                                                style={{ borderRadius: '14.6px' }}
                                                required
                                            >
                                                <option value="">Select an item</option>
                                                {itemData.map((item) => (
                                                    <option key={item.Item_Name} value={item.Item_Name}>
                                                        {item.Item_Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <label className="form-label" htmlFor="purchaseQuantity" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                        <strong>Purchase Quantity *</strong>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="Number"
                                        id="purchaseQuantity"
                                        value={purchaseQuantity}
                                        onChange={(e) => setPurchaseQuantity(e.target.value)}
                                        style={{ borderRadius: '14.6px' }}
                                        required
                                    />
                                    <label className="form-label" htmlFor="sellingPrice" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                        <strong>Selling Price *</strong>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="Number"
                                        id="sellingPrice"
                                        value={sellingPrice}
                                        onChange={(e) => setSellingPrice(e.target.value)}
                                        style={{ borderRadius: '14.6px' }}
                                        required
                                    />
                                    <label className="form-label" htmlFor="totalPurchaseAmount" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                        <strong>Total Purchase Amount</strong>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="totalPurchaseAmount"
                                        value={totalPurchaseAmount}
                                        readOnly // Make it read-only to prevent manual input
                                        style={{ borderRadius: '14.6px' }}
                                    />
                                    <label className="form-label" htmlFor="description" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                        <strong>Description</strong>
                                    </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        style={{ borderRadius: '14.6px' }}
                                    />
                                    <div className="mb-3"></div>
                                    <div className="mb-3">
                                        <button className="btn btn-primary btn-sm" type="submit" style={{ width: '223px', borderRadius: '15px', fontWeight: 'bold', fontSize: '18px', background: 'var(--bs-teal)', borderWidth: '0px', marginTop: '6px' }}>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PurchaseEntry;
