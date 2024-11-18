import { deletMarketCart, getConfigProduct, getMarketCart, updateMarketCart } from "@/api/market.service";
import DeleteIcon from "@/assets/deleteRed.svg";
import StoreIcon from "@/assets/storeIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomCheckbox } from "@/components/CustomCheckbox";
import { CustomInput } from "@/components/CustomInput";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import { formatMoney, formatNumber, getImage, hasPermission, sliceString } from "@/helpers";
import { branchState, marketCartState, paymentProductState, profileState } from "@/recoil/state";
import { useMutation, useQuery } from "@tanstack/react-query";
import { message, Radio } from "antd";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import ProductCard from "../product-list/ProductCard";
import { useRouter } from "next/router";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";

function Cart() {
  const branchId = useRecoilValue(branchState);
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
    status: "",
    "createdAt[start]": undefined,
    "createdAt[end]": undefined,
    sortBy: "quantitySold",
    type: "common",
  });
  const [marketCart, setMarketCart] = useRecoilState(marketCartState);
  const [paymentProduct, setPaymentProduct] = useRecoilState(paymentProductState);
  const [storeSelected, setStoreSelected] = useState<any>([]);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [productId, setProductId] = useState(null);
  const [cartTemp, setCartTemp] = useState<any>(null);
  const [cartList, setCartList] = useState<any>([]);
  const { data: configProduct, isLoading } = useQuery(["CONFIG_PRODUCT", JSON.stringify(formFilter), branchId], () =>
    getConfigProduct({ ...formFilter }),
  );

  const { mutate: mutateDeleteCart, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deletMarketCart(String(productId));
    },
    {
      onSuccess: async (res) => {
        setCartTemp(new Date().getTime());
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const { mutate: mutateUpdateCart, isLoading: isUpdateCart } = useMutation(
    (value: { id: string; quantity: number }) => {
      return updateMarketCart(String(value?.id), Number(value?.quantity));
    },
    {
      onSuccess: (res) => {
        // Cập nhật số lượng sản phẩm mà không làm mất trạng thái "selected"
        const updatedCartList = cartList.map((cartItem) => {
          return {
            ...cartItem,
            products: cartItem.products.map((product) => {
              if (product.id === res.data.id) {
                return {
                  ...product,
                  quantity: res.data.quantity, // Cập nhật số lượng từ kết quả API
                  // Giữ nguyên trạng thái selected
                  selected: product.selected,
                };
              }
              return product;
            }),
          };
        });
        setCartList(updatedCartList); // Cập nhật lại giỏ hàng với thông tin mới
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const { data: marketCartRes, isLoading: isLoadingMarketCart } = useQuery(
    ["MARKET_CART", cartTemp],
    () => getMarketCart({}),
    {
      onSuccess: (res) => {
        const updatedCartList = res?.data?.item.map((cart) => {
          return {
            ...cart,
            products: cart.products.map((product) => {
              return {
                ...product,
                // Nếu sản phẩm đã được chọn trước đó, giữ trạng thái selected
                selected:
                  cartList.find((c) => c.storeId === cart.storeId)?.products.find((p) => p.id === product.id)
                    ?.selected || false,
              };
            }),
          };
        });
        setCartList(updatedCartList);
      },
    },
  );

  useEffect(() => {
    if (marketCart) {
      const newCartList = marketCart.map((cart) => {
        return {
          ...cart,
          products: cart?.products.map((product) => {
            if (cart?.branchId === storeSelected) {
              return {
                ...product,
                selected:
                  cartList
                    ?.find((cartItem) => cartItem?.storeId === storeSelected)
                    ?.products?.find((productItem) => productItem?.id === product?.id)?.selected || false,
              };
            } else {
              return {
                ...product,
                selected: false,
              };
            }
          }),
        };
      });

      setCartList(newCartList);
    }
  }, [marketCart]);

  const handleDelete = () => {
    mutateDeleteCart();
  };

  const updateQuantity = (id, value) => {
    if (value < 1) {
      message.error("Số lượng mua tối thiểu là 1");
      return;
    }
    mutateUpdateCart({ id, quantity: value });
  };

  const caculateMoney = (products) => {
    return (products?.discountPrice > 0 ? products?.discountPrice : products?.price) * products?.quantity;
  };

  const totalProductSelected = useMemo(() => {
    const selectedCart = cartList?.filter(
      (item) => storeSelected.includes(item.storeId) && item?.products?.some((product) => product?.selected),
    );
    return selectedCart?.reduce((total, cart) => {
      return total + cart?.products?.filter((product) => product?.selected)?.length;
    }, 0);
  }, [cartList, storeSelected]);

  const totalMoney = useMemo(() => {
    const selectedCart = cartList?.filter(
      (item) => storeSelected.includes(item.storeId) && item?.products?.some((product) => product?.selected),
    );
    return selectedCart?.reduce((total, cart) => {
      return (
        total +
        cart?.products?.reduce((totalProduct, product) => {
          return product?.selected ? totalProduct + caculateMoney(product) : totalProduct;
        }, 0)
      );
    }, 0);
  }, [cartList, storeSelected]);

  useEffect(() => {
    const updatedSelectedStores = cartList.reduce((acc, cartItem) => {
      const hasSelectedProduct = cartItem.products.some((product) => product.selected);

      if (hasSelectedProduct) {
        // If the store has selected products, add it to the selected stores
        if (!storeSelected.includes(cartItem.storeId)) {
          return [...acc, cartItem.storeId];
        }
        return acc;
      } else {
        // If no products selected, ensure the store is not in the selected list
        return acc.filter((id) => id !== cartItem.storeId);
      }
    }, storeSelected);

    setStoreSelected(updatedSelectedStores);
  }, [cartList]);

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
                Giỏ hàng
              </a>
            </li>
          </ul>
        </nav>

        <div className="grid grid-cols-12 p-[26px] bg-white rounded my-4 font-semibold">
          <div className="col-span-6">Sản phẩm</div>
          <div className="col-span-6 grid grid-cols-4 gap-2">
            <div className="text-center">Đơn giá</div>
            <div className="text-center">Số lượng</div>
            <div className="text-center">Số tiền</div>
            <div className="text-center">Thao tác</div>
          </div>
        </div>
        <Radio.Group className="flex flex-col gap-3">
          {cartList?.map((cart) => (
            <div className="flex flex-col gap-3" key={cart?.storeId}>
              <div className="">
                <div className="grid grid-cols-12 p-[22px] bg-white rounded font-semibold border-b-[1px] border-[#DDDDDD]">
                  <div className="col-span-6 flex items-center">
                    <CustomCheckbox
                      checked={storeSelected.includes(cart?.storeId)}
                      onChange={() => {
                        const updatedSelectedStores = storeSelected.includes(cart?.storeId)
                          ? storeSelected.filter((id) => id !== cart?.storeId)
                          : [...storeSelected, cart?.storeId];

                        setStoreSelected(updatedSelectedStores);

                        const newCartList = cartList.map((cartItem) => {
                          if (updatedSelectedStores.includes(cartItem?.storeId)) {
                            const haveSelectedProduct = cartItem?.products.some((product) => product?.selected);
                            if (haveSelectedProduct) {
                              return cartItem;
                            }
                            return {
                              ...cartItem,
                              products: cartItem?.products.map((product) => ({
                                ...product,
                                selected: true,
                              })),
                            };
                          } else {
                            return {
                              ...cartItem,
                              products: cartItem?.products.map((product) => ({
                                ...product,
                                selected: false,
                              })),
                            };
                          }
                        });
                        setCartList(newCartList);
                      }}
                    />

                    <div className="ml-7 mr-2 grid place-items-center">
                      <Image src={StoreIcon} />
                    </div>
                    <span>{cart?.products[0]?.marketProduct?.store?.name}</span>
                  </div>
                </div>
                {cart?.products.map((product, index) => (
                  <div
                    className={`grid grid-cols-12 p-[22px] bg-white rounded ${
                      index === cart?.products?.length - 1 ? "border-0" : "border-b-[1px] border-[#DDDDDD]"
                    }`}
                    key={product?.id}
                  >
                    <div className="col-span-6 flex items-center">
                      <CustomCheckbox
                        // disabled={!storeSelected.includes(cart?.branchId)}
                        checked={product?.selected}
                        onChange={(e) => {
                          const newCartList = cartList.map((cartItem) => {
                            if (cartItem?.storeId === cart?.storeId) {
                              return {
                                ...cartItem,
                                products: cartItem?.products.map((productItem) => {
                                  if (productItem?.id === product?.id) {
                                    return {
                                      ...productItem,
                                      selected: e.target.checked,
                                    };
                                  } else {
                                    return productItem;
                                  }
                                }),
                              };
                            } else {
                              return cartItem;
                            }
                          });

                          setCartList(newCartList);

                          // Check if all products in the store are unchecked
                          const allProductsUnchecked = newCartList
                            .find((cartItem) => cartItem?.storeId === cart?.storeId)
                            ?.products.every((product) => !product?.selected);

                          if (allProductsUnchecked) {
                            setStoreSelected(storeSelected.filter((id) => id !== cart?.storeId));
                          }
                        }}
                      />

                      <div className="ml-12 mr-5 w-20 h-20 flex-shrink-0 rounded overflow-hidden border-[#E4E4EB] border-[1px] grid place-items-center">
                        <Image
                          src={
                            product?.marketProduct?.imageCenter?.path
                              ? getImage(product?.marketProduct?.imageCenter?.path)
                              : product?.marketProduct?.imageCenter?.filePath
                          }
                          className="object-cover"
                          width={80}
                          height={80}
                        />
                      </div>
                      <span>{sliceString(product?.marketProduct?.product?.name, 55)}</span>
                    </div>
                    <div className="col-span-6 grid grid-cols-4 items-center gap-2">
                      <div className="text-center">
                        {product?.discountPrice > 0 && (
                          <span className="text-[#999999] line-through">{formatMoney(product?.price)}</span>
                        )}
                        <span className="ml-1">
                          {formatMoney(product?.discountPrice > 0 ? product?.discountPrice : product?.price)}
                        </span>
                      </div>
                      <div className="text-center">
                        <CustomInput
                          wrapClassName=""
                          className="!h-7 !w-20 text-center text-base mx-auto"
                          hasMinus={true}
                          hasPlus={true}
                          value={product?.quantity}
                          disabled={
                            hasPermission(profile?.role?.permissions, RoleModel.market_common, RoleAction.update)
                              ? false
                              : true
                          }
                          type="number"
                          onChange={(value) => {
                            updateQuantity(product?.id, value);
                          }}
                          onMinus={async (value) => {
                            updateQuantity(product?.id, value);
                          }}
                          onPlus={async (value) => {
                            updateQuantity(product?.id, value);
                          }}
                          onBlur={(e) => {}}
                        />
                      </div>
                      <div className="text-center">{formatMoney(caculateMoney(product))}</div>
                      <div
                        className="text-center cursor-pointer"
                        onClick={() => {
                          if (!hasPermission(profile?.role?.permissions, RoleModel.market_common, RoleAction.delete))
                            return;
                          setOpenDeleteConfirm(true);
                          setProductId(product?.id);
                        }}
                      >
                        <Image src={DeleteIcon} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Radio.Group>

        {marketCart?.length > 0 && (
          <div className="bg-white shadow-lg p-6 mt-3">
            <div className="">
              <div className="flex justify-between items-center">
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    // unselected all product
                    const newCartList = cartList.map((cartItem) => {
                      return {
                        ...cartItem,
                        products: cartItem?.products.map((product) => {
                          return {
                            ...product,
                            selected: false,
                          };
                        }),
                      };
                    });
                    setCartList(newCartList);
                  }}
                >
                  Bỏ chọn tất cả
                </div>
                <div className="font-medium text-base">
                  Tổng thanh toán ({formatNumber(totalProductSelected)} sản phẩm):{" "}
                  <span className="text-red-main ml-4">{formatMoney(totalMoney)}</span>
                </div>
              </div>
              <div className="flex justify-end mt-5">
                <CustomButton
                  className="!w-[300px] !h-[46px]"
                  disabled={storeSelected.length === 0 || totalProductSelected === 0} // Disable if no stores or products are selected
                  onClick={() => {
                    // Filter the cartList to include only selected stores and their selected products
                    const paymentProduct = cartList
                      .filter((cart) => storeSelected.includes(cart.storeId))
                      .map((cart) => ({
                        storeId: cart.storeId,
                        products: cart.products.filter((product) => product.selected),
                      }))
                      .filter((cart) => cart.products.length > 0); // Ensure each store has at least one product

                    if (paymentProduct.length <= 0) {
                      message.error("Vui lòng chọn ít nhất một sản phẩm để mua.");
                      return;
                    }

                    setPaymentProduct(paymentProduct);
                    router.push("/markets/payment");
                  }}
                >
                  Mua hàng
                </CustomButton>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <h4 className="text-5xl font-semibold text-center">Có thể bạn muốn mua</h4>

          <div className="mt-12 grid grid-cols-4 gap-10">
            {configProduct?.data?.items.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </div>
      </div>

      <DeleteModal
        isOpen={openDeleteConfirm}
        onCancel={() => setOpenDeleteConfirm(false)}
        onSuccess={() => {
          handleDelete();
          setOpenDeleteConfirm(false);
        }}
        content={"sản phẩm"}
        // isLoading={isLoadingDelete}
      />
    </div>
  );
}

export default Cart;
