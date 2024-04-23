import React, { useState, useEffect } from 'react';

const BarcodeScanner = () => {
  const [scannedData, setScannedData] = useState('');

  useEffect(() => {
    const handleBarcodeScanned = (event) => {
      // Xử lý dữ liệu quét được ở đây
      const scannedValue = event.data; // Lấy dữ liệu từ sự kiện
      setScannedData(scannedValue);

      console.log("event", event);
    };

    // Đăng ký lắng nghe sự kiện từ cả trang web
    document.addEventListener('keypress', handleBarcodeScanned);

    // Xóa bỏ lắng nghe sự kiện khi component unmount
    return () => {
      document.removeEventListener('keypress', handleBarcodeScanned);
    };
  }, []); // Dependency array rỗng để chỉ chạy một lần khi component mount

  console.log("scannedData", scannedData);

  return (
    <div>
      <p>Scanned Data: {scannedData}</p>
    </div>
  );
};

export default BarcodeScanner;
