import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import CloseIcon from '@/assets/closeIcon.svg';
import EditIcon from '@/assets/editIcon.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import SaveIcon from '@/assets/saveIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { formatMoney, formatNumber, hasPermission } from '@/helpers';
import { useRef, useState } from 'react';
import DeleteModal from './DeleteModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { deleteInventoryChecking } from '@/api/check-inventory';
import { useRecoilValue } from 'recoil';
import { branchState, profileState } from '@/recoil/state';
import { useReactToPrint } from 'react-to-print';
import styles from "./style.module.css"
import InvoicePrint from './InvoicePrint';
import CopyBlueIcon from '@/assets/copyBlue.svg';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import { useRouter } from 'next/router';
interface IRecord {
  key: number;
  id: string;
  name: string;
  inventoryQuantity: number;
  actualQuantity: number;
  diffQuantity: number;
  diffAmount: number;
  productUnit?: any;
  difference: number
}

export function Info({ record }: { record: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const invoiceComponentRef = useRef(null);
  const [openDelete, setOpenDelete] = useState(false);
  const profile = useRecoilValue(profileState);
  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hàng',
      dataIndex: 'productUnit',
      key: 'productUnit',
      render: (productUnit) => (
        <span className="cursor-pointer text-[#0070F4]">{productUnit?.product?.code}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => <span>
        {record?.productUnit?.product?.name}
      </span>
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventoryQuantity',
      key: 'inventoryQuantity',
    },
    {
      title: 'Thực tế',
      dataIndex: 'realQuantity',
      key: 'realQuantity',
      render: (realQuantity) => formatNumber(realQuantity)
    },
    {
      title: 'Số lượng lệch',
      dataIndex: 'difference',
      key: 'difference',
      render: (difference) => formatNumber(difference)
    },
    {
      title: 'Giá trị lệch',
      dataIndex: 'diffAmount',
      key: 'diffAmount',
      render: (_, record) => formatNumber(record?.difference * record?.productUnit?.product?.price)
    },
  ];

  const { mutate: mutateDeleteInventory, isLoading: isLoadingDeleteInventory } =
    useMutation(() => deleteInventoryChecking(Number(record.id), Number(branchId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['INVENTORY_CHECKING']);
        setOpenDelete(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const handlePrint = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  return (
    <div className="gap-12 ">
      <div ref={invoiceComponentRef} className={`${styles.invoicePrint} invoice-print`}>
        <InvoicePrint data={record} columns={columns} />
      </div>
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã nhập hàng:</div>
          <div className="text-black-main">{record?.code}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người cân bằng:</div>
          <div className="w-3/4">
            {/* <CustomSelect onChange={() => {}} className="border-underline" /> */}
            {record?.userCreate?.fullName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">17/10/2023 09:05:14</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">
            <Image src={EditIcon} />
            <span className="ml-2">Ghi chú:</span>
          </div>
          <div className="w-3/4">
            {/* <CustomInput bordered={false} onChange={() => {}} /> */}
            {record?.note}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div className="text-[#00B63E]">Đã cân bằng kho</div>
        </div>
      </div>

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={record?.inventoryCheckingProduct}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="ml-auto mb-5 w-[380px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng thực tế {"(" + record?.totalRealQuantity + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.totalVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch tăng {"(" + formatNumber(record?.totalIncrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.increaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch giảm {"(" + formatNumber(record?.totalDecrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.decreaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng chênh lệch {"(" + formatNumber(record?.totalIncrease + record?.totalDecrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.increaseVal + record?.decreaseVal)}</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={PrintOrderIcon} alt="" />}
          onClick={handlePrint}
        >
          In phiếu
        </CustomButton>
        {
          hasPermission(profile?.role?.permissions, RoleModel.check_inventory, RoleAction.create) && (
            <CustomButton
              type="primary"
              outline={true}
              prefixIcon={<Image src={CopyBlueIcon} alt="" />}
              onClick={() => router.push(`/products/check-inventory/coupon?id=${record.id}`)}
            >
              Sao chép
            </CustomButton>
          )
        }
        {
          hasPermission(profile?.role?.permissions, RoleModel.check_inventory, RoleAction.delete) && (
            <CustomButton
              outline={true}
              prefixIcon={<Image src={CloseIcon} alt="" />}
              onClick={() => setOpenDelete(true)}
            >
              Hủy bỏ
            </CustomButton>
          )
        }
      </div>

      <DeleteModal
        isOpen={openDelete}
        onCancel={() => setOpenDelete(false)}
        onSubmit={() => mutateDeleteInventory()}
        isLoading={isLoadingDeleteInventory}
      />
    </div>
  );
}
