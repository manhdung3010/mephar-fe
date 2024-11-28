import { useQuery } from "@tanstack/react-query";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";

import { getReturnProduct } from "@/api/return-product.service";
import ExportIcon from "@/assets/exportIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { branchState, profileState } from "@/recoil/state";

import type { IRecord } from "./interface";
import ProductDetail from "./row-detail";
import Search from "./Search";
import { formatDateTime, hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { getProductReturnExcel } from "@/api/export.service";

export function ReturnProduct() {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    dateRange: { startDate: undefined, endDate: undefined },
    userId: undefined,
  });

  const { data: returnProducts, isLoading } = useQuery(
    ["LIST_RETURN_PRODUCT", JSON.stringify(formFilter), branchId],
    () => getReturnProduct({ ...formFilter, branchId }),
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã trả hàng",
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
      render: (data) => formatDateTime(data),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDateTime(data),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (data) => data?.name,
    },
    {
      title: "Chi nhánh",
      dataIndex: "branch",
      key: "branch",
      render: (data) => data?.name,
    },
    {
      title: "Người trả",
      dataIndex: "user",
      key: "user",
      render: (data) => data?.fullName,
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      render: (data) => data?.fullName,
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
    },
  ];

  async function downloadExcel() {
    try {
      const response = await getProductReturnExcel({ branchId });

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "product_return_data.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  }

  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.return_product, RoleAction.create) && (
          <CustomButton
            onClick={() => router.push("/products/return/coupon")}
            type="success"
            prefixIcon={<Image src={PlusIcon} />}
          >
            Trả hàng nhập
          </CustomButton>
        )}
      </div>

      <Search setFormFilter={setFormFilter} formFilter={formFilter} />

      <CustomTable
        dataSource={returnProducts?.data?.items?.map((item, index) => ({
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
                setExpandedRowKeys({ [record.key - 1]: true });
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
        total={returnProducts?.data?.totalItem}
      />
    </div>
  );
}
