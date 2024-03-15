import { CustomButton } from '@/components/CustomButton';

import Tab from '../../../../components/CustomTab';
import Detail from './Detail';
import Info from './Info';
import Ingredient from './Ingredient';

const AddCombo = ({
  productId,
  isCopy,
}: {
  productId?: string;
  isCopy?: boolean;
}) => {
  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          Thêm mới COMBO - đóng gói
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
            menu={['Thông tin', 'Mô tả chi tiết', 'Thành phần']}
            components={[
              <Info key="0" />,
              <Detail key="1" />,
              <Ingredient key="2" />,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AddCombo;
