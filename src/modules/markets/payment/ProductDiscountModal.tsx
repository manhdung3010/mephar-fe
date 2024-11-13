import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import CustomTable from "@/components/CustomTable";
import { checkEndPrice, formatMoney, formatNumber } from "@/helpers";
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from "@/modules/settings/discount/add-discount/Info";
import { branchState, marketOrderDiscountState, paymentProductState } from "@/recoil/state";
import type { ColumnsType } from "antd/es/table";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

export function ProductDiscountModal({
  isOpen,
  onCancel,
  onSave,
  discountList,
  productUnitId,
  storeId,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value, storeId, productUnitId) => void;
  discountList?: any;
  productUnitId: number;
  storeId?: any;
}) {
  const [paymentProduct, setPaymentProduct] = useRecoilState<any>(paymentProductState);
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  useEffect(() => {
    if (discountList) {
      const listBatchClone = cloneDeep(discountList);
      listBatchClone.forEach((batch) => {
        // const marketOrderDiscount = selectedDiscount?.find((item) => item.code === batch.code);
        // if (marketOrderDiscount?.code === batch.code) {
        //   batch.isSelected = true;
        // } else {
        // }
        batch.isSelected = false;
      });
      setListDiscount(listBatchClone);
    }
  }, [discountList?.data?.data?.items, isOpen]);
  const columns: ColumnsType<any> = [
    {
      title: "Chương trình khuyến mại",
      dataIndex: "name",
      className: "w-[200px]",
      key: "name",
    },
    {
      title: "Hình thức khuyến mại",
      dataIndex: "type",
      key: "type",
      className: "w-[200px]",
      render: (type, { target }) => (
        <span>
          {target === "order"
            ? EDiscountBillMethodLabel[type.toUpperCase()]
            : EDiscountGoodsMethodLabel[type.toUpperCase()]}
        </span>
      ),
    },
    {
      title: "Quà khuyến mại",
      dataIndex: "items",
      key: "items",
      render: (items, record) => (
        <div>
          Mua từ <span className="text-[#d64457]">{formatNumber(items[0]?.condition?.product?.from)}</span> sp,
          {items[0]?.apply?.changeType === "type_price" ? (
            <span>
              {" được KM mua với giá "}
              <span className="text-[#d64457]">{formatMoney(items[0]?.apply?.fixedPrice)}</span>/1sp
            </span>
          ) : (
            <span>
              {" được giảm "}
              <span className="text-[#d64457]">{formatMoney(items[0]?.apply?.fixedPrice)}</span>/1sp
            </span>
          )}
        </div>
      ),
    },
  ];
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Khuyến mại trên hóa đơn"
      width={980}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />
      <CustomTable
        dataSource={
          listDiscount &&
          listDiscount?.map((item: any) => ({
            ...item,
            key: item.id,
          }))
        }
        // loading={isLoading}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          type: "radio",
          selectedRowKeys: [...listDiscount.filter((batch) => batch.isSelected).map((batch: any) => batch.id)],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(listDiscount);
            listBatchClone = listBatchClone.map((batch: any) => {
              if (selectedRowKeys.includes(batch.id)) {
                return {
                  ...batch,
                  isSelected: true,
                };
              }

              return { ...batch, isSelected: false };
            });
            setListDiscount(listBatchClone);
          },
        }}
      />
      <div className="mt-5 flex justify-end gap-x-4">
        <CustomButton
          onClick={() => {
            onCancel();
          }}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            let selectedDiscount = listDiscount.find((batch) => batch.isSelected);

            onSave(selectedDiscount, storeId, productUnitId);

            onCancel();
          }}
          className="h-[46px] min-w-[150px] py-2 px-4"
          // type={isSaleReturn && batchErr.length > 0 ? 'disable' : 'danger'}
          // disabled={isSaleReturn && batchErr.length > 0 ? true : false}
        >
          Áp dụng
        </CustomButton>
      </div>
    </CustomModal>
  );
}
