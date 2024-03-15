import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useState } from 'react';

import CloseIcon from '@/assets/closeWhiteIcon.svg';
import RemoveIcon from '@/assets/removeIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { CustomUnitSelect } from '@/components/CustomUnitSelect';

import { RightContent } from './RightContent';

interface IRecord {
  key: number;
  id: string;
  name: string;
  units: { name: string }[];
  inventoryQuantity: number;
  actualQuantity: number;
  diffQuantity: number;
  diffAmount: number;
}

export function CheckInventoryCoupon() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const dataSource: IRecord[] = [
    {
      key: 0,
      id: 'TH230719085724',
      name: 'Mike',
      units: [{ name: 'test 1' }, { name: 'test2' }],
      inventoryQuantity: 100,
      actualQuantity: 10,
      diffQuantity: 4,
      diffAmount: 0,
    },
    {
      key: 1,
      id: 'TH230719085724',
      name: 'Mike',
      units: [{ name: 'test 1' }, { name: 'test2' }],
      inventoryQuantity: 100,
      actualQuantity: 100000,
      diffQuantity: 5,
      diffAmount: 0,
    },
  ];

  const columns: ColumnsType<IRecord> = [
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <Image
          src={RemoveIcon}
          className=" cursor-pointer"
          onClick={() => console.log(id)}
        />
      ),
    },
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã hàng',
      dataIndex: 'id',
      key: 'id',
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'ĐVT',
      dataIndex: 'units',
      key: 'units',
      render: (_, { units }) => <CustomUnitSelect />,
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
      render: () => (
        <CustomInput
          className="w-[70px]"
          bordered={false}
          onChange={() => {}}
        />
      ),
    },
    {
      title: 'SL lệch',
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
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
          <div className="flex h-[72px] w-full  min-w-[800px] items-center bg-red-main px-6 py-3">
            <CustomInput
              className="h-[40px] w-full rounded text-base"
              prefixIcon={<Image src={SearchIcon} />}
              placeholder="Tìm kiếm theo mã nhập hàng"
              wrapClassName="w-full"
              onChange={() => {}}
            />
          </div>
        </div>

        <div className=" overflow-x-auto">
          <div className="min-w-[1000px]">
            <CustomTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              expandable={{
                defaultExpandAllRows: true,
                // eslint-disable-next-line @typescript-eslint/no-shadow
                expandedRowRender: (record: IRecord) => (
                  <div className="flex items-center bg-[#FFF3E6] px-6 py-2">
                    <div className="mr-3 cursor-pointer font-medium text-[#0070F4]">
                      Chọn lô
                    </div>
                    <div className="flex items-center rounded bg-red-main py-1 px-2 text-white">
                      <span className="mr-2">Pherelive SL1 - 26/07/2023</span>{' '}
                      <Image className=" cursor-pointer" src={CloseIcon} />
                    </div>
                  </div>
                ),
                expandIcon: () => <></>,
                expandedRowKeys: Object.keys(expandedRowKeys).map(
                  (key) => +key
                ),
              }}
            />
          </div>
        </div>
      </div>

      <RightContent />
    </div>
  );
}
