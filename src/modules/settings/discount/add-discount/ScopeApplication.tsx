import { getBranch } from '@/api/branch.service';
import { getCustomer } from '@/api/customer.service';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { useState } from 'react';

const ScopeApplication = ({ setValue, getValues }: any) => {
  const [scope, setScope] = useState({
    branch: {
      isAll: true,
      ids: [],
    },
    customer: {
      isAll: true,
      ids: [],
    },
  });
  const [branch, setBranch] = useState(1); // 1: Toàn hệ thống, 2: Chi nhánh
  const [customer, setCustomer] = useState(1); // 1: Toàn bộ khách hàng, 2: Nhóm khách hàng
  const handleChange = (key, value) => {
    if (key === 'branch') {
      setScope((prev) => ({
        ...prev,
        [key]: {
          isAll: branch === 1,
          ids: branch === 1 ? [] : value,
        },
      }));
    }
    else {
      setScope((prev) => ({
        ...prev,
        [key]: {
          isAll: customer === 1,
          ids: customer === 1 ? [] : value,
        },
      }));
    }

    setValue('scope', scope);
  }

  const { data: customers, isLoading } = useQuery(
    ['CUSTOMER_DISCOUNT', 1, 999],
    () => getCustomer({ page: 1, limit: 999 }),
    {
      enabled: customer === 2,
    }
  );

  const { data: branches, isLoading: isLoadingBranch } = useQuery(
    ['SETTING_BRANCH', 1, 999],
    () => getBranch({ page: 1, limit: 999 }),
    {
      enabled: branch === 2,
    }
  );

  console.log("scope", scope)
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-[42px]">
      <div className='flex items-end gap-5'>
        <CustomRadio
          className='flex flex-col'
          onChange={(value) => {
            setBranch(value)
          }}
          value={branch}
          options={[{
            value: 1,
            label: 'Toàn hệ thống',
          },
          {
            value: 2,
            label: "Chi nhánh",
          },]}
        />
        <Select
          mode='multiple'
          onChange={(value) => handleChange('branch', value)}
          disabled={branch === 1}
          className=" border-underline grow"
          placeholder="Chọn chi nhánh áp dụng"
          showSearch
          optionFilterProp="label"
          options={branches?.data?.items.map((branch) => ({
            label: branch.name,
            value: branch.id,
          }))
          }
          size='large'
        />
      </div>
      <div className='flex items-end gap-5'>
        <CustomRadio
          className='flex flex-col w-52'
          onChange={(value) => setCustomer(value)}
          value={customer}
          options={[{
            value: 1,
            label: 'Toàn bộ khách hàng',
          },
          {
            value: 2,
            label: "Nhóm khách hàng",
          }]}
        />
        <Select
          mode='multiple'
          disabled={customer === 1}
          onChange={(value) => handleChange('customer', value)}
          className=" border-underline grow"
          placeholder="Chọn nhóm khách hàng áp dụng"
          options={customers?.data?.items.map((c) => ({
            label: c.fullName,
            value: c.id,
          })) || []
          }
          size='large'
        />
      </div>
    </div>
  );
};

export default ScopeApplication;
