import React from "react";
import { useNavigate } from 'react-router-dom';

function ShopNavbar() {
    const navigate = useNavigate();

    const handleNavigation = (path, defaultView) => {
        // Store the default view in local storage
        localStorage.setItem('defaultView', defaultView);
        navigate(path);
        
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light navbar-shrink py-3 shadow" id="mainNav" style={{ position: 'sticky', top: '0', zIndex: '100',background:"white" }}>
            <div className="container">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand d-flex align-items-center" href="/">
                    <span style={{ fontWeight: 'Bold', fontSize: '19.4px',color:'orange' }}>Orange-Sales360</span>
                </a>
                <div className="collapse navbar-collapse align-items-center" id="navbarNav">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <p className="nav-link active" onClick={() => handleNavigation("/ShopDashboard", "shopSalesTableHead")} style={{ cursor: 'pointer' }}>Dashboard</p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => handleNavigation("/SalesEntry", "shopSalesTableHead")} style={{ cursor: 'pointer' }}>Sales</p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => handleNavigation("/RequestPage", "shopItemReqHead")} style={{ cursor: 'pointer' }}>Item Request</p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => handleNavigation("/ShopTableView", "purchaseConfirmationHead")} style={{ cursor: 'pointer' }}>Purchase Confirmation</p>
                    </li>
                    <li className="nav-item">
                        <p className="nav-link" onClick={() => handleNavigation("/ShopTableView", "shopSalesTableHead")} style={{ cursor: 'pointer' }}>View Entries</p>
                    </li>
                </ul>
                </div>
            </div>
        </nav>
    );
}

export default ShopNavbar;
