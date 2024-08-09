import { deletMarketCart, getConfigProduct, getMarketCart, updateMarketCart } from '@/api/market.service'
import DeleteIcon from '@/assets/deleteRed.svg'
import StoreIcon from '@/assets/storeIcon.svg'
import { CustomButton } from '@/components/CustomButton'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomInput } from '@/components/CustomInput'
import DeleteModal from '@/components/CustomModal/ModalDeleteItem'
import { formatMoney, getImage } from '@/helpers'
import { branchState, marketCartState, paymentProductState } from '@/recoil/state'
import { useMutation, useQuery } from '@tanstack/react-query'
import { message, Radio } from 'antd'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import ProductCard from '../product-list/ProductCard'
import { useRouter } from 'next/router'

function Cart() {
  const branchId = useRecoilValue(branchState);
  const router = useRouter()
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
  const [paymentProduct, setPaymentProduct] = useRecoilState(paymentProductState);
  const [storeSelected, setStoreSelected] = useState(null);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [productId, setProductId] = useState(null);
  const [cartTemp, setCartTemp] = useState<any>(null);

  const [cartList, setCartList] = useState<any>([]);

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
  const { mutate: mutateUpdateCart, isLoading: isUpdateCart } =
    useMutation(
      (value: {
        id: string;
        quantity: number;
      }) => {
        return updateMarketCart(String(value?.id), Number(value?.quantity))
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

  useEffect(() => {
    if (marketCart) {
      const newCartList = marketCart.map((cart) => {
        return {
          ...cart,
          products: cart?.products.map((product) => {
            if (cart?.storeId === storeSelected) {
              return {
                ...product,
                selected: true
              }
            } else {
              return {
                ...product,
                selected: false
              }
            }
          })
        }
      })

      setCartList(newCartList)
    }
  }, [marketCart])

  const handleDelete = () => {
    mutateDeleteCart()
  }

  const updateQuantity = (id, value) => {
    if (value < 1) {
      message.error('Số lượng mua tối thiểu là 1')
      return
    }
    mutateUpdateCart({ id, quantity: value })
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
            cartList?.map((cart) => (
              <div className='flex flex-col gap-3' key={cart?.storeId}>
                <div className=''>
                  <div className='grid grid-cols-12 p-[22px] bg-white rounded font-semibold border-b-[1px] border-[#DDDDDD]'>
                    <div className='col-span-6 flex items-center'>
                      <Radio
                        value={cart?.storeId}
                        checked={storeSelected === cart?.storeId}
                        onChange={() => {
                          setStoreSelected(cart?.storeId)

                          const newCartList = cartList.map((cartItem) => {
                            if (cartItem?.storeId === cart?.storeId) {
                              return {
                                ...cartItem,
                                products: cartItem?.products.map((product) => {
                                  return {
                                    ...product,
                                    selected: true
                                  }
                                })
                              }
                            } else {
                              return {
                                ...cartItem,
                                products: cartItem?.products.map((product) => {
                                  return {
                                    ...product,
                                    selected: false
                                  }
                                })
                              }
                            }
                          })
                          setCartList(newCartList)
                        }}
                      />
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
                          <CustomCheckbox
                            disabled={storeSelected !== cart?.storeId}
                            checked={product?.selected}
                          />
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
                                updateQuantity(product?.id, value)
                              }}
                              onMinus={async (value) => {
                                updateQuantity(product?.id, value)
                              }}
                              onPlus={async (value) => {
                                updateQuantity(product?.id, value)
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
                <div className='flex justify-between items-center'>
                  <div
                    className='cursor-pointer'
                    onClick={() => {
                      // unselected all product
                      const newCartList = cartList.map((cartItem) => {
                        return {
                          ...cartItem,
                          products: cartItem?.products.map((product) => {
                            return {
                              ...product,
                              selected: false
                            }
                          })
                        }
                      })
                      setCartList(newCartList)
                    }}
                  >
                    Bỏ chọn tất cả
                  </div>
                  <div className='font-medium text-base'>Tổng thanh toán (0 sản phẩm): <span className='text-red-main ml-4'>{formatMoney(3000000)}</span></div>
                </div>
                <div className='flex justify-end mt-5'>
                  <CustomButton
                    className='!w-[300px] !h-[46px]'
                    disabled={!storeSelected}
                    onClick={() => {
                      const paymentProduct = cartList?.filter((item) => item.storeId === storeSelected && item?.products?.filter((product) => product?.selected)?.length > 0)
                      if (paymentProduct?.length <= 0) {
                        message.error('Vui lòng chọn sản phẩm')
                        return
                      }
                      setPaymentProduct(paymentProduct)
                      router.push('/markets/payment')
                    }}
                  >
                    Mua hàng
                  </CustomButton>
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