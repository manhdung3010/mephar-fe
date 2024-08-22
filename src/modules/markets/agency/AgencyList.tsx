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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateStoreStatus } from '@/api/market.service';
import ConfirmStatusModal from './ConfirmStatusModal';

function AgencyList({ data, formFilter, setFormFilter, isLoading }) {
  const queryClient = useQueryClient();
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const { mutate: mutateUpdateStoreStatus, isLoading: isLoadingCreateOrder } =
    useMutation(
      (payload: any) => {
        return updateStoreStatus(payload?.id, payload?.status)
      },
      {
        onSuccess: async (data) => {
          await queryClient.invalidateQueries(["AGENCY_LIST"]);
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
      render: (value) => <span>{value?.store?.name + " - " + value?.name}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (value, record) => record?.branch?.phone,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (value, record) => record?.branch?.address1,
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
                status: EAcceptFollowStoreStatus.CANCEL,
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
          <CustomButton outline onClick={() => {
            setOpenConfirmModal(true)
            setDeleteId(record?.id)
          }}>Hủy quyền mua</CustomButton>
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

      <ConfirmStatusModal
        isOpen={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onSuccess={() => {
          const newPayload = {
            id: deleteId,
            status: EAcceptFollowStoreStatus.CANCEL,
          }
          mutateUpdateStoreStatus(newPayload)
        }}
        content={''}
      />
    </div>
  )
}

export default AgencyList