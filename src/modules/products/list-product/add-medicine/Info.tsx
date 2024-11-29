/* eslint-disable prettier/prettier */
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

import { getMedicineCategory } from '@/api/medicine-category.service';
import {
  getDosage,
  getGroupProduct,
  getPosition,
} from '@/api/product.service';
import ArrowDownIcon from '@/assets/arrowDownGray.svg';
import DeleteRedIcon from '@/assets/deleteRed.svg';
import InfoIcon from '@/assets/info-circle.svg';
import PlusCircleIcon from '@/assets/plus-circle.svg';
import { CustomAutocomplete } from '@/components/CustomAutocomplete';
import { CustomCheckbox } from '@/components/CustomCheckbox';
import { CustomInput } from '@/components/CustomInput';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import { LoadingIcon } from '@/components/LoadingIcon';
import { randomString } from '@/helpers';

import Label from '../../../../components/CustomLabel';
import { AddDosageModal } from '../components/AddDosageModal';
import { AddGroupProductModal } from '../components/AddGroupProduct';
import { AddPositionModal } from '../components/AddPositionModal';
import { getPointStatus } from '@/api/point.service';

export enum EExpireDateType {
  STRING = 1,
  DATE = 2,
}

export const defaultUnit = (listUnit) => {
  const unitObject = {};

  if (listUnit) {
    Object.values(listUnit)?.forEach((unit) => {
      unitObject[randomString()] = unit;
    });
  } else {
    // unitObject[randomString()] = {
    //   unitName: '',
    //   exchangeValue: undefined,
    //   price: undefined,
    //   code: undefined,
    //   barCode: undefined,
    //   point: undefined,
    //   isDirectSale: false,
    //   isBaseUnit: false,
    // };
  }

  return unitObject;
};

