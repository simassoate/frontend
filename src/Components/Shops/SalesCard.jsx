import React from "react";
import itemSoap from 'Assets/Images/ItemSoap.gif'; // Import the image

const SalesCard = React.memo(({ data }) => {
  return (
    <>
      {Object.keys(data).map((key, index) => (
        <div className="col-md-6 col-xl-3 mb-4" style={{ paddingTop: '10px' }} key={data[index].Group_Name}>
        <div className="card shadow border-start-primary py-2">
            <div className="card-body">
                <div className="row align-items-center no-gutters">
                    <div className="col me-2">
                        <div className="text-uppercase text-center text-primary fw-bold text-xs mb-1">
                            <img src={itemSoap} alt="Soap" width="100" height="80" /> {/* Use the imported image */}
                        </div>
                        <div className="text-center text-dark fw-bold h5 mb-0">
                            <span style={{ fontWeight: 'bold', textAlign: 'justify' }}>
                                {data[index].Group_Name}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      ))}
    </>
  );
});

export default SalesCard;
