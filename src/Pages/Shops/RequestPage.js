import { React, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
import { toast } from "react-toastify";
import ShopNavbar from "Components/Shops/Navbar";

function RequestPage() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    //Sate handling
    const [purchaseData, setPurchaseData] = useState([]);
    const [item, setItemData] = useState([]);
    const [requestItemData, setRequestItemData] = useState("");
    const [quantity, setQuantity] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");

    const token = user.token;
    const shopNo = user.shopNo;

    //Loading the required Details
    useEffect(() => {
        const fetchData = async () => {
            try {
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

                //Progress Purchase Data
                const purchaseDataResponse = await fetch(
                    `http://localhost:5003/api/purchasedItem/get/filter/getPurcahsedItemNameandSellingPrice?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Shop_No: shopNo
                        }),
                    }
                );

                if (itemDataResponse.status === 401) {
                    navigate('/Login'); // Redirect to the login page
                    // Display a message to inform the user to log in again
                    toast.error('Your session has expired. Please log in again.');
                }
                if (!itemDataResponse.ok || !purchaseDataResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const itemDataJson = await itemDataResponse.json();
                //console.log("Item Data", itemDataJson);
                setItemData(itemDataJson);
                const purchaseDataJson = await purchaseDataResponse.json();
                setPurchaseData(purchaseDataJson);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate, shopNo, token, user.storeID]);

    const handleItemChange = (itemName) => {

        const currentItemSellingPrice = purchaseData.filter(function (data) {
            return data.Item_Name === itemName
        });
        const itemPrice = currentItemSellingPrice ? currentItemSellingPrice[0].Selling_Price : 0;
        setSellingPrice(itemPrice);
    }
    //Submit the item request
    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputDetails = {
            Shop_No: shopNo,
            Item_Name: requestItemData,
            Quantity: quantity,
            Selling_Price: sellingPrice,
            Store_ID: user.storeID,
        };

        // Send a POST request to the login endpoint
        const response = await fetch(`http://localhost:5003/api/itemRequest/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });

        if (response.ok) {
            if (response.status === 200) {
                toast.success('Item Request Sent Successfully');
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
        navigate('/ShopDashboard'); // Redirect to a specific route after submission
    };
    return (
        <>
            <ShopNavbar />
            <div className="card shadow mb-5 mt-5">
                <div className="card-header py-3">
                    <p className="text-primary m-0 fw-bold" style={{ fontSize: "20px" }}>
                        <Icon.ArrowLeft
                            onClick={() =>
                                navigate('/ShopDashboard')
                            }
                            style={{ cursor: 'pointer' }}
                            className="edit-icon"
                        />&nbsp; Request Item</p>
                </div>
                <div className="card-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6">
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="itemList" style={{ color: "rgb(0,0,0)", marginTop: "11px" }}><strong>Item Name</strong></label>
                                        <select
                                            className="form-select"
                                            id="itemList"
                                            value={requestItemData}
                                            onChange={(e) => {
                                                setRequestItemData(e.target.value); // Update the selected item
                                                handleItemChange(e.target.value); // Call handleItemChange to set sellingPrice
                                            }}
                                            style={{ borderRadius: '14.6px' }}
                                            required
                                        >
                                            <option value="">Select Item</option>
                                            {item.map((itemData) => (
                                                <option key={itemData.Item_Name} value={itemData.Item_Name}>
                                                    {itemData.Item_Name}
                                                </option>
                                            ))}
                                        </select>

                                    </div>
                                    <label className="form-label" htmlFor="quantity" style={{ color: "rgb(0,0,0)", marginTop: "21px" }}><strong>Selling Price</strong></label>
                                    <input className="form-control" type="text" style={{ borderRadius: "14.6px" }} value={sellingPrice} readOnly />
                                    <label className="form-label" htmlFor="quantity" style={{ color: "rgb(0,0,0)", marginTop: "21px" }}><strong>Quantity</strong></label>
                                    <input className="form-control" type="text" style={{ borderRadius: "14.6px" }} value={quantity} onChange={(e) => setQuantity(e.target.value)} />

                                    <div className="mb-3"></div>
                                    <div className="mb-3">
                                        <button className="btn btn-primary btn-sm" type="submit" style={{ width: "223px", background: "var(--bs-teal)", fontWeight: "bold", borderRadius: "15px", borderWidth: "0px", fontSize: "18px", marginTop: "6px" }}>Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default RequestPage;
