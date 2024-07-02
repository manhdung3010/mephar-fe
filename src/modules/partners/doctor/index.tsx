import { useQuery } from '@tanstack/react-query';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { getDoctor } from '@/api/doctor.service';
import ExportIcon from '@/assets/exportFileIcon.svg';
import ImportIcon from '@/assets/importFileIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import type { EGender } from '@/enums';
import { EDoctorStatus, EDoctorStatusLabel, getEnumKeyByValue } from '@/enums';

import RowDetail from './row-detail';
import Search from './Search';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import { hasPermission } from '@/helpers';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';

export interface IRecord {
  key: number;
  id: number;
  code: string;
  name: string;
  specialist?: { name: string };
  level?: { name: string };
  workPlace?: { name: string };
  status: EDoctorStatus;
  phone: string;
  email: string;
  gender: EGender;
  address: string;
  ward?: {
    name: string;
  };
  district?: {
    name: string;
  };
  province?: {
    name: string;
  };
  note: string;
}

export function Doctor() {
  const router = useRouter();
  const profile = useRecoilValue(profileState);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
  });

  const { data: doctors, isLoading } = useQuery(
    ['DOCTOR_LIST', formFilter.page, formFilter.limit, formFilter.keyword],
    () => getDoctor(formFilter)
  );

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã bác sĩ',
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
      title: 'Tên bác sĩ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Chuyên khoa',
      dataIndex: 'specialist',
      key: 'specialist',
      render: (data) => data?.name,
    },
    {
      title: 'Trình độ',
      dataIndex: 'level',
      key: 'level',
      render: (data) => data?.name,
    },

    {
      title: 'Nơi công tác',
      dataIndex: 'workPlace',
      key: 'workPlace',
      render: (data) => data?.name,
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
                status === EDoctorStatus.active,
              'text-[##666666] border border-[##666666] bg-[#F5F5F5]':
                status === EDoctorStatus.inactive,
            },
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EDoctorStatusLabel[getEnumKeyByValue(EDoctorStatus, status)]}
        </div>
      ),
    },
  ];
  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <div className="flex items-center gap-2">
          <Image src={ExportIcon} /> Xuất file
        </div>

        <div className="h-5 w-[1px] bg-[#D3D5D7]"></div>

        <div className="flex items-center gap-2">
          <Image src={ImportIcon} /> Nhập file
        </div>

        {
          hasPermission(profile?.role?.permissions, RoleModel.doctor, RoleAction.create) && (
            <CustomButton
              prefixIcon={<Image src={PlusIcon} />}
              onClick={() => router.push('/partners/doctor/add-doctor')}
            >
              Thêm bác sĩ
            </CustomButton>
          )
        }

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
        dataSource={doctors?.data?.items?.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        loading={isLoading}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ [record.key]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => {
            return <RowDetail record={record} />;
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={doctors?.data?.totalItem}
      />
    </div>
  );
}
