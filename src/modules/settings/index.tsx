import Image from 'next/image';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';

import DeliveryIcon from '@/assets/deliveryRedIcon.svg';
import DiscountIcon from '@/assets/discountRedIcon.svg';
import EmployeeIcon from '@/assets/employeeRedIcon.svg';
import LocationIcon from '@/assets/locationRedIcon.svg';
import MedicineIcon from '@/assets/medicineRedIcon.svg';
import RoleIcon from '@/assets/roleRedIcon.svg';
import StarIcon from '@/assets/starRedIcon.svg';
import StoreIcon from '@/assets/storeRedIcon.svg';
import { hasPermission } from '@/helpers';
import { profileState } from '@/recoil/state';

import { RoleModel } from './role/role.enum';
import { useState } from 'react';
import PointModal from './point-modal';

export function Settings() {
  const router = useRouter();
  const [openPointModal, setOpenPointModal] = useState(false);

  const profile = useRecoilValue(profileState);

  return (
    <div className="mt-6 bg-white p-5">
      <h2 className="mb-5 text-xl font-medium text-[#182537]">
        Thiết lập cửa hàng
      </h2>

      <div className=" grid grid-cols-3 gap-6">
        {hasPermission(profile?.role?.permissions, RoleModel.store) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/store')}
          >
            <Image src={StoreIcon} />
            <div>
              <div className=" mb-1 font-semibold">Thông tin cửa hàng</div>
              <div className="text-[#666] ">
                Quản lý thông tin liên hệ và địa chỉ của cửa hàng
              </div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.branch) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/branch')}
          >
            <Image src={LocationIcon} />
            <div>
              <div className=" mb-1 font-semibold">Quản lý chi nhánh</div>
              <div className="text-[#666] ">
                Thêm mới và quản lý thông tin chi nhánh
              </div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.employee) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/employee')}
          >
            <Image src={EmployeeIcon} />
            <div>
              <div className=" mb-1 font-semibold">Quản lý nhân viên</div>
              <div className="text-[#666] ">
                Thêm mới và quản lý danh sách nhân viên
              </div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.role) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/role')}
          >
            <Image src={RoleIcon} />
            <div>
              <div className=" mb-1 font-semibold">Phân quyền vai trò</div>
              <div className="text-[#666] ">
                Quản lý và phân quyền tài khoản nhân viên
              </div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.discount) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/discount')}
          >
            <Image src={DiscountIcon} />
            <div>
              <div className=" mb-1 font-semibold">Khuyến mại</div>
              <div className="text-[#666] ">
                Thêm mới và quản lý chương trình khuyến mại
              </div>
            </div>
          </div>
        )}

        {hasPermission(profile?.role?.permissions, RoleModel.point_setting) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => setOpenPointModal(true)}
          >
            <Image src={StarIcon} />
            <div>
              <div className=" mb-1 font-semibold">Thiết lập điểm</div>
              <div className="text-[#666] ">
                Thiết lập tích điểm khi mua hàng
              </div>
            </div>
          </div>
        )}

        {hasPermission(
          profile?.role?.permissions,
          RoleModel.connect_system
        ) && (
            <div
              className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
              onClick={() => router.push('/settings/connect-system')}
            >
              <Image src={MedicineIcon} />
              <div>
                <div className=" mb-1 font-semibold">
                  Liên thông hệ thống dược
                </div>
                <div className="text-[#666] ">
                  Kết nối cơ sở GPP và liên thông dữ liệu
                </div>
              </div>
            </div>
          )}

        {hasPermission(profile?.role?.permissions, RoleModel.delivery_fee) && (
          <div
            className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
            onClick={() => router.push('/settings/delivery-fee')}
          >
            <Image src={DeliveryIcon} />
            <div>
              <div className=" mb-1 font-semibold">Cấu hình phí vận chuyển</div>
              <div className="text-[#666] ">
                Quản lý mức phí vận chuyển của cửa hàng
              </div>
            </div>
          </div>
        )}

        {hasPermission(
          profile?.role?.permissions,
          RoleModel.connect_delivery
        ) && (
            <div
              className="flex cursor-pointer gap-4 rounded bg-[#F2F9FF] p-5"
              onClick={() => router.push('/settings/connect-delivery')}
            >
              <Image src={DeliveryIcon} />
              <div>
                <div className=" mb-1 font-semibold">Kết nối vận chuyển</div>
                <div className="text-[#666] ">
                  Quản lý các phương thức vận chuyển đơn hàng
                </div>
              </div>
            </div>
          )}
      </div>

      <PointModal
        isOpen={openPointModal}
        onCancel={() => setOpenPointModal(false)}
      />
    </div>
  );
}
