import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getSampleMedicines } from '@/api/product.service';
import CustomPagination from '@/components/CustomPagination';
import { ECommonStatus, ECommonStatusLabel, getEnumKeyByValue } from '@/enums';
import { branchState } from '@/recoil/state';

import CustomTable from '../../../components/CustomTable';
import Header from './Header';
import ProductDetail from './row-detail';
import Search from './Search';

const SampleMedicine = () => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    status: undefined,
    positionId: undefined,
    userId: undefined,
  });

  const { data: products, isLoading } = useQuery(
    [
      'LIST_SAMPLE_MEDICINE',
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      formFilter.status,
      formFilter.positionId,
      formFilter.userId,
      branchId,
    ],
    () => getSampleMedicines({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns = [
    {
      title: 'Mã đơn thuốc',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên đơn thuốc',
      dataIndex: 'name',
      key: 'name',
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            {
              'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                status === ECommonStatus.active,
              'text-[##666666] border border-[##666666] bg-[#F5F5F5]':
                status === ECommonStatus.inactive,
            },
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {ECommonStatusLabel[getEnumKeyByValue(ECommonStatus, status)]}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header />
      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            status: value?.status,
            positionId: value?.positionId,
            userId: value?.userId,
          }));
        }, 300)}
      />
      <CustomTable
        // rowSelection={{
        //   type: 'checkbox',
        // }}
        dataSource={products?.data?.items?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ [record.key]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record) => <ProductDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={products?.data?.totalItem}
      />
    </div>
  );
};

export default SampleMedicine;
