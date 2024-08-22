import { ReactNode, ChangeEvent } from "react";
import React, { useRef, useState } from "react";
import { message, Spin } from "antd";

import RemoveIcon from "@/assets/removeIcon.svg";

import { UploadStyled } from "./styled";
import {
  uploadProductExcel,
  uploadProductExcelKiot,
  uploadSupplierExcelKiot,
} from "@/api/import.service";
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

export function CustomUploadExcel({
  children,
  className,
  onCancel,
  typeImport = "default",
}: CustomUploadExcelProps) {
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
        await uploadSupplierExcelKiot(file, branchId);

        await queryClient.invalidateQueries(["PROVIDER_LIST"]);
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
        await uploadSupplierExcelKiot(file, branchId);
        await queryClient.invalidateQueries(["PROVIDER_LIST"]);
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
