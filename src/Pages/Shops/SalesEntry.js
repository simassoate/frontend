import { React, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
import { toast } from "react-toastify"

import itemSoap from 'Assets/Images/ItemSoap.gif'; // Import the image
import { formatDate } from "Utils/DateUtils";
import ShopNavbar from "Components/Shops/Navbar";


function SalesEntry() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [purchaseData, setPurchaseData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [salesNo, setSalesNo] = useState([]);
    const [selectedGroupInputs, setSelectedGroupInputs] = useState([]); // Track selected Group_Name
    const [inputValues, setInputValues] = useState({}); // Store input values
    const [showSolutionForm, setShowSolutionForm] = useState(false);
    const [uniqueGroupNames, setuniqueGroupNames] = useState([]);
    const [date, setDate] = useState(formatDate(new Date()));


    const token = user.token;
    const userId = user.userId;
    const shopNo = user.shopNo;

    // Loading the required Details
    useEffect(() => {
        const fetchData = async () => {
            try {
                //Purchase Data
                const purchaseDataResponse = await fetch(
                    `http://localhost:5003/api/purchasedItem/get/filter/purchaseStatus?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Shop_No: shopNo,
                            Status: "Progress"
                        }),
                    }
                );
                //Item Data
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
                //Sales Data
                const salesDataResponse = await fetch(
                    `http://localhost:5003/api/salesItem/get/allSalesItemDetails?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Shop_No: shopNo,
                        }),
                    }
                );
                //Sales No
                const salesNoResponse = await fetch(
                    `http://localhost:5003/api/salesItem/get/salesNo?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID
                        }),
                    }
                );

                //CHeck  the response
                if (!purchaseDataResponse.ok || !itemDataResponse.ok || !salesDataResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const purchaseDataJson = await purchaseDataResponse.json();
                const itemDataJson = await itemDataResponse.json();
                const salesDataJson = await salesDataResponse.json();
                const salesNoJson = await salesNoResponse.json();

                /* For developing Purpose 
                console.log("Purchase Data", purchaseDataJson);
                console.log("Item Data", itemDataJson);
                console.log("Sales Data", salesDataJson);
                console.log("Sales No", salesNoJson);
                console.log("Purchase Data", purchaseDataJson); */

                // Use a Set to collect unique Group_Name values
                const uniqueGroupNames = new Set();

                // Loop through the data and add Group_Name to the Set
                itemDataJson.forEach((item) => {
                    uniqueGroupNames.add(item.Group_Name);
                });

                const uniqueGroups = Array.from(uniqueGroupNames);

                // Set it in the state
                setuniqueGroupNames(uniqueGroups);
                setPurchaseData(purchaseDataJson);
                setItemData(itemDataJson);
                setSalesData(salesDataJson);
                setSalesNo(salesNoJson);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [shopNo, token, user.storeID]);

    /* const handleCardClick = (groupName) => {
        console.log("card clicked")
        const groupItems = itemData.filter(function (data) {
            return data.Group_Name === groupName
        })

        const inpuEntryDetails = [];

        for (const item of groupItems) {
            const currentPurchaseEntryDetails = purchaseData.filter(function (data) {
                return data.Item_Name === item.Item_Name;
            })
            console.log("filtereddata ", currentPurchaseEntryDetails)
            inpuEntryDetails.push(currentPurchaseEntryDetails)

        }

        setSelectedGroupInputs(inpuEntryDetails);
        handleCreateSolution();

    }; */
    // To  get the items available for the Group Name 
    const handleCardClick = (groupName) => {
        console.log("card clicked")
        const groupItems = itemData.filter(function (data) {
            return data.Group_Name === groupName;
        });

        const inputEntryDetails = [];

        // Iterate items of the current group
        for (const item of groupItems) {
            // Get the purchase details of the current item
            const currentPurchaseEntryDetails = purchaseData.filter(function (data) {
                return data.Item_Name === item.Item_Name;
            });

            console.log("filtereddata ", currentPurchaseEntryDetails);

            // Check if there are any purchase details for this item
            if (currentPurchaseEntryDetails.length > 0) {
                // Get the Sales details of the current item
                const currentSalesData = salesData.filter(function (data) {
                    return data.Purchase_Guid === currentPurchaseEntryDetails[0].Guid;
                });

                // Check the available quantity
                const currentPurchaseQuantity = currentPurchaseEntryDetails[0].Quantity || 0;

                // Calculate total sales quantity
                const currentSalesQuantity = currentSalesData.reduce((total, item) => total + item.Quantity, 0);

                const balanceQuantity = currentPurchaseQuantity - currentSalesQuantity;

                // Input details
                const inputItemData = {
                    Sales_no: salesNo.salesNo,
                    Quantity: balanceQuantity,
                    Purchase_Guid: currentPurchaseEntryDetails[0].Guid,
                    Item_Name: currentPurchaseEntryDetails[0].Item_Name,
                    Selling_Price: currentPurchaseEntryDetails[0].Selling_Price
                };

                // Use the spread operator to push individual items into the array
                inputEntryDetails.push(inputItemData);
            }
        }

        setSelectedGroupInputs(inputEntryDetails);
        handleSalesEntryModal();
    };


    //Check the Available Quantity and input Quantity
    const handleInputChange = (itemGuid, inputValue) => {
        const availableQuantity = selectedGroupInputs.find(item => item.Purchase_Guid === itemGuid)?.Quantity || 0;
        inputValue = parseInt(inputValue);

        if (availableQuantity >= inputValue && inputValue >= 0) {
            setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [itemGuid]: inputValue,
            }));
        } else {
            setInputValues((prevInputValues) => ({
                ...prevInputValues,
                [itemGuid]: '', // Clear the input value if it's invalid
            }));
            toast.error("Input  Quantity Exceed Available Quantity")
        }
    };

    //Show the pop-up Window
    const handleSalesEntryModal = () => {
        setShowSolutionForm(true);
    };
    //hide the pop-up Window
    const handleCloseSalesEntryModal = () => {
        setShowSolutionForm(false);
    };
    //Save the sales item Details
    const handleSubmit = async (e) => {
        console.log(inputValues);
        e.preventDefault(); // Prevent the default form submission behavior

        console.log(inputValues);

        let count = salesNo.salesNo;
        const filteredData = selectedGroupInputs.reduce((result, item) => {
            const itemGuid = item.Purchase_Guid;
            const inputValue = inputValues[itemGuid];

            if (inputValue > 0 && inputValue <= item.Quantity) {
                const totalAmount = inputValue * item.Selling_Price
                let Status = 'Completed'; // Declare Status here

                if (inputValue !== item.Quantity) {
                    Status = 'Progress'; // You can change it to 'In Progress' or any other status as needed
                }
                result.push({
                    Sales_no: count++,
                    Quantity: inputValue,
                    Purchase_Guid: itemGuid,
                    Date_of_Entry: date,
                    Shop_No: shopNo,
                    Item_Name: item.Item_Name,
                    Selling_Price: item.Selling_Price,
                    Total_Amount: totalAmount,
                    Description: '',
                    Status: Status,
                    Store_ID: user.storeID,
                    User_ID: userId
                });
            }

            return result;
        }, []);

        //console.log(filteredData);


        // Send a POST request to the login endpoint
        const response = await fetch(`http://localhost:5003/api/salesItem/createBulk?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(filteredData),
        });


        if (response.ok) {
            if (response.status === 200) {
                toast.success('Successfuly Saved Sales Entry');
                navigate('/ShopDashboard')
            }
        }
        else {
            // Handle login error
            const errorData = await response.json();
            console.log('error:', errorData);
            toast.error(errorData);
            // Display error message or perform other actions
        }
        // Handle the response as needed
    };

    return (

        <>
            <ShopNavbar />
            <div className="card shadow mb-5 mt-5">
                <div className="card-header py-3">
                    <p className="text-primary m-0 fw-bold" style={{ fontSize: '20px' }}>
                        <Icon.ArrowLeft
                            onClick={() =>
                                navigate('/ShopDashboard')
                            }
                            className="edit-icon"
                            style={{ cursor: 'pointer' }}
                        />&nbsp; Sales Entry
                    </p>
                </div>
                <div className="card-body" >
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label" htmlFor="signature" style={{ color: 'rgb(0,0,0)', paddingTop: '11px' }}>
                                            <strong>Date</strong>
                                        </label>
                                        <input className="form-control" type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            style={{ marginBottom: '10px', borderRadius: '14.6px' }} />
                                        <div className="row">
                                            {uniqueGroupNames.map((groupName) => (
                                                <div
                                                    className="col-md-6 col-xl-3 mb-4"
                                                    style={{ paddingTop: '10px',cursor: 'pointer' }}
                                                    key={groupName}
                                                    onClick={() => handleCardClick(groupName)}
                                                >
                                                    <div className="card shadow border-start-primary py-2">
                                                        <div className="card-body">
                                                            <div className="row align-items-center no-gutters">
                                                                <div className="col me-2">
                                                                    <div className="text-uppercase text-center text-primary fw-bold text-xs mb-1">
                                                                        <img src={itemSoap} alt="Soap" width="100" height="80" />
                                                                    </div>
                                                                    <div className="text-center text-dark fw-bold h5 mb-0">
                                                                        <span style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                                                                            {groupName}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                            {showSolutionForm && (
                                                <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                                                    <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title">Item List</h5>
                                                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseSalesEntryModal} style={{ cursor: 'pointer' }}></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                {/* Render the Solutionform inside the modal */}
                                                                <form > {/* Move the form here and add the onSubmit attribute */}
                                                                    {selectedGroupInputs && selectedGroupInputs.map((item, index) => (
                                                                        <div key={item.Purchase_Guid} className="mb-3">
                                                                            <label className="form-label" htmlFor={item.Purchase_Guid}>
                                                                                {item.Item_Name} - Available Q - {item.Quantity}
                                                                            </label>
                                                                            <input
                                                                                className="form-control"
                                                                                type="text"
                                                                                id={item.Purchase_Guid}
                                                                                value={inputValues[item.Purchase_Guid] || ''}
                                                                                onChange={(e) => handleInputChange(item.Purchase_Guid, e.target.value)}
                                                                                style={{ marginBottom: "10px" }}
                                                                            />
                                                                        </div>
                                                                    ))}

                                                                    <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmit}>
                                                                        <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                                                                    </button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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

export default SalesEntry;
