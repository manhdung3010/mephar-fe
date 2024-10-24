import { ReactNode, ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import { message, Spin } from "antd";

import RemoveIcon from "@/assets/removeIcon.svg";

import { UploadStyled } from "./styled";
import { uploadProductExcel, uploadProductExcelKiot } from "@/api/import.service";
import { branchState } from "@/recoil/state";
import { useRecoilValue } from "recoil";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

interface CustomUploadExcelProps {
  children: ReactNode;
  className?: string;
  onCancel?: () => void;
  typeImport?: any;
}

/**
 * CustomUploadExcel component allows users to upload Excel files by either
 * clicking to open a file dialog or dragging and dropping files into the component.
 * It supports two types of imports: "default" and "kiot".
 *
 * @param {React.ReactNode} children - The content to be displayed inside the component.
 * @param {string} className - Additional CSS classes to apply to the component.
 * @param {() => void} [onCancel] - Optional callback function to be called when the upload is cancelled.
 * @param {"default" | "kiot"} [typeImport="default"] - The type of import to be performed.
 *
 * @returns {JSX.Element} The rendered CustomUploadExcel component.
 */
export function CustomUploadExcel({ children, className, onCancel, typeImport = "default" }: CustomUploadExcelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const branchId = useRecoilValue(branchState);

  const queryClient = useQueryClient();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setLoading(true); // Start loading
      try {
        if (typeImport === "default") {
          await uploadProductExcel(file, branchId);
        } else {
          await uploadProductExcelKiot(file, branchId);
        }
        await queryClient.invalidateQueries(["LIST_PRODUCT"]);
        onCancel?.();
        resetFileInput(); // Reset input file on error
        setFileName(null);
      } catch (error: any) {
        message.error(error?.message || "An error occurred");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent file from being opened
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior
    const file = event.dataTransfer.files[0];
    if (file) {
      setFileName(file.name);
      setLoading(true); // Start loading
      try {
        if (typeImport === "default") {
          await uploadProductExcel(file, branchId);
        } else {
          await uploadProductExcelKiot(file, branchId);
        }
        await queryClient.invalidateQueries(["LIST_PRODUCT"]);
        onCancel?.();
        resetFileInput(); // Reset input file on error
        setFileName(null);
      } catch (error: any) {
        message.error(error?.message || "An error occurred");
      } finally {
        setLoading(false); // End loading
      }
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <Spin size="large" tip="Loading..." />
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
