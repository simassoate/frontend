import { React, useContext, useState } from 'react';
import { UserContext } from "UserContext";
import { useNavigate } from "react-router-dom";
import * as Icon from "react-feather";
import { toast } from 'react-toastify';
import { formatDate, formatDateToDDMMYYYY } from "Utils/DateUtils";


import { shopSalesTableHead, shopSalesTdHead, shopItemReqHead, shopItemReqTdHead, purchaseConfirmationHead, purchaseConfirmationTdHead, unitHead, UnittTdHead, itemsHead, itemsTdHead, groupNameHead, groupNameTdHead, purchaseEntryHead, purchaseEntryTdHead } from 'Utils/TableUtils';
import { faClosedCaptioning } from '@fortawesome/free-regular-svg-icons';
import { faLessThanEqual } from '@fortawesome/free-solid-svg-icons';

const Table = ({ context, data }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const token = user.token;
  const userId = user.userId;
  const shopNo = user.shopNo;

  let tableHeaders, tableTdHeader, buttonText, buttonLink, tableTitle, editIcon;

  if (context === 'shopSalesTableHead') {
    tableHeaders = shopSalesTableHead;
    tableTdHeader = shopSalesTdHead;
    tableTitle = "Sales Entries";
    buttonText = 'Create Sales Entry';
    buttonLink = '/SalesEntry';
    editIcon = '';

  } else if (context === 'shopItemReqHead') {
    tableHeaders = shopItemReqHead;
    tableTdHeader = shopItemReqTdHead;
    tableTitle = "Request item";
    buttonText = 'Request Item';
    buttonLink = '/RequestPage';
    editIcon = '';
  } else if (context === 'purchaseConfirmationHead') {
    tableHeaders = purchaseConfirmationHead;
    tableTdHeader = purchaseConfirmationTdHead;
    tableTitle = "";
    buttonText = '';
    buttonLink = '';
    editIcon = '';
  } else if (context === 'unitHead') {
    // Set headers and td headers for the "unitHead" context
    tableHeaders = unitHead;
    tableTdHeader = UnittTdHead;
    tableTitle = ""; // Update the title accordingly
    buttonText = ''; // Update button text
    buttonLink = ''; // Update button link
    editIcon = ''; // You can update the edit icon if needed
  } else if (context === 'itemsHead') {
    tableHeaders = itemsHead;
    tableTdHeader = itemsTdHead;
    tableTitle = "Request item";
    buttonText = 'Request Item';
    buttonLink = '/RequestPage';
    editIcon = '';
  } else if (context === 'groupNameHead') {
    tableHeaders = groupNameHead;
    tableTdHeader = groupNameTdHead;
    tableTitle = "";
    buttonText = '';
    buttonLink = '';
    editIcon = '';
  }
  else if (context === 'purchaseHead') {
    tableHeaders = purchaseEntryHead;
    tableTdHeader = purchaseEntryTdHead;
    tableTitle = "Purchase Entry";
    buttonText = 'Create Purchase Entry';
    buttonLink = '/PurchaseEntry';
    editIcon = '';
  }

  const tableData = data;
  const [selectedItem, setSelectedItem] = useState(null);
  const [showRows, setShowRows] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);


  // Calculate the index of the first and last items to be displayed on the current page
  const indexOfLastItem = currentPage * showRows;
  const indexOfFirstItem = indexOfLastItem - showRows;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // Change the current page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filter the data based on the search term
  const filteredData = tableData.filter((row) => {
    // Check if any of the row values contain the search term
    return Object.values(row).some((value) => {
      return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  });


  //Sales edit Required details 
  const [showSalesEntryModal, setShowSalesEntryModal] = useState(false);
  const [salesEditQuantity, setSalesEditQuantity] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [purchaseData, setpurchaseData] = useState([]);
  const [availableQuantity, setavailableQuantity] = useState('');
  const [salesDate, setsalesDate] = useState(formatDate(new Date()));

  //Item Request edit Required Details
  const [showItemReqEntryModal, setShowItemReqEntryModal] = useState(false);
  const [itemRequestData, setitemRequestData] = useState([]);
  const [itemRequestQuantity, setItemRequestQuantity] = useState('');

  //Purchase Item Confirmation  edit Required Details
  const [showPurchaseConfirmationModal, setShowPurchaseConfirmationModal] = useState(false);
  const [purchaseConfirmationData, setPurchaseConfirmationData] = useState([]);
  const [purchaseConfirmationStatus, setPurchaseConfirmationStatus] = useState('');

  //UPdate unit Data 
  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitData, setUnitData] = useState([]);
  const [updatedUnitName, setUpdatedUnitName] = useState('');

  //UPdate Group Data 
  const [showGroupNameModal, setShowGroupNameModal] = useState(false);
  const [GroupNameData, setGroupNameData] = useState([]);
  const [updatedGroupName, setUpdatedGroupName] = useState('');

  //UPdate Items Data 
  const [showItemsModal, setShowItemsModal] = useState(false);
  const [itemsData, setItemsData] = useState([]);
  const [groupNames, setgroupNames] = useState([]);
  const [unitNames, setUnitNames] = useState([]);
  const [updatedItemName, setUpdatedItemName] = useState('');
  const [updatedItemGroupName, setUpdatedItemGroupName] = useState('');
  const [updatedItemUnitName, setUpdatedItemUnitName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');

  //Purcahse Entry data
  const [ShowPurchaseEntryModal, setShowPurchaseEntryModal] = useState(false);
  const [purcahseEntryData, setPurchaseEntryData] = useState([]);
  const [ShopForPurchaseEntry, setShopForPurchaseEntry] = useState([]);
  const [ItemsForPurchaseEntry, setItemsForPurchaseEntry] = useState([]);

  const [PurchaseEntryAutoId, setPurchaseEntryAutoId] = useState('');
  const [UpdatePurchaseDescription, setUpdatePurchaseDescription] = useState('');
  const [UpdatedPurchaseTotal, setUpdatedPurchaseTotal] = useState('');
  const [UpdatedPurcahseSellingPrice, setUpdatedPurcahseSellingPrice] = useState('');
  const [UpdatedPurchaseQuantity, setUpdatedPurchaseQuantity] = useState('');
  const [UpdatedPurcahseItemName, setUpdatedPurcahseItemName] = useState('');
  const [UpdatedPurchaseShopNo, setUpdatedPurchaseShopNo] = useState('');
  const [UpdatedPurchaseDate, setUpdatedPurchaseDate] = useState(formatDate(new Date()));


  function mapHeaderToColumnName(header) {
    // Define a mapping of headers to column names
    const headerToColumnMapping = {
      "Unit Name": "Unit_Name",
      "Item Name": "Item_Name",
      // Add more mappings for other headers if needed
    };

    // Return the corresponding column name from the mapping
    return headerToColumnMapping[header] || header;
  }

  const handleDelete = (id) => {
    setSelectedItem(id);

    // Display a confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this item?');
    if (confirmDelete) {
      // Call the respective delete API based on the context
      if (context === 'clientlist') {
        fetch(`http://localhost:5002/api/client/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then((response) => {
            if (response.ok) {
              // Handle the successful delete operation
              console.log('Client deleted successfully');
              toast.success('Client deleted successfully')
              // Refresh the data or perform any necessary actions after deletion
            } else {
              throw new Error('Failed to delete client');
            }
          })
          .catch((error) => {
            // Handle the delete error
            console.error('Error deleting client', error);
            toast.error('Error deleting client')
          })
          .finally(() => {
            setSelectedItem(null);
          });
      } else if (context === 'invoicelist') {
        fetch(`http://localhost:5003/api/invoice/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then((response) => {
            if (response.ok) {
              // Handle the successful delete operation
              console.log('Invoice deleted successfully');
              toast.success('Invoice deleted successfully');
              // Refresh the data or perform any necessary actions after deletion
            } else {
              throw new Error('Failed to delete invoice');
            }
          })
          .catch((error) => {
            // Handle the delete error
            console.error('Error deleting invoice', error);
            toast.error('Failed to delete invoice')
          })
          .finally(() => {
            setSelectedItem(null);
          });
      } else if (context === 'itemlist') {
        fetch(`http://localhost:5005/api/items/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
        })
          .then((response) => {
            if (response.ok) {
              // Handle the successful delete operation
              console.log('Item deleted successfully');
              toast.success('Item deleted successfully');
              // Refresh the data or perform any necessary actions after deletion
            } else {
              throw new Error('Failed to delete item');
            }
          })
          .catch((error) => {
            // Handle the delete error
            console.error('Error deleting item', error);
            toast.error('Error deleting item')
          })
          .finally(() => {
            setSelectedItem(null);
          });
      }
    } else {
      setSelectedItem(null);
    }
  };

  const handleEdit = async (id) => {

    //Sales Entry Edit
    if (context === 'shopSalesTableHead') {
      const currentSalesData = data.filter(function (curentData) {
        return curentData.Auto_id === id
      })

      setSalesData(currentSalesData);
      const purcahseGuid = currentSalesData[0].Purchase_Guid

      const purchaseDataResponse = await fetch(
        `http://localhost:5003/api/purchasedItem/get/filter/getPurchasedItemDetailsGuid?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Guid: purcahseGuid }),
        }
      );

      const allSalesDataBasedOnPurchaseGuid = await fetch(
        `http://localhost:5003/api/salesItem/get/SalesItemDetailsByPurchaseGuid?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "Purchase_Guid": purcahseGuid }),
        }
      );

      const checkProgressPurchaseItem = await fetch(
        `http://localhost:5003/api/purchasedItem/get/filter/purchaseStatus?token=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Shop_No: shopNo, Status: "Progress", Store_ID: user.storeID }),
        }
      );

      if (!purchaseDataResponse.ok || !allSalesDataBasedOnPurchaseGuid.ok || !checkProgressPurchaseItem.ok) {
        throw new Error("Network response was not ok");
      }
      const checkProgressPurchaseItemData = await checkProgressPurchaseItem.json();
      if (checkProgressPurchaseItemData.length > 0) {
        const statusNewItemInPurchase = checkProgressPurchaseItemData.filter(function (data) {
          return data.Item_Name === currentSalesData[0].Item_Name
        })

        const statusNewItemInPurchaseGuid = statusNewItemInPurchase.length > 0 ? statusNewItemInPurchase[0].Guid : 'null';

        //Check the current purchase guid and currently selling purchase guid. If both the guid is allow to edit the data

        if (statusNewItemInPurchaseGuid !== purcahseGuid) {
          const checkProgressPurchaseItemInSales = await fetch(
            `http://localhost:5003/api/salesItem/get/SalesItemDetailsByPurchaseGuid?token=${token}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ Purchase_Guid: statusNewItemInPurchaseGuid }),
            }
          );

          if (!checkProgressPurchaseItemInSales.ok) {
            throw new Error("Network response was not ok");
          }
          const checkProgressPurchaseItemInSalesData = await checkProgressPurchaseItemInSales.json();

          if (checkProgressPurchaseItemInSalesData.length > 0) {
            toast.error("This item is currently selling New Purchase you Cant update the Old Sales Entry.")
          } else {
            const purcahseData = await purchaseDataResponse.json();
            setpurchaseData(purcahseData);
            const allSalesData = await allSalesDataBasedOnPurchaseGuid.json();
            const purchaseQuantity = purcahseData[0].Quantity;
            // Calculate total sales quantity
            const allSalesQuantity = allSalesData.reduce((total, item) => total + item.Quantity, 0);
            const salesQuantity = allSalesQuantity - currentSalesData[0].Quantity;
            const availableQuantity = purchaseQuantity - salesQuantity;
            setavailableQuantity(availableQuantity);
            const currentSalesDate = formatDate(new Date(currentSalesData[0].Date_of_Entry));
            setsalesDate(currentSalesDate);
            //Show the modal
            handleSalesEntryModal();
          }
        }
        else {
          const purcahseData = await purchaseDataResponse.json();
          setpurchaseData(purcahseData);
          const allSalesData = await allSalesDataBasedOnPurchaseGuid.json();
          const purchaseQuantity = purcahseData[0].Quantity;
          // Calculate total sales quantity
          const allSalesQuantity = allSalesData.reduce((total, item) => total + item.Quantity, 0);
          const salesQuantity = allSalesQuantity - currentSalesData[0].Quantity;
          const availableQuantity = purchaseQuantity - salesQuantity;
          setavailableQuantity(availableQuantity);
          const currentSalesDate = formatDate(new Date(currentSalesData[0].Date_of_Entry));
          setsalesDate(currentSalesDate);
          //Show the modal
          handleSalesEntryModal();
        }
      }
      else {
        const purcahseData = await purchaseDataResponse.json();
        setpurchaseData(purcahseData);
        const allSalesData = await allSalesDataBasedOnPurchaseGuid.json();
        const purchaseQuantity = purcahseData[0].Quantity;
        // Calculate total sales quantity
        const allSalesQuantity = allSalesData.reduce((total, item) => total + item.Quantity, 0);
        const salesQuantity = allSalesQuantity - currentSalesData[0].Quantity;
        const availableQuantity = purchaseQuantity - salesQuantity;
        setavailableQuantity(availableQuantity);
        const currentSalesDate = formatDate(new Date(currentSalesData[0].Date_of_Entry));
        setsalesDate(currentSalesDate);

        //Show the modal
        handleSalesEntryModal();
      }
    }
    else if (context === 'shopItemReqHead') {
      const currentItemRequestData = data.filter(function (data) {
        return data.Auto_id === id;
      });

      setitemRequestData(currentItemRequestData);

      handleItemReqEntryModal();
    }
    else if (context === 'purchaseConfirmationHead') {
      const currentPurchaseConfirmationData = data.filter(function (data) {
        return data.Auto_id === id;
      });

      setPurchaseConfirmationData(currentPurchaseConfirmationData);

      handlePurchaseConfirmationModal();
    }
    else if (context === 'unitHead') {
      const currentUnitDetails = data.filter(function (currentData) {
        return currentData.Auto_id === id
      })
      // Extract the Unit_Name from the filtered data
      const unitName = currentUnitDetails[0].Unit_Name;

      // Set the Unit_Name to the state
      setUpdatedUnitName(unitName);
      setUnitData(currentUnitDetails);
      handleUnitModal();
    }
    else if (context === 'groupNameHead') {
      const currentGroupNameDetails = data.filter(function (currentData) {
        return currentData.Auto_id === id
      })
      // Extract the Unit_Name from the filtered data
      const groupName = currentGroupNameDetails[0].Group_Name;

      // Set the Unit_Name to the state
      setUpdatedGroupName(groupName);

      setGroupNameData(currentGroupNameDetails);
      handleGroupNameModal();
    }
    else if (context === 'itemsHead') {
      const currentGroupNameDetails = data.filter(function (currentData) {
        return currentData.Auto_id === id
      })

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


      if (!unitDataResponse.ok || !grouNamepDataResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const unitDataJson = await unitDataResponse.json();
      setUnitNames(unitDataJson);
      const groupNameDataJson = await grouNamepDataResponse.json();
      setgroupNames(groupNameDataJson);

      const groupName = currentGroupNameDetails[0].Group_Name;
      const unitName = currentGroupNameDetails[0].Unit_Name;
      const description = currentGroupNameDetails[0].Description;
      const itemName = currentGroupNameDetails[0].Item_Name;
      setUpdatedItemGroupName(groupName);
      setUpdatedItemUnitName(unitName);
      setUpdatedDescription(description);
      setUpdatedItemName(itemName);
      setItemsData(currentGroupNameDetails);
      handleItemsModal();
    }
    else if (context === 'purchaseHead') {
      const currentpurchaseEntryDetails = data.filter(function (currentData) {
        return currentData.Auto_id === id
      })

      //Progress Purchase Data
      const shopDataResponse = await fetch(
        `http://localhost:5003/api/shopDetails/get/allShopDetails?token=${token}`,
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
      const ItemDataResponse = await fetch(
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


      if (!shopDataResponse.ok || !ItemDataResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const shopDataJson = await shopDataResponse.json();
      setShopForPurchaseEntry(shopDataJson);
      const itemDataJson = await ItemDataResponse.json();
      setItemsForPurchaseEntry(itemDataJson);
      setPurchaseEntryData(currentpurchaseEntryDetails);
      //Required Details To Show the purcahse entry 
      const autoID = currentpurchaseEntryDetails[0].Auto_id;
      setPurchaseEntryAutoId(autoID)
      const description = currentpurchaseEntryDetails[0].Description;
      setUpdatePurchaseDescription(description);
      const total = currentpurchaseEntryDetails[0].Total_Amount;
      setUpdatedPurchaseTotal(total);
      const sellingPrice = currentpurchaseEntryDetails[0].Selling_Price;
      setUpdatedPurcahseSellingPrice(sellingPrice);
      const quantity = currentpurchaseEntryDetails[0].Quantity;
      setUpdatedPurchaseQuantity(quantity);
      const itemName = currentpurchaseEntryDetails[0].Item_Name;
      setUpdatedPurcahseItemName(itemName);
      const shopNo = currentpurchaseEntryDetails[0].Shop_No;
      setUpdatedPurchaseShopNo(shopNo);
      const date = formatDate(new Date(currentpurchaseEntryDetails[0].Date_of_Entry));
      setUpdatedPurchaseDate(date);

      handlePurchaseEntryModal();
    }
  }

  //Start******************************************************************************************
  //Show the pop-up Window for sales entry
  const handleSalesEntryModal = () => {
    setShowSalesEntryModal(true);
  };
  //hide the pop-up Window for sales entry
  const handleCloseSalesEntryModal = () => {
    setShowSalesEntryModal(false);
  }
  //Check the input quantity and available quantity
  const handleSalesQuantityChange = (inputQuantity) => {
    if (parseInt(inputQuantity) > availableQuantity) {
      // If inputQuantity is greater than availableQuantity, clear the input field
      setSalesEditQuantity('');
    } else {
      // Otherwise, update the salesEditQuantity state
      setSalesEditQuantity(inputQuantity);
    }
  }
  //Saved the update sales Entry 
  const handleSubmitSales = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    let Status = 'Completed'; // Declare Status here

    if (parseInt(salesEditQuantity) !== availableQuantity) {
      Status = 'Progress'; // You can change it to 'In Progress' or any other status as needed
    }
    const totalAmount = parseInt(salesEditQuantity) * salesData[0].Selling_Price
    const inputDetails = {
      Auto_id: salesData[0].Auto_id,
      Sales_no: salesData[0].Sales_No,
      Quantity: salesEditQuantity,
      Purchase_Guid: salesData[0].Purchase_Guid,
      Date_of_Entry: salesDate,
      Shop_No: shopNo,
      Item_Name: salesData[0].Item_Name,
      Selling_Price: salesData[0].Selling_Price,
      Total_Amount: totalAmount,
      Description: '',
      Status: Status,
      Store_ID: user.storeID,
      User_ID: userId
    }

    // Send a POST request to the Sales Item Update endpoint
    const response = await fetch(`http://localhost:5003/api/salesItem/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputDetails),
    });


    if (response.ok) {
      if (response.status === 200) {
        toast.success('Successfuly Saved Sales Entry');
        //navigate('/ShopDashboard')
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
  //End******************************************************************************************

  //Start******************************************************************************************
  //Show the pop-up Window for Item Request entry
  const handleItemReqEntryModal = () => {
    setShowItemReqEntryModal(true);
  };
  //hide the pop-up Window for Item Request entry
  const handleCloseItemReqEntryModal = () => {
    setShowItemReqEntryModal(false);
  };
  //Save the Item Request
  const handleSubmitItemReq = async (e) => {
    e.preventDefault();

    const inputDetails = {
      Quantity: itemRequestQuantity,
      Selling_Price: itemRequestData[0].Selling_Price,
      Auto_id: itemRequestData[0].Auto_id

    }
    // Send a POST request to the Sales Item Update endpoint
    const response = await fetch(`http://localhost:5003/api/itemRequest/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputDetails),
    });


    if (response.ok) {
      if (response.status === 200) {
        toast.success('Successfuly Saved Item Request');
        //navigate('/ShopDashboard')
      }
    }
    else {
      // Handle login error
      const errorData = await response.json();
      console.log('error:', errorData);
      toast.error(errorData);
      // Display error message or perform other actions
    }

  };
  //End******************************************************************************************

  //Start******************************************************************************************
  //Show the pop-up Window for Item Request entry
  const handlePurchaseConfirmationModal = () => {
    setShowPurchaseConfirmationModal(true);
  };
  //hide the pop-up Window for Item Request entry
  const handleClosePurchaseConfirmationModal = () => {
    setShowPurchaseConfirmationModal(false);
  };

  const handleSubmitPurchaseConfirmation = async (e) => {
    e.preventDefault();

    let status = 1;
    if (purchaseConfirmationStatus === "NO") {
      status = 0
    }
    const inputDetails = {
      Received_By_Shop: status,
      Auto_id: purchaseConfirmationData[0].Auto_id

    }
    // Send a POST request to the Sales Item Update endpoint
    const response = await fetch(`http://localhost:5003/api/purchasedItem/update/shopReceivedStatus?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputDetails),
    });


    if (response.ok) {
      if (response.status === 200) {
        toast.success('Successfuly Update Sent the status');

        //navigate('/ShopDashboard')
      }
    }
    else {
      // Handle login error
      const errorData = await response.json();
      console.log('error:', errorData);
      toast.error(errorData);
      // Display error message or perform other actions
    }

  };
  //End******************************************************************************************

  //Start******************************************************************************************

  //Show the pop-up Window for sales entry
  const handleUnitModal = () => {
    setShowUnitModal(true);
  };
  //hide the pop-up Window for sales entry
  const handleCloseUnitModal = () => {
    setShowUnitModal(false);
  }

  const handleSubmitUnit = async (e) => {
    e.preventDefault();
    const currentUntDetails = data.filter(function (currentData) {
      return currentData.Unit_Name === updatedUnitName
    })

    if (currentUntDetails.length > 0) {
      toast.error("Unit Name Present Try Different Unit Name")
    } else {
      const inputDetails = {
        Data_ID: unitData[0].Auto_id,
        New_Unit_Name: updatedUnitName,
        Old_Unit_Name: unitData[0].Unit_Name,
        Store_ID: user.storeID,
        User_ID: userId
      }

      // Send a POST request to the Sales Item Update endpoint
      const response = await fetch(`http://localhost:5003/api/itemunit/update?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputDetails),
      });


      if (response.ok) {
        if (response.status === 200) {
          toast.success('Successfuly Update Unit Name');

          //navigate('/ShopDashboard')
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
  }

  //End******************************************************************************************

  //Start******************************************************************************************

  //Show the pop-up Window for sales entry
  const handleGroupNameModal = () => {
    setShowGroupNameModal(true);
  };
  //hide the pop-up Window for sales entry
  const handleCloseGroupNameModal = () => {
    setShowGroupNameModal(false);
  }

  const handleSubmitGroupName = async (e) => {
    e.preventDefault();
    const currentUntDetails = data.filter(function (currentData) {
      return currentData.Group_Name === updatedGroupName
    })

    if (currentUntDetails.length > 0) {
      toast.error("Group Name Present Try Different Group Name")
    } else {
      const inputDetails = {
        Data_ID: GroupNameData[0].Auto_id,
        New_Group_Name: updatedGroupName,
        Old_Group_Name: GroupNameData[0].Group_Name,
        Store_ID: user.storeID,
        User_ID: userId
      }

      // Send a POST request to the Sales Item Update endpoint
      const response = await fetch(`http://localhost:5003/api/itemGroup/update?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputDetails),
      });


      if (response.ok) {
        if (response.status === 200) {
          toast.success('Successfuly Update Unit Name');

          //navigate('/ShopDashboard')
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
  }

  //End******************************************************************************************

  //Start******************************************************************************************

  //Show the pop-up Window for sales entry
  const handleItemsModal = () => {
    setShowItemsModal(true);
  };
  //hide the pop-up Window for sales entry
  const handleCloseItemsModal = () => {
    setShowItemsModal(false);
  }

  const handleSubmitItems = async (e) => {
    e.preventDefault();


    const currentItemDetails = data.filter(function (currentData) {
      return currentData.Item_Name === updatedItemName
    })

    const checkingId = currentItemDetails.filter(function (currentdata) {
      return currentdata.Auto_id === itemsData[0].Auto_id
    })
    let updateItem = false;
    if (checkingId.length > 0) {
      updateItem = true;
    }
    else {
      if (currentItemDetails.length > 0) {
        toast.error("Item Name Present Try Different Item Name");
        updateItem = false;
      } else {
        updateItem = true;
      }
    }
    if (updateItem) {

      const inputDetails = {
        Auto_id: itemsData[0].Auto_id,
        Group_Name: updatedItemGroupName,
        New_Item_Name: updatedItemName,
        Old_Item_Name: itemsData[0].Item_Name,
        Unit_Name: updatedItemUnitName,
        Description: updatedDescription,
        Status: itemsData[0].Status,
        Store_ID: user.storeID,
        User_ID: userId
      }
      // Send a POST request to the Sales Item Update endpoint
      const response = await fetch(`http://localhost:5003/api/items/update?token=${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputDetails),
      });


      if (response.ok) {
        if (response.status === 200) {
          toast.success('Successfuly Update Unit Name');

          //navigate('/ShopDashboard')
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
  }

  //End******************************************************************************************

  //Start******************************************************************************************

  //Show the pop-up Window for sales entry
  const handlePurchaseEntryModal = () => {
    setShowPurchaseEntryModal(true);
  };
  //hide the pop-up Window for sales entry
  const handleClosePurchaseEntryModal = () => {
    setShowPurchaseEntryModal(false);
  }
  const handleSubmitPurchaseEntry = async (e) => {
    e.preventDefault();


    const currentPurchaseEntryDetails = data.filter(function (currentData) {
      return currentData.Auto_id === PurchaseEntryAutoId;
    })
    
    const inputDetails = {
      Auto_id: PurchaseEntryAutoId,
      Date_of_Entry: UpdatedPurchaseDate,
      Item_Name: UpdatedPurcahseItemName,
      Quantity: UpdatedPurchaseQuantity,
      Selling_Price: UpdatedPurcahseSellingPrice,
      Total_Amount: UpdatedPurchaseTotal,
      Description: UpdatePurchaseDescription,
      Status:currentPurchaseEntryDetails[0].Status,
      Received_By_Shop:0,
      Store_ID: user.storeID,
      User_ID: userId
    }
    // Send a POST request to the Sales Item Update endpoint
    const response = await fetch(`http://localhost:5003/api/purchasedItem/update?token=${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputDetails),
    });


    if (response.ok) {
      if (response.status === 200) {
        toast.success('Successfuly Update purchase Entry');
        handleClosePurchaseEntryModal();
        //navigate('/ShopDashboard')
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

  //End******************************************************************************************

  /* it converts all the data// Function to convert table data to CSV
  const convertToCSV = (data) => {
    const csv = [];
    // Create the CSV header from table columns
    const columns = Object.keys(data[0]);
    csv.push(columns.join(','));

    // Iterate through data and create rows
    data.forEach((item) => {
        const row = columns.map((column) => item[column]).join(',');
        csv.push(row);
    });

    // Combine rows into a single CSV string
    return csv.join('\n');
}; */

  // Function to convert table data to CSV
  const convertToCSV = () => {
    const csv = [];
    // Create the CSV header from table headers
    csv.push(tableHeaders.join(','));

    // Iterate through data and create rows
    filteredData.forEach((item) => {
      const row = tableTdHeader.map((header) => {
        if (header === "Date_of_Entry" || header === "Date_of_Request") {
          // Format the date using the formatDateToDDMMYYYY function
          return formatDateToDDMMYYYY(new Date(item[header]));
        } else {
          return item[header];
        }
      }).join(',');

      csv.push(row);
    });

    // Combine rows into a single CSV string
    return csv.join('\n');
  };

  // Function to download CSV file
  const downloadCSV = () => {
    const tableData = context === 'shopSalesTableHead' ? data :
      context === 'shopItemReqHead' ? data :
        context === 'purchaseConfirmationHead' ? data : [];

    const csvContent = convertToCSV(tableData);

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv' });

    // Create a URL for the Blob
    const url = window.URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table_data.csv'; // Set the file name here

    // Trigger a click event to initiate the download
    a.click();

    // Release the URL object to free up resources
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container-fluid">
      <div className="card shadow">
        <div className="card-header py-3">
          <div className="d-sm-flex justify-content-between align-items-center mb-2">
            <h3 className="text-dark mb-0">{tableTitle}</h3>
            <div>
              <button className="btn btn-primary" style={{ marginRight: "10px" }} onClick={() => navigate(buttonLink)}>
                <Icon.Plus /> {buttonText}
              </button>
              <button onClick={downloadCSV}>Download CSV</button>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 text-nowrap">
              <div id="dataTable_length" className="dataTables_length" aria-controls="dataTable">
                <label className="form-label">
                  Show&nbsp;
                  <select
                    className="d-inline-block form-select form-select-sm"
                    value={showRows}
                    onChange={(e) => setShowRows(parseInt(e.target.value))}
                  >
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                  &nbsp;
                </label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="text-md-end dataTables_filter" id="dataTable_filter" style={{ display: "flex", flexDirection: "row-reverse" }}>
                <label className="form-label">
                  <input
                    type="search"
                    className="form-control form-control-sm"
                    aria-controls="dataTable"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearch}
                  ></input>
                </label>
              </div>
            </div>
          </div>
          <div className="table-responsive table mt-2" id="dataTable" role="grid" aria-describedby="dataTable_info">
            <table className="table my-0" id="dataTable">
              <thead>
                <tr style={{ color: "black" }}>
                  {tableHeaders.map((dt, index) => (
                    <th key={index}>{dt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row) => (
                  <tr key={row.Auto_id} style={{ color: "black" }}>
                    {/* Render table data based on table headers */}
                    {tableTdHeader.map((header, idx) => {
                      if (header === "Action") {
                        return (
                          <td key={idx}>
                            <div className="table-icons">
                              <Icon.Edit2

                                onClick={() => handleEdit(row.Auto_id)}
                                style={{ cursor: 'pointer' }}
                                className="edit-icon"
                              />

                              {/* Eye icon 
                              <Icon.Eye
                                size={20}
                                onClick={() => navigate(`/View/Invoice/${row.Auto_id}`)}
                                style={{ cursor: 'pointer' }}
                              />
                              <Icon.Trash2
                                onClick={() => handleDelete(row.Auto_id)}
                                className="delete-icon"
                              />*/}
                            </div>
                          </td>
                        );
                      } else if (header === "Date_of_Entry" || header === "Date_of_Request" || header === "Date_of_Creation") {
                        // Format the date using the formatDateToDDMMYYYY function
                        const formattedDate = formatDateToDDMMYYYY(new Date(row[header]));
                        return <td key={idx}>{formattedDate}</td>;
                      } else {
                        // Map the correct column data based on the header
                        const columnName = mapHeaderToColumnName(header); // Implement this function
                        return <td key={idx}>{row[columnName]}</td>;
                      }
                    })}
                  </tr>
                ))}

              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-md-6 align-self-center">
              <p>
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, tableData.length)} of {tableData.length} entries
              </p>
            </div>
            <div className="col-md-6">
              <div className="dataTables_paginate paging_simple_numbers">
                <ul className="pagination" style={{ flexDirection: "row-reverse" }}>
                  {/* Render pagination buttons */}
                  {Array.from({ length: Math.ceil(tableData.length / showRows) }).map((_, index) => (
                    <li key={index} className={`paginate_button page-item ${currentPage === index + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => paginate(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Sales Edit Modal */}
      {showSalesEntryModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item List</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseSalesEntryModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form > {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="signature" style={{ color: 'rgb(0,0,0)', paddingTop: '11px' }}>
                      <strong>Date</strong>
                    </label>
                    <input className="form-control" type="date"
                      value={salesDate}
                      onChange={(e) => setsalesDate(e.target.value)}
                      style={{ marginBottom: '10px', borderRadius: '14.6px' }} />
                    <label htmlFor="salesNumber" className="form-label">{salesData[0].Item_Name}- Available Q- {availableQuantity}</label>
                    <input
                      type="number"
                      className="form-control"
                      id="salesNumber"
                      value={salesEditQuantity}
                      onChange={(e) => handleSalesQuantityChange(e.target.value)}
                    />

                  </div>
                  <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitSales}>
                    <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*Item Request Edit Modal */}
      {showItemReqEntryModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item List</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseItemReqEntryModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form > {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">

                    <label htmlFor="salesNumber" className="form-label">Item Name - {itemRequestData[0].Item_Name}</label>
                    <input
                      type="number"
                      className="form-control"
                      id="salesNumber"
                      value={itemRequestQuantity}
                      onChange={(e) => setItemRequestQuantity(e.target.value)}
                    />

                  </div>
                  <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitItemReq}>
                    <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*Purchase Item Edit Modal */}
      {showPurchaseConfirmationModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Item List</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClosePurchaseConfirmationModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form > {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">

                    <label htmlFor="salesNumber" className="form-label">Item Name - {purchaseConfirmationData[0].Item_Name} </label>
                    <label htmlFor="salesNumber" className="form-label">Item Quantity - {purchaseConfirmationData[0].Quantity} </label>
                    <label htmlFor="salesNumber" className="form-label">Selling Price - {purchaseConfirmationData[0].Selling_Price}</label>
                    <label className="form-label">
                      Received&nbsp;
                      <select
                        className="d-inline-block form-select form-select-sm"
                        value={purchaseConfirmationStatus}
                        onChange={(e) => setPurchaseConfirmationStatus(e.target.value)}
                      >
                        <option value="10">YES</option>
                        <option value="25">NO</option>
                      </select>
                      &nbsp;
                    </label>
                  </div>
                  <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitPurchaseConfirmation}>
                    <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*Unit  Edit Modal */}
      {showUnitModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Unit Name</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseUnitModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form > {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">
                    <label htmlFor="salesNumber" className="form-label">Unit Name</label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id={unitData[0].Auto_id}
                      value={updatedUnitName}
                      onChange={(e) => setUpdatedUnitName(e.target.value)}
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
      {showGroupNameModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Group Name</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseGroupNameModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form > {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">
                    <label htmlFor="salesNumber" className="form-label">Group Name</label>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id={GroupNameData[0].Auto_id}
                      value={updatedGroupName}
                      onChange={(e) => setUpdatedGroupName(e.target.value)}
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
      {showItemsModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Item Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseItemsModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form> {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">
                    <label htmlFor="groupName" className="form-label">Group Name</label>
                    <select
                      className="form-select"
                      id="groupName"
                      value={updatedItemGroupName}
                      onChange={(e) => setUpdatedItemGroupName(e.target.value)}
                    >
                      {/* Render the dropdown options dynamically */}
                      {groupNames.map((groupName) => (
                        <option key={groupName.Group_Name} value={groupName.Group_Name}>
                          {groupName.Group_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unitName" className="form-label">Unit Name</label>
                    <select
                      className="form-select"
                      id="unitName"
                      value={updatedUnitName}
                      onChange={(e) => setUpdatedUnitName(e.target.value)}
                    >
                      {/* Render the dropdown options dynamically */}
                      {unitNames.map((unitName) => (
                        <option key={unitName.Unit_Name} value={unitName.Unit_Name}>
                          {unitName.Unit_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="itemName"
                      value={updatedItemName}
                      onChange={(e) => setUpdatedItemName(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={updatedDescription}
                      onChange={(e) => setUpdatedDescription(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitItems}>
                    <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {ShowPurchaseEntryModal && (
        <div className="modal modal-dialog-scrollable" tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-scrollable" role="document" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Update Purcahse Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleClosePurchaseEntryModal}></button>
              </div>
              <div className="modal-body">
                {/* Render the Solutionform inside the modal */}
                <form> {/* Move the form here and add the onSubmit attribute */}
                  <div className="mb-3">
                    <label className="form-label" htmlFor="signature" style={{ color: 'rgb(0,0,0)', paddingTop: '11px' }}>
                      <strong>Purcahse Date</strong>
                    </label>
                    <input className="form-control" type="date"
                      value={UpdatedPurchaseDate}
                      onChange={(e) => setUpdatedPurchaseDate(e.target.value)}
                      style={{ marginBottom: '10px', borderRadius: '14.6px' }} />

                  </div>
                  <div className="mb-3">
                    <label htmlFor="groupName" className="form-label">Shop No</label>
                    <select
                      className="form-select"
                      id="groupName"
                      value={UpdatedPurchaseShopNo}
                      onChange={(e) => setUpdatedPurchaseShopNo(e.target.value)}
                    >
                      {/* Render the dropdown options dynamically */}
                      {ShopForPurchaseEntry.map((shop) => (
                        <option key={shop.Shop_No} value={shop.Shop_No}>
                          {shop.Shop_No}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="unitName" className="form-label">Item Name</label>
                    <select
                      className="form-select"
                      id="unitName"
                      value={UpdatedPurcahseItemName}
                      onChange={(e) => setUpdatedPurcahseItemName(e.target.value)}
                    >
                      {/* Render the dropdown options dynamically */}
                      {ItemsForPurchaseEntry.map((item) => (
                        <option key={item.Item_Name} value={item.Item_Name}>
                          {item.Item_Name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Quantity</label>
                    <input
                      type="Number"
                      className="form-control"
                      id="itemName"
                      value={UpdatedPurchaseQuantity}
                      onChange={(e) => setUpdatedPurchaseQuantity(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Selling Price</label>
                    <input
                      type="Number"
                      className="form-control"
                      id="itemName"
                      value={UpdatedPurcahseSellingPrice}
                      onChange={(e) => setUpdatedPurcahseSellingPrice(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">Total Purchase Value</label>
                    <input
                      type="Number"
                      className="form-control"
                      id="itemName"
                      value={UpdatedPurchaseTotal}
                      onChange={(e) => setUpdatedPurchaseTotal(e.target.value)}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      id="description"
                      value={UpdatePurchaseDescription}
                      onChange={(e) => setUpdatePurchaseDescription(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary btn-sm" type="submit" onClick={handleSubmitPurchaseEntry}>
                    <i className="fas fa-download fa-sm text-white-50"></i>&nbsp; Save
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Table;
