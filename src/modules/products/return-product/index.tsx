import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getReturnProduct } from '@/api/return-product.service';
import ExportIcon from '@/assets/exportIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { branchState } from '@/recoil/state';

import type { IRecord } from './interface';
import ProductDetail from './row-detail';
import Search from './Search';

export function ReturnProduct() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    dateRange: { startDate: undefined, endDate: undefined },
    userId: undefined,
  });

  const { data: returnProducts, isLoading } = useQuery(
    ['LIST_IMPORT_PRODUCT', JSON.stringify(formFilter), branchId],
    () => getReturnProduct({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Mã nhập hàng',
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
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thời gian tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Nhà cung cấp',
      dataIndex: 'supplier',
      key: 'supplier',
      render: (data) => data?.name,
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
      render: (data) => data?.name,
    },
    {
      title: 'Người trả',
      dataIndex: 'user',
      key: 'user',
      render: (data) => data?.fullName,
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
      render: (data) => data?.fullName,
    },
    {
      title: 'Ghi chú',
      dataIndex: 'description',
      key: 'description',
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push('/products/return/coupon')}
          type="success"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Trả hàng nhập
        </CustomButton>

        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>

      <Search />

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={returnProducts?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => (
            <ProductDetail record={record} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={returnProducts?.data?.totalItem}
      />
    </div>
  );
}
