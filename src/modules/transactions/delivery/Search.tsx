import { DatePicker, Select, Tag } from 'antd';
import Image from 'next/image';
import { getBranch } from '@/api/branch.service';
import { getEmployee } from '@/api/employee.service';
import { getPosition } from '@/api/product.service';
import ArrowDownGray from '@/assets/arrowDownGray.svg';
import DateIcon from '@/assets/dateIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { EDeliveryTransactionStatus, EDeliveryTransactionStatusLabel } from '@/enums';
import { formatDate } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';


const productStatusData = [
  {
    value: EDeliveryTransactionStatus.MOVING,
    label: EDeliveryTransactionStatusLabel.MOVING,
  },
  {
    value: EDeliveryTransactionStatus.RECEIVED,
    label: EDeliveryTransactionStatusLabel.RECEIVED,
  },
]

const Search = ({ onChange }: { onChange: (value) => void }) => {

  const [formFilter, setFormFilter] = useState({
    keyword: '',
    status: null,
    movedBy: null,
    fromBranchId: null,
    toBranchId: null,
    movedAt: undefined,
    receivedAt: undefined,
    receivedBy: null,
  });
  const [positionKeyword, setPositionKeyword] = useState("");
  const [userKeyword, setUserKeyword] = useState("");

  const { data: positions } = useQuery(["POSITION", positionKeyword], () =>
    getPosition({ page: 1, limit: 20, keyword: positionKeyword })
  );
  const { data: employees, isLoading } = useQuery(
    ['SETTING_EMPLOYEE', userKeyword],
    () => getEmployee({ page: 1, limit: 20, keyword: userKeyword })
  );
  const { data: branches } = useQuery(['SETTING_BRANCH'], () => getBranch());

  useEffect(() => {
    onChange(formFilter);
  }, [formFilter])

  const handleChangeFormFilter = (key, value) => {
    setFormFilter({ ...formFilter, [key]: value });
    onChange({ ...formFilter, [key]: value });
  }

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1">
          <CustomInput
            placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            value={formFilter.keyword}
            onChange={(value) => handleChangeFormFilter('keyword', value)}
          />
        </div>

        <div className="flex rounded-l-[3px] border border-[#D3D5D7]">
          <DatePicker
            bordered={false}
            placeholder={"Ngày chuyển hàng"}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format="DD/MM/YYYY"
            onChange={(value: any) => {
              if (value) {
                setFormFilter((preValue: any) => ({
                  ...preValue,
                  movedAt: formatDate(value, "YYYY-MM-DD"),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  movedAt: undefined,
                }));
              }
            }}
          />
          <DatePicker
            bordered={false}
            placeholder={"Ngày nhận hàng"}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format="DD/MM/YYYY"
            onChange={(value: any) => {
              if (value) {
                setFormFilter((preValue: any) => ({
                  ...preValue,
                  receivedAt: formatDate(value, "YYYY-MM-DD"),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  receivedAt: undefined,
                }));
              }
            }}
          />
          <Select
            className='w-[150px] rounded-l-[3px] rounded-r-[3px]'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Từ chi nhánh"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('fromBranchId', value)}
            options={branches?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={branches?.data?.items?.find((item) => item?.id === formFilter?.fromBranchId)?.name || undefined}
          />
          <Select
            className='w-[150px] rounded-l-[3px] rounded-r-[3px]'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Tới chi nhánh"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('toBranchId', value)}
            options={branches?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={branches?.data?.items?.find((item) => item?.id === formFilter?.toBranchId)?.name || undefined}
          />
          <Select
            className='w-[150px] rounded-l-[3px] rounded-r-[0px] border-r-0'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Trạng thái"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('status', value)}
            options={productStatusData}
            value={productStatusData.find((item) => item.value === formFilter?.status) || undefined}
          />
          <Select
            className='w-[150px] rounded-l-[3px] rounded-r-[3px]'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Người nhận"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('receivedBy', value)}
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))}
            value={employees?.data?.items?.find((item) => item?.id === formFilter?.receivedBy)?.fullName || undefined}
          />
        </div>


        {/* <CustomButton
          type="original"
          outline={true}
          className="h-auto w-[130px] rounded-[3px]"
          suffixIcon={<Image src={FilterIcon} />}
          disabled={true}
        >
          Lưu bộ lọc
        </CustomButton> */}
      </div>
      <div className='flex items-center gap-4 p-4'>
        {
          Object.keys(formFilter).map((key, index) => {
            if (formFilter[key] !== null && formFilter[key] !== "" && key !== "keyword" && key !== "movedAt" && key !== "receivedAt") {
              return (
                <Tag
                  key={key}
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
                    key === "fromBranchId" && (
                      <>
                        <span>
                          Từ chi nhánh:
                        </span>
                        <span className='ml-1 font-semibold'>{branches?.data?.items?.find((item) => item?.id === formFilter[key])?.name}</span>
                      </>
                    )
                  }
                  {
                    key === "toBranchId" && (
                      <>
                        <span>
                          Tới chi nhánh:
                        </span>
                        <span className='ml-1 font-semibold'>{branches?.data?.items?.find((item) => item?.id === formFilter[key])?.name}</span>
                      </>
                    )
                  }
                  {
                    key === "status" && (
                      <>
                        <span>
                          Trạng thái:
                        </span>
                        <span className='ml-1 font-semibold'>{formFilter[key] === EDeliveryTransactionStatus.MOVING ? EDeliveryTransactionStatusLabel.MOVING : EDeliveryTransactionStatusLabel.RECEIVED}</span>
                      </>
                    )
                  }
                  {
                    key === "receivedBy" && (
                      <>
                        <span>
                          Người nhận:
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
      </div>
    </div>
  );
};

export default Search;
