import Image from 'next/image';

import { createConfigProduct, getConfigProductDetail } from '@/api/market.service';
import { getSaleProducts } from '@/api/product.service';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import PhotographIcon from '@/assets/photograph.svg';
import SearchIcon from '@/assets/searchIcon.svg';
import { CustomAutocomplete } from '@/components/CustomAutocomplete';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput, CustomTextarea } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomUpload } from '@/components/CustomUpload';
import InputError from '@/components/InputError';
import { formatMoney, formatNumber, getImage } from '@/helpers';
import { IBatch, ISaleProduct } from '@/modules/sales/interface';
import { branchState } from '@/recoil/state';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { cloneDeep, debounce } from 'lodash';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import ListBatchModal from './ListBatchModal';
import { schema } from './schema';
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
      marketType: 'common',
      images: [],
    },
  });
  const branchId = useRecoilValue(branchState)
  const queryClient = useQueryClient();
  const router = useRouter();

  const { id } = router.query;

  const [formFilter, setFormFilter] = useState({ page: 1, limit: 10, keyword: "", isSale: true });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [productSelected, setProductSelected] = useState<any>(null);
  const [openListBatchModal, setOpenListBatchModal] = useState(false);
  const [listBatchSelected, setListBatchSelected] = useState<any[]>([]);
  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(
    [
      "LIST_SALE_PRODUCT",
      formFilter.page,
      formFilter.limit,
      formFilter.keyword,
      branchId,
    ],
    () => getSaleProducts({ ...formFilter, branchId }),
  );

  const {
    data: productDetail,
    isLoading: isLoadingProductDetail,
  } = useQuery<{
    data?: { item: any };
  }>(
    [
      "CONFIG_PRODUCT_DETAIL",
      id,
    ],
    () => getConfigProductDetail(String(id)),
    {
      enabled: !!id,
    }
  );

  useEffect(() => {
    if (!productDetail && productSelected) {
      setListBatchSelected([]);
    }
  }, [productSelected])

  useEffect(() => {
    if (productDetail?.data?.item) {
      const { product, productUnit, productUnitId, batches, ...rest } = productDetail?.data?.item;
      // setValue('productId', product.id, { shouldValidate: true });
      // setValue('productUnitId', productUnit.id, { shouldValidate: true });
      const productSelected = getSaleProducts({ ...formFilter, productUnit: productUnitId, branchId }).then((res) => {
        onSelectedProduct(JSON.stringify(res.data.items[0]));
        const newBatches = batches.map((batch) => {
          const nBatch = res.data.items[0].batches.find((item) => item.id === batch.batchId);
          return {
            ...nBatch,
            originalQuantity: nBatch.quantity,
            quantity: batch.quantity,
          }
        });
        setListBatchSelected(newBatches);
        setValue('batches', batches, { shouldValidate: true });
      }
      );
      setValue('price', rest.price, { shouldValidate: true });
      rest.discountPrice > 0 && setValue('discountPrice', rest.discountPrice, { shouldValidate: true });
      setValue('quantity', rest.quantity, { shouldValidate: true });
      setValue('description', rest.description), { shouldValidate: true };
      setValue('marketType', rest.marketType, { shouldValidate: true });
      setValue('thumbnail', rest?.imageCenter?.id, { shouldValidate: true });
      setValue('images', rest.images, { shouldValidate: true });
      setProductSelected(productDetail?.data?.item);
    }
  }, [productDetail])

  console.log('listBatchSelected', listBatchSelected);

  const { mutate: mutateCreateConfigProduct, isLoading } =
    useMutation(
      () => {
        const payload = {
          ...getValues(),
        }
        if (!payload?.batches) {
          delete payload.batches;
        }

        return createConfigProduct({ ...getValues(), branchId });
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
      }
    );

  const onSearch = useCallback(
    debounce((value) => {
      setFormFilter((preValue) => ({
        ...preValue,
        keyword: value,
      }));
    }, 300),
    [formFilter]
  );

  const onSubmit = () => {
    if (productSelected?.batches?.length > 0 && listBatchSelected.length === 0) {
      message.error('Vui lòng chọn lô sản phẩm');
      return;
    }
    mutateCreateConfigProduct();
  }

  const onSelectedProduct = (value) => {
    const parseProduct = JSON.parse(value);
    setValue('productId', parseProduct.productId, { shouldValidate: true });
    setValue('productUnitId', parseProduct.productUnit?.id, { shouldValidate: true });
    setProductSelected(parseProduct);
    setFormFilter((pre) => ({ ...pre, keyword: "" }));
    setSearchKeyword(parseProduct?.product?.name);
  }
  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {id ? 'Cập nhật' : 'thêm mới'} CẤU HÌNH SẢN PHẨM LÊN CHỢ
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)}>Lưu</CustomButton>
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
                suffixIcon={
                  <Image src={SearchIcon} />
                }
                placeholder="Tìm kiếm sản phẩm"
                options={products?.data?.items?.map((item) => ({
                  value: JSON.stringify(item),
                  label: (
                    <div className="flex items-center gap-x-4 p-2">
                      <div className=" flex h-12 w-[68px] items-center rounded border border-gray-300 p-[2px]">
                        {item.product?.image?.path && (
                          <Image
                            src={getImage(
                              item.product?.image?.path
                            )}
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
                            <span>{item.product.name}</span>
                          </div>
                          <div className="rounded bg-red-main px-2 py-[2px] text-white">
                            {item.productUnit.unitName}
                          </div>
                          {item.quantity <= 0 && (
                            <div className="rounded text-red-main py-[2px] italic">
                              Hết hàng
                            </div>
                          )}
                        </div>

                        <div className="flex gap-x-3">
                          <div>
                            Số lượng: {formatNumber(item.quantity)}
                          </div>
                          <div>|</div>
                          <div>
                            Giá:{" "}
                            {formatMoney(item.productUnit.price)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                }))
                }
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
                onChange={() => { }}
                value={productSelected?.product?.groupProduct?.name}
                className="suffix-icon h-11 !rounded"
                placeholder="Nhóm sản phẩm"
                disabled
              />
            </div>
            <div>
              <Label infoText="" label="Đơn vị" required />
              <CustomSelect
                onChange={(value) => setValue('productUnitId', value, { shouldValidate: true })}
                className="suffix-icon h-11 !rounded"
                placeholder="Chọn đơn vị"
                options={productSelected?.product?.productUnit?.map((item) => {
                  return {
                    label: item.unitName,
                    value: item.id,
                  };
                })}
                value={getValues('productUnitId')}
              />
              <InputError error={errors.productUnitId?.message} />
            </div>
            <div>
              <Label infoText="" label="Lô" />
              <div className='flex gap-2'>
                <div className='w-fit'>
                  <CustomButton outline onClick={() => setOpenListBatchModal(true)} className='!h-11 p-1' disabled={productSelected?.batches?.length > 0 ? false : true} type={productSelected?.batches?.length > 0 ? 'danger' : 'disable'}>
                    Chọn lô
                  </CustomButton>
                </div>
                <div className='flex gap-1 flex-wrap'>
                  {
                    listBatchSelected && listBatchSelected.length > 0 && listBatchSelected.map((batch) => (
                      <div
                        key={batch.batchId}
                        className="flex min-w-fit items-center rounded bg-red-main py-1 px-2 text-white"
                      >
                        <span className="mr-2">
                          {batch?.name} - {batch?.expiryDate}{" "}
                          - SL: {batch.quantity}
                        </span>
                      </div>
                    ))
                  }
                </div>

              </div>
            </div>

            <div>
              <Label infoText="" label="Số lượng tồn" required />
              <CustomInput
                placeholder="Nhập số lượng tồn"
                className="h-11"
                type='number'
                onChange={(value) => setValue('quantity', value, { shouldValidate: true })}
                value={getValues('quantity')}
              />
              <InputError error={errors.quantity?.message} />
            </div>

            <div>
              <Label infoText="" label="Loại chợ" required />
              <CustomSelect
                onChange={() => { }}
                className="suffix-icon h-11 !rounded"
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} />
                  </div>
                }
                value={getValues('marketType')}
                options={[
                  { label: 'Chợ chung', value: 'common' },
                  { label: 'Chợ riêng', value: 'private' },
                ]}
              />
            </div>
            <div>
              <Label infoText="" label="Giá khuyến mãi" />
              <CustomInput
                placeholder="Nhập giá khuyến mãi"
                className="h-11"
                value={getValues('discountPrice')}
                type='number'
                onChange={(value) => setValue('discountPrice', value, { shouldValidate: true })}
              />
              <InputError error={errors.discountPrice?.message} />
            </div>

            <div>
              <Label infoText="" label="Giá bán trên chợ" required />
              <CustomInput
                placeholder="Nhập giá bán"
                className="h-11"
                type='number'
                value={getValues('price')}
                onChange={(value) => setValue('price', value, { shouldValidate: true })}
              />
              <InputError error={errors.price?.message} />
            </div>
          </div>

          <div>
            <Label infoText="" label="Mô tả" />
            <CustomTextarea rows={10} placeholder="Nhập mô tả" value={getValues('description')} onChange={(e) => setValue('description', e.target.value, { shouldValidate: true })} />
          </div>
        </div>

        <div
          className="flex h-fit w-1/3 max-w-[360px] flex-col bg-white p-5"
          style={{
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">
              Hình ảnh minh họa
            </div>
            <CustomUpload
              onChangeValue={(value) => {
                setValue('thumbnail', value, { shouldValidate: true })
              }}
              values={[productDetail?.data?.item?.imageCenter?.path]}
            >
              <div
                className={
                  'flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5'
                }
              >
                <Image src={PhotographIcon} alt="" />
                <div className="font-semibold">
                  <span className="text-[#E03]">Tải ảnh lên</span>{' '}
                  <span className="text-[#6F727A]">hoặc kéo và thả</span>
                </div>
                <div className="font-thin text-[#6F727A]">
                  PNG, JPG, GIF up to 2MB
                </div>
              </div>
            </CustomUpload>
            <InputError error={errors.thumbnail?.message} />
          </div>

          <div className="-mx-1 flex mt-2">
            {
              Array.from({ length: 3 }).map((_, index) => (
                <div className="w-1/3 px-1 ">
                  <CustomUpload
                    onChangeValue={(value) => {
                      const images: any = cloneDeep(getValues('images'));
                      images[index] = value;
                      setValue('images', images, { shouldValidate: true })
                    }}
                    values={[productDetail?.data?.item?.images[index]?.path]}
                  >
                    <div className="flex h-[90px] w-full items-center justify-center rounded-md border-2 border-dashed border-[#9CA1AD]">
                      <Image src={PhotographIcon} alt="" />
                    </div>
                  </CustomUpload>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      <ListBatchModal
        isOpen={openListBatchModal}
        onCancel={() => setOpenListBatchModal(false)}
        selectedProduct={productSelected}
        productUnit={getValues('productUnitId')}
        onSave={(listBatch: IBatch[]) => {
          const newListBatch = listBatch.filter((item) => item.isSelected).map((item) => ({
            batchId: item.id,
            quantity: item.quantity,
          }));
          setListBatchSelected(listBatch.filter((item) => item.isSelected));
          setValue('batches', newListBatch, { shouldValidate: true });
        }}
        listBatchSelected={listBatchSelected}
      />
    </>
  );
}
