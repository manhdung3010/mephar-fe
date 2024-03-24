import { Select, Tag } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import FilterIcon from '@/assets/filterIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { useEffect, useState } from 'react';
import { set } from 'lodash';
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from '@/enums';
import { useQuery } from '@tanstack/react-query';
import { getPosition } from '@/api/product.service';
import { getEmployee } from '@/api/employee.service';

const productTypeData = [
  {
    value: 1,
    label: 'Thuốc',
  },
  {
    value: 2,
    label: 'Hàng hóa',
  },
  {
    value: 3,
    label: 'Combo - đóng gói',
  },
]

const productStatusData = [
  {
    value: 1,
    label: 'Hoạt động',
  },
  {
    value: 0,
    label: 'Ngừng hoạt động',
  },
]

const productInventoryData = [
  {
    value: 1,
    label: "Dưới định mức tồn",
  },
  {
    value: 2,
    label: "Vượt định mức tồn",
  },
  {
    value: 3,
    label: "Còn hàng trong kho",
  },
  {
    value: 4,
    label: "Hết hàng trong kho",
  },
]

const Search = ({ onChange }: { onChange: (value) => void }) => {

  const [formFilter, setFormFilter] = useState({
    keyword: '',
    status: null,
    type: null,
    position: null,
    user: null
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

  const handleChangeFormFilter = (key, value) => {
    setFormFilter({ ...formFilter, [key]: value });
    onChange({ ...formFilter, [key]: value });
  }

  console.log("formFilter", formFilter)

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
            className='w-[150px] rounded-l-[3px] rounded-r-[0px] border-r-0'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Vị trí"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('position', value)}
            options={positions?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            value={productStatusData.find((item) => item.value === formFilter?.position) || undefined}
          />
          <Select
            className='w-[150px] rounded-l-[3px] rounded-r-[3px]'
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Người tạo"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('user', value)}
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))}
            value={productStatusData.find((item) => item.value === formFilter?.user) || undefined}
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
            if (formFilter[key]) {
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
                  <span>
                    {key === "status" ? "Trạng thái" : key === "position" ? "Vị trí" : key === "user" ? "Người tạo" : key}:
                  </span>
                  <span className='ml-1 font-semibold'>{formFilter[key]}</span>
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
