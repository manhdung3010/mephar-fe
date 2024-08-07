import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { createGroupProduct } from "@/api/product.service";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import InputError from "@/components/InputError";

export function AddGroupProductModal({
  isOpen,
  onCancel,
  setGroupProductKeyword,
  setProductValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setGroupProductKeyword: (value) => void;
  setProductValue: any;
}) {
  const queryClient = useQueryClient();

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required("Đây là trường bắt buộc!"),
      })
    ),
    mode: "onChange",
  });

  const {
    mutate: mutateCreateGroupProduct,
    isLoading: isLoadingCreateGroupProduct,
  } = useMutation(() => createGroupProduct(getValues()), {
    onSuccess: async (res) => {
      setGroupProductKeyword(getValues("name"));
      setProductValue("groupProductId", res.data.id);
      reset();
      await queryClient.invalidateQueries(["GROUP_PRODUCT"]);

      onCancel();
    },
    onError: (err: any) => {
      message.error(err?.message);
    },
  });

  const onSubmit = () => {
    mutateCreateGroupProduct();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title="Thêm nhóm sản phẩm"
      width={650}
      onSubmit={handleSubmit(onSubmit)}
      isLoading={isLoadingCreateGroupProduct}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="mb-5">
        <Label infoText="" label="Tên nhóm sản phẩm" required />
        <CustomInput
          placeholder="Nhập tên nhóm sản phẩm"
          className="h-11"
          onChange={(e) => setValue("name", e, { shouldValidate: true })}
          value={getValues("name")}
        />
        <InputError error={errors.name?.message} />
      </div>
    </CustomModal>
  );
}
