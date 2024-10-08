import { updateStoreStatus } from "@/api/market.service";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { debounce } from "lodash";
import Image from "next/image";
import React, { useState } from "react";
import { EAcceptFollowStoreStatus, EFollowStoreStatus } from "../type";
import ConfirmStatusModal from "./ConfirmStatusModal";
import GroupAgencyModal from "./GroupAgencyModal";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import RowDetail from "./RowDetail";

function AgencyList({ data, formFilter, setFormFilter, isLoading }) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);
  const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
  const [openGroupModal, setOpenGroupModal] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);
  const [recordId, setRecordId] = React.useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>({});

  const { mutate: mutateUpdateStoreStatus, isLoading: isLoadingCreateOrder } = useMutation(
    (payload: any) => {
      console.log("payload", payload);
      return updateStoreStatus(
        payload?.id,
        payload?.status,
        payload?.groupAgencyId ? { groupAgencyId: payload?.groupAgencyId } : null,
      );
    },
    {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries(["AGENCY_LIST"]);
        setOpenGroupModal(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const columns: any = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (value, _, index) => value,
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "agency",
      key: "agency",
      render: (value) => <span>{value?.name}</span>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      render: (value, record) => record?.agency?.phone,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (value, record) =>
        record?.agency?.address +
        ", " +
        record?.agency?.ward?.name +
        ", " +
        record?.agency?.district?.name +
        ", " +
        record?.agency?.province?.name,
    },
    {
      title: "Thao tác",
      dataIndex: "createdAt",
      key: "createdAt",
      classNames: "w-[280px]",
      render: (value, record) =>
        formFilter?.status === EFollowStoreStatus.PENDING ? (
          <div className="flex items-center gap-2">
            <CustomButton
              outline
              onClick={() => {
                const newPayload = {
                  id: record?.id,
                  status: EAcceptFollowStoreStatus.CANCEL,
                };
                mutateUpdateStoreStatus(newPayload);
              }}
            >
              Từ chối
            </CustomButton>
            <CustomButton
              onClick={() => {
                setRecordId(record?.id);
                setOpenGroupModal(true);
              }}
            >
              Chấp nhận
            </CustomButton>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <CustomButton
              outline
              onClick={() => {
                setOpenConfirmModal(true);
                setDeleteId(record?.id);
              }}
            >
              Hủy đại lý
            </CustomButton>
          </div>
        ),
    },
  ];

  console.log("data", data?.items);

  return (
    <div>
      <CustomInput
        placeholder="Tìm kiếm khách hàng"
        prefixIcon={<Image src={SearchIcon} alt="" />}
        className="h-9"
        value={formFilter?.keyword}
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />
      {formFilter?.status === EFollowStoreStatus.PENDING && (
        <p className="italic font-medium text-[#8F90A6] my-6">Số lượng yêu cầu: {data?.totalItem}</p>
      )}
      {formFilter?.status === EFollowStoreStatus.ACTIVE && (
        <p className="italic font-medium text-[#8F90A6] my-6">Số lượng đại lý: {data?.totalItem}</p>
      )}

      <CustomTable
        dataSource={data?.items?.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        loading={isLoading}
        columns={columns}
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
          expandedRowRender: (record) => <RowDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={data?.totalItem}
      />

      <ConfirmStatusModal
        isOpen={openConfirmModal}
        onCancel={() => setOpenConfirmModal(false)}
        onSuccess={() => {
          const newPayload = {
            id: deleteId,
            status: EAcceptFollowStoreStatus.CANCEL,
          };
          mutateUpdateStoreStatus(newPayload);
          setOpenConfirmModal(false);
        }}
        content={""}
      />
      <GroupAgencyModal
        isOpen={openGroupModal}
        onCancel={() => {
          const newPayload = {
            id: recordId,
            status: EAcceptFollowStoreStatus.ACTIVE,
          };
          mutateUpdateStoreStatus(newPayload);
        }}
        onSuccess={({ agencyId }) => {
          const newPayload = {
            id: recordId,
            status: EAcceptFollowStoreStatus.ACTIVE,
            groupAgencyId: agencyId,
          };
          mutateUpdateStoreStatus(newPayload);
        }}
        onClose={() => setOpenGroupModal(false)}
        content={""}
      />
    </div>
  );
}

export default AgencyList;
