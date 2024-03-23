import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { debounce, set } from 'lodash';
import { useEffect, useState } from 'react';
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
import { CustomUnitSelect } from '@/components/CustomUnitSelect';
import ListUnit from './ListUnit';

const ProductList = () => {
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    // name: '',
    type: null,
    status: null,
    // productCategoryId: '',
    // groupProductId: '',
    // statusArray: [],
    // unitId: '',
    // manufactureId: '',
    // notEqualManufactureId: '',
    // listProductId: [],
    // notEqualId: '',
    // order: ['id', 'desc'],
    // tag: '',
    // newest: '',
    // bestseller: '',
    // az: '',
    // za: '',
    // price: '',
    // include: 'productUnit,groupProduct,manufacture,productCategory',
    // attributes: '',
    // raw: false,
    // branchId: branchId,
    // storeId: '',
    // isSale: false
  });

  const [valueChange, setValueChange] = useState<number | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<any>([]);

  const { data: products, isLoading } = useQuery(
    [
      'LIST_PRODUCT',
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
      formFilter.status,
      formFilter.type
    ],
    () => getProduct({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    setSelectedList(products?.data?.items)
  }, [formFilter, products?.data?.items])

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
      dataIndex: 'productUnit',
      key: 'productUnit',
      className: 'unit-col',
      render: (data, record) => {
        return (
          <ListUnit data={data} onChangeUnit={(value) => handleChangeUnitValue(value, record)} />
        )
      },
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
      render: (value, record) => {
        return formatMoney(value)
      },
    },
    {
      title: 'Giá vốn',
      dataIndex: 'primePrice',
      key: 'primePrice',
      render: (value) => formatMoney(value),
    },
  ];

  const handleChangeUnitValue = (value, record) => {
    setValueChange(value);
    const filter = selectedList.filter((item) => item?.id !== record.id);
    setSelectedList([...filter, { ...record, price: record?.productUnit?.find((unit) => unit.id === value)?.price, unitId: value }]?.sort(function (a, b) {
      return b.id - a.id;
    }));
  }

  return (
    <div>
      <Header />
      <Search
        onChange={debounce((value) => {
          console.log("value", value)
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            status: value?.status,
            type: value?.type,
          }));
        }, 300)}
      />
      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={selectedList?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Check if the click came from the action column
              if ((event.target as Element).closest('.ant-table-cell.unit-col') || (event.target as Element).closest('.rc-virtual-list-holder-inner')) {
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
