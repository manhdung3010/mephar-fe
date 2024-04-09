import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import BarcodeIcon from '@/assets/barcodeBlue.svg';
import EditIcon from '@/assets/editWhite.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomTextarea } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { EDeliveryTransactionStatusLabel } from '@/enums';
import { formatDateTime, formatNumber } from '@/helpers';
import { useMemo } from 'react';

interface IRecord {
  key: number;
  id: string;
  name: string;
  product: any;
  quantity: number;
  totalReceive: number;
}

export function Info({ record }: { record: any }) {
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
      title: 'Số lượng nhận',
      dataIndex: 'totalReceive',
      key: 'totalReceive',
      render: (value) => formatNumber(value),
    },
  ];

  const totalQuantity = useMemo(() => {
    return record?.items?.reduce((total, item) => total + item.quantity, 0);
  }, [record?.items])

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
            <div className="text-black-main">{formatDateTime(record?.moveAt)}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày nhận:</div>
            {/* <CustomSelect onChange={() => { }} className="border-underline" /> */}
            <div className="text-black-main">{record?.receivedAt ? formatDateTime(record?.receivedAt) : ''}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">Kimka.nt</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">{formatDateTime(record?.moveAt)}</div>
          </div>
        </div>

        <div className="grow">
          <CustomTextarea rows={8} placeholder="Ghi chú:" value={record?.note} />
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
        {/* <CustomButton
          type="success"
          prefixIcon={<Image src={EditIcon} alt="" />}
        >
          Cập nhật
        </CustomButton> */}
      </div>
    </div>
  );
}
