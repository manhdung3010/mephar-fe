import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import ExportIcon from "@/assets/exportIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EProductSettingStatus, EProductSettingStatusLabel } from "@/enums";
import RowDetail from "./row-detail";
import Search from "./Search";
import { useQuery } from "@tanstack/react-query";
import { getConfigProduct } from "@/api/market.service";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { formatDateTime, formatNumber, hasPermission, sliceString } from "@/helpers";
import CustomPagination from "@/components/CustomPagination";
import { debounce } from "lodash";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
interface IRecord {
  key: number;
  name: string;
  groupProduct: string;
  marketType: string;
  inventoryQuantity: number;
  soldQuantity: number;
  status: EProductSettingStatus;
  createdAt: string;
  updatedAt: string;
}

const marketType = {
  common: 'Chợ chung',
  private: 'Chợ riêng',
}

export function MarketSetting() {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    type: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    isConfig: true,
  });

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter)],
    () => getConfigProduct({ ...formFilter }),
  );
  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
      render: (value, record, index) => (
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
          {sliceString(record.product?.name, 60)}
        </span>
      ),
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "groupProduct",
      key: "groupProduct",
      render: (_, record) => record?.product?.groupProduct?.name,
    },
    {
      title: "Loại chợ",
      dataIndex: "marketType",
      key: "marketType",
      render: (_, record) => marketType[record.marketType],
    },
    {
      title: "SL tồn",
      dataIndex: "quantity",
      key: "quantity",
      render: (value, record) => formatNumber(+value - +record?.quantitySold),
    },
    {
      title: "SL đã bán",
      dataIndex: "quantitySold",
      key: "quantitySold",
      render: (value) => formatNumber(value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => (
        <div
          className={cx(
            value === EProductSettingStatus.active
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EProductSettingStatusLabel[value]}
        </div>
      ),
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value, record) => (
        <div>
          <div>{formatDateTime(value)}</div>
          <div className="font-medium text-[#222325]">Nv: {record?.userCreated?.fullName}</div>
        </div>
      ),
    },
    {
      title: "Cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (value, record) => (
        <div>
          <div>{formatDateTime(value)}</div>
          <div className="font-medium text-[#222325]">Nv: {record?.userUpdated?.fullName}</div>
        </div>
      ),
    },
  ];
  return (
    <div>
      {
        hasPermission(profile?.role?.permissions, RoleModel.market_setting, RoleAction.create) && (
          <div className="my-3 flex justify-end gap-4">
            <CustomButton
              onClick={() => router.push('/markets/setting/add-setting')}
              type="success"
              prefixIcon={<Image src={PlusIcon} />}
            >
              Thêm mới
            </CustomButton>

            <CustomButton prefixIcon={<Image src={ExportIcon} />}>
              Xuất file
            </CustomButton>
          </div>
        )
      }


      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            'createdAt[start]': value?.timeStart,
            'createdAt[end]': value?.timeEnd,
            type: value?.type,
            status: value?.status,
          }));
        }, 300)}
      />

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={configProduct?.data?.items.map((item, index) => ({
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
                const { [record.key - 1]: value, ...remainingKeys } =
                  expandedRowKeys;
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
          expandedRowRender: (record: IRecord) => (
            <RowDetail record={record} />
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
        total={configProduct?.data?.totalItem}
      />
    </div>
  );
}
