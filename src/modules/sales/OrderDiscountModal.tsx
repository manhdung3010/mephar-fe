import type { ColumnsType } from 'antd/es/table';

import { CustomButton } from '@/components/CustomButton';
import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';

import type { IBatch } from './interface';
import { useQuery } from '@tanstack/react-query';
import { getOrderDiscountList } from '@/api/discount.service';
import { EDiscountBillMethodLabel, EDiscountGoodsMethodLabel } from '../settings/discount/add-discount/Info';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';

export function OrderDiscountModal({
  isOpen,
  onCancel,
  onSave,
  data
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
  data: any
}) {
  const [listDiscount, setListDiscount] = useState<any[]>([]);

  const { data: discountList, isLoading } = useQuery(['ORDER_LIST', isOpen], () =>
    getOrderDiscountList(data),
    {
      enabled: !!isOpen && !!data,
    }
  );

  useEffect(() => {
    if (discountList?.data?.data?.items) {
      const listBatchClone = cloneDeep(discountList?.data?.data?.items);
      setListDiscount(listBatchClone);
    }
  }, [discountList?.data?.data?.items]);

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
                  " " + formatNumber(items[0]?.apply?.discountValue)
                }
                <span>
                  {(items[0]?.apply?.discountType === "amount" ? "đ" : "%")}
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
                    " " + formatNumber(items[0]?.apply?.pointValue)
                  }
                </span>
                {
                  (items[0]?.apply?.pointType === "amount" ? "" : "%") + " điểm"
                }
              </div>
            )
          }
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
        dataSource={listDiscount?.map((item: any) => ({
          ...item,
          key: item.id,
        }))}
        columns={columns}
        scroll={{ x: 600 }}
        loading={isLoading}
        rowSelection={{
          type: 'checkbox',
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
