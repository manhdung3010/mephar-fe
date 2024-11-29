import { useQuery } from "@tanstack/react-query";
import { cloneDeep } from "lodash";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";

import { getBatch } from "@/api/batch.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { formatNumber } from "@/helpers";
import { branchState, productReturnState } from "@/recoil/state";

import type { IBatch } from "../interface";
import { message } from "antd";
import { log } from "util";

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
  const returnProducts = useRecoilValue(productReturnState);
  const branchId = useRecoilValue(branchState);

  const [openAddBatchModal, setOpenAddBatchModal] = useState(false);
  const [listBatchSelected, setListBatchSelected] = useState<IBatch[]>([]);

  useEffect(() => {
    if (productKeyAddBatch) {
      const product = returnProducts?.find((product) => product.productKey === productKeyAddBatch);

      if (product?.batches) {
        setListBatchSelected(product.batches);
      }
    }
  }, [productKeyAddBatch]);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99,
    keyword: "",
  });

  const { productId, exchangeValue } = useMemo(() => {
    const result = productKeyAddBatch?.split("-") ?? [];

    const exchangeValue =
      returnProducts?.find((product) => product.productKey === productKeyAddBatch)?.exchangeValue ?? 1;

    return {
      productId: Number(result[0]),
      unitId: Number(result[1]),
      exchangeValue,
    };
  }, [productKeyAddBatch]);

  let { data: batches, isLoading } = useQuery(
    ["LIST_BATCH", formFilter.page, formFilter.limit, formFilter.keyword],
    () =>
      getBatch({
        ...formFilter,
        productId,
        branchId,
      }),
    { enabled: isOpen },
  );

  useEffect(() => {
    if (batches?.data?.items) {
      const records = batches?.data?.items.map((item) => ({
        ...item,
        inventory: item.quantity,
      }));

      batches.data.items = records;
    }
  }, [batches?.data?.items]);

  const columns = [
    {
      title: "STT",
      dataIndex: "no",
      key: "no",
      render: (value) => formatNumber(value),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (name, { batch }) => name || batch?.name,
    },
    {
      title: "Hạn sử dụng",
      dataIndex: "expiryDate",
      key: "expiryDate",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, { id, originalInventory }) => {
        console.log(quantity);

        return (
          <div className="flex items-center gap-2">
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
              value={quantity}
            />
            <span>/ {formatNumber(originalInventory)}</span>
          </div>
        );
      },
    },
    {
      title: "Tồn",
      dataIndex: "inventory",
      key: "inventory",
      render: (value) => formatNumber(value),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div
          className=" cursor-pointer"
          onClick={() => {
            const records = listBatchSelected.filter((batch) => batch.id !== id);
            setListBatchSelected(records);
          }}
        >
          <Image src={DeleteIcon} alt="" />
        </div>
      ),
    },
  ];

  const checkBatchQuantity = () => {
    // eslint-disable-next-line no-restricted-syntax
    console.log("listBatchSelected", listBatchSelected);
    for (const batch of listBatchSelected) {
      if (batch.isSelected && batch.quantity === 0) {
        message.error("Số lượng sản phẩm chọn phải lớn hơn hoặc bằng 1");
        return false;
      }

      if (batch.isSelected && batch.quantity > (batch.originalInventory ?? 0)) {
        message.error("Số lượng sản phẩm chọn phải nhỏ hơn hoặc bằng số lượng đã nhập");
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
      isLoading={isLoading}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      {/* <div className="mb-4">
        <Label label="Lô sản phẩm" hasInfoIcon={false} />
        <CustomSelect
          onChange={(value) => {
            const record = JSON.parse(value);

            if (!listBatchSelected?.find((batch) => batch.id === record.id)) {
              const quantity = returnProducts?.find(
                (product) => product.productKey === productKeyAddBatch
              )?.quantity;

              if (listBatchSelected.length === 0) {
                setListBatchSelected((preValue) => [
                  ...preValue,
                  {
                    ...record,
                    originalInventory: record.inventory,
                    inventory: record?.quantity,
                    quantity,
                  },
                ]);
                return;
              }

              setListBatchSelected((preValue) => [
                ...preValue,
                {
                  ...record,
                  originalInventory: record.inventory,
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
        />
      </div> */}
      <CustomTable
        dataSource={listBatchSelected?.map((item, index) => ({
          ...item,
          key: item.batchId || item.id,
          no: index + 1,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          selectedRowKeys: [
            ...listBatchSelected.filter((batch) => batch.isSelected).map((batch: any) => batch.batchId || batch.id),
          ],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listBatchSelected);

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

            setListBatchSelected(listBatchClone);
          },
        }}
      />

      <div className="mt-5 flex justify-end gap-x-4">
        {/* <CustomButton
          onClick={() => setOpenAddBatchModal(true)}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Thêm lô mới
        </CustomButton> */}
        <CustomButton
          onClick={() => {
            if (checkBatchQuantity()) {
              onSave(listBatchSelected);
              onCancel();
            }
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Lưu
        </CustomButton>
      </div>
    </CustomModal>
  );
}
