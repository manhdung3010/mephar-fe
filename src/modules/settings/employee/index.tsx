import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import _debounce from "lodash/debounce";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { deleteEmployee, getEmployee } from "@/api/employee.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editGreenIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { EEmployeeStatus, EEmployeeStatusLabel } from "@/enums";

interface IRecord {
  key: number;
  id: number;
  username: string;
  phone: string;
  email: string;
  role: { name: string };
  createdAt: string;
  status: EEmployeeStatus;
}

export function EmployeeInfo() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });
  const [deletedId, setDeletedId] = useState<number>();

  const { data: employees, isLoading } = useQuery(
    ["SETTING_EMPLOYEE", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getEmployee(formFilter),
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: "Tên nhân viên",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => role?.name,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            {
              "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]": status === EEmployeeStatus.active,
              "text-[##666666] border border-[##666666] bg-[#F5F5F5]": status === EEmployeeStatus.inactive,
            },
            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {EEmployeeStatusLabel[status]}
        </div>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div className="flex gap-3">
          <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
            <Image src={DeleteIcon} />
          </div>
          <div className=" cursor-pointer" onClick={() => router.push(`/settings/employee/add-employee?id=${id}`)}>
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteEmployee, isLoading: isLoadingDeleteEmployee } = useMutation(
    () => deleteEmployee(Number(deletedId)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["SETTING_EMPLOYEE"]);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteEmployee();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          type="danger"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push("/settings/employee/add-employee")}
        >
          Thêm mới nhân viên
        </CustomButton>
      </div>

      <div className="bg-white p-4">
        <CustomInput
          placeholder="Tìm kiếm"
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className=""
          onChange={_debounce((value) => {
            setFormFilter((preValue) => ({
              ...preValue,
              keyword: value,
            }));
          }, 300)}
        />
      </div>

      <CustomTable loading={isLoading} dataSource={employees?.data?.items} columns={columns} pagination={false} />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={employees?.data?.totalItem}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="nhân viên"
        isLoading={isLoadingDeleteEmployee}
      />
    </div>
  );
}
