import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useState } from 'react';

import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from './Search';
import { SettingCollectPointModal } from './SettingCollectPointModal';

interface IRecord {
  key: number;
  type: string;
  changePoint: string;
  target: string;
  init: string;
}

export function CollectPoint() {
  const [openSettingCollectPointModal, setOpenSettingCollectPointModal] =
    useState(false);

  const record = {
    key: 1,
    type: 'Hóa đơn',
    changePoint: 'Content',
    target: 'Toàn bộ khách hàng',
    init: 'Content',
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Hình thức',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Đổi điểm',
      dataIndex: 'changePoint',
      key: 'changePoint',
    },
    {
      title: 'Đối tượng',
      dataIndex: 'target',
      key: 'target',
    },
    {
      title: 'Khởi tạo',
      dataIndex: 'init',
      key: 'init',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_) => (
        <div className="flex gap-3">
          <div className=" cursor-pointer">
            <Image src={DeleteIcon} />
          </div>
          <div className=" cursor-pointer">
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];

  return (
    // <div className="mb-2">
    //   <div className="my-3 flex items-center justify-end gap-4">
    //     <CustomButton
    //       prefixIcon={<Image src={PlusIcon} />}
    //       onClick={() => setOpenSettingCollectPointModal(true)}
    //     >
    //       Thiết lập tích điểm
    //     </CustomButton>
    //   </div>

    //   <Search />

    //   <CustomTable dataSource={dataSource} columns={columns} />

    //   <SettingCollectPointModal
    //     isOpen={openSettingCollectPointModal}
    //     onCancel={() => setOpenSettingCollectPointModal(false)}
    //   />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
