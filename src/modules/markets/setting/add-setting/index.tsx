import Image from "next/image";
import { createConfigProduct, getConfigProductDetail, updateConfigProduct } from "@/api/market.service";
import { getSaleProducts } from "@/api/product.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import PhotographIcon from "@/assets/photograph.svg";
import SearchIcon from "@/assets/searchIcon.svg";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput, CustomTextarea } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomSelect } from "@/components/CustomSelect";
import { CustomUpload } from "@/components/CustomUpload";
import InputError from "@/components/InputError";
import { formatMoney, formatNumber, getImage, sliceString } from "@/helpers";
import { IBatch, ISaleProduct } from "@/modules/sales/interface";
import { agencyState, branchState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { cloneDeep, debounce } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import ListBatchModal from "./ListBatchModal";
import { schema } from "./schema";
import CustomTextEditor from "@/components/CustomTextEditor";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import CustomTable from "@/components/CustomTable";
import { ColumnsType } from "antd/es/table";
import DeleteIcon from "@/assets/deleteRed.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import AgencyModal from "./AgencyModal";
import CustomEditor from "@/components/CustomEditor";
export function AddMarketSetting() {
  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      marketType: "common",
      images: [],
      isDefaultPrice: true,
    },
  });
  const branchId = useRecoilValue(branchState);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { id } = router.query;
  const [isAgency, setIsAgency] = useRecoilState(agencyState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
    keyword: "",
    isSale: true,
  });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [productSelected, setProductSelected] = useState<any>(null);
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [openAgencyModal, setOpenAgencyModal] = useState(false);
  const [listBatchSelected, setListBatchSelected] = useState<any[]>([]);
  const [listAgencySelected, setListAgencySelected] = useState<any[]>([]);
  const [noBatchInventory, setNoBatchInventory] = useState(0);
  const [imageCenterPath, setImageCenterPath] = useState<string>("");
  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_SALE_PRODUCT", formFilter.page, formFilter.limit, formFilter.keyword], () =>
    getSaleProducts({ ...formFilter }),
  );

  const { data: productDetail, isLoading: isLoadingProductDetail } = useQuery<{
    data?: { item: any };
  }>(["CONFIG_PRODUCT_DETAIL", id], () => getConfigProductDetail(String(id)), {
    enabled: !!id,
  });

  useEffect(() => {
    if (!productDetail && productSelected) {
      setListBatchSelected([]);
    }
  }, [productSelected]);

  useEffect(() => {
    if (productDetail?.data?.item) {
      const { product, productUnit, productUnitId, batches, ...rest } = productDetail?.data?.item;
      const productSelected = getSaleProducts({
        ...formFilter,
        productUnit: productUnitId,
        branchId,
      }).then((res) => {
        onSelectedProduct(JSON.stringify(res.data.items[0]));
        const newBatches = batches.map((batch) => {
          const nBatch = res.data.items[0].batches.find((item) => item.id === batch.batchId);
          return {
            ...nBatch,
            originalQuantity: nBatch.quantity,
            quantity: batch.quantity,
          };
        });
        setListBatchSelected(newBatches);
        setValue("batches", batches, { shouldValidate: true });
      });
      setValue("price", rest.price, { shouldValidate: true });
      setValue("discountPrice", rest.discountPrice, { shouldValidate: true });
      setValue("quantity", rest.quantity, { shouldValidate: true });
      setValue("description", rest.description ? rest.description : "", { shouldValidate: true });
      setValue("marketType", rest.marketType, { shouldValidate: true });
      setValue("thumbnail", rest?.imageCenter?.id, { shouldValidate: true });
      setValue("images", rest.images ? rest.images?.map((item) => item.id) : [], { shouldValidate: true });
      setValue("isDefaultPrice", rest.isDefaultPrice, { shouldValidate: true });
      setProductSelected(productDetail?.data?.item);
      setListAgencySelected(
        rest.agencys?.map((item) => {
          return {
            ...item,
            agency: item.agency?.agency,
            isGroup: item.groupAgencyId ? true : false,
            id: item.groupAgencyId || item.agencyId,
          };
        }),
      );
    }
  }, [productDetail]);

  const { mutate: mutateCreateConfigProduct, isLoading } = useMutation(
    () => {
      const payload: any = {
        ...getValues(),
        agencys: listAgencySelected?.map((item) => {
          return {
            ...(item.isGroup ? { groupId: item.id } : { agencyId: item.id }),
            price: item.price,
            discountPrice: item.discountPrice,
          };
        }),
      };
      if (getValues("marketType") === "common") {
        delete payload.agencys;
      }
      if (!payload?.batches) {
        delete payload.batches;
      }
      return id ? updateConfigProduct(id, { ...payload }) : createConfigProduct({ ...payload });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["CONFIG_PRODUCT"]);
        reset();
        router.push("/markets/setting");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSearch = useCallback(
    debounce((value) => {
      setFormFilter((preValue) => ({
        ...preValue,
        keyword: value,
      }));
    }, 300),
    [formFilter],
  );

  const validateDiscountPrice = () => {
    const agency = listAgencySelected.find((item) => item.discountPrice > item.price);
    if (agency) {
      return false;
    }
    return true;
  };

  const onSubmit = () => {
    if (productSelected?.batches?.length > 0 && listBatchSelected.length === 0) {
      message.error("Vui lòng chọn lô sản phẩm");
      return;
    }
    if (!validateDiscountPrice()) {
      message.error("Giá khuyến mãi của đại lý/nhóm đại lý không được lớn hơn giá bán");
      return;
    }
    // check quantity with batch selected
    if (listBatchSelected?.length > 0) {
      const totalQuantity = listBatchSelected.reduce((total, item) => total + item.newInventory, 0);
      if (getValues("quantity") > totalQuantity) {
        message.error("Số lượng tồn không được lớn hơn số lượng tồn của lô");
        return;
      }
    } else {
      if (getValues("quantity") > productSelected?.quantity) {
        message.error("Số lượng tồn không được lớn hơn số lượng tồn của sản phẩm");
        return;
      }
    }
    mutateCreateConfigProduct();
  };

  const onSelectedProduct = (value) => {
    const parseProduct = JSON.parse(value);
    setProductSelected(parseProduct);
    setValue("productId", parseProduct.productId, { shouldValidate: true });
    setValue("productUnitId", parseProduct.productUnit?.id, {
      shouldValidate: true,
    });
    setValue("price", parseProduct?.price, { shouldValidate: true });
    if (productDetail?.data?.item?.imageCenter?.id) {
      setValue("thumbnail", productDetail?.data?.item?.imageCenter?.id, {
        shouldValidate: true,
      });
    } else {
      setValue("thumbnail", parseProduct?.product?.image?.id, {
        shouldValidate: true,
      });
    }
    setValue("description", parseProduct?.product?.description ?? "", {
      shouldValidate: true,
    });
    setFormFilter((pre) => ({ ...pre, keyword: "" }));
    setImageCenterPath(parseProduct?.product?.image?.path);
    setSearchKeyword(parseProduct?.product?.name);
  };

  const columns: ColumnsType<any> = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Loại",
      dataIndex: "groupAgency",
      key: "groupAgency",
      render: (_, record) => (record?.isGroup ? "Nhóm đại lý" : "Đại lý"),
    },
    {
      title: "Nhóm đại lý/Đại lý",
      dataIndex: "groupProduct",
      key: "groupProduct",
      render: (_, record) =>
        record?.isGroup
          ? record?.name || record?.groupAgency?.name
          : `${record?.agency?.name} - ${record?.agency?.phone}`,
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      render: (value, record) => (
        <CustomInput
          value={value}
          onChange={(value) => {
            const newAgency = listAgencySelected.map((item) => {
              if (item.id === record.id && item.isGroup === record.isGroup) {
                return {
                  ...item,
                  price: value,
                };
              }
              return item;
            });
            setListAgencySelected(newAgency);
          }}
          className="h-11 w-24"
          type="number"
          disabled={getValues("isDefaultPrice")}
        />
      ),
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "discountPrice",
      key: "discountPrice",
      render: (value, record) => (
        <CustomInput
          value={value}
          onChange={(value) => {
            const newAgency = listAgencySelected.map((item) => {
              if (item.id === record.id && item.isGroup === record.isGroup) {
                return {
                  ...item,
                  discountPrice: value,
                };
              }
              return item;
            });
            setListAgencySelected(newAgency);
          }}
          className="h-11 w-24"
          type="number"
          disabled={getValues("isDefaultPrice")}
        />
      ),
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => (
        <div className="flex gap-3">
          {
            <div
              className="w-5 flex-shrink-0 cursor-pointer"
              onClick={() => {
                const newAgency = listAgencySelected
                  .map((item) => {
                    if (item.id === record.id && item.isGroup === record.isGroup) {
                      return null;
                    }
                    return item;
                  })
                  .filter((item) => item);
                setListAgencySelected(newAgency);
              }}
            >
              <Image src={DeleteIcon} />
            </div>
          }
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (productSelected && getValues("productUnitId")) {
      const productUnit = productSelected?.product?.productUnit?.find((item) => item.id === getValues("productUnitId"));
      let inventory = 0;
      const mainInventory = productSelected?.quantity * productSelected?.exchangeValue;
      if (productUnit?.isBaseUnit) {
        inventory = Math.floor(mainInventory / productUnit?.exchangeValue);
      } else {
        inventory = Math.floor(mainInventory / productUnit?.exchangeValue);
      }
      setNoBatchInventory(inventory);
      setValue("price", productUnit?.price, { shouldValidate: true });
    }
  }, [productSelected, getValues("productUnitId")]);

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">{id ? "Cập nhật" : "thêm mới"} CẤU HÌNH SẢN PHẨM LÊN CHỢ</div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push("/markets/setting")}>
            Hủy bỏ
          </CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading}>
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className="mb-5 grid grid-cols-2 gap-x-[42px] gap-y-5">
            <div>
              <Label infoText="" label="Sản phẩm" required />
              <CustomAutocomplete
                onSelect={(value) => {
                  onSelectedProduct(value);
                }}
                onSearch={(value) => {
                  setSearchKeyword(value);
                  onSearch(value);
                }}
                showSearch={true}
                className="h-11  !rounded bg-white text-base"
                wrapClassName="w-full"
                suffixIcon={<Image src={SearchIcon} />}
                disabled={id ? true : false}
                placeholder="Tìm kiếm sản phẩm"
                options={products?.data?.items?.map((item) => ({
                  value: JSON.stringify(item),
                  label: (
                    <div className="flex items-center gap-x-4 p-2">
                      <div className=" flex h-12 w-[68px] flex-shrink-0 items-center rounded border border-gray-300 p-[2px]">
                        {item.product?.image?.path && (
                          <Image
                            src={getImage(item.product?.image?.path)}
                            height={40}
                            width={68}
                            alt=""
                            objectFit="cover"
                          />
                        )}
                      </div>

                      <div>
                        <div className="mb-2 flex gap-x-3">
                          <div>
                            <span>{item.code}</span> {" - "}
                            <span>{sliceString(item.product.name, 80)}</span>
                          </div>
                          <div className="rounded bg-red-main px-2 py-[2px] text-white">
                            {item.productUnit.unitName}
                          </div>
                          {item.quantity <= 0 && <div className="rounded text-red-main py-[2px] italic">Hết hàng</div>}
                        </div>

                        <div className="flex gap-x-3">
                          <div>Số lượng: {formatNumber(item.quantity)}</div>
                          <div>|</div>
                          <div>Giá: {formatMoney(item.productUnit.price)}</div>
                        </div>
                      </div>
                    </div>
                  ),
                }))}
                value={searchKeyword}
                isLoading={isLoadingProduct}
                listHeight={512}
                popupClassName="search-product"
              />
              <InputError error={errors.productId?.message} />
            </div>
            <div>
              <Label infoText="" label="Nhóm sản phẩm" />
              <CustomInput
                onChange={() => {}}
                value={productSelected?.product?.groupProduct?.name}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhóm sản phẩm"
                disabled
              />
            </div>
            <div>
              <Label infoText="" label="Đơn vị" required />
              <CustomSelect
                onChange={(value) => {
                  // change inventory of batch when change product unit
                  const newBatch = listBatchSelected.map((item) => {
                    return {
                      ...item,
                    };
                  });
                  setListBatchSelected(newBatch);
                  setValue("productUnitId", value, { shouldValidate: true });
                }}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn đơn vị"
                options={productSelected?.product?.productUnit?.map((item) => {
                  return {
                    label: item.unitName,
                    value: item.id,
                  };
                })}
                value={getValues("productUnitId")}
              />
              <InputError error={errors.productUnitId?.message} />
            </div>
            <div>
              <Label infoText="" label="Lô" />
              <div className="flex gap-2">
                <div className="w-fit">
                  <CustomButton
                    outline
                    onClick={() => setOpenListBatchModal(true)}
                    className="!h-11 p-1"
                    disabled={productSelected?.batches?.length > 0 ? false : true}
                    type={productSelected?.batches?.length > 0 ? "danger" : "disable"}
                  >
                    Chọn lô
                  </CustomButton>
                </div>
                <div className="flex gap-1 flex-wrap">
                  {listBatchSelected &&
                    listBatchSelected.length > 0 &&
                    listBatchSelected.map((batch) => (
                      <div
                        key={batch.batchId}
                        className="flex min-w-fit items-center rounded bg-red-main py-1 px-2 text-white"
                      >
                        <span className="mr-2">
                          {batch?.name} - {batch?.expiryDate} - SL: {batch.quantity}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div>
              <Label
                infoText=""
                label={`Số lượng tồn ${
                  productSelected?.batches?.length < 1 ? `(Tồn: ${formatNumber(noBatchInventory)})` : ""
                }`}
                required
              />
              <CustomInput
                placeholder="Nhập số lượng tồn"
                className="h-11"
                type="number"
                onChange={(value) => {
                  // update quantity of batch selected
                  const newBatch = listBatchSelected.slice(0, 1).map((item) => {
                    return {
                      ...item,
                      quantity: value,
                    };
                  });
                  setListBatchSelected(newBatch);
                  setValue(
                    "batches",
                    newBatch?.map((item) => ({
                      batchId: item?.id,
                      quantity: item?.quantity,
                    })),
                    { shouldValidate: true },
                  );
                  setValue("quantity", value, { shouldValidate: true });
                }}
                value={getValues("quantity")}
              />
              <InputError error={errors.quantity?.message} />
            </div>

            {isAgency && (
              <div>
                <Label infoText="" label="Loại chợ" required />
                <CustomSelect
                  onChange={(value) => {
                    setValue("marketType", value, { shouldValidate: true });
                  }}
                  className="suffix-icon h-11 !rounded"
                  suffixIcon={
                    <div className="flex items-center">
                      <Image src={ArrowDownIcon} />
                    </div>
                  }
                  value={getValues("marketType")}
                  options={[
                    { label: "Chợ", value: "common" },
                    {
                      label: "Chợ hàng điểm",
                      value: "private",
                      disabled: isAgency ? false : true,
                    },
                  ]}
                />
              </div>
            )}
            <div>
              <Label infoText="" label="Giá khuyến mãi" />
              <CustomInput
                placeholder="Nhập giá khuyến mãi"
                className="h-11"
                value={getValues("discountPrice")}
                type="number"
                onChange={(value) => setValue("discountPrice", value, { shouldValidate: true })}
              />
              <InputError error={errors.discountPrice?.message} />
            </div>

            <div>
              <Label infoText="" label="Giá bán trên chợ" required />
              <CustomInput
                placeholder="Nhập giá bán"
                className="h-11"
                type="number"
                value={getValues("price")}
                onChange={(value) => setValue("price", value, { shouldValidate: true })}
              />
              <InputError error={errors.price?.message} />
            </div>
            {getValues("marketType") === "private" && (
              <>
                <div className="">
                  <div className="flex items-center gap-2 h-11">
                    <CustomCheckbox
                      checked={getValues("isDefaultPrice") ? false : true}
                      onChange={(e) =>
                        setValue("isDefaultPrice", !e.target.checked, {
                          shouldValidate: true,
                        })
                      }
                    />
                    <span>Set giá riêng cho từng đại lý</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {getValues("marketType") === "private" && (
            <div className="mb-5">
              <CustomTable
                dataSource={
                  listAgencySelected.map((item: any, index) => ({
                    ...item,
                    key: index + 1,
                  })) || []
                }
                columns={columns}
                scroll={{ x: 500 }}
                loading={isLoading}
              />

              <div className="w-fit mt-3">
                <CustomButton
                  className="!border-0"
                  onClick={() => setOpenAgencyModal(true)}
                  prefixIcon={<Image src={PlusCircleIcon} />}
                  outline
                >
                  Thêm đại lý
                </CustomButton>
              </div>
            </div>
          )}

          <div>
            <Label infoText="" label="Mô tả" />
            <CustomEditor
              value={getValues("description")}
              onChange={(value) => {
                setValue("description", value, { shouldValidate: true });
              }}
            />
            {/* <CustomTextarea rows={10} placeholder="Nhập mô tả" value={getValues('description')} onChange={(e) => setValue('description', e.target.value, { shouldValidate: true })} /> */}
            <InputError error={errors.description?.message} />
          </div>
        </div>

        <div
          className="flex h-fit w-1/3 max-w-[360px] flex-col bg-white p-5 flex-shrink-0"
          style={{
            boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Hình ảnh minh họa</div>
            <CustomUpload
              onChangeValue={(value) => {
                // validate if value size > 2MB
                if (+value.size > 2 * 1024 * 1024) {
                  setError("thumbnail", {
                    type: "manual",
                    message: "Dung lượng ảnh không được lớn hơn 2MB",
                  });
                  return;
                }
                setValue("thumbnail", value, { shouldValidate: true });
              }}
              fileUrl={productDetail?.data?.item?.imageCenter?.filePath || null}
              values={
                productDetail?.data?.item?.imageCenter?.filePath
                  ? [productDetail?.data?.item?.imageCenter?.path || imageCenterPath]
                  : [productDetail?.data?.item?.imageCenter?.filePath]
              }
            >
              <div
                className={
                  "flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5"
                }
              >
                <Image src={PhotographIcon} alt="" />
                <div className="font-semibold">
                  <span className="text-[#E03]">Tải ảnh lên</span>{" "}
                  <span className="text-[#6F727A]">hoặc kéo và thả</span>
                </div>
                <div className="font-thin text-[#6F727A]">PNG, JPG, GIF up to 2MB</div>
              </div>
            </CustomUpload>
            <InputError error={errors.thumbnail?.message} />
          </div>

          <div className="-mx-1 flex mt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="w-1/3 px-1 ">
                <CustomUpload
                  onChangeValue={(value) => {
                    const images: any = cloneDeep(getValues("images"));
                    images[index] = value;
                    setValue("images", images, { shouldValidate: true });
                  }}
                  values={[productDetail?.data?.item?.images ? productDetail?.data?.item?.images[index]?.path : null]}
                >
                  <div className="flex h-[90px] w-full items-center justify-center rounded-md border-2 border-dashed border-[#9CA1AD]">
                    <Image src={PhotographIcon} alt="" />
                  </div>
                </CustomUpload>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ListBatchModal
        isOpen={openListBatchModal}
        onCancel={() => setOpenListBatchModal(false)}
        selectedProduct={productSelected}
        productUnit={getValues("productUnitId")}
        onSave={(listBatch: IBatch[]) => {
          const newListBatch = listBatch
            .filter((item) => item.isSelected)
            .map((item) => ({
              batchId: item.id,
              quantity: item.quantity,
            }));
          const totalQuantity = newListBatch.reduce((total, item) => total + item.quantity, 0);
          setListBatchSelected(listBatch.filter((item) => item.isSelected));
          setValue("batches", newListBatch, { shouldValidate: true });
          setValue("quantity", totalQuantity, { shouldValidate: true });
        }}
        listBatchSelected={listBatchSelected}
      />

      <AgencyModal
        isOpen={openAgencyModal}
        onCancel={() => setOpenAgencyModal(false)}
        isLoading={isLoading}
        onSuccess={() => setOpenAgencyModal(false)}
        onSave={(data) => {
          const newData = data.map((item) => {
            return {
              ...item,
              price: getValues("price"),
              discountPrice: getValues("discountPrice"),
            };
          });
          // check agency exist
          const agencyExist = newData
            .filter((item) => item.isGroup === false)
            .find((item) => listAgencySelected.some((agency) => agency.id === item.id));
          const agencyGroupExist = newData
            .filter((item) => item.isGroup === true)
            .find((item) => listAgencySelected.some((agency) => agency.isGroup === true && agency.id === item.id));
          if (agencyExist) {
            message.error(`Đại lý "${agencyExist?.agency?.name}" đã tồn tại`);
            return;
          } else if (agencyGroupExist) {
            message.error(`Nhóm đại lý "${agencyGroupExist?.name}" đã tồn tại`);
            return;
          }
          setListAgencySelected([...listAgencySelected, ...newData]);
          setOpenAgencyModal(false);
        }}
      />
    </>
  );
}
