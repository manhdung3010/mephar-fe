import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import { getCountries } from '@/api/address.service';
import {
  createProduct,
  getManufacture,
  getProductDetail,
  updateProduct,
} from '@/api/product.service';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import Tab from '@/components/CustomTab';
import { CustomUpload } from '@/components/CustomUpload';
import NormalUpload from '@/components/CustomUpload/NormalUpload';
import { EProductStatus, EProductType } from '@/enums';
import { branchState } from '@/recoil/state';

import { AddManufactureModal } from '../components/AddManufacture';
import Detail from './Detail';
import Info from './Info';
import { schema } from './schema';

const AddMedicine = ({
  productId,
  isCopy,
}: {
  productId?: string;
  isCopy?: boolean;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);

  const {
    getValues,
    setValue,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      status: EProductStatus.active,
      type: EProductType.MEDICINE,
      isDirectSale: false,
      isBatchExpireControl: true,
      expiryPeriod: 180,
    },
  });

  const [isOpenManufactureModal, setIsOpenManufactureModal] = useState(false);
  const [manufactureKeyword, setManufactureKeyword] = useState();
  const [countryKeyword, setCountryKeyword] = useState();
  const [selectedMedicineCategory, setSelectedMedicineCategory] =
    useState<any>();

  const { data: manufactures } = useQuery(
    ['MANUFACTURE', manufactureKeyword],
    () => getManufacture({ page: 1, limit: 20, keyword: manufactureKeyword })
  );

  const { data: countries } = useQuery(['COUNTRIES', countryKeyword], () =>
    getCountries({ page: 1, limit: 20, keyword: countryKeyword })
  );

  const { data: productDetail } = useQuery(
    ['DETAIL_PRODUCT', productId],
    () => getProductDetail(Number(productId)),
    { enabled: !!productId }
  );

  useEffect(() => {
    if (selectedMedicineCategory) {
      const record = JSON.parse(selectedMedicineCategory);

      Object.keys(schema.fields).forEach((key: any) => {
        if (![undefined, null].includes(record[key]) && key !== 'type') {
          if (key !== "code") {
            setValue(key, record[key], {
              shouldValidate: true,
            });
          }
        }
      });

      setManufactureKeyword(record?.manufacture?.name);
      setCountryKeyword(record?.country?.name);

      setValue('baseUnit', record?.unit?.name, {
        shouldValidate: true,
      });
    }
  }, [selectedMedicineCategory]);

  useEffect(() => {
    if (productDetail?.data) {
      Object.keys(schema.fields).forEach((key: any) => {
        if (
          ![undefined, null].includes(productDetail.data[key]) &&
          key !== 'productUnits'
        ) {
          if (isCopy && ['code', 'barCode'].includes(key)) {
            // nothing
          } else {
            setValue(key, productDetail.data[key], {
              shouldValidate: true,
            });
          }
        }
      });

      const productUnits = productDetail.data?.productUnit?.filter(
        (unit) => !unit.isBaseUnit
      );

      setManufactureKeyword(productDetail?.data?.productManufacture?.name);
      setCountryKeyword(productDetail?.data?.country?.name);

      setValue('productUnits', productUnits, { shouldValidate: true });
    }
  }, [productDetail]);

  const { mutate: mutateCreateMedicine, isLoading: isLoadingCreateMedicine } =
    useMutation(
      () => {
        const payload = {
          ...getValues(),
          branchId,
          productUnits: [
            ...(getValues('productUnits') || []),
            {
              id: productDetail?.data?.productUnit?.find(
                (unit) => unit.isBaseUnit
              )?.id,
              unitName: getValues('baseUnit'),
              code: '',
              price: getValues('price'),
              barCode: '',
              point: '',
              exchangeValue: 1,
              isDirectSale: getValues('isDirectSale'),
              isBaseUnit: true,
            },
          ],
        };
        delete payload.isDirectSale;

        return productDetail && !isCopy
          ? updateProduct(productDetail?.data?.id, payload)
          : createProduct(payload);
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(['LIST_PRODUCT']);
          reset();

          router.push('/products/list');
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    mutateCreateMedicine();
  };

  const title = useMemo(() => {
    if (isCopy) return 'Sao chép hàng hóa';

    return productDetail ? 'Cập nhật thuốc' : 'Thêm mới thuốc';
  }, [productDetail, isCopy]);

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">{title}</div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            onClick={() => router.push('/products/list')}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton outline={true}>
            Lưu và đưa sản phẩm lên chợ
          </CustomButton>
          <CustomButton
            disabled={isLoadingCreateMedicine}
            onClick={() => {
              const productUnits = getValues('productUnits')?.map((unit) => {
                return {
                  ...unit,
                  price: !unit.price
                    ? Number(unit.exchangeValue) * Number(getValues('price'))
                    : unit.price,
                };
              });

              setValue('productUnits', productUnits, {
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
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Tab
            menu={['Thông tin', 'Mô tả chi tiết']}
            components={[
              <Info
                useForm={{
                  getValues,
                  setValue,
                  errors,
                  setError,
                }}
                key="0"
                selectedMedicineCategory={selectedMedicineCategory && JSON.parse(selectedMedicineCategory)}
                setSelectedMedicineCategory={setSelectedMedicineCategory}
                groupProductName={productDetail?.data?.groupProduct?.name}
                dosageName={productDetail?.data?.productDosage?.name}
                positionName={productDetail?.data?.productPosition?.name}
              />,
              <Detail
                key="1"
                useForm={{
                  getValues,
                  setValue,
                  errors,
                }}
              />,
            ]}
          />
        </div>
        <div
          className="flex h-fit flex-1 flex-col gap-5 bg-white p-5"
          style={{
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <div>
            <div className="mb-2 font-medium text-[#15171A]">
              Hình ảnh minh họa
            </div>
            <CustomUpload
              onChangeValue={(value) =>
                setValue('imageId', value, { shouldValidate: true })
              }
              values={[productDetail?.data?.image?.path]}
            >
              <NormalUpload className="!h-[200px]" />
            </CustomUpload>
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Số đăng ký</div>
            <CustomInput
              className=" h-11"
              placeholder="Nhập số đăng ký"
              onChange={(e) =>
                setValue('registerNumber', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('registerNumber')}
              disabled={true}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Hoạt chất</div>
            <CustomInput
              className=" h-11"
              placeholder="Nhập tên hoạt chất"
              onChange={(e) =>
                setValue('activeElement', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('activeElement')}
              disabled={true}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Hàm lượng</div>
            <CustomInput
              className=" h-11"
              placeholder="Nhập hàm lượng"
              onChange={(e) =>
                setValue('content', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('content')}
              disabled={true}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">
              Quy cách đóng gói
            </div>
            <CustomInput
              className=" h-11"
              placeholder="Quy cách đóng gói"
              onChange={(e) =>
                setValue('packingSpecification', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('packingSpecification')}
              disabled={true}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Hãng sản xuất</div>
            <CustomSelect
              onChange={(value) =>
                setValue('manufactureId', value, { shouldValidate: true })
              }
              showSearch={true}
              onSearch={debounce((value) => {
                setManufactureKeyword(value);
              }, 300)}
              options={manufactures?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              className="suffix-icon h-11 !rounded"
              placeholder="Nhập tên hãng"
              suffixIcon={
                <div className="flex items-center">
                  <Image src={ArrowDownIcon} alt="" />
                  <Image
                    src={PlusCircleIcon}
                    alt=""
                    onClick={() => setIsOpenManufactureModal(true)}
                  />
                </div>
              }
              value={getValues('manufactureId')}
              disabled={true}
            />
          </div>
          <div>
            <div className="mb-2 font-medium text-[#15171A]">Nước sản xuất</div>
            <CustomSelect
              onChange={(value) =>
                setValue('countryId', value, { shouldValidate: true })
              }
              options={countries?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              showSearch={true}
              onSearch={debounce((value) => {
                setCountryKeyword(value);
              }, 300)}
              className="h-11 !rounded"
              placeholder="Nhập tên nước"
              value={getValues('countryId')}
              disabled={true}
            />
          </div>
        </div>
      </div>

      <AddManufactureModal
        isOpen={isOpenManufactureModal}
        onCancel={() => setIsOpenManufactureModal(false)}
        setManufactureKeyword={setManufactureKeyword}
        setProductValue={setValue}
      />
    </>
  );
};

export default AddMedicine;
