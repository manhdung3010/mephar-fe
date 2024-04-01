import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteCustomer, getCustomer } from '@/api/customer.service';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import ExportIcon from '@/assets/exportFileIcon.svg';
import ImportIcon from '@/assets/importFileIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import DeleteModal from '@/components/CustomModal/ModalDeleteItem';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { ECustomerStatus, ECustomerStatusLabel } from '@/enums';
import { formatMoney } from '@/helpers';

import RowDetail from './row-detail';
import Search from './Search';
import type { ICustomer } from './type';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

interface IRecord {
  key: number;
  id: number;
  code: string;
  fullName: string;
  phone: string;
  debt: number;
  totalSell: number;
  point: number;
  totalPoint: number;
  totalSellExceptReturn: number;
  status: ECustomerStatus;
}

export function Customer() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const [deletedId, setDeletedId] = useState<number>();
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });
  const { data: customers, isLoading } = useQuery(
    ['CUSTOMER_LIST', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getCustomer(formFilter)
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã khách hàng',
      dataIndex: 'code',
      key: 'code',
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
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Nợ hiện tại',
      dataIndex: 'debt',
      key: 'debt',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Tổng bán',
      dataIndex: 'totalSell',
      key: 'totalSell',
    },
    // {
    //   title: 'Điểm hiện tại',
    //   dataIndex: 'point',
    //   key: 'point',
    // },
    // {
    //   title: 'Tổng điểm',
    //   dataIndex: 'totalPoint',
    //   key: 'totalPoint',
    // },
    // {
    //   title: 'Tổng bán trừ trả hàng',
    //   dataIndex: 'totalSellExceptReturn',
    //   key: 'totalSellExceptReturn',
    // },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            {
              'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                status === ECustomerStatus.active,
              'text-[##666666] border border-[##666666] bg-[#F5F5F5]':
                status === ECustomerStatus.inactive,
            },
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {ECustomerStatusLabel[status]}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <div className="flex gap-3">
          <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
            <Image src={DeleteIcon} />
          </div>
          <div
            className=" cursor-pointer"
            onClick={() =>
              router.push(`/partners/customer/add-customer?id=${id}`)
            }
          >
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteCustomer, isLoading: isLoadingDeleteCustomer } =
    useMutation(() => deleteCustomer(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['CUSTOMER_LIST']);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteCustomer();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Image src={ExportIcon} /> Xuất file
        </div>

        <div className="h-5 w-[1px] bg-[#D3D5D7]"></div>

        <div className="flex items-center gap-2">
          <Image src={ImportIcon} /> Nhập file
        </div>

        <CustomButton
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/partners/customer/add-customer')}
        >
          Thêm khách hàng
        </CustomButton>
      </div>

      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={customers?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Check if the click came from the action column
              if ((event.target as Element).closest('.ant-table-cell:last-child')) {
                return;
              }

              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key - 1]) {
                const { [record.key - 1]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ ...expandedRowKeys, [record.key - 1]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: ICustomer) => (
            <RowDetail record={record} branchId={branchId} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map(
            (key) => Number(key) + 1
          ),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={customers?.data?.totalItem}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="khách hàng"
        isLoading={isLoadingDeleteCustomer}
      />
    </div>
  );
}
