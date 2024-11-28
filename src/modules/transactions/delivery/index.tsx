import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import ExportIcon from "@/assets/exportIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EDeliveryTransactionStatus, EDeliveryTransactionStatusLabel } from "@/enums";

import ReturnDetail from "./row-detail";
import Search from "./Search";
import CustomPagination from "@/components/CustomPagination";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMove } from "@/api/move";
import { formatDateTime, hasPermission } from "@/helpers";
import { debounce, set } from "lodash";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

interface IRecord {
  key: number;
  id: string;
  fromBranch: {
    id: number;
    name: string;
  };
  toBranch: {
    id: number;
    name: string;
  };
  movedAt: string;
  receivedAt: string;
  status: EDeliveryTransactionStatus;
}

export function DeliveryTransaction() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);

  const [deletedId, setDeletedId] = useState<number>();
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: null,
    status: null,
    movedBy: null,
    fromBranchId: null,
    toBranchId: null,
    movedAt: undefined,
    receivedAt: undefined,
    receivedBy: null,
  });
  const { data: moveList, isLoading } = useQuery(
    [
      "MOVE_LIST",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      formFilter.status,
      formFilter.movedBy,
      formFilter.fromBranchId,
      formFilter.toBranchId,
      formFilter.movedAt,
      formFilter.receivedAt,
      formFilter.receivedBy,
      branchId,
    ],
    () => getMove({ ...formFilter, branchId }),
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã chuyển hàng",
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
      title: "Từ chi nhánh",
      dataIndex: "fromBranch",
      key: "fromBranch",
      render: (_, { fromBranch }) => <div>{fromBranch?.name}</div>,
    },
    {
      title: "Tới chi nhánh",
      dataIndex: "toBranch",
      key: "toBranch",
      render: (_, { toBranch }) => <div>{toBranch?.name}</div>,
    },
    {
      title: "Ngày chuyển",
      dataIndex: "movedAt",
      key: "movedAt",
      render: (moveAt) => formatDateTime(moveAt),
    },
    {
      title: "Ngày nhận",
      dataIndex: "receivedAt",
      key: "receivedAt",
      render: (receivedAt) => (receivedAt ? formatDateTime(receivedAt) : ""),
    },

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            {
              "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]": status === EDeliveryTransactionStatus.RECEIVED,
              "text-[#0070F4] border border-[#0070F4] bg-[#E4F0FE]": status === EDeliveryTransactionStatus.MOVING,
            },

            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {EDeliveryTransactionStatusLabel[status]}
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.delivery, RoleAction.create) && (
          <CustomButton
            onClick={() => router.push("/transactions/delivery/coupon")}
            type="success"
            prefixIcon={<Image src={PlusIcon} />}
          >
            Chuyển hàng
          </CustomButton>
        )}
      </div>

      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value?.keyword,
            status: value?.status,
            movedBy: value?.movedBy,
            fromBranchId: value?.fromBranchId,
            toBranchId: value?.toBranchId,
            movedAt: value?.movedAt,
            receivedAt: value?.receivedAt,
            receivedBy: value?.receivedBy,
          }));
        }, 300)}
      />

      <CustomTable
        dataSource={moveList?.data.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ [record.key]: true });
              }
            },
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => <ReturnDetail branchId={branchId} record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={moveList?.data?.totalItem}
      />
    </div>
  );
}
