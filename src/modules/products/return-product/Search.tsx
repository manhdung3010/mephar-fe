import { useQuery } from "@tanstack/react-query";
import { DatePicker, Select, Tag } from "antd";
import dayjs from "dayjs";
import { debounce } from "lodash";
import Image from "next/image";
import { useState } from "react";

import { getEmployee } from "@/api/employee.service";
import ArrowDownGray from "@/assets/arrowDownGray.svg";
import DateIcon from "@/assets/dateIcon.svg";
import FilterIcon from "@/assets/filterIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { getProvider } from "@/api/provider.service";
// import { importProductStatus } from './interface';
import { EImportProductStatus, EImportProductStatusLabel } from "@/enums";
import { formatDate } from "@/helpers";
import { importProductStatus } from "../import-product/interface";

const { RangePicker } = DatePicker;

const Search = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void; formFilter: any }) => {
  const [searchEmployeeText, setSearchEmployeeText] = useState("");
  const [searchProviderText, setSearchProviderText] = useState("");

  const { data: employees } = useQuery(["EMPLOYEE_LIST", searchEmployeeText], () =>
    getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText }),
  );

  const { data: providers, isLoading } = useQuery(["PROVIDER_LIST", searchProviderText], () =>
    getProvider({ page: 1, limit: 20, keyword: searchProviderText }),
  );

  const onChange = (value: string) => {
    setFormFilter((preValue) => ({
      ...preValue,
      userId: value,
    }));
  };

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-1/2">
          <CustomInput
            placeholder="Tìm kiếm theo mã trả hàng"
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

        <div className="flex grow rounded-l-[3px] border border-[#D3D5D7]">
          <RangePicker
            bordered={false}
            placeholder={["Từ ngày", "Đến ngày"]}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format={{ format: "DD/MM/YYYY", type: "mask" }}
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: JSON.stringify({
                    startDate: dayjs(value[0]).format("YYYY-MM-DD"),
                    endDate: dayjs(value[1]).format("YYYY-MM-DD"),
                  }),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  dateRange: undefined,
                }));
              }
            }}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />

          <Select
            className="w-[150px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Trạng thái"
            optionFilterProp="children"
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
            onSearch={debounce((value) => {
              setSearchEmployeeText(value);
            }, 300)}
            showSearch={true}
            options={importProductStatus}
            value={importProductStatus.find((item) => item?.value === formFilter?.status)?.label || undefined}
          />
        </div>

        {/* <CustomButton
          type="original"
          outline={true}
          className="h-auto w-[130px] rounded-[3px]"
          suffixIcon={<Image src={FilterIcon} />}
        >
          Lưu bộ lọc
        </CustomButton> */}
      </div>
      <div className="flex items-center gap-4 p-4">
        {Object.keys(formFilter).map((key, index) => {
          if (formFilter[key] && key !== "page" && key !== "limit" && key !== "keyword") {
            if (key === "dateRange" && formFilter[key] !== null) {
              // render date range to Tag
              const dateRange = typeof formFilter[key] === "string" ? JSON?.parse(formFilter[key]) : formFilter[key];
              return (
                <>
                  {dateRange?.startDate && dateRange?.endDate && (
                    <Tag key={index} style={{ userSelect: "none" }} className="py-1 px-4">
                      <span>Từ ngày:</span>
                      <span className="ml-1 font-semibold">{formatDate(dateRange.startDate)}</span>
                      <span className="mx-2">-</span>
                      <span>Đến ngày:</span>
                      <span className="ml-1 font-semibold">{formatDate(dateRange.endDate)}</span>
                    </Tag>
                  )}
                </>
              );
            }
            return (
              <Tag
                key={index}
                closable={true}
                style={{ userSelect: "none" }}
                onClose={() => {
                  setFormFilter((prevState) => {
                    const newState = { ...prevState };
                    newState[key] = null; // remove the key-value pair from the state
                    return newState;
                  });
                }}
                className="py-1 px-4"
              >
                {key === "status" && (
                  <>
                    <span>Trạng thái:</span>
                    <span className="ml-1 font-semibold">
                      {formFilter[key] === EImportProductStatus.SUCCEED
                        ? EImportProductStatusLabel.SUCCEED
                        : EImportProductStatusLabel.DRAFT}
                    </span>
                  </>
                )}
                {key === "userId" && (
                  <>
                    <span>Người tạo:</span>
                    <span className="ml-1 font-semibold">
                      {employees?.data?.items?.find((item) => item?.id === formFilter[key])?.fullName}
                    </span>
                  </>
                )}
                {key === "supplierId" && (
                  <>
                    <span>Nhà cung cấp:</span>
                    <span className="ml-1 font-semibold">
                      {providers?.data?.items?.find((item) => item?.id === formFilter[key])?.name}
                    </span>
                  </>
                )}
                {/* {
                    key === "positionid" && (
                      <>
                        <span>
                          Vị trí:
                        </span>
                        <span className='ml-1 font-semibold'>{positions?.data?.items?.find((item) => item?.id === formFilter[key])?.name}</span>
                      </>
                    )
                  } */}
              </Tag>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Search;
