import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { createProduct, getProductDetail, updateProduct } from "@/api/product.service";
import { CustomButton } from "@/components/CustomButton";
import { EProductStatus, EProductType } from "@/enums";
import { branchState, profileState } from "@/recoil/state";
import Tab from "@/components/CustomTab";
import Detail from "./Detail";
import Info from "./Info";
import { schema } from "./schema";
import { hasPermission } from "@/helpers";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

const AddPackage = ({ productId, isCopy }: { productId?: string; isCopy?: boolean }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const profile = useRecoilValue(profileState);
  const [selectedMedicineCategory, setSelectedMedicineCategory] = useState<any>();

  const { data: product } = useQuery(["DETAIL_PRODUCT", productId], () => getProductDetail(Number(productId)), {
    enabled: !!productId,
  });

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      status: EProductStatus.active,
      type: EProductType.PACKAGE,
      isDirectSale: false,
      isLoyaltyPoint: false,
      isBatchExpireControl: false,
      expiryPeriod: 180,
    },
  });

  useEffect(() => {
    if (profile?.role?.permissions) {
      if (!hasPermission(profile?.role?.permissions, RoleModel.list_product, RoleAction.create)) {
        message.error("Bạn không có quyền truy cập vào trang này");
        router.push("/products/list");
      }
    }
  }, [profile?.role?.permissions]);

  useEffect(() => {
    if (selectedMedicineCategory) {
      const record = JSON.parse(selectedMedicineCategory);

      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(record[key]) && key !== "type") {
          if (key !== "code") {
            setValue(key, record[key], {
              shouldValidate: true,
            });
          }
        }
      });

      // setManufactureKeyword(record?.manufacture?.name);
      // setCountryKeyword(record?.country?.name);

      setValue("baseUnit", record?.unit?.name, {
        shouldValidate: true,
      });
    }
  }, [selectedMedicineCategory]);

  useEffect(() => {
    if (product?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(product.data[key]) && key !== "productUnits") {
          if (isCopy && ["code", "barCode"].includes(key)) {
            // nothing
          } else {
            setValue(key, product.data[key], {
              shouldValidate: true,
            });
            setValue("point", product.data?.productUnit?.find((item) => item.isBaseUnit)?.point, {
              shouldValidate: true,
            });
          }
        } else {
          if (isCopy && key === "productUnits") {
            const productUnits = product.data.productUnit
              .filter((unit) => !unit.isBaseUnit)
              .map((unit) => {
                return {
                  ...unit,
                  code: "",
                  barCode: "",
                };
              });
            setValue(key, productUnits, { shouldValidate: true });
          } else {
            const productUnits = product.data.productUnit.filter((unit) => !unit.isBaseUnit);
            setValue("productUnits", productUnits, { shouldValidate: true });
          }
        }
      });
    }
  }, [product]);

  const { mutate: mutateCreatePackage, isLoading: isLoadingCreatePackage } = useMutation(
    () => {
      const payload: any = {
        ...getValues(),
        branchId,
        productUnits: [
          ...(getValues("productUnits") || []),
          {
            id: product?.data?.productUnit?.find((unit) => unit.isBaseUnit)?.id,
            unitName: getValues("baseUnit"),
            code: "",
            price: getValues("price"),
            barCode: "",
            point: getValues("point"),
            exchangeValue: 1,
            isDirectSale: getValues("isDirectSale"),
            isBaseUnit: true,
          },
        ],
      };
      delete payload.isDirectSale;
      delete payload.point;

      return product && !isCopy ? updateProduct(product?.data?.id, payload) : createProduct(payload);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["LIST_PRODUCT"]);
        reset();
        router.push("/products/list");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreatePackage();
  };

  const title = useMemo(() => {
    if (isCopy) return "Sao chép hàng hóa";

    return product ? "Cập nhật hàng hóa" : "Thêm mới hàng hóa";
  }, [product, isCopy]);

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">{title}</div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push("/products/list")}>
            Hủy bỏ
          </CustomButton>
          {/* <CustomButton outline={true}>Lưu và đưa sản phẩm lên chợ</CustomButton> */}
          <CustomButton
            disabled={isLoadingCreatePackage}
            onClick={() => {
              const productUnits = getValues("productUnits")?.map((unit) => {
                return {
                  ...unit,
                  price: !unit.price ? Number(unit.exchangeValue) * Number(getValues("price")) : unit.price,
                };
              });

              setValue("productUnits", productUnits, {
                shouldValidate: true,
              });
              handleSubmit(onSubmit)();
            }}
          >
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div
          className="h-fit flex-[2] bg-white p-5"
          style={{
            boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
          }}
        >
          <Tab
            menu={["Thông tin", "Mô tả chi tiết"]}
            components={[
              <Info
                key="0"
                useForm={{
                  getValues,
                  setValue,
                  errors,
                }}
                // key="0"
                selectedMedicineCategory={selectedMedicineCategory && JSON.parse(selectedMedicineCategory)}
                setSelectedMedicineCategory={setSelectedMedicineCategory}
                groupProductName={product?.data?.groupProduct?.name}
                positionName={product?.data?.productPosition?.name}
                manufactureName={product?.data?.productManufacture?.name}
                countryName={product?.data?.country?.name}
                isCopy={isCopy}
                images={product && product?.data?.image}
              />,
              <Detail
                useForm={{
                  getValues,
                  setValue,
                  errors,
                }}
                key="1"
              />,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AddPackage;
