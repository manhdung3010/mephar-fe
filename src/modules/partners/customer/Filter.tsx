import { useQuery } from "@tanstack/react-query";
import { DatePicker, Select, Tag } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Image from "next/image";
import { useState } from "react";

import { getEmployee } from "@/api/employee.service";
import ArrowDownGray from "@/assets/arrowDownGray.svg";
import DateIcon from "@/assets/dateIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomInput } from "@/components/CustomInput";
import { formatDate } from "@/helpers";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { getGroupCustomer } from "@/api/group-customer";
import { getBranch } from "@/api/branch.service";
import { ECustomerStatus } from "@/enums";

const { RangePicker } = DatePicker;

const Filter = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void; formFilter: any }) => {
  const [searchEmployeeText, setSearchEmployeeText] = useState("");
  const [searchGroupCustomer, setSearchGroupCustomer] = useState("");

  const { data: employees } = useQuery(["EMPLOYEE_LIST", searchEmployeeText], () =>
    getEmployee({ page: 1, limit: 99, keyword: searchEmployeeText }),
  );

  const { data: groupCustomer, isLoading } = useQuery(
    ["GROUP_CUSTOMER", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getGroupCustomer({ page: 1, limit: 99, keyword: searchGroupCustomer }),
  );

  const { data: branches } = useQuery(["SETTING_BRANCH"], () => getBranch());

  return (
    <div className="">
      <div className="flex  items-center gap-4 px-4">
        <div className="flex flex-col gap-5 grow rounded-l-[3px] w-full">
          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Trạng thái</h4>
            <Select
              bordered={false}
              className="w-full border-b border-[#D3D5D7]"
              suffixIcon={<Image src={ArrowDownGray} alt="" />}
              placeholder="Trạng thái"
              onChange={(value) => {
                if (value) {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    status: value,
                  }));
                } else {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    status: undefined,
                  }));
                }
              }}
              defaultValue={formFilter?.status || null}
              showSearch={true}
              options={[
                {
                  value: null,
                  label: "Tất cả",
                },
                {
                  value: ECustomerStatus.potential,
                  label: "Tiềm năng",
                },
                {
                  value: ECustomerStatus.active,
                  label: "Đang hoạt động",
                },
                {
                  value: ECustomerStatus.inactive,
                  label: "Ngừng hoạt động",
                },
              ]}
              value={formFilter?.status || undefined}
            />
          </div>
          <div className="bg-white rounded-lg p-5 shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Nhóm khách hàng </h4>
            <Select
              className="w-full border-b border-[#D3D5D7]"
              bordered={false}
              suffixIcon={<Image src={ArrowDownGray} alt="" />}
              placeholder="Nhóm khách hàng"
              optionFilterProp="label"
              onChange={(value) => {
                if (value) {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    groupCustomerId: value,
                  }));
                } else {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    groupCustomerId: undefined,
                  }));
                }
              }}
              onSearch={debounce((value) => {
                setSearchGroupCustomer(value);
              }, 300)}
              showSearch={true}
              defaultValue={""}
              options={[
                { value: "", label: "Tất cả" },
                ...(groupCustomer?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || []),
              ]}
              value={
                groupCustomer?.data?.items?.find((item) => item?.id === formFilter?.groupCustomerId)?.id || undefined
              }
            />
          </div>
          {/* <RangePicker
            bordered={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format="DD/MM/YYYY"
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: JSON.stringify({
                    startDate: dayjs(value[0]).format('YYYY-MM-DD'),
                    endDate: dayjs(value[1]).format('YYYY-MM-DD'),
                  }),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: undefined,
                }));
              }
            }}
          /> */}

          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Tổng bán</h4>
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8">Từ:</span>{" "}
                <CustomInput
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  type="number"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`totalOrderPayRange[totalOrderPayStart]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`totalOrderPayRange[totalOrderPayStart]`]}
                />
              </div>
              <div className="flex items-center">
                <span className="w-8">Tới:</span>
                <CustomInput
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  type="number"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`totalOrderPayRange[totalOrderPayEnd]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`totalOrderPayRange[totalOrderPayEnd]`]}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Nợ hiện tại</h4>
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8">Từ:</span>{" "}
                <CustomInput
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  type="number"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`totalDebtRange[totalDebtStart]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`totalDebtRange[totalDebtStart]`]}
                />
              </div>
              <div className="flex items-center">
                <span className="w-8">Tới:</span>{" "}
                <CustomInput
                  type="number"
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`totalDebtRange[totalDebtEnd]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`totalDebtRange[totalDebtEnd]`]}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Điểm hiện tại</h4>
            <div>
              <div className="flex items-center mb-4">
                <span className="w-8">Từ:</span>{" "}
                <CustomInput
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  type="number"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`pointRange[pointStart]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`pointRange[pointStart]`]}
                />
              </div>
              <div className="flex items-center">
                <span className="w-8">Tới:</span>{" "}
                <CustomInput
                  className="border-underline w-full"
                  placeholder="Giá trị"
                  type="number"
                  onChange={(value) => {
                    setFormFilter((preValue) => ({
                      ...preValue,
                      [`pointRange[pointEnd]`]: value > 0 ? value : null,
                    }));
                  }}
                  value={formFilter?.[`pointRange[pointEnd]`]}
                />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Loại khách</h4>
            <Select
              bordered={false}
              className="w-full border-b border-[#D3D5D7]"
              suffixIcon={<Image src={ArrowDownGray} alt="" />}
              placeholder="Loại khách"
              onChange={(value) => {
                if (value) {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    type: value,
                  }));
                } else {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    type: undefined,
                  }));
                }
              }}
              defaultValue={null}
              showSearch={true}
              options={[
                {
                  value: null,
                  label: "Tất cả",
                },
                {
                  value: 1,
                  label: "Cá nhân",
                },
                {
                  value: 2,
                  label: "Công ty",
                },
              ]}
              value={formFilter?.type || undefined}
            />
          </div>
          <div className="bg-white rounded-lg p-5  shadow-sm">
            <h4 className="text-sm font-semibold mb-2">Giới tính</h4>
            <Select
              bordered={false}
              className="w-full border-b border-[#D3D5D7]"
              suffixIcon={<Image src={ArrowDownGray} alt="" />}
              placeholder="Giới tính"
              onChange={(value) => {
                if (value) {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    gender: value,
                  }));
                } else {
                  setFormFilter((preValue) => ({
                    ...preValue,
                    gender: undefined,
                  }));
                }
              }}
              defaultValue={null}
              showSearch={true}
              options={[
                {
                  value: null,
                  label: "Tất cả",
                },
                {
                  value: "male",
                  label: "Nam",
                },
                {
                  value: "female",
                  label: "Nữ",
                },
              ]}
              value={formFilter?.gender || undefined}
            />
          </div>
        </div>
      </div>
      {/* <div className='flex items-center gap-4 p-4'>
        {
          Object.keys(formFilter).map((key, index) => {
            if (formFilter[key] && key !== "page" && key !== "limit" && key !== "keyword" && key !== "branchId") {
              if (key === "dateRange" && formFilter[key] !== null) {
                // render date range to Tag
                const dateRange = typeof formFilter[key] === "string" ? JSON?.parse(formFilter[key]) : formFilter[key];
                return <>
                  {dateRange?.startDate && dateRange?.endDate && <Tag
                    key={index}
                    style={{ userSelect: 'none' }}
                    className='py-1 px-4'
                  >
                    <span>
                      Từ ngày:
                    </span>
                    <span className='ml-1 font-semibold'>{formatDate(dateRange.startDate)}</span>
                    <span className='mx-2'>-</span>
                    <span>
                      Đến ngày:
                    </span>
                    <span className='ml-1 font-semibold'>{formatDate(dateRange.endDate)}</span>
                  </Tag>}
                </>
              }
              return (
                <Tag
                  key={index}
                  closable={true}
                  style={{ userSelect: 'none' }}
                  onClose={() => {
                    setFormFilter(prevState => {
                      const newState = { ...prevState };
                      newState[key] = null; // remove the key-value pair from the state
                      return newState;
                    });
                  }}
                  className='py-1 px-4'
                >
                  {
                    key === "userId" && (
                      <>
                        <span>
                          Người bán:
                        </span>
                        <span className='ml-1 font-semibold'>{employees?.data?.items?.find((item) => item?.id === formFilter[key])?.fullName}</span>
                      </>
                    )
                  }

                </Tag>
              )
            }
            return null;
          })
        }
      </div> */}
    </div>
  );
};

export default Filter;
