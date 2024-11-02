import { getCustomer } from "@/api/customer.service";
import { createTrip, getLatLng, getTripDetail, searchPlace, searchPlaceByLatLng, updateTrip } from "@/api/trip.service";
import LineIcon from "@/assets/LineDotLargeIcon.svg";
import ArrowLeftIcon from "@/assets/arrowLeftIcon2.svg";
import DeleteIcon from "@/assets/deleteRed.svg";
import EndMarkIcon from "@/assets/endMarkIcon.svg";
import LocationIcon from "@/assets/location.svg";
import MarkIcon from "@/assets/markIcon.svg";
import PhoneIcon from "@/assets/phoneIcon.svg";
import { CustomAutocomplete } from "@/components/CustomAutocomplete";
import { CustomButton } from "@/components/CustomButton";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import CustomMap from "@/components/CustomMap";
import InputError from "@/components/InputError";
import { ECustomerStatus, ECustomerStatusLabel } from "@/enums";
import { profileState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Select } from "antd";
import cx from "classnames";
import dayjs from "dayjs";
import { debounce, isArray } from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { schema } from "./schema";
import { isCoordinates } from "@/helpers";
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

  const [startAddress, setStartAddress] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [tempKeyword, setTempKeyword] = useState("");
  const [tempKeywordEnd, setTempKeywordEnd] = useState("");

  const [refId, setRefId] = useState("");
  const [isEnd, setIsEnd] = useState(false);

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      time: dayjs().format("YYYY-MM-DD hh:mm:ss"),
      listCustomer: [],
    },
  });

  const { data: tripDetail, isLoading: isLoadingTripDetail } = useQuery(["TRIP_DETAIL", id], () => getTripDetail(id), {
    enabled: !!id && !!isEdit,
  });

  const { data: customers, isLoading } = useQuery(["CUSTOMER", customerKeyword], () =>
    getCustomer({ page: 1, limit: 20, keyword: customerKeyword }),
  );
  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () => {
      if (isCoordinates(placeKeyword)) {
        return searchPlaceByLatLng({
          lat: String(placeKeyword.split(",")[0]),
          lng: String(placeKeyword.split(",")[1]),
        });
      }
      return searchPlace({ keyword: placeKeyword });
    },
    {
      enabled: placeKeyword.length > 0,
    },
  );
  const { data: latLng, isLoading: isLoadingLatLng } = useQuery(
    ["GET_LAT_LNG", refId],
    () => getLatLng({ refId: refId }),
    {
      enabled: refId.length > 0,
    },
  );

  useEffect(() => {
    if (tripDetail?.data) {
      setValue("name", tripDetail?.data?.name, { shouldValidate: true });
      setValue("time", tripDetail?.data?.time, { shouldValidate: true });
      setStartAddress(tripDetail?.data?.startAddress);
      setTempKeywordEnd(tripDetail?.data?.endAddress);
      setValue("lat", tripDetail?.data?.lat?.trim(), { shouldValidate: true });
      setValue("lng", tripDetail?.data?.lng?.trim(), { shouldValidate: true });
      setValue("latEnd", tripDetail?.data?.latEnd?.trim(), { shouldValidate: true });
      setValue("lngEnd", tripDetail?.data?.lngEnd?.trim(), { shouldValidate: true });
      const customers = tripDetail?.data?.tripCustomer?.map((item) => ({
        id: item?.customerId,
        tripCustomerId: item?.id,
        address: item?.address,
        lat: item?.lat,
        lng: item?.lng,
        status: item?.status,
        fullName: item?.customer?.fullName,
      }));
      setValue("listCustomer", customers, { shouldValidate: true });
      tripDetail?.data?.tripCustomer?.forEach((item, index) => {
        handleAddMarker(+item?.lng, +item?.lat, item?.customer, item?.stt);
      });
      handleAddMarker(+tripDetail?.data?.lng, +tripDetail?.data?.lat);
    }
  }, [tripDetail]);

  useEffect(() => {
    if (latLng) {
      if (isEnd) {
        setValue("latEnd", latLng?.data?.lat, { shouldValidate: true });
        setValue("lngEnd", latLng?.data?.lng, { shouldValidate: true });
        handleAddMarker(latLng?.data?.lng, latLng?.data?.lat, null, undefined, true);
      } else {
        setValue("lat", latLng?.data?.lat, { shouldValidate: true });
        setValue("lng", latLng?.data?.lng, { shouldValidate: true });
        handleAddMarker(latLng?.data?.lng, latLng?.data?.lat);
      }
    }
  }, [latLng, isEnd]);

  console.log("getValues", getValues());

  const { mutate: mutateCreateTrip, isLoading: isLoadinCreateTrip } = useMutation(
    () => {
      let payload = {
        ...getValues(),
        userId: profile?.id,
      };
      if (!!id && !!isEdit) {
        return updateTrip(Number(id), payload);
      }
      return createTrip(payload);
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
    },
  );

  const onSubmit = () => {
    // add validation here
    if (getValues("listCustomer")?.length === 0) {
      message.error("Vui lòng chọn ít nhất 1 khách hàng");
      return;
    }
    if (!getValues("lat") || !getValues("lng")) {
      message.error("Vui lòng chọn điểm xuất phát");
      return;
    }
    if (!getValues("latEnd") || !getValues("lngEnd")) {
      message.error("Vui lòng chọn điểm kết thúc");
      return;
    }

    // add validation duplicate customer using lodash
    // const listCustomer = getValues('listCustomer');
    // const duplicateCustomer = listCustomer.some((item, index) => listCustomer.findIndex((item2) => item2.id === item.id) !== index);
    // if (duplicateCustomer) {
    //   message.error('Khách hàng không được trùng nhau');
    //   return;
    // }

    mutateCreateTrip();
  };

  const handleAddMarker = (lng, lat, customerInfo?: any, customerIndex?: number, isEndPoint?: boolean) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.addMarker(
        coordinates,
        customerInfo ? customerInfo : null,
        customerIndex ? customerIndex : null,
        isEndPoint,
      );
    }
  };
  const handleUpdateMarker = (lng, lat, customerInfo?: any, customerIndex?: number) => {
    const coordinates = [lng, lat];
    if (mapRef.current) {
      mapRef.current.updateMarker(
        coordinates,
        customerInfo ? customerInfo : null,
        customerIndex ? customerIndex : null,
      );
    }
  };
  const handleDeleteMarker = (lng, lat) => {
    const coordinates = [+lng, +lat];
    if (mapRef.current) {
      mapRef.current.deleteMarker(coordinates);
    }
  };

  // Search product
  const onSearch = useCallback(
    debounce((value) => {
      setPlaceKeyword(value);
    }, 300),
    [customerKeyword],
  );
  // Search customer
  const onSearchCustomer = useCallback(
    debounce((value) => {
      setCustomerKeyword(value);
    }, 300),
    [customerKeyword],
  );

  return (
    <>
      <div className="my-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">{`${tripDetail ? "Cập nhật" : "Thêm mới"} lịch trình`}</div>
        <div className="flex gap-4">
          <CustomButton outline={true} type="danger" onClick={() => router.push("/customer-care/list-schedule")}>
            Hủy bỏ
          </CustomButton>
          <CustomButton
            disabled={isLoadinCreateTrip}
            loading={isLoadinCreateTrip}
            onClick={handleSubmit(onSubmit)}
            type="danger"
          >
            Lưu
          </CustomButton>
        </div>
      </div>
      <div className="my-6 flex gap-6">
        <div className="grow  bg-white p-5">
          <div className="grid grid-cols-12 gap-x-[42px]">
            {isMapFull ? null : (
              <div className={`col-span-5 flex flex-col gap-y-5 }`}>
                <div>
                  <Label infoText="" label="Tên lịch trình" required />
                  <CustomInput
                    placeholder="Nhập tên lịch trình"
                    className="h-11"
                    value={getValues("name")}
                    onChange={(value) => {
                      setValue("name", value, { shouldValidate: true });
                    }}
                  />
                  <InputError error={errors.name?.message} />
                </div>
                <div>
                  <Label infoText="" label="Thời gian bắt đầu" required />
                  <CustomDatePicker
                    value={getValues("time")}
                    onChange={(value) => {
                      setValue("time", value, { shouldValidate: true });
                    }}
                  />
                  <InputError error={errors.time?.message} />
                </div>
                <div>
                  <Label infoText="" label="Chọn lịch trình tiếp thị" required />
                  <div className="flex gap-y-3 flex-col">
                    <div className="flex items-center">
                      <div className="w-8 flex-shrink-0 flex items-center z-10">
                        <Image src={LocationIcon} alt="icon" />
                      </div>
                      <div className="w-full">
                        <CustomAutocomplete
                          placeholder="Chọn vị trí xuất phát"
                          className="h-11 !rounded w-full"
                          // prefixIcon={<Image src={SearchIcon} alt="" />}
                          wrapClassName="w-full !rounded bg-white"
                          disabled={isEdit ? true : false}
                          onSelect={(value) => {
                            setIsEnd(false);
                            setTempKeyword(
                              isCoordinates(placeKeyword)
                                ? placeKeyword
                                : places?.data?.find((item) => item.ref_id === value)?.display,
                            );
                            if (isCoordinates(placeKeyword)) {
                              setValue("lat", placeKeyword.split(",")[0]?.trim(), { shouldValidate: true });
                              setValue("lng", placeKeyword.split(",")[1]?.trim(), { shouldValidate: true });
                              handleAddMarker(placeKeyword.split(",")[1]?.trim(), placeKeyword.split(",")[0]?.trim());
                              return;
                            }
                            setRefId(value);
                          }}
                          showSearch={true}
                          listHeight={300}
                          onSearch={(value) => {
                            setTempKeyword(value);
                            onSearch(value);
                          }}
                          value={tempKeyword || startAddress || null}
                          options={
                            isArray(places?.data)
                              ? places?.data.map((item) => ({
                                  value: item?.ref_id,
                                  label: (
                                    <div className="!flex items-center gap-1 py-2">
                                      <div className="w-5 h-5 flex-shrink-0">
                                        <Image src={MarkIcon} />
                                      </div>
                                      <span className="display">{item?.display}</span>
                                    </div>
                                  ),
                                }))
                              : [
                                  {
                                    value: places?.data?.address,
                                    label: places?.data?.address,
                                  },
                                ]
                          }
                        />
                      </div>
                    </div>
                    <div className="flex gap-y-3 flex-col">
                      {getValues("listCustomer").map((row: any, index) => (
                        <CustomerRow
                          key={index}
                          row={row}
                          index={index}
                          setValue={setValue}
                          getValues={getValues}
                          handleUpdateMarker={handleUpdateMarker}
                          customers={customers}
                          setCustomerAddress={setCustomerAddress}
                          handleAddMarker={handleAddMarker}
                          onSearchCustomer={onSearchCustomer}
                          errors={errors}
                          handleDeleteMarker={handleDeleteMarker}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="w-fit mt-3">
                    <CustomButton
                      // disabled={isLoadingCreateCustomer}
                      onClick={() => {
                        setValue("listCustomer", [...getValues("listCustomer"), {}], { shouldValidate: true });
                      }}
                      className=""
                      outline={true}
                      type="danger"
                    >
                      Thêm điểm tiếp thị
                    </CustomButton>
                  </div>
                  <div className="mt-5">
                    <Label infoText="" label="Chọn điểm kết thúc" required />
                    <div className="flex items-center gap-2">
                      <div className="flex-shrink-0 flex items-center z-10 w-6 h-6">
                        <Image src={EndMarkIcon} alt="icon" />
                      </div>
                      <div className="w-full">
                        <CustomAutocomplete
                          placeholder="Chọn vị trí kết thúc"
                          className="h-11 !rounded w-full"
                          // prefixIcon={<Image src={SearchIcon} alt="" />}
                          wrapClassName="w-full !rounded bg-white"
                          onSelect={(value) => {
                            setIsEnd(true);
                            setTempKeywordEnd(
                              isCoordinates(placeKeyword)
                                ? placeKeyword
                                : places?.data?.find((item) => item.ref_id === value)?.display,
                            );
                            if (isCoordinates(placeKeyword)) {
                              setValue("latEnd", placeKeyword.split(",")[0]?.trim(), { shouldValidate: true });
                              setValue("lngEnd", placeKeyword.split(",")[1]?.trim(), { shouldValidate: true });
                              // handleAddMarker(placeKeyword.split(",")[1]?.trim(), placeKeyword.split(",")[0]?.trim());
                              return;
                            }
                            setRefId(value);
                          }}
                          showSearch={true}
                          listHeight={300}
                          onSearch={(value) => {
                            setTempKeywordEnd(value);
                            onSearch(value);
                          }}
                          value={tempKeywordEnd || null}
                          options={
                            isArray(places?.data)
                              ? places?.data.map((item) => ({
                                  value: item?.ref_id,
                                  label: (
                                    <div className="!flex items-center gap-1 py-2">
                                      <div className="w-5 h-5 flex-shrink-0">
                                        <Image src={MarkIcon} />
                                      </div>
                                      <span className="display">{item?.display}</span>
                                    </div>
                                  ),
                                }))
                              : [
                                  {
                                    value: places?.data?.address,
                                    label: places?.data?.address,
                                  },
                                ]
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className={`${isMapFull ? "col-span-12" : "col-span-7"} h-[700px] w-full relative`}>
              <CustomMap ref={mapRef} isMapFull={isMapFull} />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white py-7 px-4 rounded-r-lg rounded-br-lg cursor-pointer transition-all duration-300 hover:bg-[#F5F5F5] z-10"
                onClick={() => {
                  // change width full
                  setIsMapFull(!isMapFull);
                }}
              >
                <Image src={ArrowLeftIcon} className={`${isMapFull ? "rotate-180" : ""}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const CustomerRowAddress = ({ row, index, setValue, getValues, handleUpdateMarker }) => {
  const [placeKeyword, setPlaceKeyword] = useState("");
  const { data: places, isLoading: isLoadingPlace } = useQuery(
    ["SEARCH_PLACE", placeKeyword],
    () => {
      if (isCoordinates(placeKeyword)) {
        return searchPlaceByLatLng({
          lat: String(placeKeyword.split(",")[0])?.trim(),
          lng: String(placeKeyword.split(",")[1])?.trim(),
        });
      }
      return searchPlace({ keyword: placeKeyword });
    },
    {
      enabled: placeKeyword.length > 0,
    },
  );
  useEffect(() => {
    if (row?.address) {
      setPlaceKeyword(row?.address);
    }
  }, [row?.address]);
  return (
    <CustomAutocomplete
      placeholder="Địa chỉ khách hàng"
      className="h-11 !rounded w-full"
      disabled={row?.status === "visited"}
      // prefixIcon={<Image src={SearchIcon} alt="" />}
      wrapClassName="w-full !rounded bg-white"
      // onSelect={(value) => handleSelectProduct(value)}
      onSelect={async (value) => {
        // setRefId(value);
        if (isCoordinates(placeKeyword)) {
          const listCustomer = getValues("listCustomer");
          listCustomer[index] = {
            ...listCustomer[index],
            address: value,
            lat: placeKeyword.split(",")[0]?.trim(),
            lng: placeKeyword.split(",")[1]?.trim(),
          };
          setValue("listCustomer", listCustomer, { shouldValidate: true });
          handleUpdateMarker(placeKeyword.split(",")[1], placeKeyword.split(",")[0], null, index + 1);
          return;
        }
        const res = await getLatLng({ refId: value });
        if (res?.data) {
          const listCustomer = getValues("listCustomer");
          listCustomer[index] = {
            ...listCustomer[index],
            address: res?.data?.display,
            lat: res?.data?.lat,
            lng: res?.data?.lng,
          };
          setValue("listCustomer", listCustomer, { shouldValidate: true });
          handleUpdateMarker(res?.data?.lng, res?.data?.lat, null, index + 1);
        }
      }}
      showSearch={true}
      listHeight={300}
      onSearch={(value) => {
        setPlaceKeyword(value);
        // onSearch(value);
      }}
      value={placeKeyword || null}
      options={
        isArray(places?.data)
          ? places?.data.map((item) => ({
              value: item?.ref_id,
              label: (
                <div className="!flex items-center gap-1 py-2">
                  <div className="w-5 h-5 flex-shrink-0">
                    <Image src={MarkIcon} />
                  </div>
                  <span className="display">{item?.display}</span>
                </div>
              ),
            }))
          : [
              {
                value: places?.data?.address,
                label: places?.data?.address,
              },
            ]
      }
    />
  );
};

const CustomerRow = ({
  row,
  index,
  setValue,
  getValues,
  handleUpdateMarker,
  customers,
  setCustomerAddress,
  handleAddMarker,
  onSearchCustomer,
  errors,
  handleDeleteMarker,
}) => {
  const [customerKeyword, setCustomerKeyword] = useState("");
  return (
    <div className="flex gap-2 items-center w-full">
      <div className="w-6 flex-shrink-0 flex items-center relative">
        <div className="bg-[#0063F7] rounded-full text-white w-6 h-6 grid place-items-center z-10">{index + 1}</div>
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-0 ${index === 0 && "h-20 overflow-hidden"}`}>
          <Image src={LineIcon} alt="icon" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex flex-col gap-1">
          <CustomAutocomplete
            placeholder="Chọn khách hàng"
            className="h-11 !rounded w-full"
            disabled={row?.status === "visited"}
            // prefixIcon={<Image src={SearchIcon} alt="" />}
            wrapClassName="w-full !rounded bg-white"
            onSelect={(value) => {
              const customer = customers?.data?.items?.find((item) => item?.id === value);
              const listCustomer = getValues("listCustomer");
              listCustomer[index] = {
                id: value,
                address: customer?.address,
                lat: customer?.lat?.trim(),
                lng: customer?.lng?.trim(),
                fullName: customer?.fullName,
              };
              setValue("listCustomer", listCustomer, { shouldValidate: true });
              setCustomerAddress(customer?.address);
              if (customer) {
                handleAddMarker(customer?.lng, customer?.lat, customer, index + 1);
              }
              // update tempCustomerKeyword
            }}
            showSearch={true}
            listHeight={300}
            onSearch={(value) => {
              onSearchCustomer(value);
              setCustomerKeyword(value);
            }}
            value={customerKeyword || row?.fullName || null}
            options={customers?.data?.items?.map((item) => ({
              value: item?.id,
              label: (
                <div className="flex flex-col gap-1 border-b-[1px] border-b-[#E9EFF6]">
                  <div className="pt-1">
                    <span className="text-red-main">{item.code} - </span>
                    <span className="fullName">{item.fullName}</span>
                    <span
                      className={cx(
                        {
                          "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]":
                            item?.status === ECustomerStatus.active,
                          "text-[#666666] border border-[#666666] bg-[#F5F5F5]":
                            item?.status === ECustomerStatus.inactive,
                        },
                        "px-2 py-1 rounded-2xl w-max ml-2",
                      )}
                    >
                      {ECustomerStatusLabel[item?.status]}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image src={PhoneIcon} /> <span>{item?.phone}</span>
                  </div>
                  <div className="flex items-center gap-1 pb-1">
                    <Image src={MarkIcon} /> <span>{item?.address}</span>
                  </div>
                </div>
              ),
            }))}
          />
          <CustomerRowAddress
            row={row}
            index={index}
            setValue={setValue}
            getValues={getValues}
            handleUpdateMarker={handleUpdateMarker}
          />
        </div>
        <InputError error={errors.listCustomer?.[index]?.message} />
      </div>
      <div className={`cursor-pointer w-5 flex-shrink-0 ${row?.status === "visited" && "cursor-not-allowed"}`}>
        <Image
          src={DeleteIcon}
          onClick={() => {
            if (row?.status === "visited") return;
            const listCustomer = getValues("listCustomer");
            listCustomer.splice(index, 1);
            setValue("listCustomer", listCustomer, { shouldValidate: true });
            const customer = customers?.data?.items?.find((item) => item?.id === row?.id);
            if (customer) {
              handleDeleteMarker(customer?.lng, customer?.lat);
            }
          }}
          alt="icon"
        />
      </div>
    </div>
  );
};

export default CreateSchedule;
