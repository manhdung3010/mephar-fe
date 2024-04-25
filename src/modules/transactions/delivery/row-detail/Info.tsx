import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import BarcodeIcon from '@/assets/barcodeBlue.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomTextarea } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { EDeliveryTransactionStatus, EDeliveryTransactionStatusLabel } from '@/enums';
import { formatDateTime, formatMoney, formatNumber, hasPermission } from '@/helpers';
import { useRouter } from 'next/router';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DeliveryInvoice from './DeliveryInvoice';
import styles from './styles.module.css';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';

interface IRecord {
  key: number;
  id: string;
  name: string;
  product: any;
  quantity: number;
  totalReceive: number;
}

export function Info({ record, branchId }: { record: any, branchId: number }) {
  const router = useRouter();
  const invoiceComponentRef = useRef(null);
  const profile = useRecoilValue(profileState);

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hàng',
      dataIndex: 'id',
      key: 'id',
      render: (_, { product }) => (
        <span className="cursor-pointer text-[#0070F4]">{product?.code}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (_, { product }) => (
        <div>
          {product?.name}{' '}
          {/* <div className="w-fit rounded-sm bg-red-main px-1 py-[2px] text-white">
            Pherelive SL1 - 26/07/2023
          </div> */}
        </div>
      ),
    },
    {
      title: 'Số lượng chuyển',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value) => formatNumber(value),
    },
    {
      title: 'Giá chuyển',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Số lượng nhận',
      dataIndex: 'toQuantity',
      key: 'toQuantity',
      render: (value) => formatNumber(value),
    },
  ];

  const totalQuantity = useMemo(() => {
    return record?.items?.reduce((total, item) => total + item.quantity, 0);
  }, [record?.items])

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });


  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã đơn chuyển hàng:</div>
            <div className="text-black-main">{record?.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className="text-[#0070F4]">{EDeliveryTransactionStatusLabel[record?.status]}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Từ chi nhánh:</div>
            <div className="text-black-main">{record?.fromBranch?.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Tới chi nhánh:</div>
            <div className="text-black-main">{record?.toBranch?.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày chuyển:</div>
            <div className="text-black-main">{record?.movedAt ? formatDateTime(record?.movedAt) : ''}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày nhận:</div>
            {/* <CustomSelect onChange={() => { }} className="border-underline" /> */}
            <div className="text-black-main">{record?.receivedAt ? formatDateTime(record?.receivedAt) : ''}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">{record?.movedByUser?.fullName}</div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người nhận:</div>
            <div className="text-black-main">{record?.receivedByUser?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">{formatDateTime(record?.moveAt)}</div>
          </div>
        </div>

        <div className="grow">
          <CustomTextarea rows={8} placeholder="Ghi chú:" value={record?.fromBranchId === branchId ? record?.note : record?.receiveNote} />
        </div>
      </div>

      <CustomTable
        dataSource={record?.items || []}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số mặt hàng:</div>
          <div className="text-black-main">{formatNumber(record?.items?.length)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số lượng chuyển:</div>
          <div className="text-black-main">{formatNumber(totalQuantity)}</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={PrintOrderIcon} alt="" />}
          onClick={handlePrintInvoice}
        >
          In phiếu
        </CustomButton>
        <CustomButton
          outline={true}
          type="primary"
          prefixIcon={<Image src={BarcodeIcon} alt="" />}
        >
          In mã vạch
        </CustomButton>
        {
          hasPermission(profile?.role?.permissions, RoleModel.delivery, RoleAction.create) && record?.status === EDeliveryTransactionStatus.MOVING && record?.toBranchId === branchId && <CustomButton
            type="success"
            prefixIcon={<Image src={PlusIcon} alt="" />}
            onClick={() => router.push(`/transactions/delivery/coupon?moveId=${record?.id}`)}
          >
            Nhận hàng
          </CustomButton>
        }
        <div ref={invoiceComponentRef} className={`${styles.invoicePrint} invoice-print`}>
          <DeliveryInvoice data={record} columns={columns} />
        </div>
      </div>
    </div>
  );
}
