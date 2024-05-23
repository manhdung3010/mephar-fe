import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, set } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';
import { orderActiveState, orderState } from '@/recoil/state';

import type { IBatch, ISaleProductLocal } from './interface';

export function ListBatchModal({
  isOpen,
  onCancel,
  productKeyAddBatch,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  productKeyAddBatch?: string;
  onSave: (value) => void;
}) {
  const orderActive = useRecoilValue(orderActiveState);
  const orderObject = useRecoilValue(orderState);

  const [batchErr, setBatchErr] = useState<any[]>([]);

  const [listBatch, setListBatch] = useState<IBatch[]>([]);

  const isSaleReturn = orderActive.split("-")[1] === "RETURN";

  useEffect(() => {
    orderObject[orderActive]?.forEach((product: any) => {
      if (product.productKey === productKeyAddBatch) {
        setListBatch(
          product.batches?.map((batch) => ({
            ...batch,
            batchId: batch.id,
            productKey: product.productKey,
            productId: product.productId,
            newInventory: Math.floor(batch.originalInventory / product.productUnit.exchangeValue),
          }))
        );
      }
    });
  }, [productKeyAddBatch]);

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
                  setBatchErr(batchErr.filter((item) => item[batchId] !== true));
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
          {
            isSaleReturn && (
              <span>/ {formatNumber(saleQuantity)}</span>
            )
          }
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

      if (isSaleReturn && batch.isSelected && batch.quantity > (batch.saleQuantity ?? 0)) {
        message.error('Số lượng sản phẩm chọn phải nhỏ hơn hoặc bằng số lượng bán');
        return false
      }

      if (batch.isSelected && batch.quantity > batch.inventory) {
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
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

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
  );
}
