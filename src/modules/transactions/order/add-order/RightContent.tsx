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
import { getCustomer } from "@/api/customer.service";
import CustomerIcon from "@/assets/customerIcon.svg";
import { CreateCustomerModal } from "@/modules/sales/CreateCustomerModal";
import { getShipAddress } from "@/api/market.service";
import AddAddressModal from "@/modules/markets/payment/AddAddressModal";

export default function RightContent({ getValues, setValue, errors, handleSubmit, reset }: any) {
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [importProducts, setImportProducts] = useRecoilState(checkInventoryState);
  const [searchEmployeeText, setSearchEmployeeText] = useState("");
  const [searchCustomerText, setSearchCustomerText] = useState("");
  const [isOpenAddCustomerModal, setIsOpenAddCustomerModal] = useState(false);
  const [customerStoreId, setCustomerStoreId] = useState<any>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [openAddNewAddress, setOpenAddNewAddress] = useState(false);
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 20,
  });

  const { data: employees } = useQuery(["EMPLOYEE_LIST", searchEmployeeText], () =>
    getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText }),
  );

  const { data: customers } = useQuery(["CUSTOMER_LIST", searchCustomerText], () =>
    getCustomer({
      page: 1,
      limit: 999,
      keyword: searchCustomerText,
      status: "active",
    }),
  );

  useEffect(() => {
    if (getValues("customerId")) {
      const customer = customers?.data?.items?.find((item) => item?.id === getValues("customerId"));
      if (customer) {
        setCustomerStoreId(customer?.customerStoreId);
      } else {
        setCustomerStoreId(null);
      }
    }
  }, [getValues("customerId")]);

  const { data: address, isLoading } = useQuery(
    ["SHIP_ADDRESS", JSON.stringify(formFilter), getValues("customerId"), customerStoreId],
    () =>
      getShipAddress({
        ...formFilter,
        ...(customerStoreId ? { toStoreId: customerStoreId } : { customerId: getValues("customerId") }),
      }),
    {
      enabled: !!customerStoreId,
      // onSuccess: (data) => {
      //   if (data?.data?.items) {
      //     const defaultAddress = data?.data?.items?.find((item) => item?.isDefaultAddress);
      //     if (!selectedAddress && defaultAddress) {
      //       setSelectedAddress(defaultAddress);
      //     }
      //   }
      // },
    },
  );

  useEffect(() => {
    if (address?.data?.items) {
      const defaultAddress = address?.data?.items?.find((item) => item?.isDefaultAddress);
      if (!selectedAddress && defaultAddress) {
        setSelectedAddress(defaultAddress);
      }
    }
  }, [address]);

  useEffect(() => {
    if (profile) {
      setValue("userCreateId", profile.id);
    }
  }, [profile]);

  const { mutate: mutateCreateOrder, isLoading: isLoadingCreateOrder } = useMutation(
    () => {
      return createCheckInventory({
        ...getValues(),
        branchId,
      });
    },
    {
      onSuccess: async (res) => {
        reset();
        router.push(`/products/check-inventory`);
        setImportProducts([]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const totalMoney = useMemo(() => {
    let total = 0;
    importProducts.forEach((item: any) => {
      total += item.realQuantity * item.price;
    });
    return total;
  }, [importProducts]);

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
          placeholder="Chọn nhân viên bán hàng"
          prefixIcon={<Image src={EmployeeIcon} alt="" />}
        />
        <InputError error={errors.userCreateId?.message} />
        <CustomSelect
          options={[
            ...(customers?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName + " - " + item.phone,
            })) || []),
          ]}
          value={getValues("customerId")}
          onSearch={debounce((value) => {
            setSearchCustomerText(value);
          }, 300)}
          showSearch={true}
          onChange={(value) => {
            setValue("customerId", value, { shouldValidate: true });
          }}
          wrapClassName="mt-3"
          className="h-[44px]"
          placeholder="Thêm khách vào đơn F4"
          suffixIcon={
            <>
              {/* {hasPermission(profile?.role?.permissions, RoleModel.customer, RoleAction.create) && ( */}
              <Image
                src={PlusIcon}
                onClick={(e) => {
                  setIsOpenAddCustomerModal(true);
                  e.stopPropagation();
                }}
                alt=""
              />
              {/* )} */}
            </>
          }
          prefixIcon={<Image src={CustomerIcon} alt="" />}
        />
        {getValues("customerId") && (
          <div className="flex gap-2 mt-3">
            <span className="bg-[#F7DADD] text-red-main px-2 font-medium rounded-sm">
              Nợ:{" "}
              {formatMoney(+customers?.data?.items?.find((item) => item?.id === getValues("customerId"))?.totalDebt)}
            </span>
            <span className="bg-[#e6f8ec] text-[#00B63E] px-2 font-medium rounded-sm">
              Điểm: {formatNumber(customers?.data?.items?.find((item) => item?.id === getValues("customerId"))?.point)}
            </span>
          </div>
        )}
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">
                Tổng tiền (<span className="text-red-main">{importProducts?.length}sp</span>)
              </div>
              <div className=" leading-normal text-[#19191C]">{formatMoney(totalMoney)}</div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal ">KHÁCH PHẢI TRẢ</div>
              <div className=" leading-normal text-[#19191C]">{formatMoney(totalMoney)}</div>
            </div>
          </div>

          {/* <div className="mb-5">
            <div className="mb-5 font-medium">KIẾM GẦN ĐÂY</div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487] ">
                Bạch đái hoàn Xuân quang
              </div>
              <Image src={CopyIcon} />
            </div>
          </div> */}
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
                    <div className="pb-6 border-b-[1px] border-[#EBEBF0] flex items-center" key={item?.id}>
                      <Radio value={item?.id}></Radio>
                      <div className="w-full flex justify-between items-center ml-2">
                        <div className="flex flex-col gap-1">
                          <p className="text-[#28293D] font-medium">
                            {item?.fullName} | {item?.phone}
                          </p>
                          <span className="text-[#555770] line-clamp-1">
                            {item?.address}, {item?.ward?.name}, {item?.district?.name}, {item?.province?.name}
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

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            value={getValues("note")}
            onChange={(value) => {
              setValue("note", value, { shouldValidate: true });
            }}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="grid grid-cols-1 gap-3 px-6 pb-4">
        {/* <CustomButton className="!h-12 text-lg font-semibold">
          Lưu tạm
        </CustomButton> */}
        <CustomButton
          onClick={() => {
            const formatProducts = importProducts.map((item: any) => ({
              productUnitId: item.id,
              ...(item?.batches?.length <= 0 && {
                realQuantity: item.realQuantity,
              }),
              // isBatchExpireControl: item.product?.isBatchExpireControl,
              ...(item?.batches?.length > 0 && {
                inventoryCheckingBatch: item.batches
                  .filter((b) => b.isSelected)
                  .map((batch) => {
                    return {
                      batchId: batch.id,
                      realQuantity: batch.quantity,
                    };
                  }),
              }),
            }));

            setValue("products", formatProducts, { shouldValidate: true });
            handleSubmit(onSubmit)();
          }}
          className="!h-12 text-lg font-semibold"
          type="success"
        >
          Hoàn thành
        </CustomButton>
      </div>

      <CreateCustomerModal
        isOpen={isOpenAddCustomerModal}
        onCancel={() => setIsOpenAddCustomerModal(false)}
        onSave={({ customerId, CustomerName }) => {
          setValue("customerId", customerId, {
            shouldValidate: true,
          });
          setSearchCustomerText(CustomerName);
        }}
      />
      <AddAddressModal
        isOpen={openAddAddress}
        onCancel={() => {
          setOpenAddAddress(false);
          setOpenAddNewAddress(false);
        }}
        addressId={!openAddNewAddress ? selectedAddress : null}
        newBranchId={customerStoreId}
      />
    </div>
  );
}
