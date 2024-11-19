import { createMarketCart, getConfigProduct, getSaleProductDetail } from "@/api/market.service";
import ArrowIcon from "@/assets/arrow-down-red-icon.svg";
import CartIcon from "@/assets/cartIconRed.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { formatMoney, formatNumber, getImage, sliceString } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import StoreCard from "./StoreCard";
import ProductCard from "../product-list/ProductCard";
import { message, Spin } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import { branchState, paymentProductState } from "@/recoil/state";
import parse from "html-react-parser";

const ProductDetail = () => {
  const [isShowDetail, setIsShowDetail] = React.useState(false);

  const [images, setImages] = React.useState<any>([]);
  const [productQuantity, setProductQuantity] = React.useState(1);
  const router = useRouter();
  const { id } = router.query;

  const settings = {
    customPaging: function (i) {
      return (
        <a className="">
          <Image
            width={83}
            height={83}
            className="object-cover h-full border-[#C7C9D9] border-[1px] rounded overflow-hidden"
            src={images[i]?.path ? getImage(images[i]?.path) : images[i]?.filePath}
          />
        </a>
      );
    },
    dots: true,
    navigator: false,
    dotsClass: "slick-dots slick-thumb",
    // infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const branchId = useRecoilValue(branchState);
  const [paymentProduct, setPaymentProduct] = useRecoilState(paymentProductState);
  const queryClient = useQueryClient();

  const {
    data: configProduct,
    isLoading,
    isError,
  } = useQuery(["MARKET_PRODUCT_DETAIL", JSON.stringify(id), branchId], () => getSaleProductDetail(String(id)), {
    enabled: !!id && !!branchId,
  });

  useEffect(() => {
    if (configProduct?.data?.item) {
      let newImages;
      if (configProduct?.data?.item.images) {
        newImages = [...[configProduct?.data?.item.imageCenter], ...configProduct?.data?.item.images];
      } else {
        newImages = [configProduct?.data?.item.imageCenter];
      }
      setImages(newImages);
    }
  }, [configProduct]);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 5,
    keyword: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: "common",
  });

  const { data: configProductList, isLoading: isLoadingProductList } = useQuery(
    ["CONFIG_PRODUCT", JSON.stringify(formFilter), branchId],
    () => getConfigProduct({ ...formFilter }),
  );

  const { mutate: mutateCreateCart, isLoading: isLoadingAddCart } = useMutation(
    (marketProductId) => {
      const payload = {
        marketProductId,
        quantity: productQuantity,
      };
      return createMarketCart(payload);
    },
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["MARKET_CART"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  if (isLoading) {
    return (
      <div className="grid place-items-center min-h-[600px]">
        <Spin size="large" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="grid place-items-center min-h-[600px] text-2xl">
        <h4>Bạn không có quyền truy cập vào sản phẩm này</h4>
      </div>
    );
  }

  console.log("configProduct", configProduct);

  return (
    <div className="bg-[#fafafc]">
      <div className="fluid-container">
        <nav className="breadcrumb pt-3">
          <ul className="flex">
            <li className="!text-red-main">
              <span className="">Trang chủ</span>
              <span className="mx-2">/</span>
            </li>
            <li>
              <a href="#" className="text-gray-500 hover:text-gray-700">
                Chi tiết sản phẩm
              </a>
            </li>
          </ul>
        </nav>
        <div className="flex gap-6 mt-3 bg-white p-4 rounded-2xl">
          <div className={`slider-container w-2/5 flex-shrink-0 ${images?.length <= 1 ? "hidden-slide" : ""}`}>
            <Slider {...settings}>
              {images?.map((image) => (
                <div
                  className="border-[#C7C9D9] border-[1px] rounded-lg overflow-hidden flex h-[450px] w-[450px]"
                  key={image?.id}
                >
                  <img
                    src={image?.path ? getImage(image?.path) : image?.filePath}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">
              {sliceString(configProduct?.data?.item?.product?.name, 50)} -{" "}
              {configProduct?.data?.item?.productUnit?.unitName}
            </h1>
            <p className="mt-4">Đã bán {formatNumber(configProduct?.data?.item?.quantitySold)}</p>
            <div className="text-red-main text-xl mt-[22px]">
              {configProduct?.data?.item?.discountPrice > 0
                ? formatMoney(configProduct?.data?.item?.discountPrice)
                : formatMoney(configProduct?.data?.item?.price)}
              {configProduct?.data?.item?.discountPrice > 0 && (
                <span className="text-xl font-medium text-[#999999] line-through ml-2">
                  {formatMoney(configProduct?.data?.item?.price)}
                </span>
              )}
            </div>
            <p className="mt-4 text-gray-700">{configProduct?.data?.item?.product?.note}</p>
            <div className="mt-4 flex items-center gap-6">
              <span>Số lượng:</span>
              <CustomInput
                wrapClassName="!w-[110px]"
                className="!h-8 !w-[80px] text-center text-lg"
                hasMinus={true}
                hasPlus={true}
                value={productQuantity}
                type="number"
                onChange={(value) => {
                  setProductQuantity(value);
                }}
                onMinus={async (value) => {
                  if (value < 1) {
                    setProductQuantity(1);
                    return;
                  }
                  setProductQuantity(value);
                }}
                onPlus={async (value) => {
                  setProductQuantity(value);
                }}
                onBlur={(e) => {
                  if (e.target.value === "") {
                    setProductQuantity(1);
                  }
                }}
              />
              <div
                className={`${
                  configProduct?.data?.item?.quantity > 0 ? "text-[#3E7BFA]" : "text-red-main"
                } py-1 px-4 bg-[#ecf0ff] rounded`}
              >
                {configProduct?.data?.item?.quantity > 0 ? "Còn hàng" : "Hết hàng"}
              </div>
            </div>
            <div className="mt-6 space-x-3 flex pb-[22px] border-b-[1px] border-[#C7C9D9]">
              <CustomButton
                outline
                className="!h-[46px]"
                prefixIcon={<Image src={CartIcon} />}
                onClick={() => {
                  if (configProduct?.data?.item?.quantity - configProduct?.data?.item?.quantitySold <= 0) {
                    message.error("Sản phẩm đã hết hàng");
                    return;
                  }
                  if (productQuantity > configProduct?.data?.item?.quantity - configProduct?.data?.item?.quantitySold) {
                    message.error("Số lượng sản phẩm trong giỏ hàng không được vượt quá số lượng tồn kho");
                    return;
                  }
                  mutateCreateCart(configProduct?.data?.item?.id);
                }}
              >
                Thêm vào giỏ hàng
              </CustomButton>
              <CustomButton
                className="!h-[46px]"
                onClick={() => {
                  const paymentProduct = [
                    {
                      branchId: configProduct?.data?.item?.branchId,
                      storeId: configProduct?.data?.item?.storeId,
                      products: [
                        {
                          ...configProduct?.data?.item,
                          marketProduct: configProduct?.data?.item,
                          marketProductId: configProduct?.data?.item?.id,
                          quantity: productQuantity,
                        },
                      ],
                    },
                  ];
                  setPaymentProduct(paymentProduct);
                  router.push("/markets/payment");
                }}
              >
                Đặt hàng
              </CustomButton>
            </div>

            <div className=" mt-6 flex flex-col gap-3">
              <span>Mã: {configProduct?.data?.item?.productUnit?.code}</span>
              <div className="w-fit py-1 px-4 bg-[#ecf0ff] rounded">Thực phẩm chống lão hóa</div>
            </div>
          </div>
        </div>

        <div className="my-6">
          <StoreCard store={configProduct?.data?.item?.store} branch={configProduct?.data?.item?.store?.name} />
        </div>

        <div className="grid grid-cols-12  gap-10 ">
          <div className="col-span-9 ">
            <div className="bg-white rounded-2xl py-6 px-7">
              <h5 className="bg-[#FAFAFA] text-xl font-semibold p-5 rounded-lg uppercase">Thông tin sản phẩm</h5>
              {configProduct?.data?.item?.description ? (
                <div className="mt-6 custom-text-editor">
                  <div className={isShowDetail ? "" : "line-clamp-5"}>
                    {parse(String(configProduct?.data?.item?.description))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 mt-5">Không có mô tả sản phẩm</p>
              )}
              {configProduct?.data?.item?.description?.length > 200 && (
                <div className="flex justify-center mt-3">
                  <CustomButton
                    onClick={() => setIsShowDetail(!isShowDetail)}
                    className="!border-0 !w-fit"
                    outline
                    suffixIcon={<Image src={ArrowIcon} className={isShowDetail ? "" : "rotate-180"} />}
                  >
                    {isShowDetail ? "Thu gọn" : "Xem thêm"}
                  </CustomButton>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h2 className="text-[32px] font-semibold">Sản phẩm khác của đại lý</h2>
              <div className="grid grid-cols-3 gap-10 mt-6 ">
                {configProduct?.data?.item?.productWillCare?.map((product) => (
                  <ProductCard product={product} key={product.id} />
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <h4 className="text-center text-base font-bold mb-4">Có thể bạn muốn mua</h4>
            <div className="grid grid-col-1 gap-10">
              {configProductList?.data?.items?.map((product) => (
                <ProductCard product={product} key={product.id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
