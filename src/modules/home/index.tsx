import { Avatar } from 'antd';
import Image from 'next/image';

import ArrowDownIcon from '@/assets/arrow-down.svg';
import DollarIcon from '@/assets/dolarIcon.svg';
import DoubleBackIcon from '@/assets/doubleBackIcon.svg';

import { BestSellerProductChart } from './BestSellerProductChart';
import { RevenueChart } from './RevenueChart';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

export enum FilterDateType {
  CURRENT_MONTH = 1,
  PRE_MONTH = 2,
}

export enum ProductViewType {
  Date = 'date',
  Day = 'day',
}

export function Home() {

  const branchId = useRecoilValue(branchState);

  return (
    <div className="grid grid-cols-4 gap-x-6 py-6">
      <div className="col-span-3 ">
        <div className="mb-6 rounded-sm bg-white p-5">
          <div className="mb-3 font-bold text-[#15171A]">
            Kết quả bán hàng hôm nay
          </div>

          <div className="flex gap-x-6">
            <div className="flex ">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#56BD79]">
                <Image src={DollarIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">0 Hóa đơn</div>
                <div className="text-[22px] text-[#56BD79]">0</div>
                <div className="text-xs text-[#525D6A]">Doanh thu</div>
              </div>
            </div>

            <div className="flex border-x border-[#E1E3E6] px-6">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
                <Image src={ArrowDownIcon} alt="" />
              </div>

              <div>
                <div className=" text-xs">0 Hóa đơn</div>
                <div className="text-[22px] text-[#FF8800]">0</div>
                <div className="text-xs text-[#525D6A]">Trả hàng</div>
              </div>
            </div>

            <div className="flex">
              <div className="mt-4 mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#ED232F]">
                <Image src={DoubleBackIcon} alt="" />
              </div>

              <div>
                <div className="mt-4 text-[22px] text-[#ED232F]">-30.20%</div>
                <div className="text-xs text-[#525D6A]">
                  So với cùng kỳ tháng trước
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 bg-white p-5">
          <RevenueChart branchId={branchId} />
        </div>

        <div className="mb-6 bg-white p-5">
          <BestSellerProductChart branchId={branchId} />
        </div>
      </div>

      <div className=" col-span-1 bg-white py-5">
        <div className="ml-5 border-b border-[#E1E3E6] pb-4 font-bold text-[#15171A]">
          Doanh thu thuần Tháng này
        </div>

        <div className="px-5 pt-5">
          {Array.from(Array(20).keys()).map((value) => (
            <div className="flex h-fit gap-x-5" key={value}>
              <div className="flex flex-col items-center">
                <Avatar style={{ background: '#4285F4' }} size={32}>
                  A
                </Avatar>
                {value !== 19 && (
                  <div className="w-[1px] grow bg-[#E1E3E6]"></div>
                )}
              </div>

              <div className="mb-5">
                <div>
                  <span className="text-[#0070F4]">Huỳnh.N- Admin</span>
                  <span className="mx-2">vừa</span>
                  <span className="text-[#0070F4]">nhập hàng</span>
                </div>
                <div>
                  với giá trị <span className="font-bold">0</span>
                </div>
                <div className="italic text-[#525D6A]">8 phút trước</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
