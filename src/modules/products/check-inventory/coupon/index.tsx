import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useState } from 'react';

import CloseIcon from '@/assets/closeWhiteIcon.svg';
import RemoveIcon from '@/assets/removeIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';
import { CustomUnitSelect } from '@/components/CustomUnitSelect';

import { RightContent } from './RightContent';
import { CustomAutocomplete } from '@/components/CustomAutocomplete';
import { cloneDeep, debounce } from 'lodash';
import { getImage } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { getInboundProducts } from '@/api/product.service';
import { useRecoilState, useRecoilValue } from 'recoil';
import { branchState, checkInventoryState, productImportState } from '@/recoil/state';
import { IImportProduct, IImportProductLocal } from '../../import-product/coupon/interface';
import { importProductStatus } from '../../import-product/interface';
import { EProductType } from '@/enums';

interface IRecord {
  key: number;
  id: string;
  name: string;
  units: { name: string }[];
  inventoryQuantity: number;
  actualQuantity: number;
  diffQuantity: number;
  diffAmount: number;
}

export function CheckInventoryCoupon() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});
  const branchId = useRecoilValue(branchState);
  const [importProducts, setImportProducts] =
    useRecoilState(checkInventoryState);
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [productKeyAddBatch, setProductKeyAddBatch] = useState<string>();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  const { data: products, isSuccess } = useQuery<{ data: { items: any[] } }>(
    [
      "LIST_IMPORT_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getInboundProducts({ ...formFilter, branchId })
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <Image
          src={RemoveIcon}
          className=" cursor-pointer"
          onClick={() => console.log(id)}
        />
      ),
    },
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã hàng',
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
      title: 'Tên hàng',
      dataIndex: 'product',
      key: 'product',
      render: (product) => product.name,
    },
    {
      title: 'ĐVT',
      dataIndex: 'units',
      key: 'units',
      render: (_, { units }) => <CustomUnitSelect />,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventoryQuantity',
      key: 'inventoryQuantity',
    },
    {
      title: 'Thực tế',
      dataIndex: 'realQuantity',
      key: 'realQuantity',
      render: () => (
        <CustomInput
          className="w-[70px]"
          bordered={false}
          onChange={() => { }}
        />
      ),
    },
    {
      title: 'SL lệch',
      dataIndex: 'diffQuantity',
      key: 'diffQuantity',
    },
    {
      title: 'Giá trị lệch',
      dataIndex: 'diffAmount',
      key: 'diffAmount',
    },
  ];

  const handleSelectProduct = (value) => {
    const product: IImportProduct = JSON.parse(value);
    console.log("product", product)

    const localProduct: IImportProductLocal = {
      ...product,
      productKey: `${product.product.id}-${product.id}`,
      price: product.product.primePrice * Number(product.product.productUnit?.find((unit) => unit.id === product.id)?.exchangeValue),
      primePrice: product.product.primePrice * Number(product.product.productUnit?.find((unit) => unit.id === product.id)?.exchangeValue),
      inventory: product.quantity,
      quantity: 1,
      discountValue: 0,
      batches: [],
    };

    let cloneImportProducts = cloneDeep(importProducts);

    if (
      importProducts.find(
        (p) => p.productKey === localProduct.productKey
      )
    ) {
      cloneImportProducts = cloneImportProducts.map((product) => {
        if (product.productKey === localProduct.productKey) {
          return {
            ...product,
            quantity: product.quantity + 1,
          };
        }

        return product;
      });
    } else {
      cloneImportProducts.push(localProduct);
    }

    setImportProducts(cloneImportProducts);
  }

  const checkDisplayListBatch = (product: IImportProductLocal) => {
    return (
      product.product.type === EProductType.MEDICINE ||
      (product.product.type === EProductType.PACKAGE &&
        product.product.isBatchExpireControl)
    );
  };

  const handleRemoveBatch = (productKey: string, batchId: number) => {
    let products = cloneDeep(importProducts);

    products = products.map((product) => {
      if (product.productKey === productKey) {
        return {
          ...product,
          batches: product.batches?.filter((batch) => batch.id !== batchId),
        };
      }
      return product;
    });
    setImportProducts(products);
  };

  return (
    <div className="-mx-8 flex">
      <div className="grow overflow-x-auto">
        <div className="hidden-scrollbar overflow-x-auto overflow-y-hidden">
          <div className="flex h-[72px] w-full  min-w-[800px] items-center bg-red-main px-6 py-3">
            <CustomAutocomplete
              className="!h-[48px] w-full !rounded text-base"
              prefixIcon={<Image src={SearchIcon} alt="" />}
              placeholder="Tìm kiếm theo mã nhập hàng"
              wrapClassName="w-full !rounded bg-white"
              onSelect={(value) => handleSelectProduct(value)}
              showSearch={true}
              listHeight={512}
              onSearch={debounce((value) => {
                setFormFilter((preValue) => ({
                  ...preValue,
                  keyword: value,
                }));
              })}
              value={formFilter.keyword}
              options={products?.data?.items.map((item) => ({
                value: JSON.stringify(item),
                label: (
                  <div className="flex items-center gap-x-4 p-2">
                    <div className=" flex h-12 w-[68px] items-center rounded border border-gray-300 p-[2px]">
                      {item.product.image?.path && (
                        <Image
                          src={getImage(item.product.image?.path)}
                          height={40}
                          width={68}
                          alt=""
                          objectFit="cover"
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex gap-x-5">
                        <div>
                          {item.code} - {item.product.name}
                        </div>
                        <div className="rounded bg-red-main px-2 py-[2px] text-white">
                          {item.unitName}
                        </div>
                      </div>
                      <div>Số lượng - {item.quantity}</div>
                    </div>
                  </div>
                ),
              }))}
            />
          </div>
        </div>

        <div className=" overflow-x-auto">
          <div className="min-w-[1000px]">
            <CustomTable
              dataSource={importProducts?.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={columns}
              pagination={false}
              expandable={{
                defaultExpandAllRows: true,
                expandedRowRender: (record: IImportProductLocal) => (
                  <>
                    {checkDisplayListBatch(record) && (
                      <div className="bg-[#FFF3E6] px-6 py-2 ">
                        <div className="flex items-center gap-x-3">
                          <div
                            className="ml-1 cursor-pointer font-medium text-[#0070F4]"
                            onClick={() => {
                              setProductKeyAddBatch(record.productKey);
                              setOpenListBatchModal(true);
                            }}
                          >
                            Chọn lô
                          </div>

                          {record.batches?.map((batch) => (
                            <div
                              key={batch.id}
                              className="flex items-center rounded bg-red-main py-1 px-2 text-white"
                            >
                              <span className="mr-2">
                                {batch.name} - {batch.expiryDate} - SL:{" "}
                                {batch.quantity}
                              </span>{" "}
                              <Image
                                className=" cursor-pointer"
                                src={CloseIcon}
                                onClick={() => {
                                  handleRemoveBatch(
                                    record.productKey,
                                    batch.id
                                  );
                                }}
                                alt=""
                              />
                            </div>
                          ))}
                        </div>
                        {/* <InputError
                          error={
                            errors?.products &&
                            errors?.products[Number(record.key) - 1]?.batches
                              ?.message
                          }
                        /> */}
                      </div>
                    )}
                  </>
                ),
                expandIcon: () => <></>,
                expandedRowKeys: Object.keys(expandedRowKeys).map(
                  (key) => +key + 1
                ),
              }}
            />
          </div>
        </div>
      </div>

      <RightContent />
    </div>
  );
}
