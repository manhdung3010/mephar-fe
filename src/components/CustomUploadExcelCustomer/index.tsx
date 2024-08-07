import type { ReactNode, ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import { message } from "antd";

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
  const branchId = useRecoilValue(branchState);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        if (typeImport === "default") {
          await uploadCustomerExcel(file, branchId);
        } else {
          await uploadCustomerExcelKiot(file, branchId);
        }
        message.success("Nhập file thành công!");
        onCancel();
      } catch (error: any) {
        message.error(error?.message);
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

      <label className="custom-upload-label">{children}</label>
    </div>
  );
}
