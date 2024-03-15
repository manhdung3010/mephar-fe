import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getProduct } from '@/api/product.service';
import CustomPagination from '@/components/CustomPagination';
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from '@/enums';
import { formatMoney } from '@/helpers';
import { branchState } from '@/recoil/state';

import CustomTable from '../../../components/CustomTable';
import Header from './Header';
import ProductDetail from './row-detail';
import Search from './Search';
import type { IProduct } from './types';

const ProductList = () => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: products, isLoading } = useQuery(
    [
      'LIST_PRODUCT',
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getProduct({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IProduct> = [
    {
      title: 'Mã hàng',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên hàng',
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
      title: 'Đơn vị',
      dataIndex: 'baseUnit',
      key: 'baseUnit',
    },
    {
      title: 'Nhóm hàng',
      dataIndex: 'groupProduct',
      key: 'groupProduct',
      render: (data) => data?.name,
    },
    {
      title: 'Loại hàng',
      dataIndex: 'type',
      key: 'type',
      render: (value) =>
        EProductTypeLabel[getEnumKeyByValue(EProductType, value)],
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Giá vốn',
      dataIndex: 'primePrice',
      key: 'primePrice',
      render: (value) => formatMoney(value),
    },
  ];

  return (
    <div>
      <Header />
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
        dataSource={products?.data?.items?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IProduct) => (
            <ProductDetail record={record} />
          ),
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
      {/* <div className="m-auto flex w-fit flex-col gap-14">
        <div className="m-auto w-[276px]">
          <Image src={EmptyImg} alt="" />
        </div>
        <div>
          <div className="text-center text-xl font-medium text-[#182537]">
            Cửa hàng của bạn chưa có sản phẩm nào
          </div>
          <div className="text-center text-base text-[#888888]">
            Thêm mới hoặc nhập danh sách sản phẩm của bạn
          </div>

          <div className="m-auto mt-6 grid w-[352px] grid-cols-2 gap-x-[30px] gap-y-6">
            <CustomButton
              color="red"
              variant="outline"
              prefixIcon={DownloadRedIcon}
              className="font-medium"
            >
              Nhập file
            </CustomButton>
            <AddNew />
            <div className="whitespace-pre-wrap text-center text-sm text-[#888888]">
              Sử dụng khi bạn muốn nhập một danh sách sản phẩm
            </div>
            <div className="whitespace-pre-wrap text-center text-sm text-[#888888]">
              Sử dụng khi bạn muốn tạo mới một sản phẩm
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default ProductList;
