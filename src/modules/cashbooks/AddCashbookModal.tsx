import { Checkbox, Select, Spin } from 'antd';
import Image from 'next/image';

import ReceiptIcon from '@/assets/receiptIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import { CustomSelect } from '@/components/CustomSelect';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { AddCollectType } from './AddCollectTypeModal';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { useQuery } from '@tanstack/react-query';
import { getTypeTransaction, getUserTransaction } from '@/api/cashbook.service';
import { debounce } from 'lodash';
import { getCustomer } from '@/api/customer.service';
import { getProvider } from '@/api/provider.service';
import { getEmployee } from '@/api/employee.service';
import { AddOtherUserModal } from './AddOtherUserModal';
import dayjs from 'dayjs';
import InputError from '@/components/InputError';
const { Option } = Select;

export function AddCashbookModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const [isOpenAddGroupProduct, setIsOpenAddGroupProduct] = useState(false);
  const [isOpenAddOtherUser, setIsOpenAddOtherUser] = useState(false);
  const [groupProductKeyword, setGroupProductKeyword] = useState('');
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      schema
    ),
    mode: 'onChange',
    defaultValues: {
      target: 'customer',
      paymentDate: dayjs().format('YYYY-MM-DD hh:mm:ss'),
    }
  });
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });
  const { data: groupProduct } = useQuery(['TYPE_TRANSACTION', groupProductKeyword], () =>
    getTypeTransaction('income')
  );
  const { data: customers, isLoading } = useQuery(
    ['CUSTOMER_LIST', formFilter],
    () => getCustomer(formFilter)
  );
  const { data: providers, isLoading: isLoadingProvider } = useQuery(
    ['PROVIDER_LIST', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getProvider(formFilter)
  );
  const { data: employees, isLoading: isLoadingEmployees } = useQuery(
    ['SETTING_EMPLOYEE', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getEmployee(formFilter)
  );
  const { data: otherUsers, isLoading: isLoadingOtherUsers } = useQuery(
    ['OTHER_USER'],
    () => getUserTransaction(),
    {
      enabled: getValues('target') === 'other'
    }
  );

  const onSubmit = () => {
    console.log(getValues());
  };
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Lập phiếu thu (Tiền mặt)"
      width={750}
      customFooter={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="grid grid-cols-2 gap-x-8">
        <div className="mb-5">
          <Label infoText="" label="Mã phiếu" />
          <CustomInput
            onChange={(value) => {
              setValue('code', value, { shouldValidate: true })
            }}
            value={getValues('code')}
            placeholder="Mã phiếu tự động"
            className="h-11"
          />
        </div>

        <div className="mb-5">
          <Label infoText="" label="Đối tượng nộp" required />
          <CustomSelect
            onChange={(value) => {
              setValue('target', value, { shouldValidate: true })
            }}
            options={[
              {
                value: 'customer',
                label: 'Khách hàng',
              },
              {
                value: 'supplier',
                label: 'Nhà cung cấp',
              },
              {
                value: 'user',
                label: 'Nhân viên',
              },
              {
                value: 'other',
                label: 'Khác',
              },

            ]}
            className="h-11 !rounded"
            value={getValues('target')}
            placeholder="Chọn đối tượng nộp"
          />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Thời gian" />
          <CustomDatePicker showTime className="h-11 w-full !rounded" value={getValues('paymentDate')} onChange={(value) => {
            setValue('paymentDate', value, { shouldValidate: true })
          }} />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Tên người nộp" required />
          {
            getValues('target') === 'other' ? <div>
              <CustomSelect
                onChange={(value) => {
                  setValue('targetId', value, { shouldValidate: true })
                }

                }
                options={otherUsers?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhập tên người nộp"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} alt="" />
                    <Image
                      src={PlusCircleIcon}
                      alt=""
                      onClick={() => setIsOpenAddOtherUser(true)}
                    />
                  </div>
                }
                value={getValues('targetId')}
              />
            </div>
              : <Select
                className="h-11 !rounded w-full"
                placeholder={"Tìm kiếm"}
                optionFilterProp="children"
                showSearch
                onSearch={debounce((value) => {
                  setFormFilter({
                    ...formFilter,
                    keyword: value
                  })
                }, 300)}
                onChange={(value) => {
                  setValue('targetId', value, { shouldValidate: true })
                }}
                // loading={isLoadingProduct ?? isLoadingGroup}
                value={getValues('targetId')}
                notFoundContent={isLoading || isLoadingProvider || isLoadingEmployees ? <Spin size="small" className='flex justify-center p-4 w-full' /> : null}
                size='large'
              >
                {

                  getValues('target') === "customer" ? customers?.data?.items?.map((product) => (
                    <Option key={product.id} value={product?.id}>
                      {
                        product?.fullName
                      }
                    </Option>
                  )) : getValues('target') === "supplier" ?
                    providers?.data?.items?.map((product) => (
                      <Option key={product.id} value={product?.id}>
                        {
                          product?.name || product?.fullName
                        }
                      </Option>
                    )) : getValues('target') === "user" ?
                      employees?.data?.items?.map((product) => (
                        <Option key={product.id} value={product?.id}>
                          {
                            product?.fullName
                          }
                        </Option>
                      )) : null
                }
              </Select>
          }
          <InputError error={errors.targetId?.message} />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Loại thu" required />
          <CustomSelect
            onChange={(value) => {
              setValue('typeId', value, { shouldValidate: true })
            }

            }
            options={groupProduct?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            className="suffix-icon h-11 !rounded"
            placeholder="Chọn loại thu"
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
            value={getValues('typeId')}
          />
        </div>

        <div className="mb-5 ">
          <Label infoText="" label="Giá trị" required />
          <CustomInput
            placeholder="Nhập giá trị "
            className="h-11"
            value={getValues('value')}
            type='number'
            onChange={(value) => {
              setValue('value', value, { shouldValidate: true })
            }}
          />
          <InputError error={errors.value?.message} />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Nhân viên thu" required />
          <CustomSelect
            onChange={(value) => {
              setValue('userId', value, { shouldValidate: true })
            }}
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))
            }
            className="h-11 !rounded"
            placeholder="Chọn nhân viên"
            value={getValues('userId')}
          />
          <InputError error={errors.userId?.message} />
        </div>

        <div className="mb-5 flex items-end">
          <Checkbox className="mr-3" />
          Thanh toán hóa đơn nợ
        </div>
      </div>

      <div className="mb-5">
        <Label infoText="" label="Ghi chú" />
        <CustomTextarea rows={6} placeholder="Nhập ghi chú" />
      </div>

      <div className="flex justify-end">
        <CustomButton
          type="success"
          prefixIcon={<Image src={ReceiptIcon} alt="" />}
          onClick={handleSubmit(onSubmit)}
        >
          Lập phiếu thu
        </CustomButton>
      </div>

      <AddCollectType
        isOpen={isOpenAddGroupProduct}
        onCancel={() => setIsOpenAddGroupProduct(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />
      <AddOtherUserModal
        isOpen={isOpenAddOtherUser}
        onCancel={() => setIsOpenAddOtherUser(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />
    </CustomModal>
  );
}
