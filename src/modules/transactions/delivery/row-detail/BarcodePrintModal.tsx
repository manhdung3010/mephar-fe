import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, set } from 'lodash';
import { useEffect, useState } from 'react';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { formatNumber } from '@/helpers';
import JsBarcode from 'jsbarcode';


export function BarcodePrintModal({
  isOpen,
  onCancel,
  products
}: {
  isOpen: boolean;
  onCancel: () => void;
  products: any[];
}) {
  const [batchErr, setBatchErr] = useState<any[]>([]);
  const [productList, setProductList] = useState<any[]>([]);

  const columns: ColumnsType<any> = [
    {
      title: 'Mã hàng',
      dataIndex: 'code',
      key: 'code',
      render: (code, record) => record?.product?.code,
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
      render: (name, record) => record?.product?.name,
    },
    {
      title: 'Số lượng in',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity, { batchId, saleQuantity }) => (
        <div className='flex items-center gap-2'>
          <CustomInput
            bordered={false}
            onChange={(value) => {

            }}
            // value={listBatch.find((batch) => batch.batchId === batchId)?.quantity || 0}
            wrapClassName="w-[100px]"
            type="number"
            defaultValue={quantity}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const listProduct = products.map((p) => ({
      ...p,
      isSelected: true,
    }));
    setProductList(listProduct);
  }, [products]);

  const handlePrint = () => {
    const printWindow: any = window.open('', '_blank');
    const listProductSelected = productList.filter((p) => p.isSelected && p.quantity > 0 && p.product.barCode);

    const container = document.createElement('div');
    container.style.display = 'grid'; // Use CSS grid
    container.style.gridTemplateColumns = 'repeat(4, 1fr)'; // 4 columns of equal width
    container.style.gap = '10px'; // Add some space between the barcodes
    printWindow.document.body.appendChild(container);

    const elements = listProductSelected.flatMap((p) => {
      return Array.from({ length: p.quantity }, () => {
        const div = document.createElement('div');
        const img = document.createElement('img');
        JsBarcode(img, p.product.barCode, {
          width: 1.2,
          height: 50,
        });
        div.appendChild(img);

        return div;
      });
    });

    elements.forEach((div) => container.appendChild(div));

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="In mã vạch"
      width={650}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <CustomTable
        dataSource={productList?.map((item) => {
          return {
            ...item,
            key: item.id,
          };
        })}
        columns={columns}
        scroll={{ x: 600 }}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys: [
            ...productList
              .filter((p) => p.isSelected)
              .map((p: any) => p.id),
          ],
          onChange(selectedRowKeys) {
            let listBatchClone = cloneDeep(productList);

            listBatchClone = listBatchClone.map((p: any) => {
              if (selectedRowKeys.includes(p.id)) {
                return {
                  ...p,
                  quantity: p.quantity || 1,
                  isSelected: true,
                };
              }

              return { ...p, isSelected: false, quantity: 0 };
            });
            setProductList(listBatchClone);
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
            handlePrint();
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
