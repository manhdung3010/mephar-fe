import { getBranch } from "@/api/branch.service";
import { getCustomer } from "@/api/customer.service";
import { getGroupCustomer } from "@/api/group-customer";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { get } from "lodash";
import { useState } from "react";

const ScopeApplication = ({ setValue, getValues }: any) => {
  // const [scope, setScope] = useState({
  //   branch: {
  //     isAll: true,
  //     ids: [],
  //   },
  //   customer: {
  //     isAll: true,
  //     ids: [],
  //   },
  // });
  const [branch, setBranch] = useState(getValues("scope")?.branch?.isAll ? 1 : 2); // 1: Toàn hệ thống, 2: Chi nhánh
  const [customer, setCustomer] = useState(getValues("scope")?.customer?.isAll ? 1 : 2); // 1: Toàn bộ khách hàng, 2: Nhóm khách hàng
  const [channel, setChannel] = useState(getValues("scope")?.channel?.isAll ? 1 : 2); // 1: Toàn bộ khách hàng, 2: Nhóm khách hàng
  const handleChange = (key, value) => {
    let newScope = { ...getValues("scope") };
    if (key === "branch") {
      newScope.branch = {
        isAll: value?.length === 0,
        ids: branch === 1 ? [] : value,
      };
    } else if (key === "channel") {
      newScope.channel = {
        isAll: value?.length === 0,
        types: value,
      };
    } else {
      newScope.customer = {
        isAll: value?.length === 0,
        ids: customer === 1 ? [] : value,
      };
    }
    setValue("scope", newScope);
  };

  const { data: customers, isLoading } = useQuery(
    ["CUSTOMER_GROUP_DISCOUNT", 1, 999],
    () => getGroupCustomer({ page: 1, limit: 999 }),
    {
      enabled: customer === 2,
    },
  );

  const { data: branches, isLoading: isLoadingBranch } = useQuery(
    ["SETTING_BRANCH", 1, 999],
    () => getBranch({ page: 1, limit: 999 }),
    {
      enabled: branch === 2,
    },
  );

  console.log('getValues("scope")', getValues("scope"));
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-[42px]">
      <div className="flex items-end gap-5">
        <CustomRadio
          className="flex flex-col"
          onChange={(value) => {
            setBranch(value);
            handleChange("branch", []);
          }}
          value={branch}
          options={[
            {
              value: 1,
              label: "Toàn hệ thống",
            },
            {
              value: 2,
              label: "Chi nhánh",
            },
          ]}
        />
        <Select
          mode="multiple"
          onChange={(value) => {
            handleChange("branch", value);
          }}
          defaultValue={getValues("scope")?.branch?.ids || []}
          disabled={branch === 1}
          className=" border-underline grow"
          placeholder="Chọn chi nhánh áp dụng"
          showSearch
          optionFilterProp="label"
          options={branches?.data?.items.map((branch) => ({
            label: branch.name,
            value: branch.id,
          }))}
          size="large"
        />
      </div>
      <div className="flex items-end gap-5">
        <CustomRadio
          className="flex flex-col w-52"
          onChange={(value) => {
            setCustomer(value);
            handleChange("customer", []);
          }}
          value={customer}
          options={[
            {
              value: 1,
              label: "Toàn bộ khách hàng",
            },
            {
              value: 2,
              label: "Nhóm khách hàng",
            },
          ]}
        />
        <Select
          mode="multiple"
          disabled={customer === 1}
          onChange={(value) => handleChange("customer", value)}
          defaultValue={getValues("scope")?.customer?.ids || []}
          className=" border-underline grow"
          placeholder="Chọn nhóm khách hàng áp dụng"
          options={
            customers?.data?.items.map((c) => ({
              label: c.name,
              value: c.id,
            })) || []
          }
          size="large"
        />
      </div>
      <div className="flex items-end gap-5">
        <CustomRadio
          className="flex flex-col w-52"
          onChange={(value) => {
            setChannel(value);
            handleChange("channel", []);
          }}
          value={channel}
          options={[
            {
              value: 1,
              label: "Toàn bộ các kênh bán",
            },
            {
              value: 2,
              label: "Kênh bán",
            },
          ]}
        />
        <Select
          mode="multiple"
          disabled={channel === 1}
          onChange={(value) => handleChange("channel", value)}
          defaultValue={getValues("scope")?.channel?.types || "OFFLINE"}
          className=" border-underline grow"
          placeholder="Chọn kênh bán hàng"
          options={[
            {
              value: "OFFLINE",
              label: "Bán trực tiếp",
            },
            {
              value: "ONLINE",
              label: "Chợ",
            },
          ]}
          size="large"
        />
      </div>
    </div>
  );
};

export default ScopeApplication;
