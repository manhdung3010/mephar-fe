import Image from 'next/image';

import FilterIcon from '@/assets/filterIcon.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

const Search = () => {
  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="flex-1">
          <CustomInput
            placeholder="Tìm kiếm theo tên thuốc"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={() => {}}
          />
        </div>

        <CustomButton
          type="original"
          outline={true}
          className="h-auto w-[130px] rounded-[3px]"
          suffixIcon={<Image src={FilterIcon} />}
        >
          Lưu bộ lọc
        </CustomButton>
      </div>
    </div>
  );
};

export default Search;
