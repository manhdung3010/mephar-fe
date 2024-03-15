import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import CloseIcon from '@/assets/closeIcon.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import SaveIcon from '@/assets/saveIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';

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
  const data = {
    key: 1,
    id: 'PN231017090542',
    name: 'Nước cất tiêm 5ml',
    quantity: 2,
    price: 70000,
    discount: 2,
    totalPrice: 140000,
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hàng',
      dataIndex: 'id',
      key: 'id',
      render: (value, _, index) => (
        <span className="cursor-pointer text-[#0070F4]">{value}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
  ];

  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã đơn trả:</div>
            <div className="text-black-main">DQG00006601</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Chi nhánh:</div>
            <div className="text-black-main">Chi nhánh mặc định</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Thời gian:</div>
            <div className="text-black-main">17/10/2023 09:05:14</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người nhận trả:</div>
            <CustomSelect onChange={() => {}} className="border-underline" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Khách hàng:</div>
            <div className="text-black-main">Khách lẻ</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">Kimka.nt</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã hóa đơn:</div>
            <div className="text-black-main">DQG00006601</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">17/10/2023 09:05:14</div>
          </div>
        </div>

        <div className="grow">
          <TextArea rows={8} placeholder="Ghi chú:" />
        </div>
      </div>

      <CustomTable
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng thực tế:</div>
          <div className="text-black-main">2</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng tiền hàng trả:</div>
          <div className="text-black-main">1400000</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá phiếu trả:</div>
          <div className="text-black-main">0</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Phí trả hàng:</div>
          <div className="text-black-main">0</div>
        </div>
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Cần trả khách:</div>
          <div className="text-black-main">1400000</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Đã trả khách:</div>
          <div className="text-black-main">140,000</div>
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
          prefixIcon={<Image src={CloseIcon} alt="" />}
        >
          Hủy bỏ
        </CustomButton>
        <CustomButton
          outline={true}
          type="success"
          prefixIcon={<Image src={SaveIcon} alt="" />}
        >
          Lưu
        </CustomButton>
      </div>
    </div>
  );
}
