import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal'
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';
import { IBatch } from '@/modules/sales/interface';
import { message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react'

function ListBatchModal({ isOpen, onCancel, selectedProduct, productUnit, onSave, listBatchSelected }) {
  const [listBatch, setListBatch] = useState<any[]>([]);

  useEffect(() => {
    if (selectedProduct?.batches && productUnit && listBatchSelected) {
      const curUnit = selectedProduct.product?.productUnit?.find((unit) => unit.id === productUnit);
      const newBatch = selectedProduct.batches.map((batch) => ({
        ...batch,
        originalQuantity: batch.quantity,
      }));

      const newListBatch = newBatch.map((batch) => {
        const isBatchSelected = listBatchSelected?.find((item) => item.id === batch.id) ? true : false
        return {
          ...batch,
          batchId: batch.id,
          productKey: selectedProduct.productKey,
          productId: selectedProduct.productId,
          newInventory: Math.floor(batch.originalQuantity / curUnit?.exchangeValue),
          quantity: isBatchSelected ? listBatchSelected?.find((item) => item.id === batch.id)?.quantity : 0,
          isSelected: isBatchSelected,
        }
      });
      setListBatch(newListBatch)
    }
  }, [selectedProduct, productUnit, listBatchSelected]);

  const columns: ColumnsType<IBatch> = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      // render: (_, { batch }) => batch.name,
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, { batchId, saleQuantity }) => (
        <div className='flex items-center gap-2'>
          <CustomInput
            bordered={false}
            onChange={(value) => {
              let batchesClone = cloneDeep(listBatch);
              batchesClone = batchesClone.map((batch: any) => {
                if (batch.batchId === batchId) {
                  // if (value > batch.saleQuantity) {
                  //   message.error('Số lượng sản phẩm chọn phải nhỏ hơn hoặc bằng số lượng bán');
                  //   // set error with key and value to batchErr, filter duplicate key
                  //   setBatchErr([...batchErr, { [batchId]: true }]);

                  //   return { ...batch, quantity: saleQuantity };
                  // }
                  // set error with key and value to batchErr, filter duplicate key
                  // setBatchErr(batchErr.filter((item) => item[batchId] !== true));
                  return { ...batch, quantity: value };
                }

                return batch;
              });

              setListBatch(batchesClone);
            }}
            value={listBatch.find((batch) => batch.batchId === batchId)?.quantity || 0}
            wrapClassName="w-[100px]"
            type="number"
            defaultValue={quantity}
          />
        </div>
      ),
    },
    {
      title: 'Số lượng tồn',
      dataIndex: 'newInventory',
      key: 'newInventory',
      render: (value) => formatNumber(Math.floor(value || 0)),
    },
  ];

  const checkBatchQuantity = () => {
    // eslint-disable-next-line no-restricted-syntax
    for (const batch of listBatch) {
      if (batch.isSelected && batch.quantity === 0) {
        message.error('Số lượng sản phẩm chọn phải lớn hơn hoặc bằng 1');
        return false;
      }

      if (batch.isSelected && batch.quantity > batch.newInventory) {
        message.error(
          'Số lượng sản phẩm chọn phải nhỏ hơn hoặc bằng số lượng tồn'
        );
        return false;
      }
    }
    return true;
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Lô sản phẩm"
      width={650}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <CustomTable
        dataSource={listBatch.map((batch: any) => ({
          ...batch,
          key: batch.batchId || batch.id,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: [
            ...listBatch
              .filter((batch) => batch.isSelected)
              .map((batch: any) => batch.batchId || batch.id),
          ],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listBatch);

            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.batchId || batch.id)) {
                return {
                  ...batch,
                  quantity: batch.quantity || 1,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false, quantity: 0 };
            });

            setListBatch(listBatchClone);
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
            if (checkBatchQuantity()) {
              onSave(listBatch);
              onCancel();
            }
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        // type={isSaleReturn && batchErr.length > 0 ? 'disable' : 'danger'}
        // disabled={isSaleReturn && batchErr.length > 0 ? true : false}
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  )
}

export default ListBatchModal