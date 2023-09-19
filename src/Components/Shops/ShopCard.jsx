import React from "react";

const ShopCard = React.memo(({ data, color,fontSize }) => {
  return (
    <>
      {Object.keys(data).map((key, index) => (
        <div className="col-md-6 col-xl-3 mb-4" key={index}>
          <div className="card shadow border-start-primary py-2" style={{ borderRadius: '24.6px' }}>
            <div className="card-body" style={{ paddingLeft: '25px' }}>
              <div className="row align-items-center no-gutters">
                <div className="col me-2">
                  <div className="text-uppercase text-primary fw-bold text-xs mb-1">
                    <span style={{ fontSize: {fontSize}, color: `${color[index]}` }}>{key}</span>
                  </div>
                  <div className="text-dark fw-bold h5 mb-0">
                    <span>{data[key]}</span>
                  </div>
                </div>
                <div className="col-auto" style={{ paddingLeft: '25px' }}>
                  <i className="fas fa-rupee-sign fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
});

export default ShopCard;
