import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { CustomUpload } from '@/components/CustomUpload';
import NormalUpload from '@/components/CustomUpload/NormalUpload';

import Label from '../../../../components/CustomLabel';
import type { IProduct } from '../types';

const Info = () => {
  const record = {
    key: 1,
    code: 'HH230704161432',
    name: 'Cao dán gel Salonship',
    price: '300,000',
    cost: '250,000',
  };

  const dataSource: any = Array(2)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IProduct> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã vạch',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Giá vốn',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Giá bán',
      dataIndex: 'prize',
      key: 'prize',
    },
  ];

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã hàng" required />
          <CustomInput
            className="h-11"
            placeholder="Mã hàng tự động"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Mã vạch" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập mã vạch"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Tên hàng hóa" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập tên thuốc"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Nhóm" required />
          <CustomInput
            className="h-11"
            placeholder="Nhóm sản phẩm"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Vị trí" required />
          <CustomInput
            className="h-11"
            placeholder="Đường dùng"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Giá bán" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập giá bán"
            onChange={() => {}}
          />
        </div>
        <div>
          <Label infoText="" label="Trọng lượng" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập trọng lượng"
            onChange={() => {}}
          />
        </div>
        <div />
        <div>
          <Label infoText="" label="Hình ảnh minh họa" required />
          <CustomUpload className="!w-fit">
            <NormalUpload className="!h-[160px] w-[360px]" />
          </CustomUpload>
        </div>
        <div />
        <div>
          <Label infoText="" label="Thuộc tính" required />
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2">
              <div className="flex items-center gap-[20px] pr-5">
                <div className="whitespace-nowrap  font-medium">
                  Tên thuộc tính
                </div>
                <CustomSelect
                  onChange={() => {}}
                  placeholder="Chọn thuộc tính"
                  className="border-underline grow !rounded-none"
                />
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="font-medium">Giá trị</div>
                <CustomInput
                  placeholder="Nhập giá trị"
                  className="w-auto !rounded-none border-0 border-b"
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-[16px] font-semibold text-[#D64457]">
            <Image src={PlusCircleIcon} alt="" />
            <div>Thêm thuộc tính</div>
          </div>
        </div>
      </div>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        className="my-8"
        pagination={false}
      />
      <div>
        <Label infoText="" label="Đơn vị cơ bản" required />
        <CustomInput
          className="h-11"
          placeholder="Nhập đơn vị cơ bản"
          onChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Info;
