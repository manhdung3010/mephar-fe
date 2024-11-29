import { CustomModal } from "@/components/CustomModal";
import React, { useEffect } from "react";
import CloseCircleGrayIcon from "@/assets/closeCircleGrayIcon.svg";
import Image from "next/image";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import { CustomSelect } from "@/components/CustomSelect";
import { useQuery } from "@tanstack/react-query";
import { getAgency, getAgencyGroup } from "@/api/market.service";
import { cloneDeep } from "lodash";
import { message } from "antd";
import { CustomInput } from "@/components/CustomInput";
import SearchIcon from "@/assets/searchIcon.svg";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";

function AgencyModal({
  isOpen,
  onCancel,
  onSuccess,
  isLoading,
  onSave,
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  isLoading?: boolean;
  onSave?: any;
}) {
  const branchId = useRecoilValue(branchState);
  const [agencyKeyword, setAgencyKeyword] = React.useState<string>("");
  const [agencyType, setAgencyType] = React.useState<string>("agency");
  const [agencyList, setAgencyList] = React.useState<any>([]);

  const { data: angency, isLoading: isLoadingAgency } = useQuery(
    ["AGENCY_LIST", agencyKeyword],
    () => getAgency({ keyword: agencyKeyword, status: "active" }),
    {
      enabled: agencyType === "agency",
    },
  );
  const { data: angencyGroup, isLoading: isLoadingAgencyGroup } = useQuery(
    ["AGENCY_GROUP_LIST", agencyKeyword],
    () => getAgencyGroup({ keyword: agencyKeyword }),
    {
      enabled: agencyType === "agencyGroup",
    },
  );

  useEffect(() => {
    if (angency && agencyType === "agency") {
      setAgencyList(angency?.data?.items?.map((item: any) => ({ ...item, isGroup: false })));
    } else if (angencyGroup && agencyType === "agencyGroup") {
      setAgencyList(
        angencyGroup?.data?.items?.map((item: any) => ({
          ...item,
          isGroup: true,
        })),
      );
    }
  }, [angency, angencyGroup, agencyType]);

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    ...(agencyType === "agency"
      ? [
          {
            title: "Đại lý",
            dataIndex: "groupProduct",
            key: "groupProduct",
            render: (_, record) => <span>{record?.agency?.name}</span>,
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
            render: (_, record) => <span>{record?.agency?.phone}</span>,
          },
        ]
      : [
          {
            title: "Nhóm đại lý",
            dataIndex: "groupAgency",
            key: "groupAgency",
            render: (_, record) => record?.agency?.name || record?.name,
          },
        ]),
  ];

  const checkSelection = () => {
    return agencyList.some((item: any) => item.isSelected);
  };

  return (
    <CustomModal
      closeIcon={<Image src={CloseCircleGrayIcon} alt="" />}
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={onCancel}
      customFooter
      width={1100}
      title="Thêm đại lý"
    >
      <div className="flex flex-col gap-6 text-[#1C1C28]">
        <div className="grid grid-cols-4 gap-2">
          <div className="col-span-3">
            <CustomInput
              placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
              prefixIcon={<Image src={SearchIcon} alt="" />}
              className=""
              value={agencyKeyword}
              onChange={(value) => setAgencyKeyword(value)}
            />
          </div>
          <div className="col-span-1">
            <CustomSelect
              onChange={(value) => {
                setAgencyType(value);
                setAgencyKeyword("");
              }}
              className="!rounded h-[34px]"
              placeholder="Loại đại lý"
              value={agencyType}
              options={[
                { label: "Đại lý", value: "agency" },
                { label: "Nhóm đại lý", value: "agencyGroup" },
              ]}
            />
          </div>
        </div>

        <CustomTable
          dataSource={
            agencyList?.map((item: any, index) => ({
              ...item,
              key: item.id,
            })) || []
          }
          columns={columns}
          loading={isLoading}
          rowSelection={{
            selectedRowKeys: [...agencyList.filter((batch) => batch.isSelected).map((batch: any) => batch.id)],
            onChange(selectedRowKeys) {
              let listBatchClone = cloneDeep(agencyList);
              console.log("selectedRowKeys", selectedRowKeys);

              listBatchClone = listBatchClone.map((batch: any) => {
                if (selectedRowKeys.includes(batch.id)) {
                  return {
                    ...batch,
                    isSelected: true,
                  };
                }

                return { ...batch, isSelected: false };
              });

              setAgencyList(listBatchClone);
            },
          }}
        />

        <div className="mt-5 flex justify-end gap-x-4">
          <CustomButton onClick={onCancel} outline={true} className="h-[46px] min-w-[150px] py-2 px-4">
            Đóng
          </CustomButton>
          <CustomButton
            onClick={() => {
              if (checkSelection()) {
                onSave(agencyList?.filter((item: any) => item.isSelected));
                // reset isSelected agencyList
                setAgencyList(
                  agencyList.map((item: any) => ({
                    ...item,
                    isSelected: false,
                  })),
                );
              } else {
                message.error("Vui lòng chọn đại lý");
              }
            }}
            className="h-[46px] min-w-[150px] py-2 px-4"
            // type={isSaleReturn && batchErr.length > 0 ? 'disable' : 'danger'}
            // disabled={isSaleReturn && batchErr.length > 0 ? true : false}
          >
            Xác nhận
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
}

export default AgencyModal;
