import { React, useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"

import Table from "Components/Table";
import PrimaryStoreNavbar from "Components/PrimaryStore/PrimaryStoreNavbar";

function PrimaryStoreTableView() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [selectedContext, setSelectedContext] = useState('itemsHead'); // Default to "Sales Entries"

    const [unitData, setUnitData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [groupNameData, setgroupNameData] = useState([]);
    const [purchaseData, setPurchaseData] = useState([]);

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
                const unitDataResponse = await fetch(
                    `http://localhost:5003/api/itemunit/get/allUnitDetails?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Required_Details: "All"
                        }),
                    }
                );

                //Progress Purchase Data
                const grouNamepDataResponse  = await fetch(
                    `http://localhost:5003/api/itemGroup/get/allGroupDetails?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            Required_Details: "All"
                        }),
                    }
                );

                //Progress Purchase Data
                const purchasepDataResponse = await fetch(
                    `http://localhost:5003/api/purchasedItem/get/filter/getPurchasedItemShopNotReceived?token=${token}`,
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

                if (itemDataResponse.status === 401) {
                    navigate('/'); // Redirect to the login page
                    // Display a message to inform the user to log in again
                    toast.error('Your session has expired. Please log in again.');
                }
                if (!itemDataResponse.ok || !unitDataResponse.ok || !grouNamepDataResponse.ok || !purchasepDataResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const itemDataJson = await itemDataResponse.json();
                //console.log("Item Data", itemDataJson);
                setItemData(itemDataJson);
                const unitDataJson = await unitDataResponse.json();
                setUnitData(unitDataJson);
                const groupNameDataJson = await grouNamepDataResponse.json();
                setgroupNameData(groupNameDataJson);
                const purchaseDataJson = await purchasepDataResponse.json();
                setPurchaseData(purchaseDataJson);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate,shopNo, token, user.storeID]);


    return (
        <>
            <PrimaryStoreNavbar/>
            <div style={{marginTop:"10px"}}>
                <label className="form-label" style={{marginLeft:"10px",marginTop:"10px"}}>
                    Select Entries Data&nbsp;
                    <select
                        className="d-inline-block form-select form-select-sm"
                        value={selectedContext}
                        onChange={(e) => setSelectedContext(e.target.value)}
                    >
                        <option value="unitHead">Item Units</option>
                        <option value="itemsHead">Items</option>
                        <option value="groupNameHead">Item Groups</option>
                        <option value="purchaseHead">Purchase Item</option>
                    </select>
                    &nbsp;
                </label>
                <Table context={selectedContext} data={
                    selectedContext === 'unitHead' ? unitData :
                        selectedContext === 'itemsHead' ? itemData :
                            selectedContext === 'groupNameHead' ? groupNameData :
                                selectedContext === 'purchaseHead' ? purchaseData : []
                } />
            </div>
        </>
    );
}

export default PrimaryStoreTableView;