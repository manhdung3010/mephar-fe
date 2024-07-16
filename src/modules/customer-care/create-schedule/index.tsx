import { CustomButton } from '@/components/CustomButton'
import { CustomDatePicker } from '@/components/CustomDatePicker'
import { CustomInput } from '@/components/CustomInput'
import Label from '@/components/CustomLabel'
import { useRouter } from 'next/router'
import LocationIcon from "@/assets/location.svg";
import LineIcon from "@/assets/LineDotLargeIcon.svg";
import ArrowLeftIcon from "@/assets/arrowLeftIcon2.svg";
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { CustomSelect } from '@/components/CustomSelect'
import { debounce } from 'lodash'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getCustomer } from '@/api/customer.service'
import CustomMap from '@/components/CustomMap'
import cx from 'classnames';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { schema } from './schema'
import dayjs from 'dayjs'
import DeleteIcon from '@/assets/deleteRed.svg';
import PhoneIcon from '@/assets/phoneIcon.svg';
import MarkIcon from '@/assets/markIcon.svg';
import InputError from '@/components/InputError'
import { message, Select, Spin } from 'antd'
import { ECustomerStatus, ECustomerStatusLabel } from '@/enums'
import { createTrip, getLatLng, getTripDetail, searchPlace, updateTrip } from '@/api/trip.service'
import { useRecoilValue } from 'recoil'
import { profileState } from '@/recoil/state'
import { CustomAutocomplete } from '@/components/CustomAutocomplete'
import { checkTextInText, sliceString } from '@/helpers'
const { Option } = Select;

