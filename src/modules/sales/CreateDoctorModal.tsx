import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  createDoctor,
  getLevel,
  getMajor,
  getWorkPlace,
} from '@/api/doctor.service';
import ArrowDownIcon from '@/assets/arrowDownIcon.svg';
import PlusIcon from '@/assets/plusIcon.svg';
import UserUploadIcon from '@/assets/userUploadIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';
import { CustomUpload } from '@/components/CustomUpload';
import InputError from '@/components/InputError';
import { EDoctorStatus, EGender } from '@/enums';
import { useAddress } from '@/hooks/useAddress';

import { AddLevelModal } from '../partners/doctor/add-doctor/AddLevelModal';
import { AddMajorModal } from '../partners/doctor/add-doctor/AddMajorModal';
import { AddWorkPlaceModal } from '../partners/doctor/add-doctor/AddWorkPlaceModal';
import { schema } from '../partners/doctor/add-doctor/schema';
import Label from '@/components/CustomLabel';

export function CreateDoctorModal({
  isOpen,
  onCancel,
  onSave
}: {
  isOpen: boolean;
  onCancel: () => void;
  onSave: ({ doctorId, doctorName }) => void;
}) {
  const queryClient = useQueryClient();

  const [openMajorModal, setOpenMajorModal] = useState(false);
  const [openLevelModal, setOpenLevelModal] = useState(false);
  const [openWorkPlaceModal, setOpenWorkPlaceModal] = useState(false);

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      gender: EGender.male,
      status: EDoctorStatus.active,
    },
  });

  const [majorKeyword, setMajorKeyword] = useState();
  const [levelKeyword, setLevelKeyword] = useState();
  const [workPlaceKeyword, setWorkPlaceKeyword] = useState();

  const { provinces, districts, wards } = useAddress(
    getValues('provinceId'),
    getValues('districtId')
  );

  const { data: majors } = useQuery(['MAJOR', majorKeyword], () =>
    getMajor({ page: 1, limit: 20, keyword: majorKeyword })
  );

  const { data: levels } = useQuery(['LEVEL', levelKeyword], () =>
    getLevel({ page: 1, limit: 20, keyword: levelKeyword })
  );

  const { data: workPlaces } = useQuery(['WORK_PLACE', workPlaceKeyword], () =>
    getWorkPlace({ page: 1, limit: 20, keyword: workPlaceKeyword })
  );

  const { mutate: mutateCreateDoctor, isLoading: isLoadingCreateDoctor } =
    useMutation(() => createDoctor(getValues()), {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(['DOCTOR_LIST']);
        if (onSave) {
          onSave({
            doctorId: res.data.id,
            doctorName: getValues('name'),
          });
        }
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    });

  const onSubmit = () => {
    mutateCreateDoctor();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      title="Thêm mới bác sĩ"
      width={950}
      isLoading={isLoadingCreateDoctor}
    >
      <div className="flex justify-between py-8">
        <div className="mt-3 w-[98px]">
          <CustomUpload
            onChangeValue={(value) =>
              setValue('avatarId', value, { shouldValidate: true })
            }
          >
            <div className="flex flex-col">
              <div className="flex h-[120px] w-[98px] items-center justify-center rounded border-2 border-dashed border-[#C7C9D9]">
                <Image src={UserUploadIcon} />
              </div>

              <div className="mt-2 text-center text-red-main ">Chọn ảnh</div>
            </div>
          </CustomUpload>
        </div>

        <div className="w-[calc(calc(100%-98px)/2)] max-w-[362px]">
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Mã bác sĩ
            </label>
            <CustomInput
              bordered={false}
              placeholder="Mã mặc định"
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(e) => setValue('code', e, { shouldValidate: true })}
            />
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
                Tên bác sĩ
              </label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(e) => setValue('name', e, { shouldValidate: true })}
              />
            </div>
            <InputError error={errors.name?.message} />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Giới tính
            </label>

            <CustomRadio
              className="-mr-4 flex"
              options={[
                { value: EGender.male, label: 'Nam' },
                { value: EGender.female, label: 'Nữ' },
              ]}
              onChange={(value) =>
                setValue('gender', value, { shouldValidate: true })
              }
              value={getValues('gender')}
            />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Chuyên khoa
            </label>
            <div className="grow">
              <CustomSelect
                onChange={(value) =>
                  setValue('specialistId', value, { shouldValidate: true })
                }
                options={majors?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('specialistId')}
                showSearch={true}
                onSearch={debounce((value) => {
                  setMajorKeyword(value);
                }, 300)}
                className="border-underline"
                suffixIcon={
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Image src={ArrowDownIcon} />
                    </div>
                    <Image
                      src={PlusIcon}
                      onClick={(e) => {
                        setOpenMajorModal(true);
                        e.stopPropagation();
                      }}
                      alt=""
                    />
                  </div>
                }
              />
            </div>
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Trình độ
            </label>
            <div className="grow">
              <CustomSelect
                onChange={(value) =>
                  setValue('levelId', value, { shouldValidate: true })
                }
                options={levels?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('levelId')}
                showSearch={true}
                onSearch={debounce((value) => {
                  setLevelKeyword(value);
                }, 300)}
                className="border-underline"
                suffixIcon={
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Image src={ArrowDownIcon} />
                    </div>
                    <Image
                      src={PlusIcon}
                      onClick={() => setOpenLevelModal(true)}
                    />
                  </div>
                }
              />
            </div>
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Nơi công tác
            </label>
            <div className="grow">
              <CustomSelect
                onChange={(value) =>
                  setValue('workPlaceId', value, { shouldValidate: true })
                }
                options={workPlaces?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('workPlaceId')}
                showSearch={true}
                onSearch={debounce((value) => {
                  setWorkPlaceKeyword(value);
                }, 300)}
                className="border-underline"
                suffixIcon={
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Image src={ArrowDownIcon} />
                    </div>
                    <Image
                      src={PlusIcon}
                      onClick={() => setOpenWorkPlaceModal(true)}
                    />
                  </div>
                }
              />
            </div>
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Ghi chú
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(e) => setValue('note', e, { shouldValidate: true })}
            />
          </div>
        </div>
        <div className="w-[calc(calc(100%-98px)/2)] max-w-[362px]">
          <div className=" mb-5 flex items-center">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Trạng thái
            </label>

            <CustomRadio
              className="-mr-4 flex"
              onChange={(value) =>
                setValue('status', value, { shouldValidate: true })
              }
              options={[
                { value: EDoctorStatus.active, label: 'Hoạt động' },
                { value: EDoctorStatus.inactive, label: 'Ngưng hoạt động' },
              ]}
              value={getValues('status')}
            />
          </div>

          <div className=" mb-5 flex items-end flex-col">
            <div className='flex items-end w-full'>
              <Label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]" label="Số điện thoại" hasInfoIcon={false} required />
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(e) => setValue('phone', e, { shouldValidate: true })}
              />
            </div>
            <div>
              <InputError error={errors.phone?.message} />
            </div>
          </div>
          <div className=" mb-5 flex items-end flex-col">
            <div className='flex items-end w-full'>
              <Label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]" label="Email" hasInfoIcon={false} />
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(e) => setValue('email', e, { shouldValidate: true })}
              />
            </div>
            <div>
              <InputError error={errors.email?.message} />
            </div>
          </div>
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Địa chỉ
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(e) => setValue('address', e, { shouldValidate: true })}
            />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Tỉnh/Thành
            </label>
            <CustomSelect
              onChange={(value) =>
                setValue('provinceId', value, { shouldValidate: true })
              }
              options={provinces?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={getValues('provinceId')}
              className="border-underline"
              placeholder="Chọn Tỉnh/TP"
              showSearch={true}
            />
          </div>
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Quận/Huyện
            </label>
            <CustomSelect
              onChange={(value) =>
                setValue('districtId', value, { shouldValidate: true })
              }
              options={districts?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              value={getValues('districtId')}
              className="border-underline"
              placeholder="Chọn quận/huyện"
              showSearch={true}
            />
          </div>
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Phường xã
            </label>
            <CustomSelect
              onChange={(value) =>
                setValue('wardId', value, { shouldValidate: true })
              }
              options={wards?.data?.items?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              showSearch={true}
              value={getValues('wardId')}
              className="border-underline"
              placeholder="Chọn Phường/Xã"
            />
          </div>
        </div>
      </div>

      <AddMajorModal
        isOpen={openMajorModal}
        onCancel={() => setOpenMajorModal(false)}
        setMajorKeyword={setMajorKeyword}
        setDoctorValue={setValue}
        onSave={({ specialistId, specialistName }) => {
          setValue("specialistId", specialistId, {
            shouldValidate: true,
          });
          setMajorKeyword(specialistName);
        }}
      />

      <AddLevelModal
        isOpen={openLevelModal}
        onCancel={() => setOpenLevelModal(false)}
        setLevelKeyword={setLevelKeyword}
        setDoctorValue={setValue}
        onSave={({ levelId, levelName }) => {
          setValue("levelId", levelId, { shouldValidate: true });
          setLevelKeyword(levelName);
        }}
      />

      <AddWorkPlaceModal
        isOpen={openWorkPlaceModal}
        onCancel={() => setOpenWorkPlaceModal(false)}
        setWordPlaceKeyword={setWorkPlaceKeyword}
        setDoctorValue={setValue}
        onSave={({ workPlaceId, workPlaceName }) => {
          setValue("workPlaceId", workPlaceId, {
            shouldValidate: true,
          });
          setWorkPlaceKeyword(workPlaceName);
        }}
      />
    </CustomModal>
  );
}
