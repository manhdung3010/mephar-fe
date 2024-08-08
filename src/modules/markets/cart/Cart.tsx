import Image from 'next/image'
import React, { useState } from 'react'
import StoreIcon from '@/assets/storeIcon.svg'
import { CustomRadio } from '@/components/CustomRadio'
import { CustomCheckbox } from '@/components/CustomCheckbox'
import { CustomInput } from '@/components/CustomInput'
import Logo from "@/public/apple-touch-icon.png";
import DeleteIcon from '@/assets/deleteRed.svg'
import { formatMoney } from '@/helpers'
import { CustomButton } from '@/components/CustomButton'
import { useQuery } from '@tanstack/react-query'
import { getConfigProduct } from '@/api/market.service'
import ProductCard from '../product-list/ProductCard'

function Cart() {

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

  const { data: configProduct, isLoading } = useQuery(
    ['CONFIG_PRODUCT', JSON.stringify(formFilter)],
    () => getConfigProduct(formFilter),
  );
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
        <div className='flex flex-col gap-3'>
          <div className='border-b-[1px] border-[#DDDDDD]'>
            <div className='grid grid-cols-12 p-[22px] bg-white rounded font-semibold border-b-[1px] border-[#DDDDDD]'>
              <div className='col-span-6 flex items-center'>
                <CustomRadio value={true} onChange={() => { }} options={[{
                  label: '',
                  value: 1
                }]} />
                <div className='ml-7 mr-2 grid place-items-center'>
                  <Image src={StoreIcon} />
                </div>
                <span>TIM Care Diamond</span>
              </div>
            </div>
            <div className='grid grid-cols-12 p-[22px] bg-white rounded'>
              <div className='col-span-6 flex items-center'>
                <CustomCheckbox />
                <div className='ml-12 mr-5 w-20 h-20 rounded overflow-hidden border-[#E4E4EB] border-[1px] grid place-items-center'>
                  <Image src={Logo} />
                </div>
                <span>Otive - Viên uống hỗ trợ não bộ</span>
              </div>
              <div className='col-span-6 grid grid-cols-4 items-center gap-2'>
                <div className='text-center'>
                  64.000 VND
                </div>
                <div className='text-center'>
                  <CustomInput
                    wrapClassName=""
                    className="!h-7 !w-20 text-center text-lg mx-auto"
                    hasMinus={true}
                    hasPlus={true}
                    defaultValue={1}
                    // value={isNaN(quantity) ? 0 : quantity}
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
                  640.000 VND
                </div>
                <div className='text-center'>
                  <Image src={DeleteIcon} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className='grid grid-cols-12 p-[22px] bg-white rounded font-semibold border-b-[1px] border-[#DDDDDD]'>
              <div className='col-span-6 flex items-center'>
                <CustomRadio value={true} onChange={() => { }} options={[{
                  label: '',
                  value: 1
                }]} />
                <div className='ml-7 mr-2 grid place-items-center'>
                  <Image src={StoreIcon} />
                </div>
                <span>TIM Care Diamond</span>
              </div>
            </div>
            <div className='grid grid-cols-12 p-[22px] bg-white rounded'>
              <div className='col-span-6 flex items-center'>
                <CustomCheckbox />
                <div className='ml-12 mr-5 w-20 h-20 rounded overflow-hidden border-[#E4E4EB] border-[1px] grid place-items-center'>
                  <Image src={Logo} />
                </div>
                <span>Otive - Viên uống hỗ trợ não bộ</span>
              </div>
              <div className='col-span-6 grid grid-cols-4 items-center gap-2'>
                <div className='text-center'>
                  64.000 VND
                </div>
                <div className='text-center'>
                  <CustomInput
                    wrapClassName=""
                    className="!h-7 !w-20 text-center text-lg mx-auto"
                    hasMinus={true}
                    hasPlus={true}
                    defaultValue={1}
                    // value={isNaN(quantity) ? 0 : quantity}
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
                  640.000 VND
                </div>
                <div className='text-center'>
                  <Image src={DeleteIcon} />
                </div>
              </div>
            </div>
          </div>
        </div>

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
    </div>
  )
}

export default Cart