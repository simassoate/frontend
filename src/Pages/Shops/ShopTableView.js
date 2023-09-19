import { React, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";

import Table from "Components/Table";
import ShopNavbar from "Components/Shops/Navbar";

function ShopTableView() {
    const { user } = useContext(UserContext);

    const [selectedContext, setSelectedContext] = useState('shopSalesTableHead'); // Default to "Sales Entries"

    const [purchaseData, setPurchaseData] = useState([]);
    const [salesData, setSalesData] = useState([]);
    const [itemRequestData, setItemRequestData] = useState([]);

    const token = user.token;
    //const userId = user.userId;
    const shopNo = user.shopNo;
    // Loading the required Details
    useEffect(() => {

        const defaultView = localStorage.getItem('defaultView');
        if (defaultView) {
            setSelectedContext(defaultView);
        }
        
        const fetchData = async () => {
            try {
                //Purchase Data
                const purchaseConfirmationDataResponse = await fetch(
                    `http://localhost:5003/api/purchasedItem/get/filter/getPurchaseNeedToConfirmation?token=${token}`,
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
                            Shop_No: shopNo
                        }),
                    }
                );
                //Sales No
                const itemRequestResponse = await fetch(
                    `http://localhost:5003/api/itemRequest/get/all?token=${token}`,
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

                //CHeck  the response
                if (!purchaseConfirmationDataResponse.ok || !salesDataResponse.ok || !itemRequestResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const purchaseDataJson = await purchaseConfirmationDataResponse.json();
                const salesDataJson = await salesDataResponse.json();
                const itemRequestJson = await itemRequestResponse.json();

                /* For developing Purpose 
                console.log("Purchase Data", purchaseDataJson);
                console.log("Item Data", itemDataJson);
                console.log("Sales Data", salesDataJson);
                console.log("Sales No", salesNoJson);
                console.log("Purchase Data", purchaseDataJson); */


                setPurchaseData(purchaseDataJson)
                setSalesData(salesDataJson);
                setItemRequestData(itemRequestJson);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [shopNo, token, user.storeID]);


    return (
        <>
            <ShopNavbar/>
            <div style={{marginTop:"10px"}}>
                <label className="form-label" style={{marginLeft:"10px",marginTop:"10px"}}>
                    Select Entries Data&nbsp;
                    <select
                        className="d-inline-block form-select form-select-sm"
                        value={selectedContext}
                        onChange={(e) => setSelectedContext(e.target.value)}
                    >
                        <option value="shopSalesTableHead">Sales Entries</option>
                        <option value="shopItemReqHead">Item Request</option>
                        <option value="purchaseConfirmationHead">Purchase Confirmation</option>
                    </select>
                    &nbsp;
                </label>
                <Table context={selectedContext} data={
                    selectedContext === 'shopSalesTableHead' ? salesData :
                        selectedContext === 'shopItemReqHead' ? itemRequestData :
                            selectedContext === 'purchaseConfirmationHead' ? purchaseData : []
                } />
            </div>
        </>
    );
}

export default ShopTableView;