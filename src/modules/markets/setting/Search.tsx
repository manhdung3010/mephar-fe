import { DatePicker, Select, Tag } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from '@/enums';
import { useEffect, useState } from 'react';
import DateIcon from '@/assets/dateIcon.svg';
import dayjs from 'dayjs';
import { debounce } from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { getEmployee } from '@/api/employee.service';
import { formatDate } from '@/helpers';
const { RangePicker } = DatePicker;

const Search = ({ onChange }: { onChange: (value) => void }) => {

  const [formFilter, setFormFilter] = useState({
    keyword: '',
    type: undefined,
    status: undefined,
    timeStart: undefined,
    timeEnd: undefined,
  });
  const [searchEmployeeText, setSearchEmployeeText] = useState('');

  useEffect(() => {
    onChange(formFilter);
  }, [formFilter])


  const handleChangeFormFilter = (key, value) => {
    setFormFilter({ ...formFilter, [key]: value });
    onChange({ ...formFilter, [key]: value });
  }

  const { data: employees } = useQuery(
    ['EMPLOYEE_LIST', searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-2/3">
          <CustomInput
            placeholder="Tìm kiếm theo mã sản phẩm, tên sản phẩm, barcode"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            value={formFilter.keyword}
            onChange={(value) => handleChangeFormFilter('keyword', value)}
          />
        </div>
        <div className="flex grow rounded-l-[3px] border border-[#D3D5D7]">
          <RangePicker
            bordered={false}
            placeholder={['Từ ngày', 'Đến ngày']}
            suffixIcon={<Image src={DateIcon} />}
            className="grow"
            format={{ format: 'DD/MM/YYYY', type: 'mask' }}
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue: any) => ({
                  ...preValue,
                  timeStart: dayjs(value[0]).format('YYYY-MM-DD'),
                  timeEnd: dayjs(value[1]).format('YYYY-MM-DD'),
                }));
              } else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  timeStart: undefined,
                  timeEnd: undefined,
                }));
              }
            }}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            className="w-[150px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Loại"
            optionFilterProp="children"
            onChange={(value) => {
              if (value) {
                setFormFilter((preValue) => ({
                  ...preValue,
                  type: value,
                }));
              }
              else {
                setFormFilter((preValue) => ({
                  ...preValue,
                  type: undefined,
                }));
              }
            }}
            onSearch={debounce((value) => {
              setSearchEmployeeText(value);
            }, 300)}
            showSearch={true}
            options={[
              {
                label: 'Chợ chung',
                value: 'common',
              },
              {
                label: 'Chợ riêng',
                value: 'private',
              },
            ]}
            value={formFilter.type}
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
              }
              else {
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
            options={[
              {
                label: 'Đang bán',
                value: 'active',
              },
              {
                label: 'Ngừng bán',
                value: 'inactive',
              },
            ]}
            value={formFilter.status}
          />
        </div>

      </div>
      <div className='flex items-center gap-4 p-4'>
        {
          Object.keys(formFilter).map((key, index) => {
            if (formFilter[key] && key !== "page" && key !== "limit" && key !== "keyword" && key !== "timeStart" && key !== "timeEnd") {

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
                    key === "type" && (
                      <>
                        <span>
                          Loại:
                        </span>
                        <span className='ml-1 font-semibold'>{formFilter[key] === 'common' ? 'Chợ chung' : 'Chợ riêng'}</span>
                      </>
                    )
                  }
                  {
                    key === "status" && (
                      <>
                        <span>
                          Trạng thái:
                        </span>
                        <span className='ml-1 font-semibold'>{formFilter[key] === 'active' ? 'Đang bán' : 'Ngừng bán'}</span>
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
