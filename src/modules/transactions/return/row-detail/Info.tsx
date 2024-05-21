import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import CloseIcon from '@/assets/closeIcon.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import SaveIcon from '@/assets/saveIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { formatDateTime, formatMoney, formatNumber } from '@/helpers';
import { useMemo, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import InvoicePrint from './InvoicePrint';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  name: string;
  quantity: number;
  discount: number;
  price: number;
  totalPrice: number;
}

export function Info({ record }: { record: any }) {
  const invoiceComponentRef = useRef(null);

  const columns: ColumnsType<any> = [
    {
      title: 'Mã hàng',
      dataIndex: 'code',
      key: 'code',
      render: (value, { productUnit }, index) => (
        <span className="cursor-pointer text-[#0070F4]">{productUnit?.code}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (value, { productUnit }, index) => (
        <span>{productUnit.product.name}</span>
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value) => formatNumber(value)
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatMoney(value)
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      render: (value) => formatMoney(value)
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value, { quantity, price, discount }) => formatMoney(quantity * price - discount)
    },
  ];

  const totalPrice = useMemo(() => {
    return record?.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price;
    }, 0);
  }, [record?.items])
  const totalReturnPrice = useMemo(() => {
    return record?.items?.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.price - item.discount;
    }, 0);
  }, [record?.items])

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã đơn trả:</div>
            <div className="text-black-main">{record?.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Chi nhánh:</div>
            <div className="text-black-main">{record?.branch?.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Thời gian:</div>
            <div className="text-black-main">{formatDateTime(record?.createdAt)}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người nhận trả:</div>
            <div className="text-black-main">{record?.user?.fullName || record?.creator?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Khách hàng:</div>
            <div className="text-black-main">{record?.customer?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">{record?.creator?.fullName}</div>
          </div>

          {/* <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã hóa đơn:</div>
            <div className="text-black-main">---</div>
          </div> */}
        </div>

        <div className="grow">
          <TextArea rows={8} placeholder="Ghi chú:" value={record?.note} onChange={() => undefined} />
        </div>
      </div>

      <CustomTable
        dataSource={record?.items}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div ref={invoiceComponentRef} className='fixed top-0 right-[-300px] w-full -z-10 invisible print:relative print:visible print:right-0 print:p-[50px] print:z-10 print:text-base'>
        <InvoicePrint record={record} />
      </div>

      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số mặt hàng:</div>
          <div className="text-black-main">{record?.items?.length}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng tiền hàng trả:</div>
          <div className="text-black-main">{formatMoney(totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá phiếu trả:</div>
          <div className="text-black-main">{formatMoney(record?.discount)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Phí trả hàng:</div>
          <div className="text-black-main">{formatMoney(record?.returnFee)}</div>
        </div>
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Cần trả khách:</div>
          <div className="text-black-main">{formatMoney(totalReturnPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Đã trả khách:</div>
          <div className="text-black-main">{formatMoney(record?.paid)}</div>
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
          prefixIcon={<Image src={CloseIcon} alt="" />}
        >
          Hủy bỏ
        </CustomButton>
      </div>
    </div>
  );
}
