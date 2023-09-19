import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';
import * as Icon from "react-feather";
import { toast } from "react-toastify"
//import useAuthorization from "Authentication/Authorization"

import PrimaryStoreNavbar from "Components/PrimaryStore/PrimaryStoreNavbar";

function CreateItem() {

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    //Sate handling
    const [unitData, setUnitData] = useState([]);
    const [itemData, setItemData] = useState([]);
    const [groupNameData, setgroupNameData] = useState([]);

    const [selectedGroupName, setSelectedGroupName] = useState('');
    const [selectedUnit, setSelectedUnit] = useState('');
    const [itemName, setItemName] = useState('');
    const [description, setDescription] = useState('');

    //
    const [showUnitForm, setShowUnitForm] = useState(false);
    const [createdUnit, setCreatedUnit] = useState('');


    const [showGroupNameForm, setShowGroupNameForm] = useState(false);
    const [createdGroupName, setCreatedGroupName] = useState('');

    const token = user.token;

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
                const grouNamepDataResponse = await fetch(
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

                if (itemDataResponse.status === 401) {
                    navigate('/'); // Redirect to the login page
                    // Display a message to inform the user to log in again
                    toast.error('Your session has expired. Please log in again.');
                }
                if (!itemDataResponse.ok || !unitDataResponse.ok || !grouNamepDataResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const itemDataJson = await itemDataResponse.json();
                //console.log("Item Data", itemDataJson);
                setItemData(itemDataJson);
                const unitDataJson = await unitDataResponse.json();
                setUnitData(unitDataJson);
                const groupNameDataJson = await grouNamepDataResponse.json();
                setgroupNameData(groupNameDataJson);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate, token, user.storeID]);

    //Show the pop-up Window
    const handleUnitModal = () => {
        setShowUnitForm(true);
    };
    //hide the pop-up Window
    const handleCloseUnitModal = () => {
        setShowUnitForm(false);
    };

    const handleCreateUnitChange = (unitName) => {
        setCreatedUnit(unitName);
    }

    //Checking the Item Name
    const handleUnitBlur = (unitName) => {
        const checkunit = unitData.filter(function (data) {
            return data.Unit_Name === unitName;
        });

        if (checkunit.length > 0) {
            setCreatedUnit('');
        }
    }

    // Inside the handleSubmitUnit function after a successful creation
    const handleSuccessfulUnitCreation = async () => {
        // Fetch the updated unit data from the server
        const updatedUnitDataResponse = await fetch(
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

        if (updatedUnitDataResponse.ok) {
            const updatedUnitDataJson = await updatedUnitDataResponse.json();
            // Update the state with the new unit data
            setUnitData(updatedUnitDataJson);
            // Clear the input field
            setCreatedUnit('');
            // Close the unit form modal
            setShowUnitForm(false);
        } else {
            // Handle error if necessary
        }
    }

    const handleSubmitUnit = async (e) => {
        e.preventDefault();

        const inputDetails = {
            Unit_Name: createdUnit,
            Store_ID: user.storeID,
            User_ID: user.userId

        }

        // Send a POST request to the Create Group Name endpoint
        const response = await fetch(`http://localhost:5003/api/itemunit/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });

        if (response.ok) {
            if (response.status === 200) {
                toast.success('Successfuly Created Unit');
                // Call the function after a successful creation
                handleSuccessfulUnitCreation();
            }
        }
        else {
            // Handle login error
            const errorData = await response.json();
            console.log('error:', errorData);
            toast.error(errorData);
            // Display error message or perform other actions
        }
    }

    //Show the pop-up Window
    const handleGroupNameModal = () => {
        setShowGroupNameForm(true);
    };
    //hide the pop-up Window
    const handleCloseGroupNameModal = () => {
        setShowGroupNameForm(false);
    };

    const handleCreateGroupNameChange = (groupName) => {
        setCreatedGroupName(groupName);
    }

    //Checking the Item Name
    const handleGroupNameBlur = (groupName) => {
        const checkGroupName = groupNameData.filter(function (data) {
            return data.Group_Name === groupName;
        });

        if (checkGroupName.length > 0) {
            setCreatedGroupName('');
        }
    }

    // Inside the handleSubmitUnit function after a successful creation
    const handleSuccessfulGroupNameCreation = async () => {
        // Fetch the updated unit data from the server
        const updatedGroupNameDataResponse = await fetch(
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

        if (updatedGroupNameDataResponse.ok) {
            const updatedGroupNameDataJson = await updatedGroupNameDataResponse.json();
            // Update the state with the new unit data
            setgroupNameData(updatedGroupNameDataJson);
            // Clear the input field
            setCreatedGroupName('');
            // Close the unit form modal
            setShowGroupNameForm(false);
        } else {
            // Handle error if necessary
        }
    }

    const handleSubmitGroupName = async (e) => {
        e.preventDefault();

        const inputDetails = {
            Group_Name: createdGroupName,
            Store_ID: user.storeID,
            User_ID: user.userId

        }

        // Send a POST request to the Create Group Name endpoint
        const response = await fetch(`http://localhost:5003/api/itemGroup/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });


        if (response.ok) {
            if (response.status === 200) {
                toast.success('Successfuly Created Group Name');
                handleSuccessfulGroupNameCreation();
            }
        }
        else {
            // Handle login error
            const errorData = await response.json();
            console.log('error:', errorData);
            toast.error(errorData);
            // Display error message or perform other actions
        }
    }

    //Checking the Item Name
    const handleItemNameBlur = (itemName) => {
        const checkItemName = itemData.filter(function (data) {
            return data.Item_Name === itemName;
        });

        if (checkItemName.length > 0) {
            setItemName('');
        }
    }
    const handleItemNameChange = (itemName) => {
        setItemName(itemName);
    };

    //Save the item details
    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputDetails = {
            Group_Name: selectedGroupName,
            Item_Name: itemName,
            Unit_Name: selectedUnit,
            Description: description,
            Store_ID: user.storeID,
            User_ID: user.userId

        }
        // Send a POST request to the Create Group Name endpoint
        const response = await fetch(`http://localhost:5003/api/items/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });
        if (response.ok) {
            if (response.status === 200) {
                toast.success('Successfuly Created ItemName');

            }
        }
        else {
            // Handle login error
            const errorData = await response.json();
            console.log('error:', errorData);
            toast.error(errorData);
            // Display error message or perform other actions
        }
    }
    return (
        <>
            <PrimaryStoreNavbar />
            <div className="card shadow mb-5 mt-5">
                <div className="card-header py-3">
                    <p className="text-primary m-0 fw-bold" style={{ fontSize: "20px" }}>
                        <Icon.ArrowLeft
                            onClick={() =>
                                navigate('/PrimaryStoreDashboard')
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
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="itemList" style={{ color: "rgb(0,0,0)", marginTop: "11px" }}><strong>Group Name</strong></label>
                                        <select
                                            className="form-select"
                                            id="unitList"
                                            value={selectedGroupName}
                                            onChange={(e) => {
                                                setSelectedGroupName(e.target.value); // Update the selected item
                                            }}
                                            style={{ borderRadius: '14.6px' }}
                                            required
                                        >
                                            <option value="">Select Group Name</option>
                                            {groupNameData.map((itemData) => (
                                                <option key={itemData.Group_Name} value={itemData.Group_Name}>
                                                    {itemData.Group_Name}
                                                </option>
                                            ))}
                                        </select>
                                        <p style={{ color: "blue", cursor: 'pointer' }} onClick={handleGroupNameModal}>Create New Group</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="quantity" style={{ color: "rgb(0,0,0)", marginTop: "21px" }}><strong>Item Name</strong></label>
                                        <input className="form-control" type="text" style={{ borderRadius: "14.6px" }} value={itemName} onChange={(e) => handleItemNameChange(e.target.value)} onBlur={(e) => handleItemNameBlur(e.target.value)} />
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="itemList" style={{ color: "rgb(0,0,0)", marginTop: "11px" }}><strong>Unit</strong></label>
                                        <select
                                            className="form-select"
                                            id="unitList"
                                            value={selectedUnit}
                                            onChange={(e) => {
                                                setSelectedUnit(e.target.value); // Update the selected item
                                            }}
                                            style={{ borderRadius: '14.6px' }}
                                            required
                                        >
                                            <option value="">Select Unit</option>
                                            {unitData.map((itemData) => (
                                                <option key={itemData.Unit_Name} value={itemData.Unit_Name}>
                                                    {itemData.Unit_Name}
                                                </option>
                                            ))}
                                        </select>
                                        <p style={{ color: "blue", cursor: 'pointer' }} onClick={handleUnitModal}>Create New Unit</p>
                                    </div>
                                    <div className="mb-2">
                                        <label className="form-label" htmlFor="quantity" style={{ color: "rgb(0,0,0)", marginTop: "21px" }}><strong>Description</strong></label>
                                        <input className="form-control" type="text" style={{ borderRadius: "14.6px" }} value={description} onChange={(e) => { setDescription(e.target.value) }} />
                                    </div>
                                    <div className="mb-2">
                                        <button className="btn btn-primary btn-sm" type="submit" style={{ width: "223px", background: "var(--bs-teal)", fontWeight: "bold", borderRadius: "15px", borderWidth: "0px", fontSize: "18px", marginTop: "6px" }}>Save</button>
                                    </div>
                                </form>
                            </div>
                            {showUnitForm && (
                                <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                                    <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Create New Unit</h5>
                                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseUnitModal} style={{ cursor: 'pointer' }}></button>
                                            </div>
                                            <div className="modal-body">
                                                {/* Render the Solutionform inside the modal */}
                                                <form > {/* Move the form here and add the onSubmit attribute */}
                                                    <div className="mb-3">
                                                        <label className="form-label" >
                                                            Unit Name
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="text"

                                                            value={createdUnit}
                                                            onChange={(e) => handleCreateUnitChange(e.target.value)}
                                                            onBlur={(e) => handleUnitBlur(e.target.value)}
                                                            style={{ marginBottom: "10px" }}
                                                        />
                                                    </div>
                                                    <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitUnit}>
                                                        <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {showGroupNameForm && (
                                <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                                    <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h5 className="modal-title">Create New Group</h5>
                                                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseGroupNameModal} style={{ cursor: 'pointer' }}></button>
                                            </div>
                                            <div className="modal-body">
                                                {/* Render the Solutionform inside the modal */}
                                                <form > {/* Move the form here and add the onSubmit attribute */}
                                                    <div className="mb-3">
                                                        <label className="form-label" >
                                                            Group Name
                                                        </label>
                                                        <input
                                                            className="form-control"
                                                            type="text"
                                                            value={createdGroupName}
                                                            onChange={(e) => handleCreateGroupNameChange(e.target.value)}
                                                            onBlur={(e) => handleGroupNameBlur(e.target.value)}
                                                            style={{ marginBottom: "10px" }}
                                                        />
                                                    </div>
                                                    <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitGroupName}>
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
                </div>
            </div>
        </>
    )
}

export default CreateItem;