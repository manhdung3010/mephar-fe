import { Select, Tag } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { EProductType, EProductTypeLabel, getEnumKeyByValue } from '@/enums';
import { useState } from 'react';

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
    inventoryType: null,
  });

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
          <Select
            className="w-[150px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Loại sản phẩm"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('type', value)}
            // onSearch={true}
            options={productTypeData}
            value={productTypeData.find((item) => item.value === formFilter?.type) || undefined}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            className="w-[150px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Trạng thái"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('status', value)}
            options={productStatusData}
            value={productStatusData.find((item) => item.value === formFilter?.status) || undefined}
          />
          <Select
            className="w-[200px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Tồn kho"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('inventoryType', value)}
            value={productInventoryData.find((item) => item.value === formFilter?.inventoryType) || undefined}
            options={productInventoryData}
          />
        </div>
      </div>
      <div className='flex items-center gap-4 p-4'>
        {
          formFilter?.type && <Tag
            // key={tag}
            closable={true}
            style={{ userSelect: 'none' }}
            onClose={() => handleChangeFormFilter('type', null)}
            className='py-1 px-4'
          >
            <span>
              Loại sản phẩm:
            </span>
            <span className='ml-1 font-semibold'>{EProductTypeLabel[getEnumKeyByValue(EProductType, formFilter?.type)]}</span>
          </Tag>
        }
        {
          formFilter?.status !== null && <Tag
            closable={true}
            style={{ userSelect: 'none' }}
            onClose={() => handleChangeFormFilter('status', null)}
            className='py-1 px-4'
          >
            <span>
              Trạng thái:
            </span>
            <span className='ml-1 font-semibold'>{formFilter?.status === 1 ? "Đang hoạt động" : "Ngừng hoạt động"}</span>
          </Tag>
        }
        {
          formFilter?.inventoryType !== null && <Tag
            // key={tag}
            closable={true}
            style={{ userSelect: 'none' }}
            onClose={() => handleChangeFormFilter('inventoryType', null)}
            className='py-1 px-4'
          >
            <span>
              Tồn kho:
            </span>
            <span className='ml-1 font-semibold'>{productInventoryData?.find((item) => item.value === formFilter?.inventoryType)?.label}</span>
          </Tag>
        }
      </div>
    </div>
  );
};

export default Search;