function CreateSchedule() {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>([]);
  const queryClient = useQueryClient();
  const profile = useRecoilValue(profileState);
  const router = useRouter();
  const { id, isEdit } = router.query;
  const [customerKeyword, setCustomerKeyword] = useState("");
  const [placeKeyword, setPlaceKeyword] = useState("");
  const [isMapFull, setIsMapFull] = useState(false);

  const [startAddress, setStartAddress] = useState('');

  const [customerAddress, setCustomerAddress] = useState('');
  const [tempKeyword, setTempKeyword] = useState('');
  const [tempDisplay, setTempDisplay] = useState('');

  const [refId, setRefId] = useState('');

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(
      schema
    ),
    mode: 'onChange',
    defaultValues: {
      time: dayjs().format('YYYY-MM-DD hh:mm:ss'),
      listCustomer: []
    }
  });

  const { data: tripDetail, isLoading: isLoadingTripDetail } = useQuery(
    ["TRIP_DETAIL", id],
    () =>
      getTripDetail(id),
    {
      enabled: !!id && !!isEdit,
    }
  );

  const { data: customers, isLoading } = useQuery(
    ["CUSTOMER", customerKeyword],
    () =>
      getCustomer({ page: 1, limit: 20, keyword: customerKeyword })
  );
  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () =>
      searchPlace({ keyword: placeKeyword }),
    {
      enabled: placeKeyword.length > 0
    }
  );
  const { data: latLng, isLoading: isLoadingLatLng } = useQuery(
    ["GET_LAT_LNG", refId],
    () =>
      getLatLng({ refId: refId }),
    {
      enabled: refId.length > 0
    }
  );

  useEffect(() => {
    if (tripDetail?.data) {
      setValue('name', tripDetail?.data?.name, { shouldValidate: true });
      setValue('time', tripDetail?.data?.time, { shouldValidate: true });
      setStartAddress(tripDetail?.data?.startAddress);
      setValue('lat', tripDetail?.data?.lat, { shouldValidate: true });
      setValue('lng', tripDetail?.data?.lng, { shouldValidate: true });
      const customers = tripDetail?.data?.tripCustomer?.map((item) => ({ id: item?.customerId, address: item?.address, lat: item?.lat, lng: item?.lng, status: item?.status }));
      setValue('listCustomer', customers, { shouldValidate: true });
      tripDetail?.data?.tripCustomer?.forEach((item, index) => {
        handleAddMarker(+item?.lng, +item?.lat, item?.customer, item?.stt)
      })
      handleAddMarker(+tripDetail?.data?.lng, +tripDetail?.data?.lat)
    }
  }, [tripDetail])

  useEffect(() => {
    if (latLng) {
      setValue('lat', latLng?.data?.lat, { shouldValidate: true });
      setValue('lng', latLng?.data?.lng, { shouldValidate: true });

      handleAddMarker(latLng?.data?.lng, latLng?.data?.lat)
    }
  }, [latLng])

  const { mutate: mutateCreateTrip, isLoading: isLoadinCreateTrip } =
    useMutation(
      () => {
        let payload = {
          ...getValues(),
          userId: profile?.id
        }
        if (!!id && !!isEdit) {
          return updateTrip(Number(id), payload)
        }
        return createTrip(payload)
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["TRIPS"]);
          router.push("/customer-care/list-schedule");
          reset();
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    // add validation here
    if (getValues('listCustomer')?.length === 0) {
      message.error('Vui lòng chọn ít nhất 1 khách hàng');
      return;
    }
    // add validation duplicate customer using lodash
    const listCustomer = getValues('listCustomer');
    const duplicateCustomer = listCustomer.some((item, index) => listCustomer.findIndex((item2) => item2.id === item.id) !== index);
    if (duplicateCustomer) {
      message.error('Khách hàng không được trùng nhau');
      return;
    }

    mutateCreateTrip()
  }

  const handleAddMarker = (lng, lat, customerInfo?: any, customerIndex?: number) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.addMarker(coordinates, customerInfo ? customerInfo : null, customerIndex ? customerIndex : null);
    }
  };
  const handleUpdateMarker = (lng, lat, customerInfo?: any, customerIndex?: number) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.updateMarker(coordinates, customerInfo ? customerInfo : null, customerIndex ? customerIndex : null);
    }
  };
  const handleDeleteMarker = (lng, lat) => {
    const coordinates = [+lng, +lat];
    if (mapRef.current) {
      mapRef.current.deleteMarker(coordinates)
    }
  };

  // Search product
  const onSearch = useCallback(
    debounce((value) => {
      setPlaceKeyword(value);
    }, 300),
    [customerKeyword]
  );

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          {`${tripDetail ? 'Cập nhật' : 'Thêm mới'} lịch trình`}
        </div>
        <div className="flex gap-4">
          <CustomButton
            outline={true}
            type="danger"
            onClick={() => router.push("/customer-care/list-schedule")}
          >
            Hủy bỏ
          </CustomButton>
          <CustomButton
            // disabled={isLoadingCreateCustomer}
            onClick={handleSubmit(onSubmit)}
            type="danger"
          >
            Lưu
          </CustomButton>
        </div>
      </div>
      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className='grid grid-cols-12 gap-x-[42px]'>
            {
              isMapFull ? null : (
                <div className={`col-span-5 flex flex-col gap-y-5 }`}>
                  <div>
                    <Label infoText="" label="Tên lịch trình" required />
                    <CustomInput
                      placeholder="Nhập tên lịch trình"
                      className="h-11"
                      value={getValues("name")}
                      onChange={(value) => {
                        setValue("name", value, { shouldValidate: true })
                      }}
                    />
                    <InputError error={errors.name?.message} />
                  </div>
                  <div>
                    <Label infoText="" label="Thời gian bắt đầu" required />
                    <CustomDatePicker value={getValues('time')} onChange={(value) => {
                      setValue('time', value, { shouldValidate: true })
                    }} />
                    <InputError error={errors.time?.message} />
                  </div>
                  <div>
                    <Label infoText="" label="Chọn điểm tiếp thị" required />
                    <div className='flex gap-y-3 flex-col'>
                      <div className='flex items-center'>
                        <div className='w-8 flex-shrink-0 flex items-center z-10'>
                          <Image src={LocationIcon} alt='icon' />
                        </div>
                        <div className='w-full'>
                          <CustomAutocomplete
                            placeholder="Chọn vị trí xuất phát"
                            className="h-11 !rounded w-full"
                            // prefixIcon={<Image src={SearchIcon} alt="" />}
                            wrapClassName="w-full !rounded bg-white"
                            onSelect={(value) => {
                              setTempDisplay(places?.data?.find((item) => item.ref_id === value)?.display);
                              setTempKeyword(places?.data?.find((item) => item.ref_id === value)?.display)
                              setRefId(value);
                            }}
                            showSearch={true}
                            listHeight={300}
                            onSearch={(value) => {
                              setTempKeyword(value);
                              onSearch(value);
                            }}
                            value={tempKeyword || startAddress || null}
                            options={places?.data.map((item) => ({
                              value: item?.ref_id,
                              label: (
                                <div className='flex items-center gap-1 py-2'>
                                  <Image src={MarkIcon} />
                                  <span className='display'>
                                    {item?.display}
                                  </span>
                                </div>
                              ),
                            }))}
                          />
                        </div>
                      </div>
                      <div className='flex gap-y-3 flex-col'>
                        {
                          getValues('listCustomer').map((row: any, index) => (
                            <div className='flex gap-2 items-center w-full'>
                              <div className='w-6 flex-shrink-0 flex items-center relative'>
                                <div className='bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10'>
                                  {index + 1}
                                </div>
                                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-0 ${index === 0 && 'h-20 overflow-hidden'}`}>
                                  <Image src={LineIcon} alt='icon' />
                                </div>
                              </div>
                              <div className='flex-1'>
                                <div className='flex flex-col gap-1'>
                                  <Select
                                    placeholder="Chọn khách hàng"
                                    className="h-11 !rounded w-full"
                                    disabled={row?.status === 'visited'}
                                    onChange={(value) => {
                                      const customer = customers?.data?.items?.find((item) => item?.id === value);
                                      const listCustomer = getValues('listCustomer');
                                      listCustomer[index] = { id: value, address: customer?.address, lat: customer?.lat, lng: customer?.lng };
                                      setValue('listCustomer', listCustomer, { shouldValidate: true });
                                      setCustomerAddress(customer?.address)
                                      if (customer) {
                                        handleAddMarker(customer?.lng, customer?.lat, customer, index + 1)
                                      }
                                    }}
                                    onSearch={debounce((value) => {
                                      setCustomerKeyword(value);
                                    }, 300)}
                                    showSearch={true}
                                    notFoundContent={isLoading ? <Spin size="small" className='flex justify-center p-4 w-full' /> : null}
                                    value={customers?.data?.items?.find((item) => item?.id === row?.id)?.fullName || undefined}
                                    filterOption={(input, option) => {
                                      const divChildren = option?.props?.children.props.children;
                                      const fullNameDiv = divChildren[0]?.props?.children[1]

                                      const textContent = fullNameDiv ? fullNameDiv.props.children.toString().toLowerCase() : '';
                                      return textContent.includes(input.toLowerCase());
                                    }}
                                  >
                                    {
                                      customers?.data?.items?.map((item) => (
                                        <Option key={item.id} value={item.id}>
                                          <div className='flex flex-col gap-1 border-b-[1px] border-b-[#E9EFF6]'>
                                            <div className='pt-1'>
                                              <span className='text-red-main'>{item.code} - </span>
                                              <span className='fullName'>
                                                {item.fullName}
                                              </span>
                                              <span
                                                className={cx(
                                                  {
                                                    'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                                                      item?.status === ECustomerStatus.active,
                                                    'text-[#666666] border border-[#666666] bg-[#F5F5F5]':
                                                      item?.status === ECustomerStatus.inactive,
                                                  },
                                                  'px-2 py-1 rounded-2xl w-max ml-2'
                                                )}
                                              >
                                                {ECustomerStatusLabel[item?.status]}
                                              </span>
                                            </div>
                                            <div className='flex items-center gap-1'>
                                              <Image src={PhoneIcon} /> <span>{item?.phone}</span>
                                            </div>
                                            <div className='flex items-center gap-1 pb-1'>
                                              <Image src={MarkIcon} /> <span>{item?.address}</span>
                                            </div>
                                          </div>
                                        </Option>
                                      ))
                                    }
                                  </Select>
                                  <CustomerRowAddress row={row} index={index} setValue={setValue} getValues={getValues} handleUpdateMarker={handleUpdateMarker} />
                                  {/* <Select
                                    placeholder="Địa chỉ khách hàng"
                                    className="h-11 !rounded w-full"
                                    disabled={row?.status === 'visited'}
                                    onChange={async (value) => {
                                      // setRefId(value);
                                      const res = await getLatLng({ refId: value });
                                      if (res?.data) {
                                        const listCustomer = getValues('listCustomer');
                                        listCustomer[index] = { ...listCustomer[index], address: res?.data?.display, lat: res?.data?.lat, lng: res?.data?.lng };
                                        setValue('listCustomer', listCustomer, { shouldValidate: true });
                                        handleUpdateMarker(res?.data?.lng, res?.data?.lat, null, index + 1)
                                      }
                                    }}
                                    onSearch={debounce((value) => {
                                      setPlaceKeyword(value);
                                    }, 300)}
                                    showSearch={true}
                                    // notFoundContent={isLoadingPlace ? <Spin size="small" className='flex justify-center p-4 w-full' /> : null}
                                    filterOption={(input, option: any) => {
                                      console.log('input', input)
                                      const textContent = option.children.props.children[1].props.children;
                                      console.log('textContent', textContent.toLowerCase())
                                      console.log('check', textContent.toLowerCase().includes(input.toLowerCase()))
                                      return textContent.toLowerCase().includes(input.toLowerCase());
                                    }}
                                    value={row?.address?.length > 70 ? row?.address?.slice(0, 70) + '...' : row?.address || undefined}
                                  >
                                    {places?.data?.map((item) => (
                                      <Option key={item.ref_id} value={item.ref_id}>
                                        <div className='flex items-center gap-1 py-2'>
                                          <Image src={MarkIcon} />
                                          <span className='display'>
                                            {item?.display}
                                          </span>
                                        </div>
                                      </Option>
                                    ))}
                                  </Select> */}
                                </div>
                                <InputError error={errors.listCustomer?.[index]?.message} />
                              </div>
                              <div className={`cursor-pointer w-5 flex-shrink-0 ${row?.status === 'visited' && 'cursor-not-allowed'}`}>
                                <Image
                                  src={DeleteIcon}
                                  onClick={() => {
                                    if (row?.status === 'visited') return;
                                    const listCustomer = getValues('listCustomer')
                                    listCustomer.splice(index, 1)
                                    setValue('listCustomer', listCustomer, { shouldValidate: true })
                                    const customer = customers?.data?.items?.find((item) => item?.id === row?.id);
                                    if (customer) {
                                      handleDeleteMarker(customer?.lng, customer?.lat)
                                    }
                                  }}
                                  alt='icon'
                                />
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                    <div className='w-fit mt-3'>
                      <CustomButton
                        // disabled={isLoadingCreateCustomer}
                        onClick={() => {
                          setValue('listCustomer', [...getValues('listCustomer'), {}], { shouldValidate: true })
                        }}
                        className=''
                        outline={true}
                        type="danger"
                      >
                        Thêm điểm tiếp thị
                      </CustomButton>
                    </div>
                  </div>
                </div>
              )
            }
            <div className={`${isMapFull ? 'col-span-12' : 'col-span-7'} h-[700px] w-full relative`}>
              <CustomMap ref={mapRef} isMapFull={isMapFull} />
              <div className='absolute left-0 top-1/2 -translate-y-1/2 bg-white py-7 px-4 rounded-r-lg rounded-br-lg cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5] z-10'
                onClick={() => {
                  // change width full
                  setIsMapFull(!isMapFull)
                }
                }
              >
                <Image src={ArrowLeftIcon} className={`${isMapFull ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const CustomerRowAddress = ({ row, index, setValue, getValues, handleUpdateMarker }) => {
  const [placeKeyword, setPlaceKeyword] = useState("");
  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () =>
      searchPlace({ keyword: placeKeyword }),
    {
      enabled: placeKeyword.length > 0
    }
  );
  useEffect(() => {
    if (row?.address) {
      setPlaceKeyword(row?.address)
    }
  }, [row?.address])
  return (
    <CustomAutocomplete
      placeholder="Địa chỉ khách hàng"
      className="h-11 !rounded w-full"
      disabled={row?.status === 'visited'}
      // prefixIcon={<Image src={SearchIcon} alt="" />}
      wrapClassName="w-full !rounded bg-white"
      // onSelect={(value) => handleSelectProduct(value)}
      onSelect={async (value) => {
        // setRefId(value);
        const res = await getLatLng({ refId: value });
        if (res?.data) {
          const listCustomer = getValues('listCustomer');
          listCustomer[index] = { ...listCustomer[index], address: res?.data?.display, lat: res?.data?.lat, lng: res?.data?.lng };
          setValue('listCustomer', listCustomer, { shouldValidate: true });
          handleUpdateMarker(res?.data?.lng, res?.data?.lat, null, index + 1)
        }
      }}
      showSearch={true}
      listHeight={300}
      onSearch={(value) => {
        setPlaceKeyword(value);
        // onSearch(value);
      }}

      value={placeKeyword || null}
      options={places?.data.map((item) => ({
        value: item?.ref_id,
        label: (
          <div className='flex items-center gap-1 py-2'>
            <Image src={MarkIcon} />
            <span className='display'>
              {item?.display}
            </span>
          </div>
        ),
      }))}
    />
  )
}

export default CreateSchedule