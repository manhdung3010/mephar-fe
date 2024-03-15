import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';

import { getGroupCustomer } from '@/api/group-customer';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';

import { AddGroupCustomerModal } from './AddGroupCustomerModal';
import { RemoveGroupCustomerModal } from './RemoveGroupCustomerModal';

interface IRecord {
  key: number;
  id: number;
  name: string;
  description: string;
  discount: number;
}

export function GroupCustomer() {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });
  const [deletedId, setDeletedId] = useState<number>();
  const [editId, setEditId] = useState<number>();

  const { data: groupCustomer, isLoading } = useQuery(
    ['GROUP_CUSTOMER', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getGroupCustomer(formFilter)
  );

  const [openAddGroupCustomerModal, setOpenAddGroupCustomerModal] =
    useState(false);

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
      key: 'name',
      render: (value) => <span className=" text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Chiết khấu (%)',
      dataIndex: 'discount',
      key: 'discount',
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
          onClick={() => setOpenAddGroupCustomerModal(true)}
          type="danger"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Thêm nhóm khách hàng
        </CustomButton>
      </div>

      <div className="bg-white p-4">
        <CustomInput
          placeholder="Tìm kiếm mã, tên hoặc sđt khách hàng"
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
        dataSource={groupCustomer?.data?.items}
        columns={columns}
        loading={isLoading}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={groupCustomer?.data?.totalItem}
      />

      <AddGroupCustomerModal
        groupCustomerId={editId}
        isOpen={!!editId || openAddGroupCustomerModal}
        onCancel={() => {
          setEditId(undefined);
          setOpenAddGroupCustomerModal(false);
        }}
      />

      <RemoveGroupCustomerModal
        id={Number(deletedId)}
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
      />
    </div>
  );
}
