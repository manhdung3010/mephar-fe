import { CustomButton } from '@/components/CustomButton';

import Tab from '../../../../components/CustomTab';
import Detail from './Detail';
import Info from './Info';
import Ingredient from './Ingredient';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './schema';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { profileState } from '@/recoil/state';
import { hasPermission } from '@/helpers';
import { RoleAction, RoleModel } from '@/modules/settings/role/role.enum';
import { message } from 'antd';

const AddCombo = ({
  productId,
  isCopy,
}: {
  productId?: string;
  isCopy?: boolean;
}) => {
  const router = useRouter();

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      // status: EProductStatus.active,
      // type: EProductType.MEDICINE,
      // isDirectSale: false,
      // isBatchExpireControl: true,
      // expiryPeriod: 180,
    },
  });

  const profile = useRecoilValue(profileState);

  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.create)) {
        message.error('Bạn không có quyền truy cập vào trang này');
        router.push('/products/list');
      }
    }
  }, [profile?.role?.permissions]);

  const onSubmit = (data) => {
    console.log("submit combo")
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          Thêm mới COMBO - đóng gói
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push('/products/list')}>Hủy bỏ</CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)}>Lưu</CustomButton>
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
              <Info key="0" useForm={{
                getValues,
                setValue,
                errors,
                setError,
              }} />,
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
