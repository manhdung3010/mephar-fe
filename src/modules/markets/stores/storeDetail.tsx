import {
  createFollowStore,
  getConfigProduct,
  getConfigProductPrivate,
  getFollowStore,
  getMarketStoreDetail,
} from "@/api/market.service";
import { MarketPaginationStyled } from "@/components/CustomPagination/styled";
import { formatNumber, getImage, hasPermission } from "@/helpers";
import Logo from "@/public/apple-touch-icon.png";
import { branchState, profileState } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message, Pagination } from "antd";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import ProductCard from "../product-list/ProductCard";
import ProductCardSkeleton from "../product-list/ProductCardSkeleton";
import { CustomButton } from "@/components/CustomButton";
import CartPlusIcon from "@/assets/cart-plus.svg";
import CartHeartIcon from "@/assets/cart-heart.svg";
import { EFollowStoreStatus } from "../type";
import { LoadingIcon } from "@/components/LoadingIcon";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { sortBy } from "lodash";

function StoreDetail() {
  const router = useRouter();
  const { id } = router.query;
  const profile = useRecoilValue(profileState);
  const branchId = useRecoilValue(branchState);
  const [select, setSelect] = useState(0);
  const queryClient = useQueryClient();
  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 16,
    keyword: "",
    status: "active",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    isConfig: true,
    type: "common",
  });
  const { data: storeDetail, isLoading: isLoadingStoreDetail } = useQuery(
    ["MARKET_STORE_DETAIL", id],
    () => getMarketStoreDetail(String(id)),
    {
      enabled: !!id,
    },
  );
  const { data: configProduct, isLoading } = useQuery(
    ["CONFIG_PRODUCT", JSON.stringify(formFilter), id],
    () => getConfigProduct({ ...formFilter, otherStoreId: id }),
    {
      enabled: !!id && !storeDetail?.data?.isAgency,
    },
  );
  const { data: configProductPrivate, isLoading: isLoadingConfigProductPrivate } = useQuery(
    ["CONFIG_PRODUCT_PRIVATE", formFilter?.page, formFilter?.limit, formFilter?.sortBy, formFilter?.productType, id],
    () =>
      getConfigProductPrivate({
        toStoreId: String(id),
        page: formFilter?.page,
        limit: formFilter?.limit,
        sortBy: formFilter?.sortBy,
        productType: formFilter?.productType,
      }),
    {
      enabled: !!id && storeDetail?.data?.isAgency,
    },
  );
  const { data: followStore, isLoading: isLoadingFollowStore } = useQuery(
    ["FOLLOW_STORE", id],
    () => getFollowStore(String(id)),
    {
      enabled: !!id,
    },
  );

  const { mutate: muateCreateFollow, isLoading: isLoadingCreateFollow } = useMutation(
    () => {
      const payload = {
        agencyId: id,
      };
      return createFollowStore(payload);
    },
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["FOLLOW_STORE"]);
        await queryClient.invalidateQueries(["AGENCY_LIST"]);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const menu = ["Sản phẩm mới", "Bán chạy", "Thuốc", "Thực phẩm"];
  return (
    <div className="bg-[#fafafc]">
      <div className="bg-white">
        <div className="fluid-container">
          <nav className="breadcrumb pt-3">
            <ul className="flex">
              <li className="!text-red-main">
                <span className="">Trang chủ</span>
                <span className="mx-2">/</span>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-gray-700">
                  Chi tiết đại lý
                </a>
              </li>
            </ul>
          </nav>
          <div className="grid grid-cols-12 gap-8 mt-3">
            <div className="col-span-5">
              <div
                className={`h-[220px] rounded-2xl overflow-hidden relative bg-bottom bg-cover`}
                style={{ backgroundImage: `url(${getImage(storeDetail?.data?.logo?.path)})` }}
              >
                <div className="flex gap-3 items-center absolute top-1/2 -translate-y-1/2 px-9 z-50">
                  <div className="w-[100px] h-[100px] flex-shrink-0 rounded-full overflow-hidden bg-white">
                    <Image
                      width={100}
                      height={100}
                      objectFit="scale-down"
                      className="w-full h-full object-cover"
                      src={getImage(storeDetail?.data?.logo?.path) || Logo}
                      alt=""
                    />
                  </div>
                  <div className="text-white flex flex-col gap-2">
                    <h4 className="text-xl font-semibold line-clamp-1">{storeDetail?.data?.name}</h4>
                    {storeDetail?.data?.isAgency && (
                      <button
                        className={`bg-white rounded-lg ${
                          followStore?.data?.status === EFollowStoreStatus.FALSE ||
                          followStore?.data?.status === EFollowStoreStatus.PENDING
                            ? "text-red-main"
                            : "text-[#05A660]"
                        } py-2 px-4 `}
                      >
                        {(followStore?.data?.status === EFollowStoreStatus.FALSE ||
                          followStore?.data?.status === EFollowStoreStatus.CANCEL) &&
                          hasPermission(profile?.role?.permissions, RoleModel.market_common, RoleAction.create) && (
                            <p className="flex items-center gap-2 w-fit" onClick={() => muateCreateFollow()}>
                              <Image src={CartPlusIcon} />
                              <span className="text-base font-medium text-red-main">Đăng ký làm đại lý</span>
                            </p>
                          )}
                        {followStore?.data?.status === EFollowStoreStatus.PENDING && (
                          <p className="flex items-center gap-2 w-fit">
                            {/* <LoadingIcon /> */}
                            <span className="text-base font-medium">Đang chờ duyệt</span>
                          </p>
                        )}
                        {followStore?.data?.status === EFollowStoreStatus.ACTIVE && (
                          <p className="flex items-center gap-2 w-fit">
                            <Image src={CartHeartIcon} />
                            <span className="text-base font-medium">Đã là đại lý</span>
                          </p>
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className="absolute w-full h-full top-0 bottom-0 left-0 right-0 z-10"
                  style={{ backgroundColor: "rgba(0, 0, 0, .5)" }}
                ></div>
              </div>
            </div>
            <div className="col-span-7 grid grid-cols-2">
              <div className="flex items-center">
                <span className="w-40">Tổng sản phẩm: </span>
                <span className="text-red-main">{formatNumber(storeDetail?.data?.totalProduct)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40">Đã bán: </span>
                <span className="text-red-main">{formatNumber(storeDetail?.data?.totalQuantitySold)}</span>
              </div>
              <div className="flex items-center">
                <span className="w-40">Đánh giá: </span>
                <span className="text-red-main">99+</span>
              </div>
              <div className="flex items-center">
                <span className="w-40">Mức giá: </span>
                <span className="text-red-main">$$$</span>
              </div>
              <div className="flex items-center">
                <span className="w-40">Giờ mở cửa: </span>
                <span className="text-red-main">08:00 - 22:00</span>
              </div>
              <div className="flex items-center">
                <span className="w-40">Địa chỉ: </span>
                <span className="text-red-main">{storeDetail?.data?.address}</span>
              </div>
            </div>
          </div>
          <div className="mt-4 pb-3">
            <div className="flex flex-col">
              <div className="flex gap-3">
                {menu.map((item, index) => (
                  <div
                    key={index}
                    className={classNames(
                      "cursor-pointer px-5 py-[6px] rounded-t-lg relative text-2xl font-medium text-[#28293D]",
                      index === select ? "text-red-main" : "text-black-main",
                    )}
                    onClick={() => {
                      setSelect(index);
                      if (index === 1) {
                        setFormFilter({
                          page: 1,
                          limit: 16,
                          sortBy: "quantitySold",
                        });
                      } else if (index === 2) {
                        // remove sortBy
                        setFormFilter({
                          productType: 1,
                          page: 1,
                          limit: 16,
                        });
                      } else if (index === 3) {
                        setFormFilter({
                          page: 1,
                          limit: 16,
                          productType: 2,
                        });
                      } else {
                        setFormFilter({
                          page: 1,
                          limit: 16,
                        });
                      }
                    }}
                  >
                    {item}
                    {index === select && (
                      <div className="w-[57px] h-[6px] bg-red-main absolute -bottom-2 left-1/2 -translate-x-1/2 rounded" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="fluid-container">
        {(!isLoading || !isLoadingConfigProductPrivate) && (
          <p className="mt-6 text-[#555770] font-medium">
            Hiển thị {(formFilter.page - 1) * formFilter.limit + 1} -{" "}
            {Math.min(
              formFilter.page * formFilter.limit,
              storeDetail?.data?.isAgency ? configProductPrivate?.data?.totalItem : configProduct?.data?.totalItem,
            )}{" "}
            trong tổng số{" "}
            {formatNumber(
              storeDetail?.data?.isAgency ? configProductPrivate?.data?.totalItem : configProduct?.data?.totalItem,
            )}{" "}
            sản phẩm
          </p>
        )}
        <div className="mt-8">
          <h2 className="text-5xl font-semibold text-[#242424] text-center mb-12">{menu[select]}</h2>
          {storeDetail?.data?.isAgency && (
            <div className="grid grid-cols-4 gap-10">
              {isLoadingConfigProductPrivate
                ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : configProductPrivate?.data?.items?.map((item, index) => (
                    <ProductCard key={item?.id} product={item} />
                  ))}
            </div>
          )}
          {!storeDetail?.data?.isAgency && (
            <div className="grid grid-cols-4 gap-10">
              {isLoading
                ? Array.from({ length: 8 }).map((_, index) => <ProductCardSkeleton key={index} />)
                : configProduct?.data?.items?.map((item, index) => <ProductCard key={item?.id} product={item} />)}
            </div>
          )}
          <div className="flex justify-center py-12">
            <MarketPaginationStyled>
              <Pagination
                pageSize={formFilter?.limit}
                current={formFilter?.page}
                onChange={(value) => setFormFilter({ ...formFilter, page: value })}
                total={
                  storeDetail?.data?.isAgency ? configProductPrivate?.data?.totalItem : configProduct?.data?.totalItem
                }
              />
            </MarketPaginationStyled>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreDetail;
