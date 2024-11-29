import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Dropdown, MenuProps, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import cx from "classnames";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { deleteCustomer, getCustomer } from "@/api/customer.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editGreenIcon.svg";
import ExportIcon from "@/assets/exportFileIcon.svg";
import ImportIcon from "@/assets/importFileIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";
import { ECustomerStatus, ECustomerStatusLabel } from "@/enums";
import { formatMoney, hasPermission } from "@/helpers";

import RowDetail from "./row-detail";
import Search from "./Search";
import type { ICustomer } from "./type";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import Filter from "./Filter";
import { getCustomerExample, getCustomerExampleKiot, getCustomerExcel } from "@/api/export.service";
import { uploadCustomerExcel } from "@/api/import.service";
import { ImportFileCustomerModal } from "./ImportFileCustomerModal";

interface IRecord {
  key: number;
  id: number;
  code: string;
  fullName: string;
  phone: string;
  debt: number;
  totalSell: number;
  point: number;
  totalPoint: number;
  totalSellExceptReturn: number;
  status: ECustomerStatus;
}

export function Customer() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const { code } = router.query;
  const [deletedId, setDeletedId] = useState<number>();
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: code || null,
    pointStart: null,
    pointEnd: null,
    createdBy: null,
    createdAt: null,
    [`birthdayRange[birthdayStart]`]: null,
    [`birthdayRange[birthdayEnd]`]: null,
    groupCustomerId: null,
    gender: null,
    status: undefined,
    [`totalDebtRange[totalDebtStart]`]: null,
    [`totalDebtRange[totalDebtEnd]`]: null,
    [`totalOrderPayRange[totalOrderPayStart]`]: null,
    [`totalOrderPayRange[totalOrderPayEnd]`]: null,
    [`pointRange[pointStart]`]: null,
    [`pointRange[pointEnd]`]: null,
    branchId: null,
  });
  const { data: customers, isLoading } = useQuery(["CUSTOMER_LIST", formFilter], () => getCustomer(formFilter));

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã khách hàng",
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
      title: "Tên khách hàng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Nợ hiện tại",
      dataIndex: "totalDebt",
      key: "totalDebt",
      render: (value) => formatMoney(+value),
    },
    {
      title: "Tổng bán",
      dataIndex: "totalOrderPay",
      key: "totalOrderPay",
      render: (value) => formatMoney(+value),
    },
    // {
    //   title: 'Điểm hiện tại',
    //   dataIndex: 'point',
    //   key: 'point',
    // },
    // {
    //   title: 'Tổng điểm',
    //   dataIndex: 'totalPoint',
    //   key: 'totalPoint',
    // },
    // {
    //   title: 'Tổng bán trừ trả hàng',
    //   dataIndex: 'totalSellExceptReturn',
    //   key: 'totalSellExceptReturn',
    // },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            {
              "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]": status === ECustomerStatus.active,
              "text-[##666666] border border-[##666666] bg-[#F5F5F5]": status === ECustomerStatus.inactive,
              "text-[##666666] border bg-[#f0e5fa] text-[#6600CC] border-[#6600CC]":
                status === ECustomerStatus.potential,
            },
            "px-2 py-1 rounded-2xl w-max",
          )}
        >
          {ECustomerStatusLabel[status]}
        </div>
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div className="flex gap-3">
          {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.delete) && (
            <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
              <Image src={DeleteIcon} />
            </div>
          )}

          {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.update) && (
            <div className=" cursor-pointer" onClick={() => router.push(`/partners/customer/add-customer?id=${id}`)}>
              <Image src={EditIcon} />
            </div>
          )}
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteCustomer, isLoading: isLoadingDeleteCustomer } = useMutation(
    () => deleteCustomer(Number(deletedId)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CUSTOMER_LIST"]);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteCustomer();
  };

  async function downloadExcel() {
    try {
      const response = await getCustomerExcel();
      console.log(response);

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "customer_data.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  }
  async function downloadExamExcel() {
    try {
      const response = await getCustomerExample();

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "customer_data_exam.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error(error?.message);
    }
  }

  async function downloadExamExcelKiot() {
    try {
      const response = await getCustomerExampleKiot();

      const url = URL.createObjectURL(response as any);

      const a = document.createElement("a");
      a.href = url;
      a.download = "customer_data_kiot.xlsx"; // Specify the file name
      document.body.appendChild(a); // Append the link to the body
      a.click(); // Trigger the download
      document.body.removeChild(a); // Remove the link from the body

      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (error: any) {
      message.error(error?.message);
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const items: MenuProps["items"] = [
    {
      key: "0",
      label: (
        <div className="flex items-center gap-2 cursor-pointer" onClick={downloadExamExcel}>
          <Image src={ExportIcon} /> Xuất file mẫu
        </div>
      ),
    },
  ];

  return (
    <div className="mb-2 ">
      <div className="my-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={downloadExcel}>
          <Image src={ExportIcon} /> Xuất file
        </div>

        <Dropdown menu={{ items }} trigger={["click"]}>
          <div className="flex items-center gap-2 cursor-pointer">
            <Image src={ExportIcon} /> Xuất file mẫu
          </div>
        </Dropdown>

        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpenModal(true)}>
          <Image src={ImportIcon} alt="Import Icon" />
          Nhập file
        </div>
        {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.create) && (
          <CustomButton
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => router.push("/partners/customer/add-customer")}
          >
            Thêm khách hàng
          </CustomButton>
        )}
      </div>

      <div className="grid grid-cols-12">
        <div className="2xl:col-span-2 col-span-3">
          <Filter setFormFilter={setFormFilter} formFilter={formFilter} />
        </div>
        <div className="2xl:col-span-10 col-span-9">
          <div className="sticky top-0 rounded-lg overflow-hidden">
            <Search setFormFilter={setFormFilter} formFilter={formFilter} />

            <CustomTable
              dataSource={customers?.data?.items?.map((item, index) => ({
                ...item,
                key: index + 1,
              }))}
              columns={columns}
              loading={isLoading}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    // Check if the click came from the action column
                    if ((event.target as Element).closest(".ant-table-cell:last-child")) {
                      return;
                    }

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
                expandedRowRender: (record: ICustomer) => <RowDetail record={record} branchId={branchId} />,
                expandIcon: () => <></>,
                expandedRowKeys: Object.keys(expandedRowKeys).map((key) => Number(key) + 1),
              }}
            />
            <CustomPagination
              page={formFilter.page}
              pageSize={formFilter.limit}
              setPage={(value) => setFormFilter({ ...formFilter, page: value })}
              setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
              total={customers?.data?.totalItem}
            />
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="khách hàng"
        isLoading={isLoadingDeleteCustomer}
      />

      <ImportFileCustomerModal
        isOpen={isOpenModal}
        onCancel={() => {
          setIsOpenModal(false);
        }}
      />
    </div>
  );
}
