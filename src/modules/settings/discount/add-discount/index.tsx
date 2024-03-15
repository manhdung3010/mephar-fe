import { CustomButton } from '@/components/CustomButton';

import Tab from '../../../../components/CustomTab';
import Info from './Info';
import ScopeApplication from './ScopeApplication';
import TimeApplication from './TimeApplication';

const AddDiscount = () => {
  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          THÊM MỚI KHUYẾN MẠI
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton>Lưu</CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div
          className="h-fit flex-[2] bg-white p-5"
          style={{
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Tab
            menu={['Thông tin', 'Thời gian áp dụng', 'Phạm vi áp dụng']}
            components={[
              <Info key="0" />,
              <TimeApplication key="1" />,
              <ScopeApplication key="2" />,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AddDiscount;
