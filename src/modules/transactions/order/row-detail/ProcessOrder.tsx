import Image from 'next/image';
import { useState } from 'react';

import SampleProduct from '@/assets/images/product-sample.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

import { SeriDetailModal } from './SeriDetailModal';

export function ProcessOrder() {
  const [openSeriDetailModal, setOpenSeriDetailModal] = useState(false);
  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">Xử lý đơn hàng</div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Quay lại</CustomButton>
          <CustomButton>Lưu</CustomButton>
          <CustomButton type="success">Xử lý xong</CustomButton>
        </div>
      </div>

      <div className="bg-white p-5">
        <div className="mb-5 font-semibold text-[#232325]">
          mã đơn hàng:{' '}
          <span className=" font-semibold text-[#0070F4]">ĐH1563246</span>
        </div>

        <div className="mb-5 text-[#A3A8AF]">
          Người mua: <span className="ml-4 text-[#0F1824]">Đại lý 1</span>
        </div>

        <div className="mb-5 font-semibold text-[#232325]">sản phẩm (3)</div>

        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div
              className="mb-2 cursor-pointer font-medium text-[#333]"
              onClick={() => setOpenSeriDetailModal(true)}
            >
              Thuốc cảm cúm
            </div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
          <div className="w-[360px]">
            <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
            <CustomInput className="h-12" onChange={() => {}} />
          </div>
        </div>

        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div className="mb-2 font-medium text-[#333]">Thuốc cảm cúm</div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
          <div className="w-[360px]">
            <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
            <CustomInput className="h-12" onChange={() => {}} />
          </div>
        </div>

        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div className="mb-2 font-medium text-[#333]">Thuốc cảm cúm</div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
          <div className="w-[360px]">
            <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
            <CustomInput className="h-12" onChange={() => {}} />
          </div>
        </div>

        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div className="mb-2 font-medium text-[#333]">Thuốc cảm cúm</div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
          <div className="w-[360px]">
            <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
            <CustomInput className="h-12" onChange={() => {}} />
          </div>
        </div>
        <div className="mb-5 flex items-center">
          <Image src={SampleProduct} alt="" />
          <div className="grow">
            <div className="mb-2 font-medium text-[#333]">Thuốc cảm cúm</div>
            <div className="font-medium text-[#FF8800]">Đã thêm: 2/10</div>
          </div>
          <div className="w-[360px]">
            <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
            <CustomInput className="h-12" onChange={() => {}} />
          </div>
        </div>
      </div>

      <SeriDetailModal
        isOpen={openSeriDetailModal}
        onCancel={() => setOpenSeriDetailModal(false)}
      />
    </>
  );
}
