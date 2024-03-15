import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';

import { getGroupProvider } from '@/api/group-provider';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';

import { AddGroupProviderModal } from './AddGroupProviderModal';
import { RemoveGroupProviderModal } from './RemoveGroupProviderModal';

interface IRecord {
  key: number;
  id: number;
  name: string;
  description: string;
}

export function GroupProvider() {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });
  const [deletedId, setDeletedId] = useState<number>();
  const [editId, setEditId] = useState<number>();

  const { data: groupProvider, isLoading } = useQuery(
    ['GROUP_PROVIDER', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getGroupProvider(formFilter)
  );

  const [openAddGroupProviderModal, setOpenAddGroupProviderModal] =
    useState(false);

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
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
          <div className=" cursor-pointer" onClick={() => setEditId(id)}>
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
          onClick={() => setOpenAddGroupProviderModal(true)}
          type="danger"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Thêm nhóm NCC
        </CustomButton>
      </div>

      <div className="bg-white p-4">
        <CustomInput
          placeholder="Tìm kiếm"
          prefixIcon={<Image src={SearchIcon} alt="" />}
          className=""
          onChange={debounce((value) => {
            setFormFilter((preValue) => ({
              ...preValue,
              keyword: value,
            }));
          }, 300)}
        />
      </div>

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        loading={isLoading}
        dataSource={groupProvider?.data?.items}
        columns={columns}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={groupProvider?.data?.totalItem}
      />

      <AddGroupProviderModal
        isOpen={!!editId || openAddGroupProviderModal}
        onCancel={() => {
          setEditId(undefined);
          setOpenAddGroupProviderModal(false);
        }}
        groupProviderId={editId}
      />

      <RemoveGroupProviderModal
        id={Number(deletedId)}
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
      />
    </div>
  );
}
