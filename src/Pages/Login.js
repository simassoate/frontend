import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify"
import { UserContext } from 'UserContext';

//Images
import LoginImage from 'Assets/Images/LoginImage.gif'


const Login = ({ onLogin }) => {

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate()
    const [userID, setUseruID] = useState('');
    const [password, setPassword] = useState('');

    //Validate the user
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Send a POST request to the login endpoint
        const response = await fetch('http://stores-apicont.onrender.com:5003/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "User_ID": userID, "Password": password }),
        });

        if (response.ok) {
            const responseData = await response.json();

            if (response.status === 200) {

                // Set the user in the global context
                setUser(responseData);
                //console log
                //console.log(responseData.message);
                //set isloggedin
                onLogin();
                //toast message 
                toast.success('vaild user');
                // Redirect to the dashboard
                if(responseData.portalUser === 1){
                    navigate('/SalesEntry');
                }
                else{
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
        <div classNameName="container">
            <div className="row justify-content-center ">
                <div className="col-md-9 col-lg-12 col-xl-10 container" style={{ marginTop: '74px' }} >
                    <div className="card shadow-lg o-hidden border-0 my-5 container">
                        <div className="card-body p-0" >
                            <div className="row" >
                                <div className="col-lg-6 d-none d-lg-flex">
                                    <div className="flex-grow-1 bg-login-image" style={{ background: `url(${LoginImage})  space` }}></div>
                                </div>
                                <div className="col-lg-6">
                                    <div className="p-5">
                                        <div className="text-center">
                                            <h4 className=" mb-4" style={{ fontWeight: 'Bold', fontSize: '27.4px',color:'orange' }}>Orange-Sales360</h4>
                                            <h4 className="text-dark mb-4" style={{ fontWeight: 'Bold', fontSize: '23.4px' }}>Welcome Back!</h4>
                                        </div>
                                        <form className="user" onSubmit={handleSubmit}>
                                            <div className="mb-3"><input className="form-control form-control-user" onChange={(e) => { setUseruID(e.target.value) }} type="text" id="exampleInputEmail" aria-describedby="emailHelp" placeholder="Enter User id..." name="email" style={{ borderRadius: '12px' }}></input></div>
                                            <div className="mb-3"><input className="form-control form-control-user" onChange={(e) => { setPassword(e.target.value) }} type="password" id="exampleInputPassword" placeholder="Password" name="password" style={{ borderRadius: ' 12px' }}></input></div>
                                            <div className="mb-3">

                                                <div className="custom-control custom-checkbox small">
                                                    <div className="form-check"><input className="form-check-input custom-control-input" type="checkbox" id="formCheck-1"></input><label className="form-check-label custom-control-label" >Remember Me</label></div>
                                                </div>
                                            </div><button className="btn btn-primary d-block btn-user w-100 " type="submit" style={{ fontSize: '17.8px', borderRadius: '160px' }}>Login</button>
                                            
                                            <hr></hr>
                                        </form>
                                        <div className="text-center"><h4 className="text-primary mb-4" style={{ fontWeight: 'Bold', fontSize: '10.4px' }}>Powered by Simpro</h4></div>
                                        <div className="text-center"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Login;
