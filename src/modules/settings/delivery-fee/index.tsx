import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import DeliveryLogo1 from '@/assets/images/delivery-logo1.png';
import DeliveryLogo2 from '@/assets/images/delivery-logo2.png';
import DeliveryLogo3 from '@/assets/images/delivery-logo3.png';
import { CustomButton } from '@/components/CustomButton';

import { AddStageModal } from './AddStageModal';

export function Delivery() {
  const router = useRouter();

  const [openAddStageModal, setOpenAddStageModal] = useState(false);

  return (
    // <div className="my-6 grid grid-cols-3 gap-4">
    //   <div className=" col-span-1">
    //     <div className="mb-2 text-xl text-[#182537]">Phí vận chuyển</div>
    //     <div className="mb-6 text-[#666]">
    //       Thêm phí vận chuyển mới cho các khu vực vận chuyển khác nhau.Hoặc sử
    //       dụng mức phí tạm tính của các đối tác vận chuyển.
    //     </div>
    //     <CustomButton
    //       type="original"
    //       wrapClassName="w-fit"
    //       className="!h-11"
    //       onClick={() => setOpenAddStageModal(true)}
    //     >
    //       Thêm khu vực vận chuyển
    //     </CustomButton>
    //   </div>

    //   <div className=" col-span-2">
    //     <div className="mb-4 bg-white p-5 shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.07)]">
    //       <div className="mb-6 text-base text-[#182537]">
    //         Nhận phí vận chuyển từ đối tác
    //       </div>

    //       <div className="text-[#666]">
    //         Cửa hàng của bạn muốn áp dụng mức phí tạm tính của các đối tác vận
    //         chuyển ở trang thanh toán
    //       </div>

    //       <div className="my-6 h-[1px] w-full bg-[#E8EAEB]"></div>

    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <Image src={DeliveryLogo1} className=" mix-blend-luminosity" />
    //           <div>Giao hàng nhanh Express</div>
    //         </div>
    //         <CustomButton
    //           type="original"
    //           wrapClassName="w-fit"
    //           className="!h-11"
    //           onClick={() =>
    //             router.push('/settings/delivery-fee/setting-third-party-fee')
    //           }
    //         >
    //           Áp dụng phí
    //         </CustomButton>
    //       </div>

    //       <div className="my-6 h-[1px] w-full bg-[#E8EAEB]"></div>

    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <Image src={DeliveryLogo2} className=" mix-blend-luminosity" />
    //           <div>VNPost</div>
    //         </div>
    //         <CustomButton
    //           type="original"
    //           wrapClassName="w-fit"
    //           className="!h-11"
    //         >
    //           Áp dụng phí
    //         </CustomButton>
    //       </div>

    //       <div className="my-6 h-[1px] w-full bg-[#E8EAEB]"></div>

    //       <div className="flex items-center justify-between">
    //         <div className="flex items-center gap-3">
    //           <Image src={DeliveryLogo3} className=" mix-blend-luminosity" />
    //           <div>J&T Express</div>
    //         </div>
    //         <CustomButton
    //           type="original"
    //           wrapClassName="w-fit"
    //           className="!h-11"
    //         >
    //           Áp dụng phí
    //         </CustomButton>
    //       </div>
    //     </div>

    //     <div className="bg-white p-5 shadow-[0px_8px_13px_-3px_rgba(0,0,0,0.07)]">
    //       <div className="mb-6 text-base text-[#182537]">
    //         Phí vận chuyển tự cấu hình
    //       </div>

    //       <div className="my-6 h-[1px] w-full bg-[#E8EAEB]"></div>

    //       <div>
    //         <div className="mb-4 flex justify-between">
    //           <div className="font-medium uppercase text-[#182537]">Hà Nội</div>
    //           <div
    //             className="cursor-pointer text-red-main"
    //             onClick={() =>
    //               router.push('/settings/delivery-fee/setting-fee')
    //             }
    //           >
    //             Sửa
    //           </div>
    //         </div>

    //         <div className="mb-4 flex items-start justify-between">
    //           <div>
    //             <div className="text-[#0070F4]">Chốt đơn gửi luôn</div>
    //             <div className="text-[#666]">0đ trở lên</div>
    //           </div>
    //           <div className="text-[#666]">40.000 vnđ</div>
    //         </div>

    //         <div className="mb-4 flex items-start justify-between">
    //           <div>
    //             <div className="text-[#0070F4]">Gom đơn</div>
    //             <div className="text-[#666]">0đ trở lên</div>
    //           </div>
    //           <div className="text-[#666]">30.000 vnđ</div>
    //         </div>

    //         <div className="mb-4 flex items-start justify-between">
    //           <div>
    //             <div className="text-[#0070F4]">Qua kho lấy</div>
    //             <div className="text-[#666]">0đ trở lên</div>
    //           </div>
    //           <div className="text-[#666]">0 vnđ</div>
    //         </div>
    //       </div>

    //       <div className="my-6 h-[1px] w-full bg-[#E8EAEB]"></div>

    //       <div>
    //         <div className="mb-4 flex justify-between">
    //           <div className="font-medium uppercase text-[#182537]">
    //             TỈNH/THÀNH KHÁC
    //           </div>
    //           <div className="text-red-main">Sửa</div>
    //         </div>

    //         <div className="flex items-start justify-between">
    //           <div>
    //             <div className="text-[#0070F4]">Giao hàng tận nơi</div>
    //             <div className="text-[#666]">0đ trở lên</div>
    //           </div>
    //           <div className="text-[#666]">50.000 vnđ</div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>

    //   <AddStageModal
    //     isOpen={openAddStageModal}
    //     onCancel={() => setOpenAddStageModal(false)}
    //   />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
