import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

import { deleteProvider, getProvider } from "@/api/provider.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editGreenIcon.svg";
import PlusIcon from "@/assets/plusWhiteIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import CustomPagination from "@/components/CustomPagination";
import CustomTable from "@/components/CustomTable";

import RowDetail from "./row-detail";
import Search from "./Search";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { useRecoilValue } from "recoil";
import { profileState } from "@/recoil/state";
import ActionFile from "./ActionFile";

export interface IRecord {
  key: number;
  id: number;
  address: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  debt: number;
  total: number;
  province?: {
    name: string;
  };
  district?: {
    name: string;
  };
  ward?: {
    name: string;
  };
  created_by?: {
    username: string;
  };
  companyName: string;
  taxCode: string;
  createdAt: string;
  note: string;
}

export function Provider() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });
  const [deletedId, setDeletedId] = useState<number>();
  const profile = useRecoilValue(profileState);

  const { data: providers, isLoading } = useQuery(
    ["PROVIDER_LIST", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getProvider(formFilter),
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const columns: ColumnsType<IRecord> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Mã nhà cung cấp",
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
      title: "Tên nhà cung cấp",
      dataIndex: "name",
      key: "name",
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
      title: "Nợ cần trả hiện tại",
      dataIndex: "debt",
      key: "debt",
    },

    {
      title: "Tổng mua",
      dataIndex: "total",
      key: "total",
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <div className="flex gap-3">
          {hasPermission(profile?.role?.permissions, RoleModel.provider, RoleAction.delete) && (
            <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
              <Image src={DeleteIcon} />
            </div>
          )}
          {hasPermission(profile?.role?.permissions, RoleModel.provider, RoleAction.update) && (
            <div className=" cursor-pointer" onClick={() => router.push(`/partners/provider/add-provider?id=${id}`)}>
              <Image src={EditIcon} />
            </div>
          )}
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteProvider, isLoading: isLoadingDeleteProvider } = useMutation(
    () => deleteProvider(Number(deletedId)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["PROVIDER_LIST"]);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateDeleteProvider();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.provider, RoleAction.create) && (
          <CustomButton
            prefixIcon={<Image src={PlusIcon} />}
            onClick={() => router.push("/partners/provider/add-provider")}
          >
            Thêm nhà cung cấp
          </CustomButton>
        )}
      </div>

      <Search
        onChange={debounce((value) => {
          setFormFilter((preValue) => ({
            ...preValue,
            keyword: value,
          }));
        }, 300)}
      />

      <CustomTable
        dataSource={providers?.data?.items?.map((item, key) => ({
          ...item,
          key: key + 1,
        }))}
        loading={isLoading}
        columns={columns}
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
          expandedRowRender: (record: IRecord) => <RowDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key + 1),
        }}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={providers?.data?.totalItem}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="nhà cung cấp"
        isLoading={isLoadingDeleteProvider}
      />
    </div>
  );
}
