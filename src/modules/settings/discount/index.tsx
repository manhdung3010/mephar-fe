import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EDiscountStatus, EDiscountStatusLabel } from '@/enums';

import RowDetail from './row-detail';
import Search from './Search';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteDiscount, getDiscount } from '@/api/discount.service';
import CustomPagination from '@/components/CustomPagination';
import { formatDateTime, hasPermission } from '@/helpers';
import { debounce } from 'lodash';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import { RoleAction, RoleModel } from '../role/role.enum';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';
import { EDiscountBillMethod, EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from './add-discount/Info';
import DeleteModal from './DeleteModal';
import { message } from 'antd';

interface IRecord {
  key: number;
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  createdBy: string;
  status: EDiscountStatus;
  type: string;
  target: string;
}

export function Discount() {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [deletedId, setDeletedId] = useState<string>();
  const queryClient = useQueryClient();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    status: undefined,
    effective: undefined,
  });

  const { data: discount, isLoading } = useQuery(
    ['DISCOUNT_LIST', formFilter],
    () => getDiscount(formFilter)
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã chương trình',
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
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Từ ngày',
      dataIndex: 'discountTime',
      key: 'discountTime',
      render: (discountTime) => <span>{formatDateTime(discountTime[0]?.dateFrom)}</span>,
    },
    {
      title: 'Đến ngày',
      dataIndex: 'discountTime',
      key: 'discountTime',
      render: (discountTime) => <span>{formatDateTime(discountTime[0]?.dateTo)}</span>,
    },
    // {
    //   title: 'Người tạo',
    //   dataIndex: 'createdBy',
    //   key: 'createdBy',
    // },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            status === EDiscountStatus.active
              ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
              : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {status === EDiscountStatus.active ? EDiscountStatusLabel.active : EDiscountStatusLabel.inactive}
        </div>
      ),
    },
    {
      title: 'Hình thức khuyến mại',
      dataIndex: 'type',
      key: 'type',
      render: (type, { target }) => <span>
        {target === "order" ? "Hóa đơn - " : "Hàng hóa - "}
        {target === "order" ? EDiscountBillMethodLabel[type.toUpperCase()] : EDiscountGoodsMethodLabel[type.toUpperCase()]}
      </span>,
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <div className="flex gap-3">
          {
            hasPermission(profile?.role?.permissions, RoleModel.discount, RoleAction.delete) && (
              <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
                <Image src={DeleteIcon} />
              </div>
            )
          }

          {
            hasPermission(profile?.role?.permissions, RoleModel.discount, RoleAction.update) && (
              <div
                className=" cursor-pointer"
                onClick={() =>
                  router.push(`/settings/discount/add-discount?id=${id}`)
                }
              >
                <Image src={EditIcon} />
              </div>
            )
          }

        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteDiscount, isLoading: isLoadingDeleteDiscount } =
    useMutation(() => deleteDiscount(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['DISCOUNT_LIST']);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteDiscount();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        {
          hasPermission(profile?.role?.permissions, RoleModel.discount, RoleAction.create) && (
            <CustomButton
              prefixIcon={<Image src={PlusIcon} />}
              onClick={() => router.push('/settings/discount/add-discount')}
            >
              Thêm mới khuyến mại
            </CustomButton>
          )
        }
      </div>
      {/* <Search onChange={debounce((value) => {
        setFormFilter((preValue) => ({
          ...preValue,
          keyword: value,
        }));
      }, 300)} /> */}
      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            status: value?.status,
            effective: value?.effective,
          }));
        }, 300)}
      />

      <CustomTable
        dataSource={discount?.data?.data?.items?.map((item, index) => ({
          ...item,
          key: index,
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
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ ...expandedRowKeys, [record.key]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => {
            return <RowDetail record={record} />;
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={discount?.data?.data?.totalItem || 0}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="chương trình khuyến mại"
        isLoading={isLoadingDeleteDiscount}
      />
    </div>
  );
}
