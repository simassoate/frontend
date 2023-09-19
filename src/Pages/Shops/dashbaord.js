import { React, useContext, useEffect, useState } from "react";

import { UserContext } from "UserContext";
import { useNavigate } from 'react-router-dom';

import useAuthorization from "Authentication/Authorization"
//utils
import { formatDate } from "Utils/DateUtils";
import ShopCard from "Components/Shops/ShopCard";
import ShopNavbar from "Components/Shops/Navbar";

function ShopDashboard() {
  const navigate = useNavigate();
  const hasAccess = useAuthorization("ShopDashboard");

  if (!hasAccess) {
    navigate('/error')
  }

  const { user } = useContext(UserContext);
  const [dashboardData, setDashboardData] = useState({});

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const formattedFirstDayOfMonth = formatDate(firstDayOfMonth);
  const formattedLastDayOfMonth = formatDate(lastDayOfMonth);
  //console.log("First day of the month:", firstDayOfMonth);
  //console.log("Last day of the month:", lastDayOfMonth);
  const givenDate = new Date(); // Replace this with your desired date

  // Calculate 7 days before the given date
  const sevenDaysBefore = new Date(givenDate);
  sevenDaysBefore.setDate(givenDate.getDate() - 7);

  const formatedSevenDaysBeforeDate = formatDate(sevenDaysBefore);
  const formatedToday = formatDate(today)

  //console.log("Given Date:", givenDate);
  //console.log("7 Days Before:", sevenDaysBefore);

  // Loading the required Details To Show.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the form fields from the server
        // Access the token from context
        const token = user.token;
        const response = await fetch(
          `http://localhost:5003/api/dashboard/shop/dashboard?token=${token}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              Store_ID: user.storeID,
              From: formattedFirstDayOfMonth,
              To: formattedLastDayOfMonth,
              Shop_No: user.shopNo,
              Last_Week_From: formatedSevenDaysBeforeDate,
              Last_Week_To: formatedToday,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const json = await response.json();
        setDashboardData(json);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [formatedSevenDaysBeforeDate, formatedToday, formattedFirstDayOfMonth, formattedLastDayOfMonth, user.shopNo, user.storeID, user.token]);

  //Required data for the card
  const textColours = ["#FA5A7E", "#FF947A", "#3BD855", "#BF83FF"];
  const card = <ShopCard data={dashboardData} color={textColours} fontSize="10px" />;
  return (
    <>
      <ShopNavbar />
      <div className="container mt-4">
        <div className="d-sm-flex justify-content-between align-items-center mb-4">
          <h3 className="text-dark mb-0" style={{ fontWeight: "bold" }}>
            Dashboard - {user.storeID}
          </h3>
        </div>
        <div className="row">{card}</div>
        {/*<div className="row">
          <div className="col">
            <div className="row" onClick={() => navigate('/SalesEntry')}>
              <div className="col-lg-6 mb-4">
                <div
                  className="card text-white bg-primary shadow"
                  style={{
                    borderRadius: "14.6px",
                    background: "var(--bs-card-cap-bg);",
                  }}
                >
                  <div className="card-body">
                    <p className="m-0" style={{ fontSize: "28px" }}>
                      Sales
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" onClick={() => navigate('/ShopTarget')}>
              <div className="col-lg-6 mb-4">
                <div
                  className="card text-white bg-info shadow"
                  style={{ borderRadius: "14.6px" }}
                >
                  <div className="card-body">
                    <p className="m-0" style={{ fontSize: "28px" }}>
                      Purchase
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="row" onClick={() => navigate('/RequestPage')}>
              <div className="col-lg-6 mb-4">
                <div
                  className="card text-white bg-success shadow"
                  style={{ borderRadius: "14.6px" }}
                >
                  <div className="card-body">
                    <p className="m-0" style={{ fontSize: "28px" }}>
                      Request
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        */}
      </div>
    </>

  );
}

export default ShopDashboard;
