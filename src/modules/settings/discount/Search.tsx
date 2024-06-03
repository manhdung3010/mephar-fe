import { Select, Tag } from 'antd';
import Image from 'next/image';

import ArrowDownGray from '@/assets/arrowDownGray.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { useState } from 'react';


const Search = ({ onChange }: { onChange: (value) => void }) => {

  const [formFilter, setFormFilter] = useState({
    keyword: '',
    status: null,
    effective: null,
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
            placeholder="Trạng thái"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('status', value)}
            // onSearch={true}
            options={[
              {
                value: "ACTIVE",
                label: 'Hoạt động',
              },
              {
                value: "INACTIVE",
                label: 'Ngừng hoạt động',
              }
            ]}
            value={formFilter?.status}
          />
          <div className="w-[1px] bg-[#D3D5D7]" />
          <Select
            className="w-[200px]"
            bordered={false}
            suffixIcon={<Image src={ArrowDownGray} alt="" />}
            placeholder="Hiệu lực"
            optionFilterProp="children"
            onChange={(value) => handleChangeFormFilter('effective', value)}
            value={formFilter?.effective}
            options={[
              {
                value: 2,
                label: "Còn hiệu lực",
              },
              {
                value: 3,
                label: "Hết hiệu lực",
              },
            ]}
          />
        </div>
      </div>
      <div className='flex items-center gap-4 p-4'>
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
            <span className='ml-1 font-semibold'>{formFilter?.status === "ACTIVE" ? "Đang hoạt động" : "Ngừng hoạt động"}</span>
          </Tag>
        }
        {
          formFilter?.effective !== null && <Tag
            // key={tag}
            closable={true}
            style={{ userSelect: 'none' }}
            onClose={() => handleChangeFormFilter('effective', null)}
            className='py-1 px-4'
          >
            <span>
              Hiệu lực:
            </span>
            <span className='ml-1 font-semibold'>{formFilter?.effective === 2 ? "Còn hiệu lực" : "Hết hiệu lực"}</span>
          </Tag>
        }
      </div>
    </div>
  );
};

export default Search;
