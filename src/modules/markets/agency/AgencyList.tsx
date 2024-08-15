import { CustomInput } from '@/components/CustomInput';
import Image from 'next/image';
import React from 'react'
import SearchIcon from '@/assets/searchIcon.svg';
import { debounce } from 'lodash';
import { message, Spin } from 'antd';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import classNames from 'classnames';
import { CustomButton } from '@/components/CustomButton';
import { EAcceptFollowStoreStatus, EFollowStoreStatus } from '../type';
import { useMutation } from '@tanstack/react-query';
import { updateStoreStatus } from '@/api/market.service';

function AgencyList({ data, formFilter, setFormFilter, isLoading }) {

  const { mutate: mutateUpdateStoreStatus, isLoading: isLoadingCreateOrder } =
    useMutation(
      (payload: any) => {
        return updateStoreStatus(payload?.id, payload?.status)
      },
      {
        onSuccess: async (data) => {

        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const columns: any = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (value, _, index) => value,
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "agency",
      key: "agency",
      render: (value) => value?.name,
    },
    {
      title: "Thao tác",
      dataIndex: "createdAt",
      key: "createdAt",
      classNames: 'w-[280px]',
      render: (value, record) => formFilter?.status === EFollowStoreStatus.PENDING ? (
        <div className='flex items-center gap-2'>
          <CustomButton outline
            onClick={() => {
              const newPayload = {
                id: record?.id,
                status: EAcceptFollowStoreStatus.CANCLE,
              }
              mutateUpdateStoreStatus(newPayload)
            }}
          >Từ chối</CustomButton>
          <CustomButton onClick={() => {
            const newPayload = {
              id: record?.id,
              status: EAcceptFollowStoreStatus.ACTIVE,
            }
            mutateUpdateStoreStatus(newPayload)
          }}>Chấp nhận</CustomButton>
        </div>
      ) : (
        <div className='flex items-center gap-2'>
          <CustomButton outline>Hủy quyền mua</CustomButton>
        </div>
      ),
    },
  ];

  return (
    <div>
      <CustomInput
        placeholder="Tìm kiếm khách hàng"
        prefixIcon={<Image src={SearchIcon} alt="" />}
        className="h-9"
        value={formFilter?.keyword}
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />
      {
        formFilter?.status === EFollowStoreStatus.PENDING && (
          <p className='italic font-medium text-[#8F90A6] my-6'>Số lượng đăng ký: {data?.totalItem}</p>
        )
      }
      {
        formFilter?.status === EFollowStoreStatus.ACTIVE && (
          <p className='italic font-medium text-[#8F90A6] my-6'>Số lượng đã chấp nhận: {data?.totalItem}</p>
        )
      }

      <CustomTable
        dataSource={data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        loading={isLoading}
        columns={columns}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={data?.totalItem}
      />
    </div>
  )
}

export default AgencyList