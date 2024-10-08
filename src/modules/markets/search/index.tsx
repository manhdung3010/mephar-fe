import { getConfigProduct, getMarketStore } from "@/api/market.service";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import ProductCard from "../product-list/ProductCard";
import ProductCardSkeleton from "../product-list/ProductCardSkeleton";
import { MarketPaginationStyled } from "@/components/CustomPagination/styled";
import { Pagination } from "antd";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import StoreCardSkeleton from "../product-detail/StoreCardSkeleton";
import StoreCard from "../product-detail/StoreCard";

function MarketSearch() {
  const router = useRouter();
  const { keyword } = router.query;
  const branchId = useRecoilValue(branchState);

  const [formFilter, setFormFilter] = useState<any>({
    page: 1,
    limit: 16,
    keyword: "",
    status: "active",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: "common",
  });
  const [formFilterStore, setFormFilterStore] = useState<any>({
    page: 1,
    limit: 10,
    keyword: "",
  });

  useEffect(() => {
    setFormFilter({
      ...formFilter,
      keyword,
    });
    setFormFilterStore({
      ...formFilterStore,
      keyword,
    });
  }, [keyword]);

  const { data: configProduct, isLoading } = useQuery(["CONFIG_PRODUCT", JSON.stringify(formFilter), branchId], () =>
    getConfigProduct({ ...formFilter }),
  );
  const { data: stores, isLoading: isLoadingStore } = useQuery(["MARKET_STORE", JSON.stringify(formFilterStore)], () =>
    getMarketStore({ ...formFilter }),
  );

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
                Tìm kiếm
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-8 bg-white rounded-lg p-4">
          <h4 className="text-3xl font-medium">
            Kết quả tìm kiếm với từ khóa <span className="text-red-main text-3xl font-medium">"{keyword}"</span>
          </h4>
          <div className="mt-5">
            <h4 className="text-2xl font-medium">Sản phẩm</h4>
            <div>
              <div className="mt-6 grid grid-cols-4 gap-10">
                {isLoading
                  ? Array.from({ length: 16 }).map((_, index) => <ProductCardSkeleton />)
                  : configProduct?.data?.items.map((product) => <ProductCard product={product} key={product.id} />)}
                {configProduct?.data?.items?.length === 0 && (
                  <div className="col-span-4 text-center">
                    <h4 className="text-2xl font-medium text-gray-500">Không tìm thấy sản phẩm</h4>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <h4 className="text-2xl font-medium">Cửa hàng</h4>
            <div className="grid grid-cols-1 gap-5 mt-6">
              {stores?.data?.items?.length <= 0 ? (
                <div className="flex justify-center py-28">
                  <p className="text-lg">Không tìm thấy cửa hàng hợp lệ!</p>
                </div>
              ) : isLoadingStore ? (
                Array.from({ length: 10 }).map((_, index) => <StoreCardSkeleton key={index} />)
              ) : (
                stores?.data?.items?.map((item, index) => <StoreCard key={index} store={item} branch={item?.name} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketSearch;
