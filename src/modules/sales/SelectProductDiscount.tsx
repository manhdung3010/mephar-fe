import { CustomButton } from '@/components/CustomButton'
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable';
import { formatMoney } from '@/helpers';
import { branchState, productDiscountSelected } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ISaleProduct } from './interface';
import { getSaleProducts } from '@/api/product.service';
import { ProductList } from './ProductList';

function SelectProductDiscount({ isOpen, onCancel, onSave, products, discountId }) {
  const [listProduct, setListProduct] = useState<any[]>([]);
  const [productDiscount, setProductDiscount] = useRecoilState(productDiscountSelected);
  const [productCode, setProductCode] = useState('');
  const branchId = useRecoilValue(branchState);

  const { data: productsList, isLoading: isLoadingProduct, isSuccess } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    [
      'LIST_SALE_PRODUCT',
      1,
      9999,
      "",
      branchId,
    ],
    () => getSaleProducts({ page: 1, limit: 9999, keyword: "", branchId }),
    { enabled: !!isOpen }
  );

  useEffect(() => {
    if (products) {
      // const newProducts = products.map((product) => {
      //   return {
      //     ...product,
      //     isSelected: false,
      //     discountQuantity: 0,
      //   };
      // });
      // setListProduct(newProducts);

      // get product discount

      const productUnits = products.find((p) => p.id === discountId)?.items[0]?.apply?.productUnitId;
      const maxQuantity = products.find((p) => p.id === discountId)?.items[0]?.apply?.maxQuantity;
      const a = productUnits?.map((item) => {
        const product1 = productsList?.data?.items?.find((product) => product.id === item || product.id === item?.id);
        return {
          ...product1,
          isSelected: false,
        };
      }).map((i, index) => {
        return {
          ...i,
          maxQuantity: maxQuantity,
          // isSelected: isSe,
          key: i.id,
        }
      });
      console.log("a", a)

      setListProduct(a);
    }
  }, [products, isOpen, productsList]);

  // console.log("productDiscount", productDiscount)

  const columns: any = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      render: (_, { product, productUnit }) => <span>
        {product.name} - {productUnit.unitName}
      </span>,
    },
    {
      title: 'Số lượng',
      dataIndex: 'discountQuantity',
      key: 'discountQuantity',
      render: (discountQuantity) => (
        <CustomInput onChange={(value) => {
          // change quantity
          const listBatchClone = cloneDeep(listProduct);
          const batchIndex = listBatchClone.findIndex((batch) => batch.isSelected);
          listBatchClone[batchIndex].discountQuantity = +value;
          setListProduct(listBatchClone);
        }}
          value={discountQuantity}
        />
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatMoney(price),
    },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Chọn hàng giảm giá"
      width={730}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <h4 className='text-base mb-3'>Tổng số lượng: <span className='text-red-main'>{listProduct[0]?.maxQuantity}</span></h4>
      <CustomTable
        dataSource={listProduct.map((batch: any) => ({
          ...batch,
          key: batch.id,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: [
            ...listProduct
              .filter((batch) => batch.isSelected)
              .map((batch: any) => batch.id),
          ],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listProduct);

            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.id)) {
                return {
                  ...batch,
                  quantity: batch.quantity || 1,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false, quantity: 0 };
            });

            setListProduct(listBatchClone);
          },
        }}
      />


      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={onCancel}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            const selectedProducts = listProduct.filter(
              (product) => product.isSelected
            );

            onSave(selectedProducts);
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  )
}

export default SelectProductDiscount