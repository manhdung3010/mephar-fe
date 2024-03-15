import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import _debounce from 'lodash/debounce';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteBranch, getBranch } from '@/api/branch.service';
import CheckIcon from '@/assets/checkIcon.svg';
import DashIcon from '@/assets/dashIcon.svg';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import DeleteModal from '@/components/CustomModal/ModalDeleteItem';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { ECommonStatus, ECommonStatusLabel, getEnumKeyByValue } from '@/enums';

interface IRecord {
  key: number;
  id: number;
  code: string;
  name: string;
  address1: string;
  address2: string;
  province: { name: string };
  district: { name: string };
  ward: { name: string };
  createdAt: string;
  status: ECommonStatus;
  isDefaultBranch: boolean;
}

export function BranchInfo() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: branches, isLoading } = useQuery(
    ['SETTING_BRANCH', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getBranch(formFilter)
  );

  const [deletedId, setDeletedId] = useState<number>();

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mã CN',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Địa chỉ 1',
      dataIndex: 'address1',
      key: 'address1',
    },
    {
      title: 'Thành phố',
      dataIndex: 'province',
      key: 'province',
      render: (data) => data?.name,
    },
    {
      title: 'Quận/Huyện',
      dataIndex: 'district',
      key: 'district',
      render: (data) => data?.name,
    },
    {
      title: 'Phường/Xã',
      dataIndex: 'ward',
      key: 'district',
      render: (data) => data?.name,
    },
    {
      title: 'Địa chỉ 2',
      dataIndex: 'address2',
      key: 'address2',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            {
              'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                status === ECommonStatus.active,
              'text-[##666666] border border-[##666666] bg-[#F5F5F5]':
                status === ECommonStatus.inactive,
            },
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {ECommonStatusLabel[getEnumKeyByValue(ECommonStatus, status)]}
        </div>
      ),
    },
    {
      title: 'CN mặc định',
      dataIndex: 'isDefaultBranch',
      key: 'isDefaultBranch',
      render: (value) => <Image src={value ? CheckIcon : DashIcon} />,
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
            onClick={() => router.push(`/settings/branch/add-branch?id=${id}`)}
          >
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteBranch, isLoading: isLoadingDeleteBranch } =
    useMutation(() => deleteBranch(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['SETTING_BRANCH']);
        message.success('Xóa thành công!');
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteBranch();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          type="danger"
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/settings/branch/add-branch')}
        >
          Thêm chi nhánh
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
        pagination={false}
        dataSource={branches?.data?.items}
        columns={columns}
        loading={isLoading}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={branches?.data?.totalItem}
      />

      <DeleteModal
        isOpen={!!deletedId}
        onCancel={() => setDeletedId(undefined)}
        content="chi nhánh"
        onSuccess={onSubmit}
        isLoading={isLoadingDeleteBranch}
      />
    </div>
  );
}
