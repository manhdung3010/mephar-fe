import React, { useState } from "react";
import * as XLSX from "xlsx";

/**
 * Custom hook to export data to an Excel file.
 *
 * @param data - The data to be exported.
 * @param columnMapping - An object mapping the data fields to the desired column names in the Excel file.
 * @param fileName - The name of the Excel file to be created.
 * @returns An object containing:
 *  - `exported`: A boolean indicating whether the data has been exported.
 *  - `exportToExcel`: A function to trigger the export process.
 *  - `displayedColumns`: An array of the columns to be displayed in the Excel file.
 */
const useExportToExcel = (data, columnMapping, fileName) => {
  const [exported, setExported] = useState(false);
  const [displayedColumns, setDisplayedColumns] = useState(Object.keys(columnMapping));

  const exportToExcel = () => {
    const worksheetData = data.map((row) => {
      const rowData = {};
      displayedColumns.forEach((column) => {
        if (columnMapping[column]) {
          const nestedFields = column.split(".");
          let value = row;
          nestedFields.forEach((field) => {
            value = value ? value[field] : null;
          });
          rowData[columnMapping[column]] = value;
        }
      });
      return rowData;
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, fileName);
    setExported(true);
  };

  return { exported, exportToExcel, displayedColumns };
};

export default useExportToExcel;
