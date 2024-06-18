import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import {
  createSampleMedicine,
  getPosition,
  getProduct,
  getSampleMedicineDetail,
  updateSampleMedicine,
} from "@/api/product.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import RemoveIcon from "@/assets/removeIcon.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomRadio } from "@/components/CustomRadio";
import { CustomSelect } from "@/components/CustomSelect";
import CustomTable from "@/components/CustomTable";
import { CustomUnitSelect } from "@/components/CustomUnitSelect";
import { CustomUpload } from "@/components/CustomUpload";
import NormalUpload from "@/components/CustomUpload/NormalUpload";
import InputError from "@/components/InputError";
import { LoadingIcon } from "@/components/LoadingIcon";
import { ECommonStatus } from "@/enums";
import { formatMoney } from "@/helpers";
import { branchState } from "@/recoil/state";

import Tab from "../../../../components/CustomTab";
import { AddPositionModal } from "../../list-product/components/AddPositionModal";
import { schema } from "./schema";

const AddSampleMedicine = ({
  sampleMedicineId,
}: {
  sampleMedicineId?: number;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

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
      status: ECommonStatus.active,
      branchId,
    },
  });

  const [positionKeyword, setPositionKeyword] = useState("");
  const [isOpenAddPosition, setIsOpenAddPosition] = useState(false);

  const { data: positions } = useQuery(["POSITION", positionKeyword], () =>
    getPosition({ page: 1, limit: 20, keyword: positionKeyword })
  );

  const { data: sampleMedicineDetail } = useQuery(
    ["DETAIL_PRODUCT", sampleMedicineId],
    () => getSampleMedicineDetail(Number(sampleMedicineId)),
    { enabled: !!sampleMedicineId }
  );

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  const [productSelected, setProductSelected] = useState<any>([]);

  const { data: products, isLoading } = useQuery(
    [
      "LIST_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getProduct({ ...formFilter, branchId })
  );

  useEffect(() => {
    if (sampleMedicineDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(sampleMedicineDetail.data[key])) {
          setValue(key, sampleMedicineDetail.data[key], {
            shouldValidate: true,
          });
        }
      });

      const products = sampleMedicineDetail?.data?.products.map((product) => ({
        ...product.product,
        productUnitIdSelected: product.productUnitId,
        price: product.productUnit?.price,
        quantity: product.quantity,
        dosage: product.dosage,
      }));

      setProductSelected(products);
      setPositionKeyword(sampleMedicineDetail?.data?.position?.name);
    }
  }, [sampleMedicineDetail]);

  const onChangeValueProduct = (productId, field, newQuantity) => {
    let products = cloneDeep(productSelected);

    products = products.map((product) => {
      if (product.id === productId) {
        return {
          ...product,
          [field]: newQuantity,
        };
      }

      return product;
    });

    setProductSelected(products);
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "liều dùng",
      dataIndex: "dosage",
      key: "dosage",
      render: (dosage, { id }) => (
        <CustomInput
          value={dosage}
          className="h-11 w-[200px]"
          onChange={(value) => onChangeValueProduct(id, "dosage", value)}
        />
      ),
    },
    {
      title: "Đơn vị",
      dataIndex: "units",
      key: "units",
      render: (_, { productUnit, id, productUnitIdSelected }) => (
        <CustomUnitSelect
          options={(() => {
            return productUnit?.map((unit) => ({
              value: unit.id,
              label: unit.unitName,
            }));
          })()}
          value={productUnitIdSelected}
          onChange={(value) => {
            let products = cloneDeep(productSelected);

            products = products.map((product) => {
              if (product.id === id) {
                const unit = productUnit?.find((unit) => unit.id === value);

                return {
                  ...product,
                  productUnitIdSelected: unit?.id,
                  price: unit?.price,
                };
              }

              return product;
            });

            setProductSelected(products);
          }}
        />
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, { id }) => (
        <CustomInput
          wrapClassName="!w-[110px]"
          className="!h-6 !w-[80px] text-center"
          hasMinus={true}
          hasPlus={true}
          defaultValue={quantity}
          value={quantity}
          type="number"
          onChange={(value) => {
            onChangeValueProduct(id, "quantity", value);
          }}
          onMinus={(value) => {
            onChangeValueProduct(id, "quantity", value);
          }}
          onPlus={(value) => {
            onChangeValueProduct(id, "quantity", value);
          }}
        />
      ),
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (value, { id }) => <CustomInput
        disabled
        value={value}
        className="h-11 w-[200px]"
        onChange={(value) => onChangeValueProduct(id, 'price', value)}
        type="number"
      />,
    },
    {
      title: "Thành tiền",
      dataIndex: "price",
      key: "price",
      render: (_value, { price, quantity }) => formatMoney(price * quantity),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, { id }) => (
        <Image
          src={RemoveIcon}
          className=" cursor-pointer"
          onClick={() => {
            const products = productSelected.filter(
              (product) => product.id !== id
            );
            setProductSelected(products);
          }}
          alt=""
        />
      ),
    },
  ];

  const { mutate: mutateCreateMedicine, isLoading: isLoadingCreateMedicine } =
    useMutation(
      () => {
        return sampleMedicineDetail
          ? updateSampleMedicine(Number(sampleMedicineId), getValues())
          : createSampleMedicine(getValues());
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["LIST_PRODUCT"]);
          reset();

          router.push("/products/sample-medicine");
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    if (!productSelected.length) {
      message.error('Vui lòng chọn ít nhất 1 sản phẩm');
      return;
    }
    mutateCreateMedicine();
  };


  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {sampleMedicineDetail ? "Sửa danh sách đơn thuốc mẫu" : "Thêm danh sách đơn thuốc mẫu"}
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push('/products/sample-medicine')}>Hủy bỏ</CustomButton>
          <CustomButton
            onClick={() => {
              const products = productSelected.map((product) => ({
                productId: product.id,
                productUnitId: product.productUnitIdSelected,
                quantity: product.quantity,
                dosage: product.dosage,
                price: +product.price,
              }));

              setValue("ingredientProducts", products, {
                shouldValidate: true,
              });

              handleSubmit(onSubmit)();
            }}
            disabled={isLoadingCreateMedicine}
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
            menu={["Thông tin"]}
            components={[
              <div className="mt-5" key={0}>
                <div className="grid grid-cols-2 gap-x-[42px] gap-y-5">
                  <div>
                    <Label infoText="" label="Mã đơn thứ" />
                    <CustomInput
                      className="h-11"
                      placeholder="Mã hàng tự động"
                      onChange={(e) =>
                        setValue("code", e, { shouldValidate: true })
                      }
                      value={getValues("code")}
                    />
                  </div>
                  <div>
                    <div className="flex gap-10">
                      <div className="font-medium">Trạng thái</div>
                      <CustomRadio
                        className="-mt-2 flex flex-col"
                        options={[
                          { value: ECommonStatus.active, label: "Hoạt động" },
                          {
                            value: ECommonStatus.inactive,
                            label: "Ngưng hoạt động",
                          },
                        ]}
                        onChange={(value) =>
                          setValue("status", value, { shouldValidate: true })
                        }
                        value={getValues("status")}
                      />
                    </div>
                  </div>
                  <div>
                    <Label infoText="" label="Tên đơn thuốc mẫu" required />
                    <CustomInput
                      className="h-11"
                      placeholder="Nhập tên đơn thuốc mẫu"
                      onChange={(e) =>
                        setValue("name", e, { shouldValidate: true })
                      }
                      value={getValues("name")}
                    />
                    <InputError error={errors?.name?.message} />
                  </div>
                  <div></div>
                  <div>
                    <Label infoText="" label="Vị trí" />
                    <CustomSelect
                      onChange={(value) =>
                        setValue("positionId", value, { shouldValidate: true })
                      }
                      options={positions?.data?.items?.map((item) => ({
                        value: item.id,
                        label: item.name,
                      }))}
                      showSearch={true}
                      onSearch={debounce((value) => {
                        setPositionKeyword(value);
                      }, 300)}
                      className="suffix-icon h-11 !rounded"
                      placeholder="Vị trí sản phẩm"
                      suffixIcon={
                        <div className="flex items-center">
                          <Image src={ArrowDownIcon} alt="" />
                          <Image
                            src={PlusCircleIcon}
                            alt=""
                            onClick={() => setIsOpenAddPosition(true)}
                          />
                        </div>
                      }
                      value={getValues("positionId")}
                    />
                    <InputError error={errors?.positionId?.message} />
                  </div>
                  <div></div>
                  <div>
                    <Label infoText="" label="Trọng lượng" />
                    <CustomInput
                      className="h-11"
                      placeholder="Nhập trọng lượng"
                      onChange={(e) =>
                        setValue("weight", e, {
                          shouldValidate: true,
                        })
                      }
                      value={getValues("weight")}
                    />
                    <InputError error={errors?.weight?.message} />
                  </div>
                  <div />
                  <div>
                    <Label infoText="" label="Hình ảnh minh họa" />
                    <CustomUpload
                      className="!w-fit"
                      onChangeValue={(value) =>
                        setValue("imageId", value, { shouldValidate: true })
                      }
                      values={[sampleMedicineDetail?.data?.image?.path]}
                    >
                      <NormalUpload className="!h-[160px] w-[360px]" />
                    </CustomUpload>
                  </div>
                  <div />
                </div>

                <div>
                  <Label infoText="" label="Ghi chú" />
                  <CustomTextarea
                    placeholder="Nhập ghi chú"
                    onChange={(e) => setValue("description", e.target.value, { shouldValidate: true })}
                    value={getValues("description")}
                    rows={1}
                  />
                </div>

                <div className="mt-8">
                  <div className="flex items-center justify-between">
                    <Label className='text-base font-semibold"' hasInfoIcon={false} label="Thành phần" required />
                    <CustomAutocomplete
                      wrapClassName="!w-60"
                      className="!h-12 !rounded-full px-4 py-2"
                      prefixIcon={<Image src={SearchIcon} alt="" />}
                      suffixIcon={isLoading && <LoadingIcon />}
                      placeholder="Tìm kiếm sản phẩm"
                      showSearch={true}
                      onSearch={(value) => {
                        setFormFilter((preValue) => ({
                          ...preValue,
                          keyword: value,
                        }));
                      }}
                      value={formFilter.keyword}
                      onSelect={(value) => {
                        const product = JSON.parse(value);
                        if (
                          !productSelected.find((p: any) => p.id === product.id)
                        ) {
                          const baseUnit = product.productUnit?.find(
                            (unit) => unit.isBaseUnit
                          );
                          product.productUnitIdSelected = baseUnit?.id;
                          product.price = baseUnit.price;
                          product.quantity = 1;

                          setProductSelected((pre) => [...pre, product]);
                        }
                      }}
                      options={products?.data?.items?.map((item) => ({
                        label: (
                          <div>
                            <div className="text-#0F1824 mb-1 text-base font-medium">
                              <span>{item?.code}</span>{" - "}
                              <span>{item.name}</span>
                            </div>

                            <div className=" grid grid-cols-5 gap-x-8 gap-y-1">
                              <div className=" col-span-1 whitespace-normal">
                                Số đăng ký: {item?.registerNumber}
                              </div>
                              <div className=" col-span-2 whitespace-normal">
                                Hoạt chất: {item?.content}
                              </div>
                              <div className=" col-span-2 whitespace-normal">
                                {" "}
                              </div>
                              <div className=" col-span-1 whitespace-normal">
                                Hàm lượng: {item?.dosage?.name}
                              </div>
                              <div className=" col-span-2 whitespace-normal">
                                Quy cách đóng gói: {item?.packingSpecification}
                              </div>
                              <div className=" col-span-2 whitespace-normal">
                                Hãng sản phẩm: {item?.manufacture?.name}
                              </div>
                            </div>

                            <div className="mt-3 h-[1px] w-full bg-[#CFCFCF]" />
                          </div>
                        ),
                        value: JSON.stringify(item),
                      }))}
                      popupClassName="search-product"
                    />
                  </div>
                </div>
                <CustomTable
                  columns={columns}
                  dataSource={productSelected}
                  className="my-8"
                  pagination={false}
                />

                <AddPositionModal
                  isOpen={isOpenAddPosition}
                  onCancel={() => setIsOpenAddPosition(false)}
                  setPositionKeyword={setPositionKeyword}
                  setProductValue={setValue}
                />
              </div>,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AddSampleMedicine;
