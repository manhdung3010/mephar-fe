import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import Header from "./Header";

import { getImportProduct } from "@/api/import-product.service";
import ExportIcon from "@/assets/exportIcon.svg";
import ImportIcon from "@/assets/importIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { EImportProductStatus, EImportProductStatusLabel } from "@/enums";
import { formatDateTime, formatMoney, hasPermission } from "@/helpers";
import { branchState, profileState } from "@/recoil/state";
import type { IRecord } from "./interface";
import ProductDetail from "./row-detail";
import Search from "./Search";
import useExportToExcel from "@/hooks/useExportExcel";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

export function ImportProduct() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    dateRange: { startDate: undefined, endDate: undefined },
    userId: undefined,
    supplierId: undefined,
    status: undefined,
  });

  const { data: importProducts, isLoading } = useQuery(
    ["LIST_IMPORT_PRODUCT", JSON.stringify(formFilter), branchId],
    () => getImportProduct({ ...formFilter, branchId }),
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const handleCheckboxChange = (selectedRowKeys, selectedRows) => {
    if (selectedRows.length === 0) {
      setIsHeaderVisible(false);
    } else {
      setIsHeaderVisible(true);
    }
  };

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã nhập hàng",
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
      render: (value) => formatDateTime(value),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (data) => data?.name,
    },
    {
      title: "Cần trả nhà cung cấp",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value, record) => formatMoney(+value - record?.discount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EImportProductStatus.SUCCEED
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {EImportProductStatusLabel[status]}
        </div>
      ),
    },
  ];

  const columnMapping = {
    code: "Mã hàng",
    totalPrice: "Tổng giá",
    discount: "Giảm giá",
    status: "Trạng thái",
    "user.fullName": "Người dùng",
    "store.name": "Tên cửa hàng",
    "store.phone": "Số điện thoại cửa hàng",
    "store.address": "Địa chỉ cửa hàng",
    "branch.name": "Tên chi nhánh",
    "branch.phone": "Số điện thoại chi nhánh",
    "branch.code": "Mã chi nhánh",
    "supplier.name": "Tên nhà cung cấp",
    "supplier.phone": "Số điện thoại nhà cung cấp",
    "supplier.email": "Email nhà cung cấp",
    "supplier.code": "Mã nhà cung cấp",
  };

  const { exported, exportToExcel } = useExportToExcel(
    importProducts?.data.items,
    columnMapping,
    `DANHSACHNHAPSANPHAM_${Date.now()}.xlsx`,
  );

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        {isHeaderVisible && <Header />}

        {hasPermission(profile?.role?.permissions, RoleModel.import_product, RoleAction.create) && (
          <CustomButton
            onClick={() => router.push("/products/import/coupon")}
            type="success"
            prefixIcon={<Image src={ImportIcon} />}
          >
            Nhập hàng
          </CustomButton>
        )}
      </div>

      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={importProducts?.data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        loading={isLoading}
        columns={columns}
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
          expandedRowRender: (record: IRecord) => <ProductDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={importProducts?.data?.totalItem}
      />
    </div>
  );
}
