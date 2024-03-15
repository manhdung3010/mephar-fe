import { Checkbox } from 'antd';
import Image from 'next/image';

import SearchIcon from '@/assets/searchIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomRadio } from '@/components/CustomRadio';

export function SettingThirdPartyFee() {
  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">HÀ NỘi</div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton>Lưu</CustomButton>
        </div>
      </div>

      <div className="my-6 grid grid-cols-3 gap-6">
        <div className=" col-span-1">
          <div className="mb-2 text-base text-[#182537]">
            Thông tin chi tiết
          </div>
          <div className="text-[#666]">
            Cho phép điều chỉnh thông tin và phí vận chuyển từ đối tác.
          </div>
        </div>

        <div className=" col-span-2">
          <div className="mb-4 rounded bg-white p-5">
            <div>
              <Label
                label="Tên hiển thị phương thức vận chuyển trên trang thanh toán"
                hasInfoIcon={false}
              />
              <CustomInput
                className="h-11"
                placeholder="Nhập tên phương thức vận chuyển"
                onChange={() => {}}
              />
            </div>

            <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

            <div className="mb-6">
              <div className="mb-1 text-[#182537]">
                Điều chỉnh phí vận chuyển
              </div>
              <div className="text-[#666]">
                Để tăng giảm phí vận chuyển theo phần trăm hoặc giá trị của phí
                vận chuyển đối tác cung cấp. Giá trị cuối sẽ được hiển thị cho
                người mua hàng trên trang thanh toán.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-[42px]">
              <div>
                <Label label="Loại điều chỉnh" />
                <CustomInput
                  className="h-11"
                  placeholder="Theo phần trăm"
                  onChange={() => {}}
                />
              </div>

              <div>
                <Label label="Giá trị điều chỉnh" />
                <CustomInput
                  className="h-11"
                  placeholder="Theo phần trăm"
                  suffixIcon={<div className="text-[#182537]">%</div>}
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>

          <div className="rounded bg-white p-5">
            <div className="mb-1 text-[#182537]">Chọn địa chỉ lấy hàng</div>
            <div className="mb-6 text-[#666]">
              Để hệ thống hiển thị phí vận chuyển phù hợp với địa chỉ giao hàng
              người mua nhập trên trang thanh toán.
            </div>

            <div className="mb-6 italic text-[#999]">
              *Đây là địa chỉ có tích chọn ĐỊA CHỈ LẤY HÀNG trong cấu hình cửa
              hàng
            </div>

            <CustomRadio
              options={[
                {
                  value: 1,
                  label: (
                    <div className="mt-[50px]">
                      <div className="mb-2">
                        Địa chỉ lấy hàng áp dụng cho tất cả các khu vực vận
                        chuyển của cửa hàng
                      </div>
                      <CustomInput
                        className="h-11 w-[500px]"
                        placeholder="Cửa hàng chính"
                        suffixIcon={<Image src={SearchIcon} />}
                        onChange={() => {}}
                      />
                    </div>
                  ),
                },
                {
                  value: 1,
                  label:
                    'Địa chỉ lấy hàng áp dụng cho từng khu vực vận chuyển của cửa hàng',
                },
              ]}
              className="-mt-[50px] flex flex-col"
            />

            <div className="my-6 h-[1px] w-full bg-[#E8EAEB]" />

            <CustomInput
              className="mb-6 h-11 w-full"
              placeholder="Tìm kiếm tỉnh/thành phố"
              suffixIcon={<Image src={SearchIcon} />}
              onChange={() => {}}
            />

            <div className="flex justify-between">
              <div className="flex gap-2">
                <Checkbox />
                Tích chọn khu vực sử dụng phí từ đối tác
              </div>
              <div className="text-red-main">Thêm khu vực vận chuyển</div>
            </div>

            <div className="my-4 h-[1px] w-full bg-[#E8EAEB]" />

            <div className="mb-4 flex gap-2">
              <Checkbox />
              Hà Nội
            </div>

            <div className="mb-4 flex gap-2">
              <Checkbox />
              Thành Phố Hồ Chí Minh
            </div>

            <div className="mb-4 flex gap-2">
              <Checkbox />
              Bà Rịa - Vũng Tàu
            </div>

            <div className="mb-4 flex gap-2">
              <Checkbox />
              Đã Nẵng
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
