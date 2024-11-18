import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import ImgCrop from "antd-img-crop";
import NextImage from "next/image";
import type { ReactNode } from "react";
import React, { useState } from "react";

import { uploadSingleFile } from "@/api/upload.service";
import { getImage } from "@/helpers";

import { UploadStyled } from "./styled";
import { message } from "antd";

/**
 * CustomUpload component for handling file uploads with additional features like file size validation,
 * preview, and removal. It uses Ant Design's Upload component with ImgCrop for image cropping.
 *
 * @param {ReactNode} children - The content to be displayed inside the upload area.
 * @param {string} [className] - Optional class name for custom styling.
 * @param {(value: any) => void} [onChangeValue] - Optional callback function to handle changes in file upload.
 * @param {string[]} [values] - Optional array of file URLs to display initially.
 * @param {number} [maxCount=1] - Maximum number of files that can be uploaded.
 * @param {any} [fileUrl] - Optional URL of a file to be displayed.
 *
 * @returns {JSX.Element} The rendered CustomUpload component.
 */
export function CustomUpload({
  children,
  className,
  onChangeValue,
  values,
  maxCount = 1,
  fileUrl,
}: {
  children: ReactNode;
  className?: string;
  onChangeValue?: (value) => void;
  values?: string[];
  maxCount?: number;
  fileUrl?: any;
}) {
  const [files, setFiles] = useState<string[]>([]);
  const props: UploadProps = {
    async onChange(info: any) {
      // validate file size
      if (info.file.size > 2 * 1024 * 1024) {
        message.error("Dung lượng file không được lớn hơn 2MB");
        return;
      }

      setFiles((preValues) => [...preValues, info.file.name]);
      const res = await uploadSingleFile(info.file);
      if (res?.data?.id) {
        if (onChangeValue) {
          onChangeValue(res?.data?.id);
        }
      }
    },
    async onPreview(file: UploadFile) {
      // Hide preview if file size is larger than 2MB
      if (file.size && file.size > 2 * 1024 * 1024) {
        message.error("Không thể xem trước các tệp lớn hơn 2MB");
        return;
      }
      let src = file.url as string;
      if (!src) {
        src = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as RcFile);
          reader.onload = () => resolve(reader.result as string);
        });
      }
      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      imgWindow?.document.write(image.outerHTML);
    },
    onRemove(file: UploadFile) {
      setFiles((preValues) => preValues.filter((item) => item !== file.name));
    },
    beforeUpload: () => false,
    accept: "image/*",
    listType: "picture-card",
    maxCount,
    multiple: maxCount > 1,
  };

  return (
    <ImgCrop rotationSlider>
      <>
        <UploadStyled className={className} {...props}>
          {children}
        </UploadStyled>
        {!files.length && values?.length && (
          <div className="mt-3">
            {values.map((file) => {
              if (file) {
                return (
                  <div
                    key={file}
                    className="relative -mt-2 flex h-[102px] w-[102px] items-center justify-center rounded-lg !border !border-[#d9d9d9] p-1"
                  >
                    <NextImage
                      width={102}
                      height={102}
                      className="rounded-lg object-cover py-1"
                      src={getImage(file)}
                      alt=""
                    />
                  </div>
                );
              } else if (fileUrl) {
                return (
                  <div
                    key={file}
                    className="relative -mt-2 flex h-[102px] w-[102px] items-center justify-center rounded-lg !border !border-[#d9d9d9] p-1"
                  >
                    <NextImage width={102} height={102} className="rounded-lg object-cover py-1" src={fileUrl} alt="" />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </>
    </ImgCrop>
  );
}
