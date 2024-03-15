import Image from 'next/image';

import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import PhotographIcon from '@/assets/photograph.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomUpload } from '@/components/CustomUpload';

export function AddMarketSetting() {
  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          Thêm mới CẤU HÌNH SẢN PHẨM LÊN CHỢ
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton>Lưu</CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
            <div>
              <Label infoText="" label="Nhóm sản phẩm" required />
              <CustomSelect
                onChange={() => {}}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhóm sản phẩm"
                suffixIcon={<Image src={ArrowDownIcon} />}
              />
            </div>

            <div>
              <Label infoText="" label="Sản phẩm" required />
              <CustomSelect
                onChange={() => {}}
                className="suffix-icon h-11 !rounded"
                placeholder="NTìm sp"
                suffixIcon={<Image src={SearchIcon} />}
              />
            </div>

            <div>
              <Label infoText="" label="Số lượng tồn" required />
              <CustomInput
                placeholder="Nhập số lượng tồn"
                className="h-11"
                onChange={() => {}}
              />
            </div>

            <div>
              <Label infoText="" label="Loại chợ" required />
              <CustomSelect
                onChange={() => {}}
                className="suffix-icon h-11 !rounded"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} />
                  </div>
                }
              />
            </div>
            <div>
              <Label infoText="" label="Giá khuyến mãi" required />
              <CustomInput
                placeholder="Nhập giá khuyến mãi"
                className="h-11"
                onChange={() => {}}
              />
            </div>

            <div>
              <Label infoText="" label="Giá bán trên chợ" required />
              <CustomInput
                placeholder="Nhập giá bán"
                className="h-11"
                onChange={() => {}}
              />
            </div>
          </div>

          <div>
            <Label infoText="" label="Vị trí" required />
            <CustomTextarea rows={10} placeholder="Nhập mô tả" />
          </div>
        </div>

        <div
          className="flex h-fit w-1/3 max-w-[360px] flex-col bg-white p-5"
          style={{
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">
              Hình ảnh minh họa
            </div>
            <CustomUpload>
              <div
                className={
                  'flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5'
                }
              >
                <Image src={PhotographIcon} alt="" />
                <div className="font-semibold">
                  <span className="text-[#E03]">Tải ảnh lên</span>{' '}
                  <span className="text-[#6F727A]">hoặc kéo và thả</span>
                </div>
                <div className="font-thin text-[#6F727A]">
                  PNG, JPG, GIF up to 2MB
                </div>
              </div>
            </CustomUpload>
          </div>

          <div className="-mx-1 flex">
            <div className="w-1/3 px-1 ">
              <CustomUpload>
                <div className="flex h-[90px] w-full items-center justify-center rounded-md border-2 border-dashed border-[#9CA1AD]">
                  <Image src={PhotographIcon} alt="" />
                </div>
              </CustomUpload>
            </div>
            <div className="w-1/3 px-1 ">
              <CustomUpload>
                <div className="flex h-[90px] w-full items-center justify-center rounded-md border-2 border-dashed border-[#9CA1AD]">
                  <Image src={PhotographIcon} alt="" />
                </div>
              </CustomUpload>
            </div>
            <div className="w-1/3 px-1 ">
              <CustomUpload>
                <div className="flex h-[90px] w-full items-center justify-center rounded-md border-2 border-dashed border-[#9CA1AD]">
                  <Image src={PhotographIcon} alt="" />
                </div>
              </CustomUpload>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
