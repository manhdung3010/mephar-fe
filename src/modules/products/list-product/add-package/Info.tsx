import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { getCountries } from '@/api/address.service';
import {
  getGroupProduct,
  getManufacture,
  getPosition,
} from '@/api/product.service';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import InfoIcon from '@/assets/info-circle.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import RemoveGrayIcon from '@/assets/remove-gray.svg';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomUpload } from '@/components/CustomUpload';
import NormalUpload from '@/components/CustomUpload/NormalUpload';
import InputError from '@/components/InputError';
import { randomString } from '@/helpers';

import Label from '../../../../components/CustomLabel';
import { defaultUnit } from '../add-medicine/Info';
import { AddGroupProductModal } from '../components/AddGroupProduct';
import { AddManufactureModal } from '../components/AddManufacture';
import { AddPositionModal } from '../components/AddPositionModal';
import { CustomAutocomplete } from '@/components/CustomAutocomplete';
import { getMedicineCategory } from '@/api/medicine-category.service';
import { LoadingIcon } from '@/components/LoadingIcon';
import { getPointStatus } from '@/api/point.service';

const Info = ({
  useForm,
  groupProductName,
  positionName,
  manufactureName,
  countryName,
  selectedMedicineCategory,
  setSelectedMedicineCategory,
  isCopy,
  images

}: any) => {
  const { getValues, setValue, errors } = useForm;
  const [isPoint, setIsPoint] = useState(false);

  const [listUnit, setListUnit] = useState<any>(
    defaultUnit(getValues('productUnits'))
  );

  console.log("images", images)

  const [isOpenAddGroupProduct, setIsOpenAddGroupProduct] = useState(false);
  const [isOpenAddPosition, setIsOpenAddPosition] = useState(false);
  const [isOpenManufactureModal, setIsOpenManufactureModal] = useState(false);

  const [groupProductKeyword, setGroupProductKeyword] = useState();
  const [positionKeyword, setPositionKeyword] = useState();
  const [manufactureKeyword, setManufactureKeyword] = useState();
  const [countryKeyword, setCountryKeyword] = useState();
  const [medicineCategoryKeyword, setMedicineCategoryKeyword] = useState<string>();

  useEffect(() => {
    setGroupProductKeyword(groupProductName);
  }, [groupProductName]);

  useEffect(() => {
    setPositionKeyword(positionName);
  }, [positionName]);

  useEffect(() => {
    setManufactureKeyword(manufactureName);
  }, [positionName]);

  useEffect(() => {
    setCountryKeyword(countryName);
  }, [countryName]);

  const { data: groupProduct } = useQuery(
    ['GROUP_PRODUCT', groupProductKeyword],
    () => getGroupProduct({ page: 1, limit: 20, keyword: groupProductKeyword })
  );
  const { data: positions } = useQuery(['POSITION', positionKeyword], () =>
    getPosition({ page: 1, limit: 20, keyword: positionKeyword })
  );
  const { data: manufactures } = useQuery(
    ['MANUFACTURE', manufactureKeyword],
    () => getManufacture({ page: 1, limit: 20, keyword: manufactureKeyword })
  );

  const { data: countries } = useQuery(['COUNTRIES', countryKeyword], () =>
    getCountries({ page: 1, limit: 20, keyword: countryKeyword })
  );

  const { data: pointStatus, isLoading: isLoadingPointDetail } = useQuery(
    ['POINT_STATUS'],
    () => getPointStatus(),
  );

  useEffect(() => {
    if (pointStatus?.data?.type === "product") {
      setIsPoint(true);
    }
  }, [pointStatus?.data?.type]);

  const getCategoryKeyword = useCallback(
    debounce((keyword) => {
      return setMedicineCategoryKeyword(keyword)
    }, 300),
    []
  );

  const { data: exampleProduct, isLoading: isLoadingSearchMedicine } = useQuery(
    ['SEARCH_PRODUCT_MEDICINE', medicineCategoryKeyword],
    () =>
      getMedicineCategory({
        name: medicineCategoryKeyword,
        page: 1,
        limit: 20,
      })
  );

  const onChangeUnit = (unitKey, objectKey, value) => {
    const units: any = { ...listUnit };

    units[unitKey][objectKey] = value;
    setValue('productUnits', Object.values(units), { shouldValidate: true });
    setListUnit(units);
  };

  useEffect(() => {
    if (
      getValues('productUnits') &&
      getValues('productUnits').length !== Object.keys(listUnit).length
    ) {
      setListUnit(getValues('productUnits'));
    }
  }, [getValues('productUnits')]);

  console.log('values', getValues());

  return (
    <div className="mt-5">
      <div className="grid grid-cols-2 gap-x-[42px] gap-y-5">
        <div>
          <Label infoText="" label="Mã hàng" />
          <CustomInput
            placeholder="Mã hàng tự động"
            className="h-11"
            onChange={(e) =>
              setValue('code', e, {
                shouldValidate: true,
              })
            }
            value={getValues('code')}
          />
        </div>
        <div>
          <Label infoText="" label="Mã vạch" />
          <CustomInput
            placeholder="Mã vạch tự động"
            className="h-11"
            onChange={(e) =>
              setValue('barCode', e, {
                shouldValidate: true,
              })
            }
            value={getValues('barCode')}
          />
          <InputError error={errors?.barCode?.message} />
        </div>
        {/* <div>
          <Label infoText="" label="Tên hàng hóa" required />
          <CustomInput
            className="!h-11"
            placeholder="Nhập tên thuốc"
            onChange={(e) =>
              setValue('name', e, {
                shouldValidate: true,
              })
            }
            value={getValues('name')}
          />
          <InputError error={errors?.name?.message} />
        </div> */}

        <div>
          <Label infoText="" label="Tên hàng hóa" required />
          <CustomInput
            placeholder="Nhập tên hàng hóa"
            className="h-11"
            onChange={(e) =>
              setValue('name', e, {
                shouldValidate: true,
              })
            }
            value={getValues('name')}
          />
          <InputError error={errors?.name?.message} />
        </div>


        <div>
          <Label infoText="" label="Tên viết tắt" />
          <CustomInput
            placeholder="Nhập tên viết tắt"
            className="h-11"
            onChange={(e) =>
              setValue('shortName', e, {
                shouldValidate: true,
              })
            }
            value={getValues('shortName')}
          />
          <InputError error={errors?.shortName?.message} />
        </div>
        <div>
          <Label infoText="" label="Nhóm" />
          <CustomSelect
            onChange={(value) =>
              setValue('groupProductId', value, { shouldValidate: true })
            }
            options={groupProduct?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            onSearch={debounce((value) => {
              setGroupProductKeyword(value);
            }, 300)}
            className="suffix-icon h-11 !rounded"
            placeholder="Nhóm sản phẩm"
            suffixIcon={
              <div className="flex items-center">
                <Image src={ArrowDownIcon} alt="" />
                <Image
                  src={PlusCircleIcon}
                  alt=""
                  onClick={() => setIsOpenAddGroupProduct(true)}
                />
              </div>
            }
            value={getValues('groupProductId')}
          />
          <InputError error={errors?.groupProductId?.message} />
        </div>

        <div>
          <Label infoText="" label="Vị trí" />
          <CustomSelect
            onChange={(value) =>
              setValue('positionId', value, { shouldValidate: true })
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
            value={getValues('positionId')}
          />
          <InputError error={errors?.positionId?.message} />
        </div>
        <div>
          <Label infoText="" label="Giá vốn" />
          <CustomInput
            placeholder="Nhập giá vốn"
            className="h-11"
            onChange={(e) =>
              setValue('primePrice', e, {
                shouldValidate: true,
              })
            }
            value={getValues('primePrice')}
            type="number"
          />
          <InputError error={errors?.primePrice?.message} />
        </div>
        <div>
          <Label infoText="" label="Giá bán" required />
          <CustomInput
            placeholder="Nhập giá bán"
            className="h-11"
            onChange={(e) =>
              setValue('price', e, {
                shouldValidate: true,
              })
            }
            value={getValues('price')}
            type="number"
          />
          <InputError error={errors?.price?.message} />
        </div>
        <div>
          <Label infoText="" label="Trọng lượng" />
          <CustomInput
            placeholder="Nhập trọng lượng"
            className="h-11"
            onChange={(e) =>
              setValue('weight', e, {
                shouldValidate: true,
              })
            }
            value={getValues('weight')}
          />
          <InputError error={errors?.weight?.message} />
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
          />
          <InputError error={errors?.packingSpecification?.message} />
        </div>
        <div>
          <div className="mb-2 font-medium text-[#15171A]">Hãng sản xuất</div>
          <CustomSelect
            onChange={(value) =>
              setValue('manufactureId', value, { shouldValidate: true })
            }
            options={manufactures?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            onSearch={debounce((value) => {
              setManufactureKeyword(value);
            }, 300)}
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
          />
        </div>
        <div>
          <div className="mb-2 font-medium text-[#15171A]">Nước sản xuất</div>
          <CustomSelect
            onChange={(value) =>
              setValue('countryId', value, { shouldValidate: true })
            }
            showSearch={true}
            onSearch={debounce((value) => {
              setCountryKeyword(value);
            }, 300)}
            options={countries?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            className="suffix-icon h-11 !rounded"
            placeholder="Nhập tên nước"
            value={getValues('countryId')}
          />
        </div>

        {!getValues('isBatchExpireControl') && (
          <div>
            <Label infoText="" label="Tồn kho" required />
            <CustomInput
              className=" h-11"
              placeholder="Tồn kho"
              onChange={(e) =>
                setValue('inventory', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('inventory')}
              type="number"
            />
            <InputError error={errors?.inventory?.message} />
          </div>
        )}

        {getValues('isBatchExpireControl') && (
          <div>
            <Label infoText="" label="Cảnh báo hết hạn" required />

            <CustomInput
              placeholder="Thời điểm cảnh báo hết hạn"
              wrapClassName="grow"
              className="h-11"
              onChange={(e) =>
                setValue('expiryPeriod', e, {
                  shouldValidate: true,
                })
              }
              value={getValues('expiryPeriod')}
              type="number"
              suffix="Ngày"
            />
            <InputError error={errors?.expiryPeriod?.message} />
          </div>
        )}
        {
          isPoint && (
            <div>
              <Label infoText="" label="Điểm" />
              <CustomInput
                placeholder="Nhập điểm"
                wrapClassName="grow"
                className="h-11"
                onChange={(e) =>
                  setValue('point', e, {
                    shouldValidate: true,
                  })
                }
                value={getValues('point')}
                type="number"
              />
            </div>
          )
        }
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-[42px]">
        <div>
          <Label infoText="" label="Hình ảnh minh họa" />
          <CustomUpload
            className="!w-fit"
            onChangeValue={(value) =>
              setValue('imageId', value, { shouldValidate: true })
            }
            values={[images?.path]}
            fileUrl={getValues('imageUrl')}
          >
            <NormalUpload className="!h-[160px] w-[360px] py-0" />
          </CustomUpload>
        </div>

        <div className="text-sm font-medium text-[#616266]">
          <div className="mt-5 flex gap-x-2">
            <CustomCheckbox
              onChange={(e) =>
                setValue('isBatchExpireControl', e.target.checked, {
                  shouldValidate: true,
                })
              }
              checked={getValues('isBatchExpireControl')}
            />
            <div>Lô, hạn sử dụng</div>
            <Image src={InfoIcon} alt="" />
          </div>
          {
            pointStatus?.data?.status === "active" && (
              <div className="mt-2 flex gap-x-2">
                <CustomCheckbox
                  onChange={(e) =>
                    setIsPoint(e.target.checked)
                  }
                  checked={isPoint}
                />
                <div>Tích điểm</div>
                <Image src={InfoIcon} alt="" />
              </div>
            )
          }
          {/* <div className="mt-2 flex gap-x-2">
            <CustomCheckbox
              onChange={(e) =>
                setValue('isDirectSale', e.target.checked, {
                  shouldValidate: true,
                })
              }
              checked={getValues('isDirectSale')}
            />
            <div>Bán trực tiếp</div>
          </div> */}
        </div>
      </div>

      <div>
        <div className="relative mt-5">
          <Label infoText="" label="Đơn vị cơ bản" required />
          <CustomInput
            placeholder="Nhập đơn vị cơ bản"
            className="!h-11 w-[calc((100%-42px)/2)]"
            onChange={(e) =>
              setValue('baseUnit', e, {
                shouldValidate: true,
              })
            }
            value={getValues('baseUnit')}
          />
          {/* <div className="absolute bottom-0 left-[calc((100%-42px)/2+12px)] flex gap-2">
            <CustomCheckbox
              onChange={(e) =>
                setValue('isDirectSale', e.target.checked, {
                  shouldValidate: true,
                })
              }
              checked={getValues('isDirectSale')}
            />
            <div>Bán trực tiếp</div>
            <Image src={InfoIcon} alt="" />
          </div> */}
        </div>
        <InputError error={errors.baseUnit?.message} />
      </div>

      <div className="my-5 flex flex-col gap-2 font-medium">
        <div className="flex bg-[#FBECEE]">
          <div className="flex-1 p-4">Tên đơn vị</div>
          <div className="flex-1 p-4">Giá trị quy đổi</div>
          <div className="flex-1 p-4">Giá bán</div>
          <div className="flex-1 p-4">Mã hàng</div>
          <div className="flex-1 p-4">Mã vạch</div>
          <div className="flex-1 p-4">Điểm</div>
          <div className="flex-[2] p-4"></div>
        </div>

        {Object.keys(listUnit)?.map((unitKey, index) => (
          <div key={unitKey}>
            <div className="flex gap-3">
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'unitName', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].unitName}
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'exchangeValue', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].exchangeValue}
                type="number"
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'price', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={
                  listUnit[unitKey].price !== undefined
                    ? listUnit[unitKey].price
                    : Number(getValues('price') || 0) *
                    Number(listUnit[unitKey].exchangeValue || 0)
                }
                type="number"
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'code', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={isCopy ? null : listUnit[unitKey].code}
                placeholder='Mã hàng tự động'
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'barCode', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={isCopy ? null : listUnit[unitKey].barCode}
                placeholder='Mã vạch tự động'
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'point', e)}
                wrapClassName="flex-1"
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].point}
                bordered={false}
                type="number"
              />

              <div className="flex flex-[2] items-end justify-center gap-4">
                {/* <div className="flex gap-2">
                  <CustomCheckbox
                    onChange={(e) =>
                      onChangeUnit(unitKey, 'isDirectSale', e.target.checked)
                    }
                    checked={listUnit[unitKey].isDirectSale}
                  />
                  <div>Bán trực tiếp</div>
                  <Image src={InfoIcon} alt="" />
                </div> */}

                <Image
                  src={RemoveGrayIcon}
                  alt=""
                  onClick={() => {
                    const units = { ...listUnit };
                    delete units[unitKey];

                    setValue('productUnits', Object.values(units), {
                      shouldValidate: true,
                    });
                    setListUnit(units);
                  }}
                  className=" cursor-pointer"
                />
              </div>
            </div>
            <InputError
              error={
                errors?.productUnits &&
                (errors?.productUnits[index]?.unitName?.message ||
                  errors?.productUnits[index]?.exchangeValue?.message ||
                  errors?.productUnits[index]?.code?.message ||
                  errors?.productUnits[index]?.barCode?.message)
              }
            />
          </div>
        ))}
      </div>
      <div
        onClick={() => {
          const units = { ...listUnit };
          units[randomString()] = {
            unitName: '',
            exchangeValue: undefined,
            code: undefined,
            barCode: undefined,
            point: undefined,
            price: undefined,
            isDirectSale: false,
            isBaseUnit: false,
          };

          setValue('productUnits', Object.values(units), {
            shouldValidate: true,
          });
          setListUnit(units);
        }}
        className="flex cursor-pointer gap-3 text-[16px] font-semibold text-[#D64457]"
      >
        <Image src={PlusCircleIcon} alt="" />
        <div>Thêm đơn vị</div>
      </div>

      <AddManufactureModal
        isOpen={isOpenManufactureModal}
        onCancel={() => setIsOpenManufactureModal(false)}
        setManufactureKeyword={setManufactureKeyword}
        setProductValue={setValue}
      />

      <AddGroupProductModal
        isOpen={isOpenAddGroupProduct}
        onCancel={() => setIsOpenAddGroupProduct(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />

      <AddPositionModal
        isOpen={isOpenAddPosition}
        onCancel={() => setIsOpenAddPosition(false)}
        setPositionKeyword={setPositionKeyword}
        setProductValue={setValue}
      />
    </div>
  );
};

export default Info;
