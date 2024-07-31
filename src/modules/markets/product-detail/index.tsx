import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Label from '@/components/CustomLabel';
import CartIcon from '@/assets/cartIconRed.svg';
import { CustomInput } from '@/components/CustomInput';
import { CustomButton } from '@/components/CustomButton';
import StoreCard from './StoreCard';
import ArrowIcon from '@/assets/arrow-down-red-icon.svg';
import { productList } from '../product-list';
import ProductCard from '../product-list/ProductCard';

const ProductDetail = () => {

  const [isShowDetail, setIsShowDetail] = React.useState(false);

  const settings = {
    customPaging: function (i) {
      return (
        <a className='h-24 w-24'>
          <img className='object-cover h-full' src={`https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75`} />
        </a>
      );
    },
    dots: true,
    navigator: false,
    dotsClass: "slick-dots slick-thumb",
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className='bg-[#fafafc]'>
      <div className="fluid-container">
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className='!text-red-main'>
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">Chi tiết sản phẩm</a>
            </li>
          </ul>
        </nav>
        <div className="flex gap-6 mt-3 bg-white p-4 rounded-2xl">
          <div className='slider-container w-2/5'>
            <Slider {...settings}>
              <div className='border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]'>
                <img src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} className='w-full h-full object-cover' />
              </div>
              <div className='border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]'>
                <img src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} className='w-full h-full object-cover' />

              </div>
              <div className='border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]'>
                <img src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} className='w-full h-full object-cover' />
              </div>
              <div className='border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]'>
                <img src={"https://mephar-sit.acdtech.asia/_next/image/?url=https%3A%2F%2Fmephar-sit-api.acdtech.asia%2F%2Fupload%2Fimages%2F2024-06-14%2Fed4c6e71-4f03-42a0-8bac-a7238ce4c63b.jpeg&w=256&q=75"} className='w-full h-full object-cover' />
              </div>
            </Slider>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              OTiV – Viên Uống Hỗ Trợ Não Bộ Chính Hãng Của Mỹ
            </h1>
            <p className='mt-4'>Đã bán 2.6k</p>
            <div className="text-red-main text-xl mt-[22px]">
              1.000.000 VND <span className='text-gray-500 ml-3'>Giá gốc: <span className="line-through">1.500.000 VND</span></span>
            </div>
            <p className="mt-4 text-gray-700">
              PANCAL được bào chế dạng dung dịch uống, với mùi vị hương cam dễ sử dụng. Thuốc giúp bổ sung calci ở những người thiếu hụt calci.
            </p>
            <div className="mt-4 flex items-center gap-6">
              <span>Số lượng:</span>
              <CustomInput
                wrapClassName="!w-[110px]"
                className="!h-8 !w-[80px] text-center text-lg"
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
              <div className='text-[#3E7BFA] py-1 px-4 bg-[#ecf0ff] rounded'>Còn hàng</div>
            </div>
            <div className="mt-6 space-x-3 flex pb-[22px] border-b-[1px] border-[#C7C9D9]">
              <CustomButton outline className='!h-[46px]' prefixIcon={<Image src={CartIcon} />}>Thêm vào giỏ hàng</CustomButton>
              <CustomButton className='!h-[46px]'>Đặt hàng</CustomButton>
            </div>

            <div className=' mt-6 flex flex-col gap-3'>
              <span>Mã: P198354</span>
              <div className='w-fit py-1 px-4 bg-[#ecf0ff] rounded'>Thực phẩm chống lão hóa</div>
            </div>
          </div>
        </div>

        <div className='my-6'>
          <StoreCard />
        </div>

        <div className='grid grid-cols-12  gap-10 '>
          <div className='col-span-9 '>
            <div className='bg-white rounded-2xl py-6 px-7'>
              <h5 className='bg-[#FAFAFA] text-xl font-semibold p-5 rounded-lg uppercase'>Thông tin sản phẩm</h5>
              <div className='mt-6'>
                <div className={isShowDetail ? '' : 'line-clamp-5'}>
                  1. CÔNG DỤNG
                  OTiV chứa các hoạt chất sinh học quý được tinh chiết từ Blueberry
                  Giúp cải thiện tình trạng thiếu máu não, mất ngủ, đau nửa đầu; giảm nguy cơ tai biến mạch máu não.
                  Giúp cải thiện tình trạng sa sút trí tuệ, suy giảm trí nhớ; giảm stress; cải thiện thính giác và thị giác.
                  Hỗ trợ chống oxy hóa, trung hòa gốc tự do, bảo vệ và chống lão hóa tế bào thần kinh.
                  1. CÔNG DỤNG
                  OTiV chứa các hoạt chất sinh học quý được tinh chiết từ Blueberry
                  Giúp cải thiện tình trạng thiếu máu não, mất ngủ, đau nửa đầu; giảm nguy cơ tai biến mạch máu não.
                  Giúp cải thiện tình trạng sa sút trí tuệ, suy giảm trí nhớ; giảm stress; cải thiện thính giác và thị giác.
                  Hỗ trợ chống oxy hóa, trung hòa gốc tự do, bảo vệ và chống lão hóa tế bào thần kinh.
                  1. CÔNG DỤNG
                  OTiV chứa các hoạt chất sinh học quý được tinh chiết từ Blueberry
                  Giúp cải thiện tình trạng thiếu máu não, mất ngủ, đau nửa đầu; giảm nguy cơ tai biến mạch máu não.
                  Giúp cải thiện tình trạng sa sút trí tuệ, suy giảm trí nhớ; giảm stress; cải thiện thính giác và thị giác.
                  Hỗ trợ chống oxy hóa, trung hòa gốc tự do, bảo vệ và chống lão hóa tế bào thần kinh.
                  1. CÔNG DỤNG
                  OTiV chứa các hoạt chất sinh học quý được tinh chiết từ Blueberry
                  Giúp cải thiện tình trạng thiếu máu não, mất ngủ, đau nửa đầu; giảm nguy cơ tai biến mạch máu não.
                  Giúp cải thiện tình trạng sa sút trí tuệ, suy giảm trí nhớ; giảm stress; cải thiện thính giác và thị giác.
                  Hỗ trợ chống oxy hóa, trung hòa gốc tự do, bảo vệ và chống lão hóa tế bào thần kinh.
                </div>
              </div>
              <div className='flex justify-center mt-3'>
                <CustomButton
                  onClick={() => setIsShowDetail(!isShowDetail)}
                  className='!border-0 !w-fit'
                  outline suffixIcon={<Image src={ArrowIcon} className={isShowDetail ? '' : 'rotate-180'} />}>{isShowDetail ? 'Thu gọn' : 'Xem thêm'}</CustomButton></div>
            </div>

            <div className='mt-6'>
              <h2 className='text-[32px] font-semibold'>Sản phẩm khác của đại lý</h2>
              <div className='grid grid-cols-3 gap-10 mt-6 '>
                {
                  productList?.slice(0, 3).map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))
                }
              </div>
            </div>
          </div>
          <div className='col-span-3'>
            <h4 className='text-center text-base font-bold mb-4'>Có thể bạn muốn mua</h4>
            <div className='grid grid-col-1 gap-10'>
              {
                productList?.slice(0, 4).map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
