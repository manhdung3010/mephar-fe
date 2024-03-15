import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  method: string;
  fromAmount: number;
  fee: number;
  stageConfig: number;
}

const SettingFee = () => {
  const record = {
    key: 1,
    method: 'Chốt đơn gửi luôn',
    fromAmount: 0,
    fee: 40000,
    stageConfig: 0,
  };

  const dataSource: IRecord[] = Array(3)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tên phương thức',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Khoảng',
      dataIndex: 'fromAmount',
      key: 'fromAmount',
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'fee',
      key: 'fee',
    },
    {
      title: 'Quận/huyện điều chỉnh',
      dataIndex: 'stageConfig',
      key: 'stageConfig',
    },
    {
      title: '',
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
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">HÀ NỘi</div>
        <div className="flex gap-4">
          <CustomButton>Xóa khu vực</CustomButton>
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton>Lưu</CustomButton>
        </div>
      </div>

      <div className="my-6 grid grid-cols-3 gap-6">
        <div className=" col-span-1">
          <div className="mb-2 text-base text-[#182537]">
            Phí vận chuyển cấu hình
          </div>
          <div className="text-[#666]">
            Các phí vận chuyển được áp dụng trong khu vực
          </div>
        </div>

        <div className=" col-span-2">
          <div className="mb-4 rounded bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="text-base text-[#182537]">
                Phí vận chuyển theo giá trị đơn hàng
              </div>
              <CustomButton type="original" className="!h-11">
                Thêm phí vận chuyển
              </CustomButton>
            </div>

            <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

            <CustomTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </div>

          <div className="rounded bg-white p-5">
            <div className="mb-6 flex items-center justify-between">
              <div className="text-base text-[#182537]">
                Phí vận chuyển theo khối lượng sản phẩm
              </div>
              <CustomButton type="original" className="!h-11">
                Thêm phí vận chuyển
              </CustomButton>
            </div>

            <div className="text-[#666666]">
              Hiện tại chưa có phí vận chuyển khối lượng sản phẩm nào được áp
              dụng cho khu vực này. Bạn hãy thêm phí vận chuyển để khách hàng có
              thể nhìn thấy khi thanh toán
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingFee;
