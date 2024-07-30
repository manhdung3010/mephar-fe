import { getCustomer } from '@/api/customer.service';
import { CustomModal } from '@/components/CustomModal';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { formatMoney } from '@/helpers';
import { ICustomer } from '@/modules/partners/customer/type';
import { branchState, profileState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Search from './Search';
import RowDetail from './RowDetail';
// import Search from './Search';
// import RowDetail from './row-detail';

function CustomerDebtModal({
  isOpen,
  onCancel,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave?: (value) => void;
}) {
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    'totalDebtRange[totalDebtStart]': 1,
  });

  const { data: customers, isLoading } = useQuery(
    ['CUSTOMER_LIST', formFilter.page, formFilter.limit, formFilter.keyword, isOpen],
    () => getCustomer(formFilter),
    {
      enabled: !!isOpen,
    }
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns = [
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
      dataIndex: 'totalDebt',
      key: 'totalDebt',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Tổng bán',
      dataIndex: 'totalOrderPay',
      key: 'totalOrderPay',
      render: (value) => formatMoney(value),
    },
  ];
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Danh sách khách hàng"
      width={1114}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />
      <CustomTable
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
                setExpandedRowKeys({ [record.key - 1]: true });
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
    </CustomModal>
  )
}

export default CustomerDebtModal