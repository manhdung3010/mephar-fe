import React, { useState } from "react";
import * as XLSX from "xlsx";

const useExportToExcel = (data, columnMapping, fileName) => {
  const [exported, setExported] = useState(false);
  const [displayedColumns, setDisplayedColumns] = useState(
    Object.keys(columnMapping)
  );

  const exportToExcel = () => {
    const worksheetData = data.map((row) => {
      const rowData = {};
      displayedColumns.forEach((column) => {
       if (columnMapping[column]) {
          const nestedFields = column.split('.');
          let value = row;
          nestedFields.forEach(field => {
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
