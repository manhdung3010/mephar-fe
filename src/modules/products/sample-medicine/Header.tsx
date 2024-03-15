import { Button } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ArrowDown from '@/assets/arrowDown.svg';
import DocumentDownload from '@/assets/documentDownload.svg';
import DocumentUpload from '@/assets/documentUpload.svg';
import PlusIconWhite from '@/assets/PlusIconWhite.svg';
import { CustomButton } from '@/components/CustomButton';

const AddNew = () => {
  const router = useRouter();

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.push('/products/sample-medicine/add-sample-medicine');
  };

  return (
    <CustomButton onClick={handleButtonClick} type="danger" className="p-0">
      <div className="flex items-center justify-center border-r border-[#EE6274] py-[8px] px-4">
        <Image src={PlusIconWhite} alt="" />
        <span className="pl-[6px]">Thêm mới</span>
      </div>
      <div className="flex items-center px-[10px] py-2">
        <Image src={ArrowDown} alt="" />
      </div>
    </CustomButton>
  );
};

const Header = () => {
  return (
    <div className="flex w-full items-center justify-end py-3">
      <Button
        type="text"
        className="flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
      >
        <Image src={DocumentUpload} alt="" />
        <span className="pl-[6px]">Xuất file</span>
      </Button>
      <div className="mx-2 h-5 w-[1px] bg-[#D3D5D7]"></div>
      <Button
        type="text"
        className="mr-4 flex h-auto items-center justify-center py-[6px] px-[5px] text-black-main"
      >
        <Image src={DocumentDownload} alt="" />
        <span className="pl-[6px]">Nhập file</span>
      </Button>
      <AddNew />
    </div>
  );
};

export { AddNew };

export default Header;
