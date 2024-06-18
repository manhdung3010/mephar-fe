import Image from 'next/image';

import FilterIcon from '@/assets/filterIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

const Search = ({ onChange }: { onChange: (value) => void }) => {
  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 py-4">
        <div className="flex-1">
          <CustomInput
            placeholder="Tìm kiếm mã, tên hoặc sđt khách hàng"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
