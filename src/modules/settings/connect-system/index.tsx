import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import {
  deleteConnectSystem,
  getConnectSystem,
  updateConnectSystem,
} from '@/api/connect-system.service';
import { CustomButton } from '@/components/CustomButton';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import {
  EConnectSystemStatus,
  EConnectSystemStatusLabel,
  getEnumKeyByValue,
} from '@/enums';
import { branchState } from '@/recoil/state';

import { ConnectSystemModal } from './ConnectSystemModal';

export function ConnectSystem() {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const [openConnectSystemModal, setOpenConnectSystemModal] = useState(false);

  const { data: connectSystem } = useQuery(
    ['CONNECT_SYSTEM'],
    () => getConnectSystem({ branchId: Number(branchId) }),
    {
      refetchInterval: 300 * 1000,
    }
  );

  const [isAutoHandle, setIsAutoHandle] = useState(0);

  useEffect(() => {
    if (
      connectSystem &&
      typeof connectSystem?.data?.items[0]?.isAutoHandle === 'number'
    ) {
      setIsAutoHandle(connectSystem?.data?.items[0]?.isAutoHandle);
    }
  }, [connectSystem]);

  const { mutate: mutateConnect } = useMutation(
    () => deleteConnectSystem(connectSystem?.data?.items[0]?.id),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['CONNECT_SYSTEM']);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateConnect();
  };

  const { mutate: mutateUpdateConnect } = useMutation(
    () =>
      updateConnectSystem(connectSystem?.data?.items[0]?.id, { isAutoHandle }),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['CONNECT_SYSTEM']);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmitUpdateConnect = () => {
    mutateUpdateConnect();
  };

  return (
    // <div className="my-6 grid grid-cols-3 gap-6 bg-white p-5">
    //   <div className=" col-span-1">
    //     <div className=" mb-1">Liên thông hệ thống dược</div>
    //     <div className="mb-16 text-[#999]">
    //       Áp dụng với đơn hàng, khách trả hàng, đơn nhập hàng, trả hàng nhà cung
    //       cấp
    //     </div>

    //     <div className="mb-1">Kết nối cơ sở</div>
    //     <div className="mb-4 text-[#999]">
    //       Kết nối các cơ sở GPP với chi nhánh được tạo trên Mephar, phục vụ cho
    //       quá trình liên thông dữ liệu
    //     </div>
    //     <CustomButton wrapClassName="w-fit">Quản lý chi nhánh</CustomButton>
    //   </div>

    //   <div className=" col-span-2">
    //     <div className="mb-4 bg-[#F6F7F9] p-3">
    //       <div className="mb-2 flex items-center gap-2">
    //         <CustomCheckbox
    //           checked={!!isAutoHandle}
    //           onChange={(e) => setIsAutoHandle(e.target.checked ? 1 : 0)}
    //         />
    //         <div className="text-medium text-[#28293D]">
    //           Tự động liên thông khi xuất/nhập kho
    //         </div>
    //       </div>

    //       <div>
    //         <span className="text-[#F32B2B]">Lưu ý:</span> Nếu không cho phép hệ
    //         thống tự động liên thông xuất/nhập kho, bạn cần chủ động chọn các
    //         đơn và thao tác liên thông lên CSDL Dược Quốc gia ở trang danh sách
    //         hoặc chi tiết chứng từ.
    //       </div>
    //     </div>

    //     <div className="mb-5 bg-[#F6F7F9] p-3">
    //       <div className="grid grid-cols-4 bg-[#F7DADD] py-4">
    //         <div className="px-4 font-medium text-[#0F1824]">Tên chi nhánh</div>
    //         <div className="px-4 font-medium text-[#0F1824]">Mã cơ sở</div>
    //         <div className="px-4 font-medium text-[#0F1824]">Trạng thái</div>
    //         <div className="px-4 font-medium text-[#0F1824]">Thao tác</div>
    //       </div>

    //       <div className="grid grid-cols-4 bg-white py-4">
    //         <div className="px-4 text-[#0F1824]">
    //           {connectSystem?.data?.items[0]?.branch?.name || '---'}
    //         </div>
    //         <div className="px-4 text-[#0F1824]">
    //           {connectSystem?.data?.items[0]?.code || '---'}
    //         </div>
    //         <div
    //           className={classNames(
    //             'px-4 ',
    //             !connectSystem?.data?.items[0]?.status
    //               ? 'text-[#D64457]'
    //               : 'text-[#00B63E'
    //           )}
    //         >
    //           {connectSystem?.data?.items[0]?.status
    //             ? EConnectSystemStatusLabel[
    //             getEnumKeyByValue(
    //               EConnectSystemStatus,
    //               connectSystem?.data?.items[0]?.status
    //             )
    //             ]
    //             : 'Chưa kết nối'}
    //         </div>

    //         {connectSystem?.data?.items[0]?.status ? (
    //           <div
    //             className="cursor-pointer px-4 text-[#0070F4]"
    //             onClick={onSubmit}
    //           >
    //             Ngắt kết nối
    //           </div>
    //         ) : (
    //           <div
    //             className="cursor-pointer px-4 text-[#0070F4]"
    //             onClick={() => setOpenConnectSystemModal(true)}
    //           >
    //             Kết nối
    //           </div>
    //         )}
    //       </div>
    //     </div>

    //     <div className="flex justify-end">
    //       <CustomButton outline={true} wrapClassName="mr-4 w-[100px]">
    //         Hủy
    //       </CustomButton>
    //       <CustomButton
    //         wrapClassName="w-[100px]"
    //         onClick={onSubmitUpdateConnect}
    //       >
    //         Lưu
    //       </CustomButton>
    //     </div>
    //   </div>

    //   <ConnectSystemModal
    //     isOpen={openConnectSystemModal}
    //     onCancel={() => setOpenConnectSystemModal(false)}
    //   />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
