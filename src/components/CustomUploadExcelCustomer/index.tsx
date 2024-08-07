import type { ReactNode, ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import { message, Spin } from "antd";

import {
  uploadCustomerExcel,
  uploadCustomerExcelKiot,
  uploadProductExcel,
  uploadProductExcelKiot,
} from "@/api/import.service";
import { branchState } from "@/recoil/state";
import { useRecoilValue } from "recoil";

interface CustomUploadExcelProps {
  children: ReactNode;
  className?: string;
  onCancel?: any;
  typeImport?: any;
}

export function CustomUploadExcelCustomer({
  children,
  className,
  onCancel,
  typeImport,
}: CustomUploadExcelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const branchId = useRecoilValue(branchState);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset giá trị input file
    }
    setFileName(null); // Xóa tên file
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
      setLoading(true); // Bắt đầu loading
      try {
        if (typeImport === "default") {
          await uploadCustomerExcel(file, branchId);
        } else {
          await uploadCustomerExcelKiot(file, branchId);
        }
        message.success("Nhập file thành công!");

        onCancel();
      } catch (error: any) {
        message.error(error?.message || "Đã xảy ra lỗi");
        resetFileInput(); // Reset input file khi có lỗi
        onCancel();
      } finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Prevent default behavior (Prevent file from being opened)
  };

  const handleDrop = async (event) => {
    event.preventDefault(); // Prevent default behavior
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setLoading(true); // Bắt đầu loading
      try {
        if (typeImport === "default") {
          await uploadProductExcel(file, branchId);
        } else {
          await uploadProductExcelKiot(file, branchId);
        }
        message.success("Nhập file thành công!");
        onCancel();
      } catch (error: any) {
        message.error(error?.message || "Đã xảy ra lỗi");
        resetFileInput(); // Reset input file khi có lỗi
      } finally {
        setLoading(false); // Kết thúc loading
      }
    }
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={className}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleImportClick}
    >
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        style={{ display: "none" }}
        ref={fileInputRef}
      />

      {loading ? (
        <div className="loading-container w-full flex justify-center h-[200px] items-center">
          <Spin size="large" tip="Đang tải..." />
        </div>
      ) : (
        <label className="custom-upload-label">{children}</label>
      )}
      {fileName && <div className="file-name">{fileName}</div>}
    </div>
  );
}
