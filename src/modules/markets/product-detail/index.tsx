import { getSaleProductDetail } from '@/api/market.service';
import ArrowIcon from '@/assets/arrow-down-red-icon.svg';
import CartIcon from '@/assets/cartIconRed.svg';
import { CustomButton } from '@/components/CustomButton';
import { CustomInput } from '@/components/CustomInput';
import { formatMoney, formatNumber, getImage } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Slider from "react-slick";
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import StoreCard from './StoreCard';

const ProductDetail = () => {
  const [isShowDetail, setIsShowDetail] = React.useState(false);

  const [images, setImages] = React.useState<any>([]);
  const router = useRouter();
  const { id } = router.query;

  const settings = {
    customPaging: function (i) {
      return (
        <a className='h-24 w-24 '>
          <img className='object-cover h-full border-[#C7C9D9] border-[1px] rounded overflow-hidden' src={images[i]?.filePath} />
        </a>
      );
    },
    dots: true,
    navigator: false,
    dotsClass: "slick-dots slick-thumb",
    // infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  const { data: configProduct, isLoading } = useQuery(
    ['MARKET_PRODUCT_DETAIL', JSON.stringify(id)],
    () => getSaleProductDetail(String(id)),
  );

  useEffect(() => {
    if (configProduct?.data?.item) {
      const newImages = [...[configProduct?.data?.item.imageCenter], ...configProduct?.data?.item.images]
      setImages(newImages)
    }
  }, [configProduct])

  console.log('images', images)
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
          <div className={`slider-container w-2/5 ${images?.length <= 1 ? 'hidden-slide' : ''}`}>
            <Slider {...settings}>
              {
                images?.map((image) => (
                  <div className='border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]' key={image?.id}>
                    <img src={getImage(image?.path)} className='w-full h-full object-cover' />
                  </div>
                ))
              }
            </Slider>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              {configProduct?.data?.item?.product?.name} - {configProduct?.data?.item?.productUnit?.unitName}
            </h1>
            <p className='mt-4'>Đã bán {formatNumber(configProduct?.data?.item?.quantitySold)}</p>
            <div className="text-red-main text-xl mt-[22px]">
              {configProduct?.data?.item?.discountPrice > 0 ? formatMoney(configProduct?.data?.item?.discountPrice) : formatMoney(configProduct?.data?.item?.price)}
              {
                configProduct?.data?.item?.discountPrice > 0 && <span className='text-xl font-medium text-[#999999] line-through ml-2'>{formatMoney(configProduct?.data?.item?.price)}</span>
              }
            </div>
            <p className="mt-4 text-gray-700">
              {configProduct?.data?.item?.product?.note}
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
              <div className={`${configProduct?.data?.item?.quantity > 0 ? 'text-[#3E7BFA]' : 'text-red-main'} py-1 px-4 bg-[#ecf0ff] rounded`}>{configProduct?.data?.item?.quantity > 0 ? 'Còn hàng' : 'Hết hàng'}</div>
            </div>
            <div className="mt-6 space-x-3 flex pb-[22px] border-b-[1px] border-[#C7C9D9]">
              <CustomButton outline className='!h-[46px]' prefixIcon={<Image src={CartIcon} />}>Thêm vào giỏ hàng</CustomButton>
              <CustomButton className='!h-[46px]' >Đặt hàng</CustomButton>
            </div>

            <div className=' mt-6 flex flex-col gap-3'>
              <span>Mã: {configProduct?.data?.item?.product?.code}</span>
              <div className='w-fit py-1 px-4 bg-[#ecf0ff] rounded'>Thực phẩm chống lão hóa</div>
            </div>
          </div>
        </div>

        <div className='my-6'>
          <StoreCard store={configProduct?.data?.item?.store} branch={configProduct?.data?.item?.branch} />
        </div>

        <div className='grid grid-cols-12  gap-10 '>
          <div className='col-span-9 '>
            <div className='bg-white rounded-2xl py-6 px-7'>
              <h5 className='bg-[#FAFAFA] text-xl font-semibold p-5 rounded-lg uppercase'>Thông tin sản phẩm</h5>
              <div className='mt-6'>
                <div className={isShowDetail ? '' : 'line-clamp-5'}>
                  {configProduct?.data?.item?.description}
                </div>
              </div>
              {
                configProduct?.data?.item?.description?.length > 200 && (
                  <div className='flex justify-center mt-3'>
                    <CustomButton
                      onClick={() => setIsShowDetail(!isShowDetail)}
                      className='!border-0 !w-fit'
                      outline suffixIcon={<Image src={ArrowIcon} className={isShowDetail ? '' : 'rotate-180'} />}>{isShowDetail ? 'Thu gọn' : 'Xem thêm'}
                    </CustomButton>
                  </div>
                )
              }
            </div>

            <div className='mt-6'>
              <h2 className='text-[32px] font-semibold'>Sản phẩm khác của đại lý</h2>
              {/* <div className='grid grid-cols-3 gap-10 mt-6 '>
                {
                  configProduct?.data?.item?.productWillCare?.map((product) => (
                    <ProductCard product={product} key={product.id} />
                  ))
                }
              </div> */}
            </div>
          </div>
          {/* <div className='col-span-3'>
            <h4 className='text-center text-base font-bold mb-4'>Có thể bạn muốn mua</h4>
            <div className='grid grid-col-1 gap-10'>
              {
                productList?.slice(0, 4).map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))
              }
            </div>
          </div> */}
        </div>
      </div>


    </div>
  );
};

export default ProductDetail;
