import { getGeo, getLatLng, searchPlace } from '@/api/trip.service';
import ArrowLeftIcon from "@/assets/arrowLeftIcon2.svg";
import MarkIcon from '@/assets/markIcon.svg';
import PhoneIcon from '@/assets/phoneIcon.svg';
import DistanceIcon from '@/assets/distanceIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import Label from '@/components/CustomLabel';
import CustomMap from '@/components/CustomMap';
import { formatDistance } from '@/helpers';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@tanstack/react-query';
import { message, Select, Spin } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { schema } from './schema';
const { Option } = Select;
function Check() {
  const mapRef = useRef<any>(null);
  const [isMapFull, setIsMapFull] = useState<boolean>(false);
  const [refId, setRefId] = useState('');
  const [placeKeyword, setPlaceKeyword] = useState("");

  const [searchResult, setSearchResult] = useState<any[]>([]);

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      radius: 5000,
    },
  });

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

  const { mutate: mutateGetGeo, isLoading: isLoadingGetGeo } =
    useMutation(
      () => {
        return getGeo(1, 999, getValues());
      },
      {
        onSuccess: async (res) => {
          // await queryClient.invalidateQueries(["TRIPS"]);

          setSearchResult(res?.data);
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  useEffect(() => {
    if (latLng) {
      setValue('lat', latLng?.data?.lat, { shouldValidate: true });
      setValue('lng', latLng?.data?.lng, { shouldValidate: true });

      handleAddMarker(latLng?.data?.lng, latLng?.data?.lat)
    }
  }, [latLng])

  const handleAddMarker = (lng, lat, customerInfo?: any, customerIndex?: number) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.addMarker(coordinates, customerInfo ? customerInfo : null, customerIndex ? customerIndex : null);
    }
  };

  const onSubmit = () => {
    mutateGetGeo();
  };

  return (
    <>
      <div className="my-6 flex gap-6">
        <div className="grow ">
          <div className='grid grid-cols-12'>
            {
              isMapFull ? null : (
                <div className={`col-span-4 flex flex-col gap-3`}>
                  <div className='bg-white p-5 shadow-sm flex flex-col gap-3'>
                    <div>
                      <Label infoText="" label="Vị trí muốn check" required />
                      <Select
                        placeholder="Chọn vị trí xuất phát"
                        className="h-11 !rounded w-full"
                        onChange={(value) => {
                          setRefId(value);
                        }}
                        onSearch={debounce((value) => {
                          setPlaceKeyword(value);
                        }, 300)}
                        showSearch={true}
                        notFoundContent={isLoadingPlace ? <Spin size="small" className='flex justify-center p-4 w-full' /> : null}
                        filterOption={(input, option: any) => {
                          const textContent = option.children.props.children[1].props.children;
                          return textContent.toLowerCase().includes(input.toLowerCase());
                        }}
                      >
                        {places?.data?.map((item) => (
                          <Option key={item.ref_id} value={item.ref_id}>
                            <div className='flex items-center gap-1 py-2'>
                              <div className='w-4 flex-shrink-0 grid place-items-center'>
                                <Image src={MarkIcon} />
                              </div>
                              <span className='display'>
                                {item?.display}
                              </span>
                            </div>
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <Label infoText="" label="Khoảng cách quét" />
                      <Select
                        className='w-full h-11 !rounded'
                        options={[
                          { value: 5000, label: '5km' },
                          { value: 10000, label: '10km' },
                          { value: 20000, label: '20km' },
                          { value: 50000, label: '50km' },
                          { value: 100000, label: '100km' },
                        ]}
                        value={getValues('radius')}
                        onChange={(value) => {
                          setValue('radius', Number(value), { shouldValidate: true });
                        }}
                      />
                    </div>
                    <CustomButton
                      className='w-full !h-10'
                      disabled={isLoadingGetGeo}
                      loading={isLoadingGetGeo}
                      onClick={() => {
                        handleSubmit(onSubmit)();
                      }}
                    >
                      Kiểm tra
                    </CustomButton>
                  </div>
                  <div className='bg-white p-5 '>
                    <h3 className='text-lg font-medium text-[#182537] mb-3'>Kết quả tìm kiếm</h3>
                    <div className='flex flex-col gap-3'>
                      {
                        isLoadingGetGeo ? (
                          <div className='grid place-items-center h-10'>
                            <Spin size='default' />
                          </div>
                        ) : searchResult?.map((item, index) => (
                          <div className='py-3 px-4 rounded border-[1px] border-[#D3D5D7]' key={item?.id}>
                            <div className='font-semibold'>
                              <span className='text-red-main'>{item?.code}</span> - <span className='text-[#404040]'>{item?.fullName}</span>
                              <span className={`ml-1 ${item?.status === 'active' ? 'bg-[#e5f8ec] text-[#00B63E] border-[1px] border-[#00B63E]' : item?.status === 'inactive' ? 'bg-[#feeaea] text-[#F32B2B] border-[1px] border-[#F32B2B]' : 'bg-[#f0e5fa] text-[#6600CC] border-[1px] border-[#6600CC]'}  rounded-full px-2 py-1 text-xs`}>{item?.status === 'active' ? "Hoạt động" : item?.status === 'inactive' ? "Ngưng hoạt động" : "Tiềm năng"}</span>

                            </div>
                            <div className='flex gap-1 text-[#455468]'>
                              <div className='w-4 grid place-items-center flex-shrink-0'>
                                <Image src={PhoneIcon} />
                              </div>
                              {item?.phone}
                            </div>
                            <div className='flex gap-1 text-[#455468]'>
                              <div className='w-4 grid place-items-center flex-shrink-0'>
                                <Image src={MarkIcon} />
                              </div>
                              <span className='line-clamp-1'>{item?.address}</span>
                            </div>
                            <div className='flex gap-1 text-[#455468]'>
                              <div className='w-4 grid place-items-center flex-shrink-0'>
                                <Image src={DistanceIcon} />
                              </div>
                              {formatDistance(item?.distance)}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )
            }
            <div className={`${isMapFull ? 'col-span-12' : 'col-span-8'} h-[700px] w-full relative`}>
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

export default Check