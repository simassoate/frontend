import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { UserContext } from 'UserContext';
import * as Icon from "react-feather";

//Images
import LoginImage from 'Assets/Images/LoginImage.gif'
import AdminNavbar from 'Components/Admin/AdminNavbar';


const CreateLogin = ({ onLogin }) => {

    const { user } = useContext(UserContext);
    const navigate = useNavigate()
    const token = user.token;
    const [roles, setRoles] = useState([]);
    const [loginData, setLoginData] = useState([]);

    const [selectedRole, setselectedRole] = useState('');
    const [selecteduserID, setselecteduserID] = useState('');
    const [selectedpassword, setselectedpassword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const loginDataResponse = await fetch(
                    `http://localhost:5003/api/user/get/AllLogin?token=${token}`,
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

                //Progress Purchase Data
                const roleDataResponse = await fetch(
                    `http://localhost:5003/api/roles/get/all?token=${token}`,
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

                if (loginDataResponse.status === 401) {
                    navigate('/'); // Redirect to the login page
                    // Display a message to inform the user to log in again
                    toast.error('Your session has expired. Please log in again.');
                }
                if (!loginDataResponse.ok || !roleDataResponse.ok) {
                    throw new Error("Network response was not ok");
                }

                const loginDataJson = await loginDataResponse.json();
                //console.log("Item Data", itemDataJson);
                setLoginData(loginDataJson);
                const roleDataJson = await roleDataResponse.json();
                setRoles(roleDataJson);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [navigate, token, user.storeID]);

    //Validate the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentRoleDetails = roles.filter(function(data){
            return data.Role_Name === selectedRole
        })
        const inputDetails = {
            "Portal_user":0,
            "Shop_No":"All",
            "User_ID":selecteduserID,
            "Password":selectedpassword,
            "Role_Name":selectedRole,
            "Role_Permission": currentRoleDetails[0].Role_Permission,
            "Store_ID":user.storeID
        }
        // Send a POST request to the login endpoint
        const response = await fetch(`http://localhost:5003/api/user/create?token=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(inputDetails),
        });

        if (response.ok) {
            //console.log("in  if else")
            const responseData = await response.json();

            if (response.status === 200) {
                
                //toast message 
                toast.success('vaild user');
                // Redirect to the dashboard
                if (responseData.portalUser === 1) {
                    navigate('/SalesEntry');
                }
                else {
                    navigate('/PrimaryStoreDashboard');
                }

            } else if (response.status === 401 && responseData.message === "Invalid Password") {
                toast.error("Invalid Password")
            } else if (response.status === 401 && responseData.message === "User Does not exist") {
                toast.error("User not Exist")
            }
            else {
                // Handle other success scenarios, if any
                toast.error('Encountered Error')
            }
        } else {
            // Handle login error
            const errorData = await response.json();
            console.log('Login error:', errorData.message);
            toast.error(errorData.message);
            // Display error message or perform other actions
        }
    };
    return (
        <>
        <AdminNavbar />
        <div className="card shadow mb-5 mt-5">
            <div className="card-header py-3">
                <p className="text-primary m-0 fw-bold" style={{ fontSize: '20px' }}>
                    <Icon.ArrowLeft onClick={() => navigate('/ShopDashboard')} className="edit-icon" />&nbsp; Target Details
                </p>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <form onSubmit={handleSubmit}>
                            
                            <div className="mb-3">
                                <label className="form-label" htmlFor="targetValue" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Set User ID</strong>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    style={{ borderRadius: '14.6px' }}
                                    onChange={(e) => setselecteduserID(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="targetValue" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Set Password</strong>
                                </label>
                                <input
                                    className="form-control"
                                    type="password"
                                    style={{ borderRadius: '14.6px' }}
                                    onChange={(e) => setselectedpassword(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="targetItem" style={{ color: 'rgb(0,0,0)', marginTop: '20px' }}>
                                    <strong>Select Role</strong>
                                </label>
                                <select
                                    className="form-control"
                                    value={selectedRole}
                                    onChange={(e) => setselectedRole(e.target.value)}
                                    style={{ borderRadius: '14.6px' }}
                                >
                                    <option value="">Select Target Item</option>
                                    {roles.map((item) => (
                                        <option key={item.Role_Name} value={item.Role_Name}>{item.Role_Name}</option>
                                    ))}
                                </select>
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
        </>
       
    );
};
export default CreateLogin;
