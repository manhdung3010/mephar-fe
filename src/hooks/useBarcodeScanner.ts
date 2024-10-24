import { useState, useEffect } from "react";

/**
 * Custom hook that handles barcode scanning functionality.
 *
 * @returns {Object} An object containing the scanned data and a flag indicating if the data has been scanned.
 * @returns {string} scannedData - The data that has been scanned.
 * @returns {boolean} isScanned - A flag indicating if the data has been scanned.
 *
 * @example
 * const { scannedData, isScanned } = useBarcodeScanner();
 *
 * useEffect(() => {
 *   if (isScanned) {
 *     console.log("Scanned Data:", scannedData);
 *   }
 * }, [isScanned, scannedData]);
 */
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
