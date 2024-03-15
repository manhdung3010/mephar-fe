import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import NextImage from 'next/image';
import type { ReactNode } from 'react';
import React, { useState } from 'react';

import { uploadSingleFile } from '@/api/upload.service';
import { getImage } from '@/helpers';

import { UploadStyled } from './styled';

export function CustomUpload({
  children,
  className,
  onChangeValue,
  values,
  maxCount = 1,
}: {
  children: ReactNode;
  className?: string;
  onChangeValue?: (value) => void;
  values?: string[];
  maxCount?: number;
}) {
  const [files, setFiles] = useState<string[]>([]);

  const props: UploadProps = {
    async onChange(info) {
      setFiles((preValues) => [...preValues, info.file.name]);
      const res = await uploadSingleFile(info.file);
      if (res?.data?.id) {
        if (onChangeValue) {
          onChangeValue(res?.data?.id);
        }
      }
    },
    async onPreview(file: UploadFile) {
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
    accept: 'image/*',
    listType: 'picture-card',
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
            {values.map((file) => (
              <>
                {file && (
                  <div
                    key={file}
                    className=" relative -mt-2 flex h-[102px] w-[102px] items-center justify-center rounded-lg !border !border-[#d9d9d9] p-1"
                  >
                    <NextImage
                      width={102}
                      height={102}
                      className=" rounded-lg object-cover py-1"
                      src={getImage(file)}
                      alt=""
                    />
                  </div>
                )}
              </>
            ))}
          </div>
        )}
      </>
    </ImgCrop>
  );
}
