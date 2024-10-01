import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import CopyIcon from "@/assets/copyIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import PlusIcon from "@/assets/plusIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getEmployee } from "@/api/employee.service";
import { debounce } from "lodash";
import EmployeeIcon from "@/assets/employeeIcon.svg";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchState, checkInventoryState, profileState } from "@/recoil/state";
import { formatMoney, formatNumber } from "@/helpers";
import { message, Radio, Spin } from "antd";
import { createCheckInventory } from "@/api/check-inventory";
import { useRouter } from "next/router";
import InputError from "@/components/InputError";
import CustomerIcon from "@/assets/customerIcon.svg";
import { getShipAddress, updateMarketOrder } from "@/api/market.service";
import AddAddressModal from "@/modules/markets/payment/AddAddressModal";

export function RightContent({
  getValues,
  setValue,
  errors,
  handleSubmit,
  reset,
  detail,
  id,
  products,
}: any) {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [searchEmployeeText, setSearchEmployeeText] = useState("");
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [openAddNewAddress, setOpenAddNewAddress] = useState(false);

  const { data: employees } = useQuery(
    ["EMPLOYEE_LIST", searchEmployeeText],
    () => getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText })
  );

  const totalMoney = useMemo(() => {
    return products?.reduce((total: number, item: any) => {
      return total + item.quantity * item.price;
    }, 0);
  }, [products]);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 50,
  });

  const { data: address, isLoading } = useQuery(
    ["SHIP_ADDRESS", JSON.stringify(formFilter), detail?.storeId],
    () => getShipAddress({ ...formFilter, toStoreId: detail?.storeId }),
    {
      onSuccess: (data) => {
        if (data?.data?.items) {
          const defaultAddress = data?.data?.items?.find(
            (item) => item?.isDefaultAddress
          );
          if (!selectedAddress && defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        }
      },
    }
  );

  useEffect(() => {
    if (profile) {
      setValue("userCreateId", profile.id);
    }
  }, [profile]);
  useEffect(() => {
    if (detail) {
      setFormFilter({
        ...formFilter,
      });
      setSelectedAddress(detail?.addressId);
    }
  }, [detail]);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } =
    useMutation(
      () => {
        const payload = {
          addressId: selectedAddress,
          listProduct: getValues("listProduct")?.map((item) => ({
            marketProductId: item?.marketProductId,
            marketOrderProductId: item?.id,
            quantity: item?.quantity,
            price: item?.price,
          })),
        };
        return updateMarketOrder(String(id), payload);
      },
      {
        onSuccess: async (res) => {
          reset();
          router.push(`/transactions/order`);
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateOrder();
    // console.log("value", getValues());
  };

  console.log("errors", errors);

  return (
    <div className="flex h-[calc(100vh-52px)] w-[360px] min-w-[360px] flex-col border-l border-[#E4E4E4] bg-white">
      <div className="px-6 pt-5 ">
        <CustomSelect
          options={employees?.data?.items?.map((item) => ({
            value: item.id,
            label: item.fullName,
          }))}
          showSearch={true}
          value={getValues("userCreateId")}
          onSearch={debounce((value) => {
            setSearchEmployeeText(value);
          }, 300)}
          onChange={(value) => {
            setValue("userCreateId", value, { shouldValidate: true });
          }}
          wrapClassName=""
          className="h-[44px]"
          placeholder="Chọn nhân viên kiểm hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errors.userCreateId?.message} />
        <CustomInput
          // bordered={false}
          disabled
          className="h-[44px] rounded-[58px]"
          onChange={(value) => {}}
          value={detail?.store?.name + " - " + detail?.store?.phone}
          prefixIcon={<Image src={CustomerIcon} alt="" />}
        />
        <span className="flex justify-end mt-2">
          Nguồn: <span className="text-red-main ml-2">Chợ</span>
        </span>
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            {/* <div className="mb-5 grid grid-cols-2">
              <div className=" leading-normal text-[#828487]">
                Mã kiểm kho
              </div>
              <CustomInput
                bordered={false}
                placeholder="Mã phiếu tự động"
                className="h-6 pr-0 text-end"
                onChange={() => { }}
              />
            </div> */}

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng tiền (
                <span className="text-red-main">
                  {detail?.products?.length}sp
                </span>
                )
              </div>
              <div className=" leading-normal text-[#19191C]">
                {formatMoney(totalMoney)}
              </div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal ">KHÁCH PHẢI TRẢ</div>
              <div className=" leading-normal text-[#19191C]">
                {formatMoney(totalMoney)}
              </div>
            </div>
          </div>
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <span>ĐỊA CHỈ GIAO HÀNG</span>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <Spin />
              </div>
            ) : (
              <div className="mb-5 flex justify-between">
                <div className="my-8">
                  <Radio.Group
                    className="flex flex-col gap-6"
                    value={selectedAddress}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                  >
                    {address?.data?.items?.map((item, index) => (
                      <div
                        className="pb-6 border-b-[1px] border-[#EBEBF0] flex items-center"
                        key={item?.id}
                      >
                        <Radio value={item?.id}></Radio>
                        <div className="w-full flex justify-between items-center ml-2">
                          <div className="flex flex-col gap-1">
                            <p className="text-[#28293D] font-medium">
                              {item?.fullName} | {item?.phone}
                            </p>
                            <span className="text-[#555770] line-clamp-1">
                              {item?.address}, {item?.ward?.name},{" "}
                              {item?.district?.name}, {item?.province?.name}
                            </span>
                            {item?.isDefaultAddress && (
                              <p className="bg-[#fde5eb] text-red-main p-1 font-semibold w-fit rounded">
                                Địa chỉ mặc định
                              </p>
                            )}
                          </div>
                          <div>
                            <Image
                              src={EditIcon}
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedAddress(item?.id);
                                setOpenAddAddress(true);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="w-fit">
                      <CustomButton
                        type="original"
                        outline
                        onClick={() => {
                          setOpenAddNewAddress(true);
                          setOpenAddAddress(true);
                        }}
                      >
                        Thêm địa chỉ mới
                      </CustomButton>
                    </div>
                  </Radio.Group>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            value={getValues('note')}
            onChange={(value) => {
              setValue('note', value, { shouldValidate: true });
            }}
          />
        </div> */}
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="grid grid-cols-1 gap-3 px-6 pb-4">
        <CustomButton
          onClick={onSubmit}
          className="!h-12 text-lg font-semibold"
          type="success"
        >
          Hoàn thành
        </CustomButton>
      </div>

      <AddAddressModal
        isOpen={openAddAddress}
        onCancel={() => {
          setOpenAddAddress(false);
          setOpenAddNewAddress(false);
        }}
        addressId={!openAddNewAddress ? selectedAddress : null}
        newBranchId={detail?.storeId}
      />
    </div>
  );
}
