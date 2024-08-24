import { Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';

import { getOrder } from '@/api/order.service';
import DollarIcon from '@/assets/dolarIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EOrderStatus, EOrderStatusLabel } from '@/enums';
import { formatDateTime, formatMoney, formatNumber, hasPermission } from '@/helpers';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getPointHistory, updateCustomerPoint } from '@/api/customer.service';
import CustomPagination from '@/components/CustomPagination';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import EditIcon from '@/assets/editWhite.svg';
import { CustomModal } from '@/components/CustomModal';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import { CustomDatePicker } from '@/components/CustomDatePicker';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  totalPrice: number;
  receivePrice: number;
  cashOfCustomer: number;
  returnPrice: number;
  createdAt: string;
  status: EOrderStatus;
}

export function PointHistory({ record, branchId }: { record: any, branchId: number }) {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    branchId,
  });

  const [isOpenUpdate, setIsOpenUpdate] = useState(false)
  const [currentPoint, setCurrentPoint] = useState(0)

  const profile = useRecoilValue(profileState);

  const { data: orders, isLoading } = useQuery(
    ['POINT_HISTORY', JSON.stringify(formFilter)],
    () => getPointHistory(record?.id, { ...formFilter }),
    {
      enabled: !!record?.id,
    }
  );

  const columns: any = [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => <span className="text-[#0070F4]">{record?.order?.code || value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      // render: (value) => formatDateTime(value),
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value, record) => formatMoney(value),
    },
    {
      title: 'Điểm GD',
      dataIndex: 'point',
      key: 'point',
      render: (value) => formatNumber(value),
    },
    {
      title: 'Điểm sau GD',
      dataIndex: 'postTransactionPoint',
      key: 'postTransactionPoint',
      render: (value, record) => formatNumber(value),
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={orders?.data?.items}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={orders?.data?.totalItem}
      />

      <div className="flex justify-end gap-4 mt-5">
        {
          hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.update) && (
            <CustomButton
              type="success"
              prefixIcon={<Image src={EditIcon} alt="" />}
              onClick={() => {
                setIsOpenUpdate(true)
                setCurrentPoint(record?.point)
              }}
            >
              Cập nhật điểm
            </CustomButton>
          )
        }

      </div>

      <UpdatePointModal isOpen={isOpenUpdate} onCancle={() => setIsOpenUpdate(false)} customerId={record?.id} currentPoint={currentPoint} />
    </div>
  );
}

const UpdatePointModal = ({ isOpen, onCancle, customerId, currentPoint }: { isOpen: boolean, onCancle: any, customerId: number, currentPoint: number }) => {
  const [pointValue, setPointValue] = useState(0)
  const [noteValue, setNoteValue] = useState('')
  const queryClient = useQueryClient();
  const { mutate: mutateUpdateCustomerPoint, isLoading } =
    useMutation(
      () => {
        return updateCustomerPoint(customerId, { point: pointValue, note: noteValue });
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['POINT_HISTORY']);
          await queryClient.invalidateQueries(['CUSTOMER_LIST']);
          setPointValue(0)
          onCancle();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      },
    );
  const onSubmit = () => {
    mutateUpdateCustomerPoint()
  }
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancle}
      onSubmit={onSubmit}
      title={
        <div className="text-xl">
          Cập nhật điểm
        </div>
      }
      width={650}
    // isLoading={isLoadingCreateCustomer}
    >
      <div className='mt-5'>
        <div>
          <div className='mb-5 grid grid-cols-1 gap-2'>
            <div className='flex items-center'>
              <span className='w-[150px] font-medium'>Điểm hiện tại</span>
              <span className='flex-1'>{formatNumber(currentPoint)}</span>
            </div>
            <div className='flex items-center'>
              <span className='w-[150px] font-medium'>Điểm mới</span>
              <span className='flex-1'>
                <CustomInput className='h-11' placeholder='Nhập điểm mới' onChange={(value) => setPointValue(value)} type='number' />
              </span>
            </div>
            <div className='flex items-center'>
              <span className='w-[150px] font-medium'>Ghi chú</span>
              <span className='flex-1'>
                <CustomInput className='h-11' placeholder='Nhập ghi chú' onChange={(value) => setNoteValue(value)} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  )
}