import type { ColumnsType } from 'antd/es/table';

import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';

import { discountTypeState, orderDiscountSelected, productDiscountSelected } from '@/recoil/state';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from '../settings/discount/add-discount/Info';

export function ProductDiscountModal({
  isOpen,
  onCancel,
  onSave,
  discountList
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  discountList?: any
}) {
  const [listDiscount, setListDiscount] = useState<any[]>([]);
  const [orderDiscount, setOrderDiscount] = useRecoilState(orderDiscountSelected);
  const [productDiscount, setProductDiscount] = useRecoilState(productDiscountSelected);
  const [discountType, setDiscountType] = useRecoilState(discountTypeState);
  useEffect(() => {
    if (discountList) {
      const listBatchClone = cloneDeep(discountList);
      setListDiscount(listBatchClone);
    }
  }, [discountList]);

  const columns: ColumnsType<any> = [
    {
      title: 'Chương trình khuyến mại',
      dataIndex: 'name',
      key: 'name',
      // render: (_, { batch }) => batch.name,
    },
    {
      title: 'Hình thức khuyến mại',
      dataIndex: 'type',
      key: 'type',
      render: (type, { target }) => <span>
        {target === "order" ? EDiscountBillMethodLabel[type.toUpperCase()] : EDiscountGoodsMethodLabel[type.toUpperCase()]}
      </span>,
    },
    {
      title: 'Quà khuyến mại',
      dataIndex: 'items',
      key: 'items',
      render: (items, { type }) => (
        <div>
          {type === "order_price" && (
            <div>
              Giảm giá
              <span className='text-[#d64457]'>
                {
                  " " + formatNumber(items?.apply?.discountValue)
                }
                <span>
                  {(items?.apply?.discountType === "amount" ? "đ" : "%")}
                </span>
              </span>
            </div>
          )}
          {
            type === "loyalty" && (
              <div>
                Tặng
                <span className='text-[#d64457]'>
                  {
                    " " + formatNumber(items?.apply?.pointValue)
                  }
                </span>
                {
                  (items?.apply?.pointType === "amount" ? "" : "%") + " điểm"
                }
              </div>
            )
          }
        </div>
      ),
    },
  ];

  useEffect(() => {
    const selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
    setOrderDiscount(selectedDiscount);
    setDiscountType("product")
  }, [])

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Khuyến mại trên hàng hóa"
      width={980}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <CustomTable
        dataSource={discountList && discountList?.map((item: any) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        // loading={isLoading}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [
            ...listDiscount
              .filter((batch) => batch.isSelected)
              .map((batch: any) => batch.id),
          ],
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
          onClick={onCancel}
          outline={true}
          className="h-[46px] min-w-[150px] py-2 px-4"
        >
          Đóng
        </CustomButton>
        <CustomButton
          onClick={() => {
            const selectedDiscount = listDiscount.filter((batch) => batch.isSelected);
            // setProductDiscount([...productDiscount, ...selectedDiscount].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i));
            setProductDiscount(selectedDiscount);
            setDiscountType("product")
            onSave(selectedDiscount);
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
