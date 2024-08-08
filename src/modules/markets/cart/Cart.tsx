import Image from 'next/image'
import React, { useState } from 'react'
import StoreIcon from '@/assets/storeIcon.svg'
import { CustomRadio } from '@/components/CustomRadio'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomInput } from '@/components/CustomInput'
import Logo from "@/public/apple-touch-icon.png";
import DeleteIcon from '@/assets/deleteRed.svg'
import { formatMoney, getImage } from '@/helpers'
import { CustomButton } from '@/components/CustomButton'
import { useMutation, useQuery } from '@tanstack/react-query'
import { deletMarketCart, getConfigProduct, getMarketCart } from '@/api/market.service'
import ProductCard from '../product-list/ProductCard'
import { useRecoilState, useRecoilValue } from 'recoil'
import { branchState, marketCartState } from '@/recoil/state'
import { message, Radio } from 'antd'
import DeleteModal from '@/components/CustomModal/ModalDeleteItem'

function Cart() {
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    isConfig: false,
    type: 'common'
  });

  const [marketCart, setMarketCart] = useRecoilState(marketCartState);
  const [storeSelected, setStoreSelected] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [productId, setProductId] = useState(null);
  const [cartTemp, setCartTemp] = useState<any>(null);

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter)],
    () => getConfigProduct(formFilter),
  );

  const { mutate: mutateDeleteCart, isLoading: isLoadingDelete } =
    useMutation(
      () => {
        return deletMarketCart(String(productId))
      },
      {
        onSuccess: async (res) => {
          setCartTemp(new Date().getTime())
        },
        onError: (err: any) => {
          message.error(err?.message);
        },
      }
    );

  const { data: marketCartRes, isLoading: isLoadingMarketCart } = useQuery(
    ['MARKET_CART', cartTemp],
    () => getMarketCart({ branchId }),
    {
      onSuccess: (res) => {
        setMarketCart(res?.data?.item)
      }
    }
  );

  const handleDelete = () => {
    // const newCart = marketCart?.map((cart) => {
    //   const newProducts = cart?.products.filter((product) => product?.marketProduct?.store?.id !== storeSelected)
    //   return {
    //     ...cart,
    //     products: newProducts
    //   }
    // })
    // setMarketCart(newCart)
    mutateDeleteCart()
  }

  return (
    <div className='bg-[#fafafc]'>
      <div className='fluid-container'>
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Giỏ hàng</a>
            </li>
          </ul>
        </nav>

        <div className='grid grid-cols-12 p-[26px] bg-white rounded my-4 font-semibold'>
          <div className='col-span-6'>
            Sản phẩm
          </div>
          <div className='col-span-6 grid grid-cols-4 gap-2'>
            <div className='text-center'>
              Đơn giá
            </div>
            <div className='text-center'>
              Số lượng
            </div>
            <div className='text-center'>
              Số tiền
            </div>
            <div className='text-center'>
              Thao tác
            </div>
          </div>
        </div>
        <Radio.Group className='flex flex-col gap-3'>
          {
            marketCart?.map((cart) => (
              <div className='flex flex-col gap-3' key={cart?.storeId}>
                <div className=''>
                  <div className='grid grid-cols-12 p-[22px] bg-white rounded font-semibold border-b-[1px] border-[#DDDDDD]'>
                    <div className='col-span-6 flex items-center'>
                      <Radio value={cart?.storeId} onChange={() => setStoreSelected(cart?.storeId)} />
                      <div className='ml-7 mr-2 grid place-items-center'>
                        <Image src={StoreIcon} />
                      </div>
                      <span>{cart?.products[0]?.marketProduct?.store?.name}</span>
                    </div>
                  </div>
                  {
                    cart?.products.map((product, index) => (
                      <div className={`grid grid-cols-12 p-[22px] bg-white rounded ${index === cart?.products?.length - 1 ? 'border-0' : 'border-b-[1px] border-[#DDDDDD]'}`} key={product?.id}>
                        <div className='col-span-6 flex items-center'>
                          <CustomCheckbox disabled={storeSelected !== cart?.storeId} />
                          <div className='ml-12 mr-5 w-20 h-20 rounded overflow-hidden border-[#E4E4EB] border-[1px] grid place-items-center'>
                            <Image src={getImage(product?.marketProduct?.imageCenter?.path)} className='object-cover' width={80} height={80} />
                          </div>
                          <span>{product?.marketProduct?.product?.name}</span>
                        </div>
                        <div className='col-span-6 grid grid-cols-4 items-center gap-2'>
                          <div className='text-center'>
                            {formatMoney(product?.marketProduct?.price)}
                          </div>
                          <div className='text-center'>
                            <CustomInput
                              wrapClassName=""
                              className="!h-7 !w-20 text-center text-base mx-auto"
                              hasMinus={true}
                              hasPlus={true}
                              value={product?.quantity}
                              type="number"
                              onChange={(value) => {

                              }}
                              onMinus={async (value) => {

                              }}
                              onPlus={async (value) => {

                              }}
                              onBlur={(e) => {

                              }}
                            />
                          </div>
                          <div className='text-center'>
                            {formatMoney(+product?.marketProduct?.price * +product?.marketProduct?.quantity)}
                          </div>
                          <div className='text-center cursor-pointer' onClick={() => {
                            setOpenDeleteConfirm(true)
                            setProductId(product?.id)
                          }}>
                            <Image src={DeleteIcon} />
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            ))
          }
        </Radio.Group>

        {
          marketCart?.length > 0 && (
            <div className='bg-white shadow-lg p-6 mt-3'>
              <div className=''>
                <div className='flex justify-end'>
                  <div className='font-medium text-base'>Tổng thanh toán (0 sản phẩm): <span className='text-red-main ml-4'>{formatMoney(3000000)}</span></div>
                </div>
                <div className='flex justify-end mt-5'>
                  <CustomButton className='!w-[300px] !h-[46px]'>Mua hàng</CustomButton>
                </div>
              </div>
            </div>
          )
        }

        <div className='mt-12'>
          <h4 className='text-5xl font-semibold text-center'>Có thể bạn muốn mua</h4>

          <div className='mt-12 grid grid-cols-4 gap-10'>
            {
              configProduct?.data?.items.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))
            }
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={openDeleteConfirm}
        onCancel={() => setOpenDeleteConfirm(false)}
        onSuccess={() => {
          handleDelete()
          setOpenDeleteConfirm(false)
        }}
        content={'sản phẩm'}
      // isLoading={isLoadingDelete}
      />
    </div>
  )
}

export default Cart