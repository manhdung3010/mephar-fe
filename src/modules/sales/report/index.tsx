import { getOrder } from '@/api/order.service';
import { CustomModal } from '@/components/CustomModal'
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { EOrderStatus, EOrderStatusLabel } from '@/enums';
import { formatMoney } from '@/helpers';
import { IOrder } from '@/modules/transactions/order/type';
import { branchState, profileState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';
import cx from "classnames";
import React, { useState } from 'react'
import { useRecoilValue } from 'recoil';
import { CustomButton } from '@/components/CustomButton';
import classNames from 'classnames';
import { SaleReport } from './sales-report/SaleReport';
import { ProductReport } from './product-report';
// import Search from './Search';

function ReportModal({
  isOpen,
  onCancel,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave?: (value) => void;
}) {
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: '',
    dateRange: { startDate: undefined, endDate: undefined },
    status: undefined,
    branchId,
  });

  const [select, setSelect] = useState(0);

  const menu = ['Báo cáo bán hàng', 'Báo cáo sản phẩm', 'Báo cáo khách hàng', 'Báo cáo nhân viên', "Báo cáo nhà cung cấp"];

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Nhân viên",
      dataIndex: "customer",
      key: "customer",
      render: (data, record) => record?.creator?.fullName,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (data) => data?.fullName,
    },
    {
      title: "Tổng cộng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, record) => {
        let total = 0;
        record.products?.forEach((item) => {
          total += item.price;
        });
        return formatMoney(total);
      },
    },
    {
      title: "Tác vụ",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <CustomButton outline>Chọn</CustomButton>
      ),
    },
  ];
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Báo cáo"
      width={1114}
      onSubmit={onCancel}
      customFooter={true}
      forceRender={true}
    >
      {/* <Search formFilter={formFilter} setFormFilter={setFormFilter} /> */}
      <div
        className="flex flex-col gap-5 bg-white  pt-4 pb-5"
        style={{ boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)' }}
      >
        <div className="flex flex-col">
          <div className="flex gap-3">
            {menu.map((item, index) => (
              <div
                key={index}
                className={classNames(
                  'cursor-pointer px-5 py-[6px] rounded-t-lg',
                  index === select
                    ? 'bg-[#D64457] text-[white]'
                    : 'text-black-main'
                )}
                onClick={() => setSelect(index)}
              >
                {item}
              </div>
            ))}
          </div>
          <div className="h-[1px] w-full bg-[#D64457]" />
        </div>
        {select === 0 && <SaleReport isOpen={isOpen} />}
        {select === 1 && <ProductReport isOpen={isOpen} />}
      </div>
    </CustomModal>
  )
}

export default ReportModal