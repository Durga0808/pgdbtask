import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // React Grid Logic
import axios from "axios";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme

//Create new Grid component
export const DataGrid = () => {
  const [data, setData] = useState([]); // State to hold the rows
  const [keys, setKeys] = useState([]); // State to hold the keys

  useEffect(() => {
    const fetchData = async () => {
      try {
        const startTime = performance.now(); // Start measuring time
       // const response = await axios.get("http://localhost:5000/data"); //making api call to get data
        const response = await axios.get("https://pgdbtask-backend.onrender.com/data"); //making api call to get data
        const fetchedData = response.data;
        // setData(fetchedData); //assigning data to data variable
        // // Extract keys from the first data item
        // if (fetchedData.length > 0) {
        //   const firstItemKeys = Object.keys(fetchedData[0]);
        //   setKeys(firstItemKeys); //assigning data to keys
        // }

        // Convert string representations of numbers to actual numbers
        const convertedData = fetchedData.map((item) => {
          const convertedItem = {};
          for (const key in item) {
            if (typeof item[key] === "string" && !isNaN(item[key])) {
              if (item[key].includes(".")) {
                convertedItem[key] = parseFloat(item[key]);
              } else if (/^-?\d+$/.test(item[key])) {
                convertedItem[key] = parseInt(item[key]);
              } 
              // else if (
              //   typeof BigInt !== "undefined" &&
              //   /^-?\d+$/.test(item[key])
              // )
              //  {
              //   convertedItem[key] = BigInt(item[key]);
              // }
               else {
                convertedItem[key] = item[key];
              }
            } else {
              convertedItem[key] = item[key];
            }
          }
          return convertedItem;
        });

        const endTime = performance.now(); // End measuring time
        const elapsedTime = endTime - startTime; // Calculate elapsed time

        console.log(
          "Time taken for data conversion:",
          elapsedTime,
          "milliseconds"
        );
        setData(convertedData); //assigning data to data variable
        // Extract keys from the first data item
        if (convertedData.length > 0) {
          const firstItemKeys = Object.keys(convertedData[0]);
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

  var currentYear = new Date().getFullYear();
  //Date custom filter
  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      if (!cellValue) return -1; // Check if cellValue is null or undefined

      // Parse the cellValue string into a Date object and set time to midnight
      var cellDate = new Date(cellValue);
      cellDate.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

      // Check if the parsed date is valid
      if (isNaN(cellDate.getTime())) return -1;

      // Create a copy of filterLocalDateAtMidnight and set time to midnight
      var filterDateMidnight = new Date(filterLocalDateAtMidnight);
      filterDateMidnight.setHours(0, 0, 0, 0); // Set time to midnight (00:00:00)

      // Compare the dates without considering time
      if (filterDateMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterDateMidnight) {
        return -1;
      }
      if (cellDate > filterDateMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2000,
    maxValidYear: currentYear,
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };

  const rowData = data;
  const colData = keys.map((key) => {
    const column = {
      headerName: key.toUpperCase(), // Use key as headerName
      field: key, // Use key as field
    };
    // Add checkboxSelection: true if key is 'id'
    if (key === "id") {
      column.checkboxSelection = true;
    }

    // Add cellRenderer: true if key is 'boolean'
    if (key === "boolean") {
      column.cellRenderer = MissionResultRenderer;
      //column.filter = "agSetColumnFilter";
      // column.suppressHeaderMenuButton= true;
    }

    if (key === "date") {
      column.filter = "agDateColumnFilter";
      column.filterParams = filterParams;
    }

    return column;
  });

  const defaultColDef = {
    //adding column field properties
    sortable: true,
    filter: true,
    floatingFilter: true,
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    flex: 1, //flexiable column
    minWidth: 20,
    suppressHeaderMenuButton: true,
  };

  return (
    <div className="ag-theme-quartz" style={{ height: 570 }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colData}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        suppressRowClickSelection={true}
        pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50, 100, 200]}
      />
    </div>
  );
};
