import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useResetRecoilState } from 'recoil';

import { login } from '@/api/auth.service';
import HidePassword from '@/assets/images/hide-password.png';
import ViewPassword from '@/assets/images/view-password.png';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import Label from '@/components/CustomLabel';
import InputError from '@/components/InputError';
import { setRefreshToken, setToken } from '@/helpers/storage';
import {
  branchState,
  orderActiveState,
  orderState,
  productImportState,
} from '@/recoil/state';

import { schema } from './schema';

export function SignIn() {
  const resetBranch = useResetRecoilState(branchState);
  const resetOrderObject = useResetRecoilState(orderState);
  const resetOrderActive = useResetRecoilState(orderActiveState);
  const resetProductsImport = useResetRecoilState(productImportState);

  const [isHidePassword, setIsHidePassword] = useState(true);

  const router = useRouter();

  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const { mutate: mutateSignIn, isLoading } = useMutation(
    () => login(getValues()),
    {
      onSuccess(data) {
        setToken(data.data.accessToken.token);
        setRefreshToken(data.data.refreshToken.token);

        message.success('Đăng nhập thành công!', 1);
        setTimeout(() => {
          router.push('/');
        }, 1000);
      },
      onError(err: any) {
        message.error(err?.message);
      },
    }
  );

  const onSubmit = () => {
    mutateSignIn();
  };

  useEffect(() => {
    setToken('');
    setRefreshToken('');
    resetBranch();
    resetOrderObject();
    resetOrderActive();
    resetProductsImport();
  }, []);

  return (
    <div className=" mx-auto flex max-w-[850px] flex-col items-center justify-center py-[65px]">
      <div className="mb-[50px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="113"
          height="72"
          viewBox="0 0 113 72"
          fill="none"
        >
          <path
            d="M36.4177 61.399L37.3694 58.5786H22.7858V61.399H22.7925L22.7858 63.5815L22.7842 63.9951V64.5283V71.2637H36.4143L37.3678 68.4383H26.2706L26.2723 66.1644H35.6835L36.5572 63.5815H26.2739L26.2789 61.399H36.4177Z"
            fill="#EE0033"
          />
          <path
            d="M75.3034 58.5737H71.8153L71.8103 63.5866L62.4224 63.5833L62.4357 58.5737H58.9476L58.9326 64.5284H58.9442L58.9459 71.2638H62.4323L62.4307 66.412H71.8103L71.8137 71.2638H75.3001L75.3034 58.5737Z"
            fill="#EE0033"
          />
          <path
            d="M10.1557 67.9366L4.35715 58.5752H0.766066L0.764404 71.2636H4.16115L4.16281 63.8937L8.5628 71.0726H11.5742L15.9675 63.8937L15.9659 71.2636H19.454L19.4573 58.5752H15.9692L10.1557 67.9366Z"
            fill="#EE0033"
          />
          <path
            d="M89.8883 58.575H86.0148L78.356 71.2633H90.9065L89.5062 68.9197H83.7393L87.9001 61.872L93.496 71.2633H97.5422L89.8883 58.575Z"
            fill="#EE0033"
          />
          <path
            d="M56.4308 62.3906C56.4308 59.0869 53.6403 58.5786 51.8581 58.5786H41.7509L40.7941 61.4007H44.3121V61.399H51.5807C52.0109 61.399 52.8862 61.4272 52.8862 62.4969C52.8862 63.5782 52.059 63.5683 51.5275 63.5683H44.3221V63.5649H40.7941L40.7925 71.2653H44.2905V66.3853H51.8581C53.5407 66.3837 56.4308 66.3488 56.4308 62.3906Z"
            fill="#EE0033"
          />
          <path
            d="M97.0786 63.5633L106.126 71.2637H111.386L105.528 66.3836H108.144C109.828 66.3836 112.717 66.3471 112.717 62.3906C112.717 59.0869 109.926 58.5786 108.146 58.5786H98.0387L97.0819 61.4007H100.6V61.399H107.867C108.297 61.399 109.172 61.4272 109.172 62.4969C109.172 63.5782 108.345 63.5683 107.814 63.5683H100.607V63.5649H97.0786V63.5633Z"
            fill="#EE0033"
          />
          <path
            d="M95.1133 23.3768C95.1731 23.8634 95.2046 24.3568 95.2046 24.8517C95.2046 25.5244 95.1482 26.1905 95.0369 26.8466C93.6134 35.3343 83.1989 42.3985 69.1352 45.0777C67.5789 45.375 65.9777 45.6176 64.3416 45.8019C64.3001 45.8069 64.2619 45.8119 64.222 45.8152C62.6557 45.9896 61.0561 46.1125 59.4284 46.1773C58.4982 46.2139 57.5581 46.2338 56.6113 46.2338C55.5831 46.2338 54.5633 46.2105 53.5551 46.1673V43.234V39.7526V26.8466V23.3768V23.3452V18.4436V9.95091V8.32645V6.46945C52.1748 6.5442 50.8144 6.66877 49.4773 6.84318L48.7598 7.7667L46.2699 10.9774L43.9661 13.9473L38.9781 20.377L34.2974 16.2444L31.2379 13.5437C30.1316 14.3658 29.1517 15.2379 28.3029 16.1564C27.8943 16.5982 27.5172 17.05 27.1684 17.5134C25.7665 19.3821 24.9211 21.3487 24.647 23.3784C24.5806 23.8668 24.5474 24.3584 24.5474 24.8534C24.5474 25.5244 24.6088 26.1905 24.7301 26.8483C25.0706 28.6936 25.8861 30.4842 27.1684 32.1934C27.9973 33.2979 29.0022 34.346 30.1748 35.326C31.198 36.1814 32.3474 36.9887 33.6214 37.7394L37.0281 35.2778C35.7342 34.5437 34.5765 33.7364 33.5749 32.8694C31.5103 31.0821 30.115 29.0375 29.5819 26.8466C29.4224 26.1938 29.341 25.5278 29.341 24.8517C29.341 24.3534 29.3859 23.8618 29.4722 23.3768C29.7463 21.8337 30.4472 20.3604 31.5103 18.9901L36.48 23.3768L39.6824 26.2038L41.8766 23.3768L43.9628 20.6876L48.7564 14.507V21.9051V23.3768V26.8067L48.7016 26.8466H48.7564V39.2127V42.7623V45.7886V49.3017C50.3344 49.4661 51.9339 49.5807 53.5501 49.6438C54.5633 49.6853 55.5815 49.7053 56.6063 49.7053C57.5498 49.7053 58.4899 49.6887 59.4234 49.6538C61.0395 49.594 62.6407 49.486 64.217 49.3266C64.2569 49.3232 64.2968 49.3183 64.3366 49.3149C65.9611 49.1488 67.5606 48.9313 69.1303 48.6622C75.8224 47.5144 81.9615 45.4465 87.0641 42.568C91.092 40.2974 94.2595 37.6431 96.4819 34.6782C98.3556 32.1801 99.485 29.5557 99.8571 26.8483C99.9485 26.1888 99.9933 25.5228 99.9933 24.8534C99.9933 24.3584 99.9684 23.8684 99.9186 23.3784C99.6279 20.4866 98.4735 17.6845 96.4803 15.0269C94.2562 12.0637 91.0887 9.40776 87.0624 7.13718C81.9598 4.26033 75.8208 2.19072 69.1286 1.04297V4.62408C83.4846 7.35975 94.037 14.6598 95.1133 23.3768Z"
            fill="#EE0033"
          />
          <path
            d="M26.5932 42.8123C31.5746 45.5446 37.511 47.5212 43.964 48.6391V45.0546C38.7102 44.0431 33.9681 42.4186 30.0199 40.3357C28.6994 39.6381 27.4652 38.8906 26.3324 38.0967C21.8261 34.9441 18.8895 31.0723 18.1819 26.8467C18.0706 26.1906 18.0142 25.5246 18.0142 24.8519C18.0142 24.3569 18.0457 23.8652 18.1055 23.3769C18.5822 19.5151 20.9176 15.9323 24.6183 12.901C25.6132 12.0871 26.7078 11.3131 27.8888 10.5839C32.2124 7.913 37.7269 5.84838 43.964 4.64748C45.5187 4.3485 47.1199 4.10101 48.7576 3.91332C49.8157 3.79206 50.887 3.69406 51.9716 3.62098C52.4965 3.5861 53.0214 3.5562 53.5529 3.53461C54.5611 3.49142 55.581 3.46817 56.6091 3.46817C56.8467 3.46817 57.0825 3.46983 57.3184 3.47315C58.026 3.47813 58.7286 3.49807 59.4262 3.52464V43.2458C61.0523 43.1661 62.6535 43.0149 64.2198 42.7973V26.8467H88.4871C88.61 26.189 88.6698 25.5229 88.6698 24.8519C88.6698 24.3586 88.6365 23.8669 88.5701 23.3769C88.296 21.3472 87.4506 19.3805 86.0487 17.5119C84.396 15.3094 82.044 13.3378 79.0576 11.6519C76.1491 10.0125 72.7873 8.72855 69.1331 7.83826V11.5323C69.3191 11.5855 69.5018 11.6386 69.6862 11.6934C77.3932 14.0205 82.848 18.3358 83.7449 23.3752H64.2198V0.378708C62.8163 0.237523 61.3928 0.134541 59.9561 0.0730844C59.7783 0.0647794 59.6023 0.0581346 59.4262 0.0514906C58.4927 0.0166096 57.5526 0 56.6091 0C55.9929 0 55.3783 0.0066439 54.7671 0.0232539H54.7654C54.3585 0.0315589 53.9565 0.0448462 53.5529 0.0614562C51.9351 0.124574 50.3355 0.239183 48.7576 0.403622C47.1331 0.573044 45.5336 0.792298 43.964 1.0647C37.3183 2.21577 31.2208 4.27707 26.1497 7.13732C25.7062 7.38813 25.2744 7.64226 24.8508 7.90304C23.6649 8.63056 22.562 9.39295 21.5471 10.1902C19.6336 11.6885 18.0225 13.3046 16.7319 15.0271C14.7387 17.6847 13.5859 20.4868 13.2953 23.3786C13.2471 23.8669 13.2222 24.3586 13.2222 24.8535C13.2222 25.5246 13.2687 26.189 13.3584 26.8484C13.7304 29.5558 14.8599 32.1819 16.7335 34.6784C18.3281 36.8044 20.4077 38.7711 22.9423 40.55C23.9423 41.2526 25.0136 41.9253 26.1514 42.5681C26.2959 42.6495 26.4437 42.7309 26.5932 42.8123Z"
            fill="#EE0033"
          />
        </svg>

        <div className="text-[7.127px] font-medium text-[#EE0033]">
          PHẦN MỀN QUẢN LÝ NHÀ THUỐC
        </div>
      </div>

      <div className="mb-[55px] text-center">
        <h1 className=" text-[34px] font-bold">
          Dùng ngay phần mềm quản lý thuốc miễn phí
        </h1>
        <div className=" text-base ">
          Hơn 10.000 quầy thuốc, nhà thuốc tin dùng
        </div>
      </div>

      <div className="w-full max-w-[400px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <Label label="Tên đăng nhập" hasInfoIcon={false} />
            <CustomInput
              className="h-11"
              placeholder="Tên đăng nhập"
              onChange={(e) => setValue('username', e, { shouldValidate: true })}
            />
            <InputError error={errors.username?.message} />
          </div>

          <div className="mb-4">
            <Label label="Mật khẩu" hasInfoIcon={false} />
            <CustomInput
              type={isHidePassword ? 'password' : 'text'}
              className="h-11"
              placeholder="Mật khẩu"
              onChange={(e) => setValue('password', e, { shouldValidate: true })}
              suffixIcon={
                <Image
                  src={isHidePassword ? HidePassword : ViewPassword}
                  alt=""
                  onClick={() => setIsHidePassword((pre) => !pre)}
                  width={16}
                  height={16}
                  className=" cursor-pointer"
                />
              }
            />
            <InputError error={errors.password?.message} />
          </div>

          <div className="mb-4">
            <CustomButton
              className="!h-11 w-full"
              type="primary"
              htmlType="submit"
              disabled={isLoading}
              loading={isLoading}
            >
              Đăng nhập
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
}
