import Image from 'next/image';
import { useResetRecoilState } from 'recoil';

import Clear from '@/assets/clearIcon.svg';
import CollectPoint from '@/assets/collectPointIcon.svg';
import Document from '@/assets/documentIcon.svg';
import Gift from '@/assets/giftIcon.svg';
import ListOrder from '@/assets/listOrder.svg';
import PayLoan from '@/assets/payLoan.svg';
import Promotion from '@/assets/promotionIcon.svg';
import ReturnOrder from '@/assets/switchIcon.svg';
import User from '@/assets/userIcon.svg';
import {
  orderActiveState,
  orderState,
  productImportState,
} from '@/recoil/state';

import { LeftMenuStyled } from './styled';

export function LeftMenu() {
  const resetOrderObject = useResetRecoilState(orderState);
  const resetOrderActive = useResetRecoilState(orderActiveState);
  const resetProductsImport = useResetRecoilState(productImportState);

  const clearCache = () => {
    resetOrderObject();
    resetOrderActive();
    resetProductsImport();
  };
  return (
    <LeftMenuStyled className="h-[calc(100vh-78px)] w-[125px] min-w-[125px] overflow-y-auto py-5 px-4">
      <div>
        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={Promotion} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Khuyến mại
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={Gift} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Đổi quà
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={CollectPoint} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Tích điểm
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={User} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Thông tin khách hàng
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={ReturnOrder} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Đổi trả đơn hàng
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={PayLoan} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Khách trả nợ
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={ListOrder} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Danh sách đơn hàng
          </div>
        </div>

        <div className="mb-3 flex h-[99px] flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2">
          <Image src={Document} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Xem báo cáo
          </div>
        </div>

        <div
          onClick={clearCache}
          className=" flex h-[99px] cursor-pointer flex-col items-center justify-center rounded-lg bg-[#FBECEE] py-3 px-2"
        >
          <Image src={Clear} />
          <div className=" mt-2 text-center font-medium leading-tight text-red-main">
            Xóa dữ liệu cache
          </div>
        </div>
      </div>
    </LeftMenuStyled>
  );
}
