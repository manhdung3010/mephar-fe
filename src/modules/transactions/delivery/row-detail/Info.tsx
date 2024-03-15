import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import BarcodeIcon from '@/assets/barcodeBlue.svg';
import EditIcon from '@/assets/editWhite.svg';
import PrintOrderIcon from '@/assets/printOrder.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomTextarea } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  id: string;
  name: string;
  quantity: number;
  totalReceive: number;
}

export function Info({ record }: { record: any }) {
  const data = {
    key: 1,
    id: 'PN231017090542',
    name: 'Nước cất tiêm 5ml',
    quantity: 2,
    totalReceive: 35000,
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hàng',
      dataIndex: 'id',
      key: 'id',
      render: (value) => (
        <span className="cursor-pointer text-[#0070F4]">{value}</span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (value) => (
        <div>
          {value}{' '}
          <div className="w-fit rounded-sm bg-red-main px-1 py-[2px] text-white">
            Pherelive SL1 - 26/07/2023
          </div>
        </div>
      ),
    },
    {
      title: 'Số lượng chuyển',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Số lượng nhận',
      dataIndex: 'totalReceive',
      key: 'totalReceive',
    },
  ];

  return (
    <div className="gap-12 ">
      <div className="mb-5 flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã đơn chuyển hàng:</div>
            <div className="text-black-main">DQG00006601</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className="text-[#0070F4]">Đang vận chuyển</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Từ chi nhánh:</div>
            <div className="text-black-main">Chi nhánh mặc định</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Tới chi nhánh:</div>
            <div className="text-black-main">Chi nhánh mặc định</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày chuyển:</div>
            <div className="text-black-main">17/10/2023 09:05:14</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày nhận:</div>
            <CustomSelect onChange={() => {}} className="border-underline" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">Kimka.nt</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">17/10/2023 09:05:14</div>
          </div>
        </div>

        <div className="grow">
          <CustomTextarea rows={8} placeholder="Ghi chú:" />
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
          <div className="text-gray-main">Tổng số mặt hàng:</div>
          <div className="text-black-main">2</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số lượng chuyển:</div>
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
          type="primary"
          prefixIcon={<Image src={BarcodeIcon} alt="" />}
        >
          In mã vạch
        </CustomButton>
        <CustomButton
          type="success"
          prefixIcon={<Image src={EditIcon} alt="" />}
        >
          Cập nhật
        </CustomButton>
      </div>
    </div>
  );
}
