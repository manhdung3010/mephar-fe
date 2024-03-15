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

interface IRecord {
  key: number;
  id: string;
  name: string;
  inventoryQuantity: number;
  actualQuantity: number;
  diffQuantity: number;
  diffAmount: number;
}

export function Info({ record }: { record: any }) {
  const data = {
    key: 1,
    id: 'PN231017090542',
    name: 'Nước cất tiêm 5ml',
    inventoryQuantity: 2,
    actualQuantity: 2,
    diffQuantity: 2,
    diffAmount: 70000,
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
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventoryQuantity',
      key: 'inventoryQuantity',
    },
    {
      title: 'Thực tế',
      dataIndex: 'actualQuantity',
      key: 'actualQuantity',
    },
    {
      title: 'Số lượng lệch',
      dataIndex: 'diffQuantity',
      key: 'diffQuantity',
    },
    {
      title: 'Giá trị lệch',
      dataIndex: 'diffAmount',
      key: 'diffAmount',
    },
  ];

  return (
    <div className="gap-12 ">
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã nhập hàng:</div>
          <div className="text-black-main">DQG00006601</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người cân bằng:</div>
          <div className="w-3/4">
            <CustomSelect onChange={() => {}} className="border-underline" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">17/10/2023 09:05:14</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">
            <Image src={EditIcon} />
            <span className="ml-2">Thêm ghi chú:</span>
          </div>
          <div className="w-3/4">
            <CustomInput bordered={false} onChange={() => {}} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div className="text-[#00B63E]">Hoàn thành</div>
        </div>
      </div>

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="ml-auto mb-5 w-[380px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng thực tế::</div>
          <div className="text-black-main">2</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Số lượng tăng::</div>
          <div className="text-black-main">1</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Số lượng giảm:</div>
          <div className="text-black-main">140000</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng chênh lệch:</div>
          <div className="text-black-main">0</div>
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
