import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { deleteProvider, getProvider } from '@/api/provider.service';
import DeleteIcon from '@/assets/deleteRed.svg';
import EditIcon from '@/assets/editGreenIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import DeleteModal from '@/components/CustomModal/ModalDeleteItem';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';

import RowDetail from './row-detail';
import Search from './Search';

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
    keyword: '',
  });
  const [deletedId, setDeletedId] = useState<number>();

  const { data: providers, isLoading } = useQuery(
    ['PROVIDER_LIST', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getProvider(formFilter)
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã nhà cung cấp',
      dataIndex: 'code',
      key: 'code',
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
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Nợ cần trả hiện tại',
      dataIndex: 'debt',
      key: 'debt',
    },

    {
      title: 'Tổng mua',
      dataIndex: 'total',
      key: 'total',
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
            onClick={() =>
              router.push(`/partners/provider/add-provider?id=${id}`)
            }
          >
            <Image src={EditIcon} />
          </div>
        </div>
      ),
    },
  ];

  const { mutate: mutateDeleteProvider, isLoading: isLoadingDeleteProvider } =
    useMutation(() => deleteProvider(Number(deletedId)), {
      onSuccess: async () => {
        await queryClient.invalidateQueries(['PROVIDER_LIST']);
        setDeletedId(undefined);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateDeleteProvider();
  };

  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/partners/provider/add-provider')}
        >
          Thêm nhà cung cấp
        </CustomButton>
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
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={providers?.data?.items?.map((item, key) => ({
          ...item,
          key: key + 1,
        }))}
        loading={isLoading}
        columns={columns}
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
