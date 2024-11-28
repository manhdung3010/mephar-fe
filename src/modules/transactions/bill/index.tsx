import PlusIconWhite from "@/assets/PlusIconWhite.svg";
import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { getOrder } from "@/api/order.service";
import ExportIcon from "@/assets/exportIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { EOrderStatus, EOrderStatusLabel, saleReturn } from "@/enums";
import { formatMoney, hasPermission } from "@/helpers";
import { branchState, profileState } from "@/recoil/state";

import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { IOrder } from "../order/type";
import Search from "./Search";
import BillDetail from "./row-detail";
import useExportToExcel from "@/hooks/useExportExcel";
import { Dropdown, MenuProps } from "antd";

export function BillTransaction() {
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    dateRange: { startDate: undefined, endDate: undefined },
    status: undefined,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(["ORDER_LIST", JSON.stringify(formFilter), branchId], () =>
    getOrder({ ...formFilter, branchId }),
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const columns: ColumnsType<IOrder> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
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
      title: "Mã trả hàng",
      dataIndex: "saleReturn",
      key: "saleReturn",
      render: (value) => (value ? value[0]?.code : ""),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (data) => data?.fullName,
    },
    {
      title: "Tổng tiền hàng",
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
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (_, record) => {
        let total = 0;
        record.products?.forEach((item) => {
          total += item.price;
        });
        return formatMoney(total - record.totalPrice);
      },
    },
    {
      title: "Tổng tiền sau giảm giá",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatMoney(value),
    },
    {
      title: "Khách đã trả",
      dataIndex: "cashOfCustomer",
      key: "cashOfCustomer",
      render: (value) => formatMoney(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EOrderStatus.SUCCEED
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {EOrderStatusLabel[status]}
        </div>
      ),
    },
  ];

  const columnMapping = {
    code: "Mã hoá đơn",
    createdAt: "Thời gian",
    saleReturn: "Mã trả hàng",
    customer: "Khách hàng",
    totalPrice: "Tổng tiền hàng",
    discount: "Giảm giá",
    finalTotalPrice: "Tổng tiền sau giảm giá",
    cashOfCustomer: "Khách đã trả",
    status: "Trạng thái",
  };

  const transformedOrders = orders?.data?.items.map((item) => ({
    code: item.code,
    createdAt: item.createdAt,
    saleReturn: item.saleReturn[0]?.code || "",
    customer: item.customer.fullName,
    totalPrice: item.products.reduce((total, product) => total + product.price, 0),
    discount: item.discountType === 1 ? `${item.discount}%` : item.discount,
    finalTotalPrice: item.totalPrice,
    cashOfCustomer: item.cashOfCustomer,
    status: EOrderStatusLabel[item.status],
  }));

  const { exported, exportToExcel } = useExportToExcel(transformedOrders, columnMapping, `HOADON_${Date.now()}.xlsx`);

  const transformedOrdersDetail = orders?.data?.items.map((item) => ({
    branch: item.branch.name,
    branchId: item.branchId,
    canReturn: item.canReturn,
    cashOfCustomer: item.cashOfCustomer,
    code: item.code,
    createdAt: item.createdAt,
    createdBy: item.createdBy,
    creator: item.creator.fullName,
    customer: item.customer.fullName,
    customerId: item.customerId,
    customerOwes: item.customerOwes,
    description: item.description,
    discount: item.discount,
    discountByPoint: item.discountByPoint,
    discountOrder: item.discountOrder,
    discountType: item.discountType,
    id: item.id,
    isVatInvoice: item.isVatInvoice,
    paymentPoint: item.paymentPoint,
    paymentType: item.paymentType,
    point: item.point,
    prescription: item.prescription,
    products: item.products.map((product) => product.price).join(", "),
    refund: item.refund,
    saleReturn: item.saleReturn.map((returnItem) => returnItem.code).join(", "),
    status: EOrderStatusLabel[item.status],
    storeId: item.storeId,
    totalPrice: item.totalPrice,
    totalProducts: item.totalProducts,
    totalQuantities: item.totalQuantities,
    user: item.user.fullName,
    userId: item.userId,
  }));

  const columnMappingDetail = {
    branch: "Chi nhánh",
    branchId: "ID Chi nhánh",
    canReturn: "Có thể trả",
    cashOfCustomer: "Khách đã trả",
    code: "Mã hoá đơn",
    createdAt: "Thời gian",
    createdBy: "Tạo bởi ID",
    creator: "Người tạo",
    customer: "Khách hàng",
    customerId: "ID Khách hàng",
    customerOwes: "Khách nợ",
    description: "Mô tả",
    discount: "Giảm giá",
    discountByPoint: "Giảm giá bằng điểm",
    discountOrder: "Giảm giá đơn hàng",
    discountType: "Loại giảm giá",
    id: "ID",
    isVatInvoice: "Hoá đơn VAT",
    paymentPoint: "Điểm thanh toán",
    paymentType: "Loại thanh toán",
    point: "Điểm",
    prescription: "Đơn thuốc",
    products: "Sản phẩm",
    refund: "Hoàn tiền",
    saleReturn: "Mã trả hàng",
    status: "Trạng thái",
    storeId: "ID Cửa hàng",
    totalPrice: "Tổng tiền hàng",
    totalProducts: "Tổng sản phẩm",
    totalQuantities: "Tổng số lượng",
    user: "Người dùng",
    userId: "ID Người dùng",
  };

  const { exported: exportedDetail, exportToExcel: exportToExcelDetail } = useExportToExcel(
    transformedOrdersDetail,
    columnMappingDetail,
    `HOADONCHITIET_${Date.now()}.xlsx`,
  );

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <CustomButton onClick={exportToExcel} prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      ),
    },
    {
      key: "1",
      label: (
        <CustomButton onClick={exportToExcelDetail} prefixIcon={<Image src={ExportIcon} />}>
          Xuất file chi tiết
        </CustomButton>
      ),
    },
  ];

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.sale, RoleAction.read) && (
          <CustomButton
            onClick={() => router.push("/sales/")}
            type="success"
            prefixIcon={<Image src={PlusIconWhite} />}
          >
            Thêm hóa đơn
          </CustomButton>
        )}
      </div>

      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={orders?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key - 1]) {
                const { [record.key - 1]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({
                  [record.key - 1]: true,
                });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IOrder) => <BillDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={orders?.data?.totalItem}
      />
    </div>
  );
}
