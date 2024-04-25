import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-alpine.css"; // Theme


//Create new Grid component
export const DataGrid = () => {
  const [data, setData] = useState([]); // State to hold the rows
  const [keys, setKeys] = useState([]); // State to hold the keys

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/data");//making api call to get data
        const fetchedData = response.data;
        setData(fetchedData);//assigning data to data variable
        // Extract keys from the first data item
        if (fetchedData.length > 0) {
          const firstItemKeys = Object.keys(fetchedData[0]);
          setKeys(firstItemKeys); //assigning data to keys
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  

  /* Custom Cell Renderer (Display tick / cross in 'Successful' column) */
  const MissionResultRenderer = ({ value }) => (
    <span
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      {
        <img
          alt={`${value}`}
          src={`https://www.ag-grid.com/example-assets/icons/${
            value ? "tick-in-circle" : "cross-in-circle"
          }.png`}
          style={{ width: "auto", height: "auto" }}
        />
      }
    </span>
  );

  const rowData = data;
  const colData = keys.map((key) => {
    const column = {
      headerName: key, // Use key as headerName
      field: key, // Use key as field
    };

    // Add checkboxSelection: true if key is 'id'
    if (key === "id") {
      column.checkboxSelection = true;
    }

    // Add cellRenderer: true if key is 'boolean'
    if (key === "boolean") {
      column.cellRenderer = MissionResultRenderer;
    }

    // if(key==='date'){
    //   column.filter='agDateColumnFilter';
    // }

    return column;
  });

  const defaultColDef = {//adding column field properties
    sortable: true,
    filter: true,
    floatingFilter: true,
    // enableRowGroup: true,
    // enablePivot: true,
    // enableValue: true,
     flex: 1,//flexiable column
    minWidth: 50,
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 570 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colData}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        //suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100, 200]}
      />
    </div>
  );
};  