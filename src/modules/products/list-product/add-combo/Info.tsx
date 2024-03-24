import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { CustomUpload } from '@/components/CustomUpload';
import NormalUpload from '@/components/CustomUpload/NormalUpload';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';

import Label from '../../../../components/CustomLabel';
import type { IProduct } from '../types';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGroupProduct, getPosition } from '@/api/product.service';
import { AddPositionModal } from '../components/AddPositionModal';
import InputError from '@/components/InputError';
import { AddGroupProductModal } from '../components/AddGroupProduct';

const Info = ({ useForm, setSelectedMedicineCategory, selectedMedicineCategory, groupProductName, dosageName, positionName }: any) => {

  const { getValues, setValue, errors } = useForm;

  const record = {
    key: 1,
    code: 'HH230704161432',
    name: 'Cao dán gel Salonship',
    price: '300,000',
    cost: '250,000',
  };

  const [isOpenAddPosition, setIsOpenAddPosition] = useState(false)
  const [isOpenAddGroupProduct, setIsOpenAddGroupProduct] =
    useState(false);

  const [positionKeyword, setPositionKeyword] = useState('');
  const [groupProductKeyword, setGroupProductKeyword] = useState(groupProductName);

  const dataSource: any = Array(2)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const { data: positions } = useQuery(['POSITION', positionKeyword], () =>
    getPosition({ page: 1, limit: 20, keyword: positionKeyword })
  );
  const { data: groupProduct } = useQuery(['GROUP_PRODUCT', groupProductKeyword], () =>
    getGroupProduct({ page: 1, limit: 20, keyword: groupProductKeyword })
  );

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
          <Label infoText="" label="Mã hàng" />
          <CustomInput
            className="h-11"
            placeholder="Mã hàng tự động"
            onChange={() => { }}
          />
          <InputError error={errors?.code?.message} />
        </div>
        <div>
          <Label infoText="" label="Mã vạch" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập mã vạch"
            onChange={() => { }}
          />
          <InputError error={errors?.barCode?.message} />
        </div>
        <div>
          <Label infoText="" label="Tên hàng hóa" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập tên thuốc"
            onChange={() => { }}
          />
          <InputError error={errors?.name?.message} />
        </div>
        <div>
          <Label infoText="" label="Nhóm" required />
          <CustomSelect
            onChange={(value) =>
              setValue('groupProductId', value, { shouldValidate: true })
            }
            options={groupProduct?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            // onSearch={debounce((value) => {
            //   setGroupProductKeyword(value);
            // }, 300)}
            className="suffix-icon h-11 !rounded"
            placeholder="Nhóm sản phẩm"
            suffixIcon={
              <div className="flex items-center">
                <Image src={ArrowDownIcon} alt="" />
                <Image
                  src={PlusCircleIcon}
                  alt=""
                  onClick={() => setIsOpenAddGroupProduct(true)}
                />
              </div>
            }
            value={getValues('groupProductId')}
          />
          <InputError error={errors?.groupProductId?.message} />
        </div>
        <div>
          <Label infoText="" label="Vị trí" required />
          <CustomSelect
            onChange={(value) =>
              // setValue('positionId', value, { shouldValidate: true })
              console.log(value)
            }
            options={
              positions?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))
            }
            showSearch={true}
            //   onSearch={
            //     debounce((value) => {
            //     setPositionKeyword(value);
            //   }, 300)
            // }
            className="suffix-icon h-11 !rounded"
            placeholder="Vị trí sản phẩm"
            suffixIcon={
              <div className="flex items-center">
                <Image src={ArrowDownIcon} alt="" />
                <Image
                  src={PlusCircleIcon}
                  alt=""
                  onClick={() => setIsOpenAddPosition(true)}
                />
              </div>
            }
          // value={getValues('positionId')}
          />
          <InputError error={errors?.barCode?.message} />
        </div>
        <div>
          <Label infoText="" label="Giá bán" required />
          <CustomInput
            className="h-11"
            placeholder="Nhập giá bán"
            onChange={() => { }}
          />
          <InputError error={errors?.price?.message} />
        </div>
        <div>
          <Label infoText="" label="Trọng lượng" />
          <CustomInput
            className="h-11"
            placeholder="Nhập trọng lượng"
            onChange={() => { }}
          />
          <InputError error={errors?.weight?.message} />
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
                  onChange={() => { }}
                  placeholder="Chọn thuộc tính"
                  className="border-underline grow !rounded-none"
                />
              </div>
              <div className="flex items-center gap-[10px]">
                <div className="font-medium">Giá trị</div>
                <CustomInput
                  placeholder="Nhập giá trị"
                  className="w-auto !rounded-none border-0 border-b"
                  onChange={() => { }}
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
          onChange={() => { }}
        />
        <InputError error={errors?.weight?.message} />
      </div>
      <AddPositionModal
        isOpen={isOpenAddPosition}
        onCancel={() => setIsOpenAddPosition(false)}
        setPositionKeyword={setPositionKeyword}
        setProductValue={setValue}
      />
      <AddGroupProductModal
        isOpen={isOpenAddGroupProduct}
        onCancel={() => setIsOpenAddGroupProduct(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />
    </div>
  );
};

export default Info;
