import { set } from "lodash";
import { useState, useEffect } from "react";

const useBarcodeScanner = () => {
  const [scannedData, setScannedData] = useState("");
  const [tempData, setTempData] = useState("");

  useEffect(() => {
    const handleBarcodeScanned = (event) => {
      if (event.code === "Enter") {
        setScannedData(tempData);
        setTempData("");
      } else {
        setScannedData("");
        const scannedValue = event.key;
        const newTempData = tempData + scannedValue;
        setTempData(newTempData);
      }
    };

    document.addEventListener("keypress", handleBarcodeScanned);

    return () => {
      document.removeEventListener("keypress", handleBarcodeScanned);
    };
  }, [tempData]);

  return scannedData;
};

export default useBarcodeScanner;
