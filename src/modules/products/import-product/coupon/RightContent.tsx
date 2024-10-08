/* eslint-disable unused-imports/no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep, debounce, set } from "lodash";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { getEmployee } from "@/api/employee.service";
import { createImportProduct } from "@/api/import-product.service";
import { getProvider } from "@/api/provider.service";
import EditIcon from "@/assets/editIcon.svg";
import EmployeeIcon from "@/assets/employeeIcon.svg";
import PlusIcon from "@/assets/plusIcon.svg";
import ProviderIcon from "@/assets/providerIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import InputError from "@/components/InputError";
import { EImportProductStatus } from "@/enums";
import { formatMoney } from "@/helpers";
import { branchState, productImportState } from "@/recoil/state";

import { AddProviderModal } from "./AddProviderModal";
import { useRouter } from "next/router";

export function RightContent({ useForm }: { useForm: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const { getValues, setValue, handleSubmit, reset, errors } = useForm;
  const [productsImport, setProductsImport] = useRecoilState(productImportState);

  const [isOpenAddProviderModal, setIsOpenAddProviderModal] = useState(false);

  const [searchEmployeeText, setSearchEmployeeText] = useState("");
  const [searchProviderText, setSearchProviderText] = useState("");

  const { data: employees } = useQuery(["EMPLOYEE_LIST", searchEmployeeText], () =>
    getEmployee({ page: 1, limit: 20, keyword: searchEmployeeText }),
  );

  const { data: providers } = useQuery(["PROVIDER_LIST", searchProviderText], () =>
    getProvider({ page: 1, limit: 20, keyword: searchProviderText }),
  );

  const totalPrice = useMemo(() => {
    let price = 0;
    if (productsImport?.length > 0) {
      productsImport.forEach(({ product, quantity, discountValue, primePrice }) => {
        price += Number(primePrice) * quantity - discountValue;
      });
      setValue("paid", price - (getValues("discount") ?? 0), { shouldValidate: true });
    } else {
      setValue("paid", 0, { shouldValidate: true });
    }

    return price;
  }, [productsImport, getValues("discount")]);

  const totalPriceAfterDiscount = useMemo(() => {
    const price = Number(totalPrice) - Number(getValues("discount") ?? 0);

    setValue("totalPrice", price, { shouldValidate: true });

    return price;
  }, [totalPrice, getValues("discount")]);

  const debtPrice = useMemo(() => {
    return Number(totalPrice) - Number(getValues("discount") ?? 0) - Number(getValues("paid") ?? 0);
  }, [getValues("discount"), getValues("paid"), totalPrice]);

  const { mutate: mutateCreateProductImport, isLoading: isLoadingCreateProductImport } = useMutation(
    () => {
      const products = getValues("products").map(({ isBatchExpireControl, ...product }) => product);

      return createImportProduct({ ...getValues(), products, branchId });
    },
    {
      onSuccess: async () => {
        const userId = getValues("userId");
        reset();
        setValue("userId", userId, { shouldValidate: true });
        setProductsImport([]);
        await queryClient.invalidateQueries(["LIST_IMPORT_PRODUCT"]);
        router.push("/products/import");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const changePayload = (status: EImportProductStatus) => {
    console.log("productsImport", productsImport);
    const products = cloneDeep(productsImport).map(
      ({ id, price, product, quantity, discountValue, batches, primePrice }) => ({
        productId: product.id,
        importPrice: primePrice,
        totalQuantity: quantity,
        totalPrice: (primePrice ?? 0) * quantity - discountValue,
        discount: discountValue,
        productUnitId: id,
        isBatchExpireControl: product.isBatchExpireControl,
        batches: batches?.map(({ id, quantity, expiryDate }) => ({
          id,
          quantity,
          expiryDate,
        })),
      }),
    );
    setValue("products", products);
    setValue("totalPrice", totalPriceAfterDiscount);
    setValue("debt", debtPrice);
    setValue("status", status);
  };

  const onSubmit = () => {
    mutateCreateProductImport();
  };

  return (
    <div className="flex h-[calc(100vh-52px)] w-[360px] min-w-[360px] flex-col border-l border-[#E4E4E4] bg-white">
      <div className="px-6 pt-5 ">
        <div className="mb-3">
          <CustomSelect
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))}
            showSearch={true}
            value={getValues("userId")}
            onSearch={debounce((value) => {
              setSearchEmployeeText(value);
            }, 300)}
            onChange={(value) => {
              setValue("userId", value, { shouldValidate: true });
            }}
            wrapClassName=""
            className="h-[44px]"
            placeholder="Chọn nhân viên bán hàng"
            prefixIcon={<Image src={EmployeeIcon} alt="" />}
          />
          <InputError error={errors.userId?.message} />
        </div>

        <div className="mb-3">
          <CustomSelect
            options={providers?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            value={getValues("supplierId")}
            onSearch={debounce((value) => {
              setSearchProviderText(value);
            }, 300)}
            onChange={(value) => {
              setValue("supplierId", value, { shouldValidate: true });
            }}
            className="h-[44px]"
            placeholder="Tìm nhà cung cấp"
            prefixIcon={<Image src={ProviderIcon} alt="" />}
            suffixIcon={
              <Image
                src={PlusIcon}
                onClick={(e) => {
                  setIsOpenAddProviderModal(true);
                  e.stopPropagation();
                }}
                alt=""
              />
            }
          />
          <InputError error={errors.supplierId?.message} />
        </div>
      </div>

      <div className="my-6 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="flex grow flex-col px-6">
        <div className="grow">
          <div className="mb-5 border-b-2 border-dashed border-[#E4E4E4]">
            <div className="mb-5 grid grid-cols-2">
              <div className=" leading-normal text-[#828487]">Mã đặt hàng nhập</div>
              <CustomInput
                bordered={false}
                placeholder="Mã phiếu tự động"
                className="h-6 pr-0 text-end"
                onChange={(value) => setValue("code", value)}
                value={getValues("code")}
              />
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Trạng thái</div>
              <div className=" leading-normal text-[#19191C]">Phiếu tạm </div>
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487] ">Tổng tiền hàng</div>
              <div className=" leading-normal text-black-main">{formatMoney(totalPrice)}</div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487]">Giảm giá</div>
              <div className="w-[90px]">
                <CustomInput
                  bordered={false}
                  className="h-6 pr-0 text-end "
                  onChange={(value) => setValue("discount", value, { shouldValidate: true })}
                  type="number"
                  value={getValues("discount")}
                />
              </div>
            </div>

            <div className="mb-5 flex justify-between">
              <div className="text-lg leading-normal text-[#000000]">CẦN TRẢ NCC</div>
              <div className="text-lg leading-normal text-red-main">
                {formatMoney(Number(totalPrice) - Number(getValues("discount") ?? 0))}
              </div>
            </div>

            <div className="mb-5 ">
              <div className="flex justify-between">
                <div className=" leading-normal text-[#828487]">Tiền trả nhà cung cấp (F8)</div>
                <div className="w-[90px]">
                  <CustomInput
                    bordered={false}
                    className="h-6 pr-0 text-end "
                    onChange={(value) => setValue("paid", value, { shouldValidate: true })}
                    type="number"
                    value={getValues("paid")}
                  />
                </div>
              </div>

              <InputError error={errors.paid?.message} />
            </div>

            <div className="mb-5 flex justify-between">
              <div className=" leading-normal text-[#828487] ">Tính vào công nợ</div>
              <div className=" leading-normal text-black-main">{formatMoney(debtPrice)}</div>
            </div>
          </div>
        </div>

        <div className="-mx-3">
          <CustomInput
            bordered={false}
            prefixIcon={<Image src={EditIcon} alt="" />}
            placeholder="Thêm ghi chú"
            className="text-sm"
            onChange={(value) => setValue("description", value)}
            value={getValues("description")}
          />
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-[#E4E4E4]"></div>

      <div className="grid grid-cols-1 gap-3 px-6 pb-4">
        {/* <CustomButton
          className="!h-12 text-lg font-semibold"
          onClick={() => {
            changePayload(EImportProductStatus.DRAFT);
            handleSubmit(onSubmit());
          }}
          disabled={isLoadingCreateProductImport}
        >
          Lưu tạm
        </CustomButton> */}
        <CustomButton
          className="!h-12 text-lg font-semibold w-full"
          type="success"
          disabled={isLoadingCreateProductImport}
          onClick={() => {
            changePayload(EImportProductStatus.SUCCEED);
            handleSubmit(onSubmit)();
          }}
        >
          Hoàn thành
        </CustomButton>
      </div>

      <AddProviderModal
        isOpen={isOpenAddProviderModal}
        onCancel={() => setIsOpenAddProviderModal(false)}
        setProductImportValue={setValue}
      />
    </div>
  );
}
