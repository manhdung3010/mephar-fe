import { useQuery } from '@tanstack/react-query';
import { cloneDeep, debounce } from 'lodash';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { getBatch } from '@/api/batch.service';
import DeleteIcon from '@/assets/deleteRed.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomModal } from '@/components/CustomModal';
import { CustomSelect } from '@/components/CustomSelect';
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';
import { branchState, productImportState } from '@/recoil/state';

import type { IBatch } from '../interface';
import { AddBatchModal } from './AddBatchModal';

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
  const importProducts = useRecoilValue(productImportState);
  const branchId = useRecoilValue(branchState);

  const [openAddBatchModal, setOpenAddBatchModal] = useState(false);
  const [listBatchSelected, setListBatchSelected] = useState<IBatch[]>([]);

  useEffect(() => {
    if (productKeyAddBatch) {
      const product = importProducts?.find(
        (product) => product.productKey === productKeyAddBatch
      );

      if (product?.batches) {
        const newBatches = product.batches.map((batch) => ({
          ...batch,
          inventory: batch.quantity,
        }));
        setListBatchSelected(newBatches);
      }
    }
  }, [productKeyAddBatch]);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99,
    keyword: '',
  });

  const { productId, exchangeValue } = useMemo(() => {
    const result = productKeyAddBatch?.split('-') ?? [];

    const exchangeValue =
      importProducts?.find(
        (product) => product.productKey === productKeyAddBatch
      )?.exchangeValue ?? 1;

    return {
      productId: Number(result[0]),
      unitId: Number(result[1]),
      exchangeValue,
    };
  }, [productKeyAddBatch]);

  const { data: batches, isLoading } = useQuery(
    ['LIST_BATCH', formFilter.page, formFilter.limit, formFilter.keyword],
    () =>
      getBatch({
        ...formFilter,
        productId,
        branchId,
      }),
    { enabled: isOpen }
  );

  const columns = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
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
      render: (quantity, { id }) => (
        <CustomInput
          bordered={false}
          onChange={(value) => {
            let batchesClone = cloneDeep(listBatchSelected);
            batchesClone = batchesClone.map((batch) => {
              if (batch.id === id) {
                return { ...batch, quantity: value };
              }

              return batch;
            });

            setListBatchSelected(batchesClone);
          }}
          wrapClassName="w-[100px]"
          type="number"
          defaultValue={quantity}
        />
      ),
    },
    {
      title: 'Tồn',
      dataIndex: 'originalInventory',
      key: 'originalInventory',
      render: (value) => formatNumber(value),
    },
    {
      title: '',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <div
          className=" cursor-pointer"
          onClick={() => {
            const records = listBatchSelected.filter(
              (batch) => batch.id !== id
            );
            setListBatchSelected(records);
          }}
        >
          <Image src={DeleteIcon} alt="" />
        </div>
      ),
    },
  ];

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Lô sản phẩm"
      width={650}
      onSubmit={onCancel}
      isLoading={isLoading}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-4">
        <Label label="Lô sản phẩm" hasInfoIcon={false} />
        <CustomSelect
          onChange={(value) => {
            const record = JSON.parse(value);

            if (!listBatchSelected?.find((batch) => batch.id === record.id)) {
              const quantity = importProducts?.find(
                (product) => product.productKey === productKeyAddBatch
              )?.quantity;

              if (listBatchSelected.length === 0) {
                setListBatchSelected((preValue) => [
                  ...preValue,
                  {
                    ...record,
                    originalInventory: record.quantity,
                    inventory: record.inventory / exchangeValue,
                    quantity,
                  },
                ]);
                return;
              }

              setListBatchSelected((preValue) => [
                ...preValue,
                {
                  ...record,
                  originalInventory: record.quantity,
                  inventory: record.inventory / exchangeValue,
                  quantity: 1,
                },
              ]);
            }
          }}
          options={batches?.data?.items?.map((item) => ({
            value: JSON.stringify(item),
            label: item.name,
          }))}
          showSearch={true}
          onSearch={debounce((value) => {
            setFormFilter((pre) => ({ ...pre, keyword: value }));
          }, 300)}
          className="h-11 !rounded"
          placeholder="Chọn lô"
          value={null}
        />
      </div>
      <CustomTable
        dataSource={listBatchSelected?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
      />

      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={() => setOpenAddBatchModal(true)}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Thêm lô mới
        </CustomButton>
        <CustomButton
          onClick={() => {
            onSave(listBatchSelected);
            onCancel();
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>

      <AddBatchModal
        isOpen={openAddBatchModal}
        onCancel={() => setOpenAddBatchModal(false)}
        productId={Number(productKeyAddBatch?.split('-')[0])}
        setListBatchSelected={setListBatchSelected}
      />
    </CustomModal>
  );
}
