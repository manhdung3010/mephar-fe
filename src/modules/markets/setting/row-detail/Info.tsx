import Image from 'next/image';

import CloseIcon from '@/assets/closeIcon.svg';
import DeleteIcon from '@/assets/deleteRed.svg';
import ProductImage from '@/assets/images/product.png';
import Product1Image from '@/assets/images/product-sample.png';
import SaveIcon from '@/assets/saveIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomSelect } from '@/components/CustomSelect';

export function Info({ record }: { record: any }) {
  return (
    <div className="gap-12 ">
      <div className="mb-10 flex gap-9">
        <div>
          <div className="mb-2 h-[223px] w-[223px] rounded-md border border-[#C9C6D9] py-1 px-4">
            <Image src={ProductImage} />
          </div>

          <div className="flex justify-between gap-2">
            <div className="flex w-1/3 items-center rounded-md border border-[#C9C6D9] p-1">
              <Image src={Product1Image} />
            </div>
            <div className="flex w-1/3 items-center  rounded-md border border-[#C9C6D9] p-1">
              <Image src={Product1Image} />
            </div>
            <div className="flex w-1/3 items-center rounded-md border border-[#C9C6D9] p-1">
              <Image src={Product1Image} />
            </div>
          </div>
        </div>
        <div className="mb-4 grid grow grid-cols-2 gap-4 gap-x-9">
          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Nhóm sản phẩm:</div>
            <div className="col-span-2 text-black-main">Nhóm 1</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Giá bán (VND):</div>
            <div className="col-span-2  text-black-main">100000</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Sản phẩm:</div>
            <div className="col-span-2 text-black-main">
              Kim Chích Máu Accu-Chek Softclix Roche
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Giá khuyến mãi (VND):</div>
            <div className="col-span-2 text-black-main">98.000</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Loại chợ:</div>
            <div className="col-span-2 text-black-main">Chợ chung</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="col-span-2 text-black-main">Quyentt</div>
          </div>

          <div className="flex grid grid-cols-3 items-center gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className="col-span-2">
              <CustomSelect onChange={() => {}} className="border-underline " />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Thời gian cập nhật cuối:</div>
            <div className="col-span-2 text-black-main">10:30, 12/02/2023</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Số lượng tồn:</div>
            <div className="col-span-2 text-black-main">100</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Người cập nhật cuối:</div>
            <div className="col-span-2 text-black-main">Quyentt</div>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="text-gray-main">Số lượng đã bán:</div>
            <div className="col-span-2 text-black-main">12</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          outline={true}
          prefixIcon={<Image src={DeleteIcon} alt="" />}
        >
          Xóa
        </CustomButton>
        <CustomButton
          outline={true}
          prefixIcon={<Image src={CloseIcon} alt="" />}
        >
          Hủy bỏ
        </CustomButton>
        <CustomButton
          type="success"
          prefixIcon={<Image src={SaveIcon} alt="" />}
        >
          Lưu
        </CustomButton>
      </div>
    </div>
  );
}
