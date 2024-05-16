import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { debounce } from 'lodash';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';

import {
  createPrescription,
  getDoctor,
  getHospital,
} from '@/api/doctor.service';
import ArrowDownIcon from '@/assets/arrowDownIcon.svg';
import PlusIcon from '@/assets/plusIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomModal } from '@/components/CustomModal';
import { CustomRadio } from '@/components/CustomRadio';
import { CustomSelect } from '@/components/CustomSelect';
import InputError from '@/components/InputError';
import { EGender } from '@/enums';
import { branchState } from '@/recoil/state';

import { CreateDoctorModal } from './CreateDoctorModal';
import { AddHospitalModal } from './CreateHospitalModal';
import { prescriptionSchema } from './schema';

export function CreatePrescriptionModal({
  isOpen,
  onCancel,
  setOrderValue,
}: {
  isOpen: boolean;
  onCancel: () => void;
  setOrderValue: any;
}) {
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const [isOpenCreateDoctorModal, setIsOpenCreateDoctorModal] = useState(false);
  const [isOpenHospitalModal, setIsOpenCreateHospitalModal] = useState(false);

  const [hospitalKeyword, setHospitalKeyword] = useState();
  const [doctorKeyword, setDoctorKeyword] = useState();

  const { data: hospitals } = useQuery(['HOSPITAL', hospitalKeyword, isOpen], () =>
    getHospital({ page: 1, limit: 20, keyword: hospitalKeyword }),
    {
      enabled: !!isOpen,
    }
  );

  const { data: doctors } = useQuery(['DOCTOR_LIST', doctorKeyword, isOpen], () =>
    getDoctor({ page: 1, limit: 20, keyword: doctorKeyword }),
    {
      enabled: !!isOpen,
    }
  );

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(prescriptionSchema),
    mode: 'onChange',
    defaultValues: {
      gender: EGender.male,
    },
  });

  const {
    mutate: mutateCreatePrescription,
    isLoading: isLoadingCreatePrescription,
  } = useMutation(
    () =>
      createPrescription({
        ...getValues(),
        branchId,
      }),
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(['PRESCRIPTION']);
        setOrderValue('prescriptionId', res.data.id, { shouldValidate: true });
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateCreatePrescription();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      title="Thông tin đơn thuốc"
      width={842}
      isLoading={isLoadingCreatePrescription}
    >
      <div className="flex py-8">
        <div className="w-1/2 pr-5">
          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Mã đơn thuốc
            </label>
            <CustomInput
              bordered={false}
              placeholder="Mã mặc định"
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(e) => setValue('code', e, { shouldValidate: true })}
            />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Bác sĩ kê đơn
            </label>
            <div className="grow">
              <CustomSelect
                options={doctors?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('doctorId')}
                onChange={(e) =>
                  setValue('doctorId', e, { shouldValidate: true })
                }
                showSearch={true}
                onSearch={debounce((value) => {
                  setDoctorKeyword(value);
                }, 300)}
                className="border-underline"
                suffixIcon={
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Image
                        src={ArrowDownIcon}
                        className=" pointer-events-none"
                      />
                    </div>
                    <Image
                      src={PlusIcon}
                      onClick={(e) => {
                        setIsOpenCreateDoctorModal(true);
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
              Cơ sở khám bệnh
            </label>
            <div className="grow">
              <CustomSelect
                options={hospitals?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                value={getValues('healthFacilityId')}
                onChange={(value) =>
                  setValue('healthFacilityId', value, { shouldValidate: true })
                }
                showSearch={true}
                onSearch={debounce((value) => {
                  setHospitalKeyword(value);
                }, 300)}
                className="border-underline"
                suffixIcon={
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Image src={ArrowDownIcon} />
                    </div>
                    <Image
                      src={PlusIcon}
                      onClick={() => setIsOpenCreateHospitalModal(true)}
                    />
                  </div>
                }
              />
            </div>
          </div>

          <div className=" mb-5 ">
            <div className="flex items-end">
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
                Tên bệnh nhân
              </label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) =>
                  setValue('name', value, { shouldValidate: true })
                }
              />
            </div>
            <InputError error={errors.name?.message} />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Tuổi
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow mr-2"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('age', value, { shouldValidate: true })
              }
            />
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
              Cân nặng
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('weight', value, { shouldValidate: true })
              }
            />
          </div>
        </div>

        <div className="w-1/2 pl-5">
          <div className=" mb-5 flex items-end flex-col">
            <div className='flex w-full items-center'>
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
                CMTND/Căn cước
              </label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) =>
                  setValue('identificationCard', value, { shouldValidate: true })
                }
              />
            </div>
            <div>
              <InputError error={errors.identificationCard?.message} />
            </div>
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Thẻ BHYT
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('healthInsuranceCard', value, { shouldValidate: true })
              }
            />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Địa chỉ
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('address', value, { shouldValidate: true })
              }
            />
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Người giám hộ
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('supervisor', value, { shouldValidate: true })
              }
            />
          </div>

          <div className=" mb-5 flex items-end flex-col">
            <div className='flex items-end w-full'>
              <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
                Điện thoại liên hệ
              </label>
              <CustomInput
                bordered={false}
                wrapClassName="grow"
                className="border-[#E4E4EB]"
                onChange={(value) =>
                  setValue('phone', value, { shouldValidate: true })
                }
              />
            </div>
            <div>
              <InputError error={errors.phone?.message} />
            </div>
          </div>

          <div className=" mb-5 flex items-end">
            <label className="mr-2 w-[120px] min-w-[120px] font-medium text-[#28293D]">
              Chuẩn đoán
            </label>
            <CustomInput
              bordered={false}
              wrapClassName="grow"
              className="border-[#E4E4EB]"
              onChange={(value) =>
                setValue('diagnostic', value, { shouldValidate: true })
              }
            />
          </div>
        </div>
      </div>

      <CreateDoctorModal
        isOpen={isOpenCreateDoctorModal}
        onCancel={() => setIsOpenCreateDoctorModal(false)}
        onSave={({ doctorId, doctorName }) => {
          setValue("doctorId", doctorId, {
            shouldValidate: true,
          });
          setDoctorKeyword(doctorName);
        }}
      />

      <AddHospitalModal
        isOpen={isOpenHospitalModal}
        onCancel={() => setIsOpenCreateHospitalModal(false)}
        onSave={({ healthFacilityId, healthFacilityName }) => {
          setValue("healthFacilityId", healthFacilityName, {
            shouldValidate: true,
          });
          setHospitalKeyword(healthFacilityName);
        }}
      />
    </CustomModal>
  );
}
