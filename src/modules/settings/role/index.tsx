import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteRole, getRole } from '@/api/role.service';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import DeleteModal from '@/components/CustomModal/ModalDeleteItem';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  id: number;
  name: string;
  note: string;
  createdAt: string;
}

export function RoleInfo() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: roles, isLoading } = useQuery(
    ['SETTING_ROLE', formFilter.keyword, formFilter.limit, formFilter.page],
    () => getRole(formFilter)
  );

  const [deletedId, setDeletedId] = useState<number>();

  const { mutate: mutateDeleteRole, isLoading: isLoadingDeleteRole } =
    useMutation(() => deleteRole(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['SETTING_ROLE']);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteRole();
  };

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Vai trò',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_, { id }) => (
        <div className="flex gap-3">
          <div className=" cursor-pointer" onClick={() => setDeletedId(id)}>
            <Image src={DeleteIcon} />
          </div>
          <div
            className=" cursor-pointer"
            onClick={() => router.push(`/settings/role/add-role?id=${id}`)}
          >
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];
  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          type="danger"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/settings/role/add-role')}
        >
          Thêm mới
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

      <CustomTable
        loading={isLoading}
        dataSource={roles?.data?.items}
        columns={columns}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={roles?.data?.totalItem}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        onSuccess={onSubmit}
        content="vai trò"
        isLoading={isLoadingDeleteRole}
      />
    </div>
  );
}
