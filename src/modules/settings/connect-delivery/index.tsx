import cx from 'classnames';
import Image from 'next/image';
import { useState } from 'react';

import DeliveryLogo1 from '@/assets/images/delivery-logo1.png';
import DeliveryLogo2 from '@/assets/images/delivery-logo2.png';
import DeliveryLogo3 from '@/assets/images/delivery-logo3.png';
import DeliveryLogo4 from '@/assets/images/delivery-logo4.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';

enum EThirdPartyDelivery {
  GHN = 1,
  VN_POST = 2,
  JT_EXPRESS = 3,
  AHA_MOVE = 4,
}

export function ConnectDelivery() {
  const [openConnectThirdParty, setOpenConnectThirdParty] = useState({
    [EThirdPartyDelivery.GHN]: false,
    [EThirdPartyDelivery.VN_POST]: false,
    [EThirdPartyDelivery.JT_EXPRESS]: false,
    [EThirdPartyDelivery.AHA_MOVE]: false,
  });

  return (
    // <div className="my-6 grid grid-cols-3 gap-[42px]">
    //   <div className=" col-span-1">
    //     <div className="mb-2 text-xl text-[#182537]">
    //       Các dịch vụ vận chuyển
    //     </div>
    //     <div className="mb-6 text-[#666]">
    //       Các dịch vụ vận chuyển giúp bạn chuyển hàng tới khách hàng một cách
    //       nhanh chóng, hiệu quả.
    //     </div>
    //   </div>

    //   <div className=" col-span-2">
    //     <div className="shadow-[0px_8px_13px_-3px rgba(0,0,0,0.07)] mb-4 rounded">
    //       <div className="bg-white p-5  ">
    //         <Image src={DeliveryLogo1} className=" mix-blend-luminosity" />
    //         <div className="text-[#182537]">
    //           Cửa hàng của bạn chưa sử dụng dịch vụ vận chuyển Giao hàng nhanh
    //           2020. Thông tin của bạn sẽ được chúng tôi mã hóa trước khi lưu
    //           trữ.
    //         </div>

    //         <div className="mt-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div
    //           className={cx(
    //             'flex justify-end',
    //             openConnectThirdParty[EThirdPartyDelivery.GHN]
    //               ? 'hidden'
    //               : 'mt-6 block'
    //           )}
    //         >
    //           <CustomButton
    //             className="h-11"
    //             type="original"
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.GHN]: true,
    //               });
    //             }}
    //           >
    //             Thiết lập
    //           </CustomButton>
    //         </div>
    //       </div>

    //       <div
    //         className={cx(
    //           'p-5 bg-[#F5F5F5]',
    //           openConnectThirdParty[EThirdPartyDelivery.GHN]
    //             ? 'block'
    //             : 'hidden'
    //         )}
    //       >
    //         <div className="mb-6">
    //           <Label label="Token giao hàng nhanh" hasInfoIcon={false} />
    //           <CustomInput
    //             className="h-11"
    //             placeholder="Token giao hàng nhanh của bạn"
    //             onChange={() => {}}
    //           />
    //         </div>

    //         <div>
    //           <Label label="Client ID giao hàng nhanh" hasInfoIcon={false} />
    //           <CustomInput
    //             className="h-11"
    //             placeholder="Client ID giao hàng nhanh của bạn"
    //             onChange={() => {}}
    //           />
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div>
    //           <Label label="Người trả phí vận chuyển" hasInfoIcon={false} />
    //           <CustomRadio
    //             options={[
    //               {
    //                 value: 1,
    //                 label: 'Người nhận trả',
    //               },
    //               {
    //                 value: 2,
    //                 label: 'Người gửi trả',
    //               },
    //             ]}
    //             className="!flex flex-col"
    //           />
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div className="flex justify-between">
    //           <div className="text-[#0070F4]">
    //             Hướng dẫn kết nối Giao hàng nhanh 2020
    //           </div>
    //           <div className="flex gap-4">
    //             <CustomButton
    //               outline={true}
    //               onClick={() => {
    //                 setOpenConnectThirdParty({
    //                   ...openConnectThirdParty,
    //                   [EThirdPartyDelivery.GHN]: false,
    //                 });
    //               }}
    //             >
    //               Hủy bỏ
    //             </CustomButton>
    //             <CustomButton>Lưu</CustomButton>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="shadow-[0px_8px_13px_-3px rgba(0,0,0,0.07)] mb-4 rounded">
    //       <div className="bg-white p-5 ">
    //         <Image src={DeliveryLogo2} className=" mix-blend-luminosity" />
    //         <div className="text-[#182537]">
    //           Cửa hàng của bạn chưa sử dụng dịch vụ vận chuyển J&T Express.
    //         </div>

    //         <div className="mt-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div
    //           className={cx(
    //             'flex justify-end ',
    //             openConnectThirdParty[EThirdPartyDelivery.VN_POST]
    //               ? 'hidden'
    //               : 'mt-6 block'
    //           )}
    //         >
    //           <CustomButton
    //             className="h-11"
    //             type="original"
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.VN_POST]: true,
    //               });
    //             }}
    //           >
    //             Thiết lập
    //           </CustomButton>
    //         </div>
    //       </div>

    //       <div
    //         className={cx(
    //           'p-5 bg-[#F5F5F5] transition-all duration-300',
    //           openConnectThirdParty[EThirdPartyDelivery.VN_POST]
    //             ? 'block'
    //             : 'hidden'
    //         )}
    //       >
    //         <div className="mb-2 font-medium text-[#15171A]">
    //           Đăng nhập tài khoản J&T Express
    //         </div>
    //         <div className="mb-2 text-[#8F90A6]">
    //           Mã khách hàng * <br /> (Vui lòng nhập đúng kí tự in hoa, in
    //           thường)
    //         </div>

    //         <CustomInput className="mb-6 h-11" onChange={() => {}} />

    //         <div>
    //           Chưa có tài khoản?{' '}
    //           <span className="text-[#0070F4]">Đăng ký tại đây</span>
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div className="flex justify-end gap-4">
    //           <CustomButton
    //             outline={true}
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.VN_POST]: false,
    //               });
    //             }}
    //           >
    //             Hủy bỏ
    //           </CustomButton>
    //           <CustomButton>Lưu</CustomButton>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="shadow-[0px_8px_13px_-3px rgba(0,0,0,0.07)] mb-4 rounded">
    //       <div className="bg-white p-5 ">
    //         <Image src={DeliveryLogo3} className=" mix-blend-luminosity" />
    //         <div className="text-[#182537]">
    //           Cửa hàng của bạn chưa sử dụng dịch vụ vận chuyển Viettel Post.
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div
    //           className={cx(
    //             'flex justify-end',
    //             openConnectThirdParty[EThirdPartyDelivery.JT_EXPRESS]
    //               ? 'hidden'
    //               : 'mt-6 block'
    //           )}
    //         >
    //           <CustomButton
    //             className="h-11"
    //             type="original"
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.JT_EXPRESS]: true,
    //               });
    //             }}
    //           >
    //             Thiết lập
    //           </CustomButton>
    //         </div>
    //       </div>

    //       <div
    //         className={cx(
    //           'p-5 bg-[#F5F5F5] transition-all duration-300',
    //           openConnectThirdParty[EThirdPartyDelivery.JT_EXPRESS]
    //             ? 'block'
    //             : 'hidden'
    //         )}
    //       >
    //         <div className="mb-6">
    //           <Label label="Email" hasInfoIcon={false} />
    //           <CustomInput
    //             className="h-11"
    //             placeholder="Nhập email của bạn"
    //             onChange={() => {}}
    //           />
    //         </div>

    //         <div>
    //           <Label label="Mật khẩu" hasInfoIcon={false} />
    //           <CustomInput
    //             className="h-11"
    //             placeholder="Nhập mật khẩu của bạn"
    //             onChange={() => {}}
    //           />
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div className="flex justify-end gap-4">
    //           <CustomButton
    //             outline={true}
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.JT_EXPRESS]: false,
    //               });
    //             }}
    //           >
    //             Hủy bỏ
    //           </CustomButton>
    //           <CustomButton>Lưu</CustomButton>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="shadow-[0px_8px_13px_-3px rgba(0,0,0,0.07)] mb-4 rounded">
    //       <div className="bg-white p-5 ">
    //         <Image src={DeliveryLogo4} />
    //         <div className="text-[#182537]">
    //           Cửa hàng của bạn đang sử dụng dịch vụ vận chuyển Ahamove.
    //         </div>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div
    //           className={cx(
    //             'flex justify-between items-center',
    //             openConnectThirdParty[EThirdPartyDelivery.AHA_MOVE]
    //               ? 'hidden'
    //               : 'mt-6 block'
    //           )}
    //         >
    //           <div>
    //             Đang sử dụng: <span className=" font-semibold">Ahamove</span>
    //           </div>
    //           <CustomButton
    //             className="h-11"
    //             type="original"
    //             onClick={() => {
    //               setOpenConnectThirdParty({
    //                 ...openConnectThirdParty,
    //                 [EThirdPartyDelivery.AHA_MOVE]: true,
    //               });
    //             }}
    //           >
    //             Thiết lập
    //           </CustomButton>
    //         </div>
    //       </div>

    //       <div
    //         className={cx(
    //           'p-5 bg-[#F5F5F5] transition-all duration-300',
    //           openConnectThirdParty[EThirdPartyDelivery.AHA_MOVE]
    //             ? 'block'
    //             : 'hidden'
    //         )}
    //       >
    //         <div className="mb-6 grid grid-cols-2 gap-6">
    //           <div>
    //             <Label label="Họ tên" hasInfoIcon={false} />
    //             <CustomInput className="h-11" onChange={() => {}} />
    //           </div>

    //           <div>
    //             <Label label="Số điện thoại" hasInfoIcon={false} />
    //             <CustomInput className="h-11" onChange={() => {}} />
    //           </div>

    //           <div>
    //             <Label label="Tỉnh / Thành phố" hasInfoIcon={false} />
    //             <CustomSelect
    //               className="h-11 !rounded bg-white"
    //               onChange={() => {}}
    //             />
    //           </div>

    //           <div>
    //             <Label label="Quận / Huyện" hasInfoIcon={false} />
    //             <CustomSelect
    //               className="h-11 !rounded bg-white"
    //               onChange={() => {}}
    //             />
    //           </div>

    //           <div>
    //             <Label label="Địa chỉ" hasInfoIcon={false} />
    //             <CustomInput className="h-11" onChange={() => {}} />
    //           </div>

    //           <div>
    //             <Label label="Email" hasInfoIcon={false} />
    //             <CustomInput className="h-11" onChange={() => {}} />
    //           </div>
    //         </div>

    //         <CustomButton
    //           className="!h-11"
    //           wrapClassName="w-fit"
    //           type="original"
    //         >
    //           Liên kết địa chỉ lấy hàng
    //         </CustomButton>

    //         <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

    //         <div className="flex justify-between">
    //           <CustomButton>Ngưng sử dụng</CustomButton>

    //           <div className="flex gap-4">
    //             <CustomButton
    //               outline={true}
    //               onClick={() => {
    //                 setOpenConnectThirdParty({
    //                   ...openConnectThirdParty,
    //                   [EThirdPartyDelivery.AHA_MOVE]: false,
    //                 });
    //               }}
    //             >
    //               Hủy bỏ
    //             </CustomButton>
    //             <CustomButton>Lưu</CustomButton>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
