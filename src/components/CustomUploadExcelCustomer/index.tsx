import RemoveIcon from "@/assets/removeIcon.svg";

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
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface CustomUploadExcelProps {
  children: ReactNode;
  className?: string;
  onCancel?: any;
  typeImport?: any;
}

/**
 * CustomUploadExcelCustomer component allows users to upload Excel files by either
 * clicking to select a file or dragging and dropping a file into the designated area.
 * It handles file uploads, displays loading states, and manages file input reset.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the upload area.
 * @param {string} className - Additional CSS classes to apply to the component.
 * @param {() => void} onCancel - Callback function to be called when the upload is cancelled.
 * @param {string} typeImport - The type of import, which determines the upload function to use.
 *
 * @returns {JSX.Element} The rendered CustomUploadExcelCustomer component.
 */
export function CustomUploadExcelCustomer({ children, className, onCancel, typeImport }: CustomUploadExcelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const branchId = useRecoilValue(branchState);

  const queryClient = useQueryClient();

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        onCancel?.();
        resetFileInput(); // Reset input file on error
        setFileName(null);
      } catch (error: any) {
        message.error(error?.message || "Đã xảy ra lỗi");
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

        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        onCancel?.();
        resetFileInput(); // Reset input file on error
        setFileName(null);
      } catch (error: any) {
        message.error(error?.message || "Đã xảy ra lỗi");
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

  const handleRemoveFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation(); // Stop the event from bubbling up to the parent element
    setFileName(null);
    resetFileInput(); // Reset the file input so a new file can be selected
  };

  return (
    <div className={className} onDrop={handleDrop} onDragOver={handleDragOver} onClick={handleImportClick}>
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
      {fileName && (
        <div className="flex gap-2 pt-2">
          <div className="file-name">{fileName}</div>
          <button onClick={handleRemoveFile}>
            <Image src={RemoveIcon} />
          </button>
        </div>
      )}
    </div>
  );
}
