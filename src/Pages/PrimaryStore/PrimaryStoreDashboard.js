import React, { useContext, useEffect, useState } from "react";
import ShopCard from "Components/Shops/ShopCard";
import { UserContext } from "UserContext";

import useAuthorization from "Authentication/Authorization"
import { formatDate } from "Utils/DateUtils";

import PrimaryStoreNavbar from "Components/PrimaryStore/PrimaryStoreNavbar";
// Import and register the required chart elements from Chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function PrimaryStoreDashboard() {
    const { user } = useContext(UserContext);
    const [dashboardData, setDashboardData] = useState([]);
    const [cardData, setCardData] = useState({});
    const [groupWiseSalesData, setgroupWiseSalesData] = useState([]);
    const [chartData, setChartData] = useState([]);


    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const formattedFirstDayOfMonth = formatDate(firstDayOfMonth);
    const formattedLastDayOfMonth = formatDate(lastDayOfMonth);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = user.token;
                const response = await fetch(
                    `http://localhost:5003/api/dashboard/admin/dashboard?token=${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Store_ID: user.storeID,
                            From: formattedFirstDayOfMonth,
                            To: formattedLastDayOfMonth
                        }),
                    }
                );
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const json = await response.json();

                setDashboardData(json);
                //Card Details
                const cardDetails = {
                    "LAST MONTH  TARGET ACHIEVED SHOPS": json.targetAchivedShops,
                    "LAST MONTH SHOPS SALES VALUE": json.totalSalesLastMonth,
                    "CURRENT MONTH REQUEST VALUE": json.totalRequestValue,
                    "CLOSING STOCK VALUE AT SHOPS": json.totalRequestValue
                };
                setCardData(cardDetails);
                setgroupWiseSalesData(json.groupWiseSalesDetails);

                //Doughnut Chart Required Details
                const chartDetails = {
                    labels: json.groupWiseSalesDetails.map((item) => item.Group_Name),
                    datasets: [
                        {
                            label: 'Total Sales',
                            data: json.groupWiseSalesDetails.map((item) => item.Total_Sales),
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                            ],
                            borderWidth: 1,
                        },
                    ],
                };
                setChartData(chartDetails);
                console.error("");

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [formattedFirstDayOfMonth, formattedLastDayOfMonth, user.shopNo, user.storeID, user.token]);

    const textColours = ["#FA5A7E", "#FF947A", "#3BD855", "#BF83FF"];
    const card = <ShopCard data={cardData} color={textColours} fontSize="10px" />;

    return (
        <>
            <PrimaryStoreNavbar />
            <div className="container mt-4">
                <div className="d-sm-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-dark mb-0" style={{ fontWeight: "bold" }}>
                        Dashboard - Primary Store
                    </h3>
                </div>
                <div className="row">{card}</div>
                <div className="row">
                    <div className="col-lg-7 col-xl-8 target-achieved-shops">
                        <div className="card shadow mb-4" style={{ borderRadius: "21.6px" }}>
                            <div className="card-header py-3">
                                <h6 className="fw-bold m-0 target-header">Target Achieved Shops</h6>
                            </div>
                            <div className="card-body">
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShops50PerCount} Shops<span className="float-end">&lt;50%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-danger" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style={{ width: '50%' }}><span className="visually-hidden">20%</span></div>
                                </div>
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShops50To75PerCount}  Shops<span className="float-end">50 - 75%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-warning" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{ width: '75%' }}><span className="visually-hidden">40%</span></div>
                                </div>
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShops75To90PerCount}  Shops<span className="float-end">70 - 90%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-primary" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: '90%' }}><span className="visually-hidden">60%</span></div>
                                </div>
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShops90To99PerCount}  Shops<span className="float-end">91 - 99%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-info" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100" style={{ width: '99%' }}><span className="visually-hidden">80%</span></div>
                                </div>
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShops100PerCount}  Shop<span className="float-end">100%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-success" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}><span className="visually-hidden">100%</span></div>
                                </div>
                                <h4 className="small fw-bold">{dashboardData.targetAchivedShopsBeyond100PerCount}  Shop<span className="float-end">Above 100%</span></h4>
                                <div className="progress mb-4">
                                    <div className="progress-bar bg-success" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style={{ width: '100%' }}><span className="visually-hidden">100%</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-5 col-xl-4">
                        <div className="card shadow mb-4" style={{ borderRadius: "21.6px" }}>
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="fw-bold m-0" style={{ fontSize: "20px", fontWeight: "bold", color: "var(--bs-pink)" }}>Sales Items</h6>
                            </div>
                            <div className="card-body">
                                <div className="chart-area">
                                    {chartData.datasets ? <Doughnut data={chartData} /> : null}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
};

export default PrimaryStoreDashboard;
