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
import { formatMoney } from "@/helpers";
import { branchState } from "@/recoil/state";
import DocumentDownload from "@/assets/documentDownload.svg";
import DocumentUpload from "@/assets/documentUpload.svg";

import type { IRecord } from "./interface";
import ProductDetail from "./row-detail";
import Search from "./Search";
import { Button } from "antd";

export function ImportProduct() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    dateRange: { startDate: undefined, endDate: undefined },
    userId: undefined,
  });

  const { data: importProducts, isLoading } = useQuery(
    ["LIST_IMPORT_PRODUCT", JSON.stringify(formFilter), branchId],
    () => getImportProduct({ ...formFilter, branchId })
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

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
      render: (value) => formatMoney(value),
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
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EImportProductStatusLabel[status]}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <Header />

        <CustomButton
          onClick={() => router.push("/products/import/coupon")}
          type="success"
          prefixIcon={<Image src={ImportIcon} />}
        >
          Nhập hàng
        </CustomButton>

        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>

      <Search setFormFilter={setFormFilter} />

      <CustomTable
        rowSelection={{
          type: "checkbox",
        }}
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
                const { [record.key - 1]: value, ...remainingKeys } =
                  expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({
                  ...expandedRowKeys,
                  [record.key - 1]: true,
                });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => (
            <ProductDetail record={record} />
          ),
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
