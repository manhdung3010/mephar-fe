import { CustomButton } from '@/components/CustomButton'
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable';
import { formatMoney } from '@/helpers';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react'
import { render } from 'react-dom';

function SelectProductDiscount({ isOpen, onCancel, products }) {
  const [listProduct, setListProduct] = useState<any[]>([]);

  useEffect(() => {
    if (products) {
      const listBatchClone = cloneDeep(products);
      setListProduct(listBatchClone);
    }
  }, [products])

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
      dataIndex: 'quantity',
      key: 'quantity',
      render: (price) => (
        <CustomInput onChange={() => { }} />
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price) => formatMoney(price),
    },
  ];

  console.log("products", products)
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