const Info = ({ useForm, setSelectedMedicineCategory, selectedMedicineCategory, groupProductName, dosageName, positionName, drugCode, id, isCopy }: any) => {
  const { getValues, setValue, errors } = useForm;

  const [isOpenAddGroupProduct, setIsOpenAddGroupProduct] =
    useState(false);
  const [isOpenAddDosage, setIsOpenAddDosage] = useState(false);
  const [isOpenAddPosition, setIsOpenAddPosition] = useState(false);

  const [groupProductKeyword, setGroupProductKeyword] = useState(groupProductName);
  const [dosageKeyword, setDosageKeyword] = useState(dosageName);
  const [positionKeyword, setPositionKeyword] = useState(positionName);
  const [isPoint, setIsPoint] = useState(false);

  useEffect(() => {
    setGroupProductKeyword(groupProductName);
  }, [groupProductName]);

  useEffect(() => {
    setDosageKeyword(dosageName);
  }, [dosageName]);

  useEffect(() => {
    setPositionKeyword(positionName);
  }, [positionName]);

  const { data: pointStatus, isLoading: isLoadingPointDetail } = useQuery(
    ['POINT_STATUS'],
    () => getPointStatus(),
  );

  useEffect(() => {
    if (pointStatus?.data?.type === "product") {
      setIsPoint(true);
    }
  }, [pointStatus?.data?.type]);

  const { data: dosages } = useQuery(['DOSAGE', dosageKeyword], () =>
    getDosage({ page: 1, limit: 20, keyword: dosageKeyword })
  );
  const { data: positions } = useQuery(['POSITION', positionKeyword], () =>
    getPosition({ page: 1, limit: 20, keyword: positionKeyword })
  );
  const { data: groupProduct } = useQuery(['GROUP_PRODUCT', groupProductKeyword], () =>
    getGroupProduct({ page: 1, limit: 20, keyword: groupProductKeyword })
  );

  const [medicineCategoryKeyword, setMedicineCategoryKeyword] = useState<string>();

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

  const [listUnit, setListUnit] = useState<any>(
    defaultUnit(getValues('productUnits'))
  );

  const onChangeUnit = (unitKey, objectKey, value) => {
    const units: any = { ...listUnit };

    units[unitKey][objectKey] = value;
    setValue('productUnits', Object.values(units), { shouldValidate: true });
    setListUnit(units);
  };

  useEffect(() => {
    if (getValues('productUnits') && getValues('productUnits').length !== Object.keys(listUnit).length) {
      setListUnit(getValues('productUnits'));
    }
  }, [getValues('productUnits')]);

  useEffect(() => {
    if (!getValues('name')) {
      setSelectedMedicineCategory(null);
    }
  }, [getValues('name')])

  // useEffect(() => {
  //   if (getValues('price')) {
  //     setMainPrice(getValues('price'));
  //   }
  // }, [getValues('price')])
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
            value={isCopy ? null : getValues('code')}
          />
        </div>
        <div>
          <Label infoText="" label="Mã vạch" />
          <CustomInput
            placeholder="Mã vạch tự động"
            className="h-11"
            onChange={(e) => setValue('barCode', e, {
              shouldValidate: true,
            })}
            value={isCopy ? null : getValues('barCode')}
          />
          <InputError error={errors?.barCode?.message} />
        </div>
        <div>
          <Label infoText="" label="Tên thuốc" required />
          <CustomAutocomplete
            placeholder="Nhập tên thuốc"
            className="h-11 !rounded"
            onSelect={
              (value) => {
                setSelectedMedicineCategory(value);
              }
            }
            showSearch={true}
            onSearch={(value) => {
              setValue('name', value, { shouldValidate: true });
              getCategoryKeyword(value);
            }}
            value={getValues('name')}
            options={exampleProduct?.data?.items?.map((item) => ({
              label: <div>
                <div className='text-#0F1824 mb-1 text-base font-medium'>{item.name}</div>

                <div className=' grid grid-cols-5 gap-x-8 gap-y-1'>
                  <div className=' col-span-1 whitespace-normal'>Số đăng ký: {item?.registerNumber}</div>
                  <div className=' col-span-2 whitespace-normal'>Hoạt chất: {item?.content}</div>
                  <div className=' col-span-2 whitespace-normal'> </div>
                  <div className=' col-span-1 whitespace-normal'>Hàm lượng: {item?.dosage?.name}</div>
                  <div className=' col-span-2 whitespace-normal'>Quy cách đóng gói: {item?.packingSpecification}</div>
                  <div className=' col-span-2 whitespace-normal'>Hãng sản phẩm: {item?.manufacture?.name}</div>
                </div>

                <div className='mt-3 h-[1px] w-full bg-[#CFCFCF]' />
              </div>,
              value: JSON.stringify(item),
            }))}
            suffixIcon={isLoadingSearchMedicine && <LoadingIcon />}
            popupClassName="search-product"
          />
          <InputError error={errors?.name?.message} />
        </div>
        {
          selectedMedicineCategory?.code && (
            <div>
              <Label infoText="" label="Mã thuốc" />
              <CustomInput
                placeholder="Nhập mã thuốc"
                className="h-11"
                onChange={(e) =>
                  setValue('selectedMedicineCategory', e, {
                    shouldValidate: true,
                  })
                }
                value={selectedMedicineCategory?.code || drugCode}
                disabled
              />
            </div>
          )
        }
        {
          drugCode && (
            <div>
              <Label infoText="" label="Mã thuốc" />
              <CustomInput
                placeholder="Nhập mã thuốc"
                className="h-11"
                onChange={(e) =>
                  setValue('selectedMedicineCategory', e, {
                    shouldValidate: true,
                  })
                }
                value={drugCode}
                disabled
              />
            </div>
          )
        }
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
          <Label infoText="" label="Đường dùng" required />
          <CustomSelect
            onChange={(value) =>
              setValue('dosageId', value, { shouldValidate: true })
            }
            options={dosages?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            showSearch={true}
            onSearch={debounce((value) => {
              setDosageKeyword(value);
            }, 300)}
            className="suffix-icon h-11 !rounded"
            placeholder="Đường dùng"
            suffixIcon={
              <div className="flex items-center">
                <Image src={ArrowDownIcon} alt="" />
                <Image
                  src={PlusCircleIcon}
                  alt=""
                  onClick={() => setIsOpenAddDosage(true)}
                />
              </div>
            }
            value={getValues('dosageId')}
          />
          <InputError error={errors?.dosageId?.message} />
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
            onChange={(e) => {
              setValue('primePrice', e, {
                shouldValidate: true,
              })
            }

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
            suffix="Ngày"
            type="number"
          />
          <InputError error={errors?.expiryPeriod?.message} />
        </div>
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

      <div>
        <div className="relative mt-5">
          <Label infoText="" label="Đơn vị cơ bản" required />
          <CustomInput
            placeholder="Nhập đơn vị cơ bản"
            className="h-11 w-[calc((100%-42px)/2)]"
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
          {
            pointStatus?.data?.type === "product" && (
              <div className="absolute bottom-6 left-[calc((100%-42px)/2+12px)] flex gap-2">
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
        </div>
        <InputError error={errors?.baseUnit?.message} />
      </div>

      <div className="my-5 flex flex-col gap-2">
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
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].unitName}
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'exchangeValue', e)}
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].exchangeValue}
                type="number"
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'price', e)}
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={
                  id ? Number(getValues("price") || 0) * Number(listUnit[unitKey].exchangeValue || 0) : listUnit[unitKey].price !== undefined
                    ? listUnit[unitKey].price
                    : Number(getValues("price") || 0) *
                    Number(listUnit[unitKey].exchangeValue || 0)
                }
                type="number"
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'code', e)}
                placeholder='Mã hàng tự động'
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={isCopy ? null : listUnit[unitKey].code}
                bordered={false}
              />
              <CustomInput
                placeholder='Mã vạch tự động'
                onChange={(e) => onChangeUnit(unitKey, 'barCode', e)}
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={isCopy ? null : listUnit[unitKey].barCode}
                bordered={false}
              />
              <CustomInput
                onChange={(e) => onChangeUnit(unitKey, 'point', e)}
                wrapClassName='flex-1'
                className="mt-0 h-11 flex-1"
                value={listUnit[unitKey].point}
                bordered={false}
                type='number'
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
                  src={DeleteRedIcon}
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

            <InputError error={errors?.productUnits && (errors?.productUnits[index]?.unitName?.message || errors?.productUnits[index]?.exchangeValue?.message || errors?.productUnits[index]?.code?.message || errors?.productUnits[index]?.barCode?.message)} />
          </div>
        ))}
      </div>
      <div
        className="flex cursor-pointer items-center gap-3 text-[16px] font-semibold text-[#D64457]"
        onClick={() => {
          const units = { ...listUnit };
          units[randomString()] = {
            unitName: undefined,
            exchangeValue: undefined,
            code: undefined,
            barCode: undefined,
            point: undefined,
            price: undefined,
            isDirectSale: false,
            isBaseUnit: false,
          };
          setValue('productUnits', Object.values(units), { shouldValidate: true });
          setListUnit(units);
        }}
      >
        <Image src={PlusCircleIcon} alt="" />
        <div>Thêm đơn vị</div>
      </div>

      <AddGroupProductModal
        isOpen={isOpenAddGroupProduct}
        onCancel={() => setIsOpenAddGroupProduct(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />

      <AddDosageModal
        isOpen={isOpenAddDosage}
        onCancel={() => setIsOpenAddDosage(false)}
        setDosageKeyword={setDosageKeyword}
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
