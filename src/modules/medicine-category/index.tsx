import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import { useState } from 'react';

import { getMedicineCategory } from '@/api/medicine-category.service';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';

import type { IProduct } from '../products/list-product/types';

export function Medicines() {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: productCategories, isLoading } = useQuery(
    ['PRODUCT_CATEGORY', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getMedicineCategory(formFilter)
  );

  const columns: ColumnsType<IProduct> = [
    {
      title: 'Mã nhập hàng',
      dataIndex: 'code',
      key: 'code',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Tên thuốc',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số đăng ký',
      dataIndex: 'registerNumber',
      key: 'registerNumber',
      className: 'min-w-[200px]',
    },
    {
      title: 'Hoạt chất',
      dataIndex: 'activeElement',
      key: 'activeElement',
    },
    {
      title: 'Hàm lượng',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Hãng sản xuất',
      dataIndex: 'manufacture',
      key: 'manufacture',
      render: (data) => data?.name,
    },
    {
      title: 'Quy cách đóng gói',
      dataIndex: 'packingSpecification',
      key: 'packingSpecification',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
      render: (data) => data?.name,
    },
  ];
  return (
    <div className="my-6 bg-white">
      <div className="p-4">
        <CustomInput
          placeholder="Tìm kiếm theo tên"
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className=""
          onChange={_debounce((value) => {
            setFormFilter((preValue) => ({
              ...preValue,
              keyword: value,
            }));
          }, 300)}
        />
      </div>

      <CustomTable
        dataSource={productCategories?.data?.items}
        columns={columns}
        scroll={{ x: 1440 }}
        loading={isLoading}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={productCategories?.data?.totalItem}
      />
    </div>
  );
}
