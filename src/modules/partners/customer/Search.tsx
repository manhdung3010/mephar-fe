import { DatePicker } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';

import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { useRouter } from 'next/router';

const Search = ({ setFormFilter, formFilter }: { setFormFilter: (value) => void, formFilter: any }) => {
  const router = useRouter();
  const { code } = router.query;
  return (
    <div className="bg-white">
      <div className="flex items-center gap-4 p-4">
        <div className="w-full">
          <CustomInput
            placeholder="Tìm kiếm theo mã khách hàng"
            prefixIcon={<Image src={SearchIcon} alt="" />}
            className=""
            onChange={debounce((value) => {
              setFormFilter((preValue) => ({
                ...preValue,
                keyword: value,
              }));
            }, 300)}
            value={code || formFilter.keyword}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
