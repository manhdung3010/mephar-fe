import { useState, useEffect } from "react";

const useBarcodeScanner = () => {
  const [scannedData, setScannedData] = useState("");
  const [isScanned, setIsScanned] = useState(false);
  const [tempData, setTempData] = useState("");

  useEffect(() => {
    const handleBarcodeScanned = (event) => {
      setIsScanned(false);
      if (event.keyCode === 13) {
        event.preventDefault();
        setTempData("");
        setScannedData(tempData);
        setIsScanned(true);
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

  return { scannedData, isScanned };
};

export default useBarcodeScanner;
