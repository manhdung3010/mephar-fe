import Image from 'next/image';
import { useState } from 'react';

import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';

import { checkSeriValid, getMarketOrderDetail, updateMarketOrderStatus, updateSeri } from '@/api/market.service';
import { formatNumber, getImage } from '@/helpers';
import { EOrderMarketStatus } from '@/modules/markets/type';
import { branchState } from '@/recoil/state';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useRecoilValue } from 'recoil';
import { schema } from './schema';
import { SeriDetailModal } from './SeriDetailModal';

export function ProcessOrder() {
  const router = useRouter();
  const queryClient = useQueryClient()
  const branchId = useRecoilValue(branchState);
  const { id } = router.query;
  const [openSeriDetailModal, setOpenSeriDetailModal] = useState(false);
  const [orderInfo, setOrderInfo] = useState<any>(null);

  const [inputValues, setInputValues] = useState({});
  const [seriInfo, setSeriInfo] = useState<any>(null);

  const handleInputChange = (key, value) => {
    setInputValues(prevValues => ({
      ...prevValues,
      [key]: value,
    }));
  };

  const { data: orderDetail, isLoading } = useQuery(
    ['MAKET_ORDER_ORDER_DETAIL', id],
    () => getMarketOrderDetail(id as string),
    {
      enabled: !!id,
      onSuccess: (res) => {
        setOrderInfo(res?.data?.item);
        setValue('products', res?.data?.item?.products?.map((product) => ({
          ...product,
          marketProductId: product.marketProductId,
          marketOrderProductId: product.id,
          listSeri: product.series?.map((seri) => seri?.code)
        })), { shouldValidate: true });
      }
    }
  );

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
    }
  });

  const { mutate: mutateUpdateOrder, isLoading: isLoadingDelete } =
    useMutation(
      () => {
        const payload = {
          status: EOrderMarketStatus.PROCESSING,
          products: getValues('products')?.map((product: any) => {
            return {
              marketProductId: product?.marketProductId,
              marketOrderProductId: product?.marketOrderProductId,
              listSeri: product?.listSeri.map((seri) => {
                return {
                  code: seri,
                  id: orderDetail?.data?.item?.products?.find((p) => p.marketProductId === product?.marketProductId)?.series?.find((s) => s.code === seri)?.id
                }
              })
            }
          })
        }
        return updateMarketOrderStatus(String(id), payload)
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["MAKET_ORDER_ORDER_DETAIL"]);
          await queryClient.invalidateQueries(["MAKET_ORDER"]);
          router.push('/transactions/order');
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );
  const { mutate: mutateUpdateSeri, isLoading: isLoadingUpdate } =
    useMutation(
      () => {
        const payload = {
          marketOrderId: id,
          products: getValues('products')?.map((product: any) => {
            return {
              marketProductId: product?.marketProductId,
              listSeri: product?.listSeri.map((seri) => {
                return {
                  code: seri,
                  id: orderDetail?.data?.item?.products?.find((p) => p.marketProductId === product?.marketProductId)?.series?.find((s) => s.code === seri)?.id
                }
              })
            }
          })
        }
        return updateSeri(payload)
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries(["MAKET_ORDER_ORDER_DETAIL"]);
          await queryClient.invalidateQueries(["MAKET_ORDER"]);
          router.push('/transactions/order');
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const onSubmit = () => {
    // validate if all seri = quantity
    const products: any = getValues('products');
    const isAllSeriValid = products.every((product) => product.listSeri.length === product.quantity);
    if (!isAllSeriValid) {
      message.error('Vui lòng nhập đủ seri cho sản phẩm');
      return;
    }
    mutateUpdateOrder()
  }
  const onUpdateSeri = () => {
    mutateUpdateSeri()
  }
  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">Xử lý đơn hàng</div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push('/transactions/order')}>Quay lại</CustomButton>
          <CustomButton onClick={handleSubmit(onUpdateSeri)}>Lưu</CustomButton>
          {
            (orderInfo?.status === EOrderMarketStatus.CONFIRM || orderInfo?.status === EOrderMarketStatus.PENDING) && (
              <CustomButton type="success" onClick={handleSubmit(onSubmit)}>Xử lý xong</CustomButton>
            )
          }
        </div>
      </div>

      <div className="bg-white p-5">
        <div className="mb-5 font-semibold text-[#232325] uppercase">
          MÃ ĐƠN HÀNG:{' '}
          <span className=" font-semibold text-[#0070F4]">{orderInfo?.code}</span>
        </div>

        <div className="mb-5 text-[#A3A8AF]">
          Người mua: <span className="ml-4 text-[#0F1824]">{orderInfo?.branch?.store?.name}</span>
        </div>

        <div className="mb-5 font-semibold text-[#232325] uppercase">sản phẩm ({formatNumber(getValues('products')?.length)})</div>

        {
          getValues('products')?.map((product: any, index) => (
            <div className="mb-5 flex items-center gap-3" key={product.id}>
              <div className='border border-[#d7d8e1] rounded-xl w-20 h-20 overflow-hidden flex-shrink-0'>
                <Image className=' object-cover' src={getImage(product?.marketProduct?.imageCenter?.path)} width={80} height={80} alt="" />
              </div>
              <div className="grow">
                <div
                  className="mb-2 cursor-pointer font-medium text-[#333] line-clamp-1"
                  onClick={() => {
                    setOpenSeriDetailModal(true);
                    setSeriInfo(product);
                  }}
                >
                  {product?.marketProduct?.product?.name}
                </div>
                <div className={`font-medium ${product?.listSeri?.length === product?.quantity ? 'text-[#05A660]' : 'text-[#FF8800]'}`}>Đã thêm: {product?.listSeri?.length}/{product?.quantity}</div>
              </div>
              <div className="w-[360px] flex-shrink-0">
                <div className="mb-2 text-[#A3A8AF]">Nhập seri để thêm:</div>
                <CustomInput
                  className="h-12"
                  onChange={(value) => {
                    handleInputChange(product?.id, value);
                  }}
                  placeholder='Nhập seri, nhấn enter để thêm'
                  value={inputValues[product?.id]}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      // validate if seri is existed
                      if (product?.listSeri?.includes(e.target.value)) {
                        message.error('Seri đã tồn tại trong sản phẩm này');
                        return;
                      }

                      // validate if seri is existed in other product
                      const allProduct: any = getValues('products');
                      const isSeriExisted = allProduct.some((p: any) => p.listSeri.includes(e.target.value));
                      if (isSeriExisted) {
                        message.error('Seri đã tồn tại trong sản phẩm khác');
                        return;
                      }

                      const isSeriValid: any = await checkSeriValid(e.target.value?.trim(), {});
                      if (isSeriValid?.data?.isExists) {
                        message.error('Seri đã tồn tại trong hệ thống');
                        return;
                      }

                      if (e.target.value?.trim()?.length <= 0) {
                        message.error('Seri của sản phẩm không được để trống')
                        return;
                      }
                      // validate if seri is enough
                      if (product?.listSeri?.length >= product?.quantity) {
                        message.error('Sản phẩm đã đủ seri');
                        return;
                      }
                      // update seri list of product
                      const products: any = cloneDeep(getValues('products'));
                      const productIndex = products.findIndex((p: any) => p.marketOrderProductId === product.id);
                      products[productIndex].listSeri.push(e.target.value);
                      setValue('products', products, { shouldValidate: true });

                      // clear value
                      setInputValues(prevValues => ({
                        ...prevValues,
                        [product?.id]: '',
                      }));
                    }
                  }} />
              </div>
            </div>
          ))
        }
      </div>

      <SeriDetailModal
        isOpen={openSeriDetailModal}
        onCancel={() => setOpenSeriDetailModal(false)}
        seriInfo={seriInfo}
        getValues={getValues}
        setValue={setValue}
      />
    </>
  );
}
