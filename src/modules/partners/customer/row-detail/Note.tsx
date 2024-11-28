import { Input, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";

import PlusIcon from "@/assets/PlusIconWhite.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createCustomerNote, getNoteList } from "@/api/customer.service";
import { CustomModal } from "@/components/CustomModal";
import { CustomTextarea } from "@/components/CustomInput";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import { formatDateTime } from "@/helpers";

const { TextArea } = Input;

interface IRecord {
  key: number;
  note: string;
  createdBy: string;
  createdAt: string;
  userCreate: any;
}

export function Note({ record }: { record: any }) {
  const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

  const toggleExpand = (key: string) => {
    setExpandedKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };
  const [isOpenNoteModal, setIsOpenNoteModal] = useState(false);
  const { data: notes, isLoading } = useQuery(["NOTE_LIST", record?.id], () => getNoteList(record?.id), {
    enabled: !!record?.id,
  });

  const columns: ColumnsType<IRecord> = [
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      render: (value: string, record: IRecord) => {
        const isExpanded = expandedKeys.has(record.note);
        if (!isExpanded && value.length > 60) {
          return (
            <>
              {value.slice(0, 60)}
              <span style={{ color: "blue", cursor: "pointer" }} onClick={() => toggleExpand(record.note)}>
                ... Xem thêm
              </span>
            </>
          );
        } else if (isExpanded) {
          return (
            <>
              {value}
              <span style={{ color: "blue", cursor: "pointer" }} onClick={() => toggleExpand(record.note)}>
                {" "}
                Thu gọn
              </span>
            </>
          );
        } else {
          return value;
        }
      },
    },
    {
      title: "Người thêm",
      dataIndex: "userCreate",
      key: "userCreate",
      render: (_, record) => record?.userCreate?.fullName,
    },
    {
      title: "Thời gian",
      dataIndex: "createdTime",
      key: "createdTime",
      render: (value) => formatDateTime(value),
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable dataSource={notes?.data?.items} columns={columns} pagination={false} className="mb-4" />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="danger"
          prefixIcon={<Image src={PlusIcon} alt="" />}
          onClick={() => setIsOpenNoteModal(true)}
        >
          Thêm ghi chú
        </CustomButton>
      </div>

      <CreateCustomerNote isOpen={isOpenNoteModal} onCancle={() => setIsOpenNoteModal(false)} customerId={record?.id} />
    </div>
  );
}

const CreateCustomerNote = ({
  isOpen,
  onCancle,
  customerId,
}: {
  isOpen: boolean;
  onCancle: any;
  customerId: number;
}) => {
  const [noteValue, setNoteValue] = useState<string>("");
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);
  const { mutate: mutateCreateNote, isLoading } = useMutation(
    () => {
      return createCustomerNote({
        note: noteValue,
        customerId,
        userId: profile?.id,
      });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["NOTE_LIST"]);
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        setNoteValue("");
        onCancle();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const onSubmit = () => {
    mutateCreateNote();
  };
  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancle}
      onSubmit={onSubmit}
      title={<div className="text-xl">Tạo ghi chú</div>}
      width={650}
      // isLoading={isLoadingCreateCustomer}
    >
      <div className="mt-5">
        <div>
          <div className="mb-5 grid grid-cols-1 gap-2">
            <div className="flex">
              <span className="w-[100px] font-medium">Ghi chú</span>
              <span className="flex-1">
                <CustomTextarea
                  className="h-11"
                  rows={6}
                  placeholder="Nhập ghi chú"
                  value={noteValue}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setNoteValue(event.target.value)}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};
