import type { ColumnsType } from "antd/es/table";

import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber } from "@/helpers";
import { ISaleProduct } from "@/modules/sales/interface";
import { useQuery } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { branchState } from "@/recoil/state";
import { getGroupProduct, getSaleProducts } from "@/api/product.service";
import { EDiscountBillMethod, EDiscountGoodsMethod, EDiscountType } from "../add-discount/Info";

interface IRecord {
  key: number;
  totalPrice: number;
  discount: number;
  discountType: string;
  productDiscount: any[];
  pointType?: string;
  changeType?: string;
}

export function DiscountInfo({ record }: any) {
  const branchId = useRecoilValue(branchState);
  const {
    data: products,
    isLoading: isLoadingProduct,
    isSuccess,
  } = useQuery<{
    data?: { items: ISaleProduct[] };
  }>(["LIST_PRODUCT_DISCOUNT", 1, 999, "", branchId], () =>
    getSaleProducts({ page: 1, limit: 999, keyword: "", branchId }),
  );
  const { data: groupProduct, isLoading: isLoadingGroup } = useQuery<{
    data?: any;
  }>(["LIST_GROUP_PRODUCT_DISCOUNT", 1, 999, ""], () => getGroupProduct({ page: 1, limit: 999, keyword: "" }));

  const columns: ColumnsType<IRecord> = [
    {
      title: "Tổng tiền hàng từ",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "max-w-[50%] w-1/2",
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: "Giảm giá hóa đơn",
      dataIndex: "discountValue",
      key: "discountValue",
      className: "max-w-[50%] w-1/2",
      render: (text, { discountType }) => <span>{discountType === "percent" ? text + "%" : formatMoney(text)}</span>,
    },
  ];
  const columns2: ColumnsType<IRecord> = [
    {
      title: "Tổng tiền hàng từ",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "max-w-[50%] w-1/2",
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: "Giá trị KM",
      dataIndex: "discountValue",
      key: "discountValue",
      // className: "max-w-[50%] w-1/2",
      render: (discountValue, { discountType }) => (
        <span>
          {formatNumber(discountValue)}
          {discountType === "amount" ? "đ" : "%"}
        </span>
      ),
    },
    {
      title: "Hàng/Nhóm hàng tặng",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "max-w-[50%] w-1/2",
      render: (text, { productDiscount }) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount[0]?.groupId
              ? productDiscount
                  .map((item) => {
                    const product = groupProduct?.data?.items.find((product) => product?.id === item.groupId);
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.name}
                    </span>
                  ))
              : productDiscount
                  .map((item) => {
                    const product = products?.data?.items.find(
                      (product) => product.productUnit?.id === item.productUnitId,
                    );
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.productUnit?.code +
                        " - " +
                        product?.product?.name +
                        " - " +
                        product?.productUnit?.unitName}
                    </span>
                  ))
          }
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      className: "max-w-[50%] w-1/2",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];
  const columns3: ColumnsType<IRecord> = [
    {
      title: "Tổng tiền hàng từ",
      dataIndex: "fixedPrice",
      key: "fixedPrice",
      className: "",
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: "Hàng/Nhóm hàng tặng",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "",
      render: (text, { productDiscount }) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount[0]?.groupId
              ? productDiscount
                  .map((item) => {
                    const product = groupProduct?.data?.items.find((product) => product?.id === item.groupId);
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.name}
                    </span>
                  ))
              : productDiscount
                  .map((item) => {
                    const product = products?.data?.items.find(
                      (product) => product.productUnit?.id === item.productUnitId,
                    );
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.productUnit?.code +
                        " - " +
                        product?.product?.name +
                        " - " +
                        product?.productUnit?.unitName}
                    </span>
                  ))
          }
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "fromQuantity",
      key: "fromQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];
  const columns4: ColumnsType<IRecord> = [
    {
      title: "Tổng tiền hàng từ",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "max-w-[50%] w-1/2",
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: "Điểm cộng",
      dataIndex: "pointValue",
      key: "pointValue",
      className: "max-w-[50%] w-1/2",
      render: (text, { discountType }) => (
        <span>
          {formatNumber(text)}
          {discountType === "amount" ? "đ" : "%"}
        </span>
      ),
    },
  ];
  const columns5: ColumnsType<IRecord> = [
    {
      title: "Hàng/nhóm hàng mua",
      dataIndex: "productDiscount",
      key: "productDiscount",
      className: "",
      render: (productDiscount) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount
              .filter((item) => item.isCondition)
              .map((item) => {
                const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
                return product;
              })
              .map((product, index) => (
                <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                  {product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "SL mua",
      dataIndex: "fromQuantity",
      key: "fromQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      title: "Giảm giá",
      dataIndex: "discountValue",
      key: "discountValue",
      className: "min-w-[100px]",
      render: (discountValue, { discountType }) => (
        <span>
          {formatNumber(discountValue)} {discountType === "amount" ? "đ" : "%"}
        </span>
      ),
    },
    {
      title: "Hàng/nhóm hàng được giảm giá",
      dataIndex: "productDiscount",
      key: "productDiscount",
      className: "",
      render: (productDiscount) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount
              .filter((item) => !item.isCondition)
              .map((item) => {
                const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
                return product;
              })
              .map((product, index) => (
                <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                  {product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "SL giảm",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      className: "",
      render: (maxQuantity) => <span>{formatNumber(maxQuantity)}</span>,
    },
  ];
  const columns6: ColumnsType<IRecord> = [
    {
      title: "Hàng/nhóm hàng mua",
      dataIndex: "productDiscount",
      key: "productDiscount",
      className: "",
      render: (productDiscount) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount
              .filter((item) => item.isCondition)
              .map((item) => {
                const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
                return product;
              })
              .map((product, index) => (
                <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                  {product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "SL mua",
      dataIndex: "fromQuantity",
      key: "fromQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      title: "Hàng/nhóm hàng được giảm giá",
      dataIndex: "productDiscount",
      key: "productDiscount",
      className: "",
      render: (productDiscount) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount
              .filter((item) => !item.isCondition)
              .map((item) => {
                const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
                return product;
              })
              .map((product, index) => (
                <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                  {product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "SL tặng",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      className: "",
      render: (maxQuantity) => <span>{formatNumber(maxQuantity)}</span>,
    },
  ];
  const columns7: ColumnsType<IRecord> = [
    {
      title: "Hàng/nhóm hàng mua",
      dataIndex: "productDiscount",
      key: "productDiscount",
      className: "",
      render: (productDiscount) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount
              .filter((item) => item.isCondition)
              .map((item) => {
                const product = products?.data?.items.find((product) => product.productUnit?.id === item.productUnitId);
                return product;
              })
              .map((product, index) => (
                <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                  {product?.productUnit?.code + " - " + product?.product?.name + " - " + product?.productUnit?.unitName}
                </span>
              ))
          }
        </div>
      ),
    },
    {
      title: "SL mua",
      dataIndex: "fromQuantity",
      key: "fromQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
    {
      title: "Điểm cộng",
      dataIndex: "pointValue",
      key: "pointValue",
      className: "",
      render: (pointValue, { pointType }) => (
        <span>
          {formatNumber(pointValue)}
          {pointType === "amount" ? "đ" : "%"}
        </span>
      ),
    },
  ];

  const columns8: ColumnsType<IRecord> = [
    {
      title: "Giá bán khuyến mại",
      dataIndex: "fixedPrice",
      key: "fixedPrice",
      className: "",
      render: (text, { changeType }) => {
        return (
          <span>
            {changeType === "type_discount" && "Giảm"} {formatMoney(text)}
          </span>
        );
      },
    },
    {
      title: "Hàng/Nhóm hàng tặng",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "",
      render: (text, { productDiscount }) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount[0]?.groupId
              ? productDiscount
                  .map((item) => {
                    const product = groupProduct?.data?.items.find((product) => product?.id === item.groupId);
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.name}
                    </span>
                  ))
              : productDiscount
                  .map((item) => {
                    const product = products?.data?.items.find(
                      (product) => product.productUnit?.id === item.productUnitId,
                    );
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.productUnit?.code +
                        " - " +
                        product?.product?.name +
                        " - " +
                        product?.productUnit?.unitName}
                    </span>
                  ))
          }
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "fromQuantity",
      key: "fromQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];

  const columns9: ColumnsType<IRecord> = [
    {
      title: "Tổng tiền hàng từ",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "",
      render: (text) => <span>{formatMoney(text)}</span>,
    },
    {
      title: "Hàng/Nhóm hàng tặng",
      dataIndex: "orderFrom",
      key: "orderFrom",
      className: "",
      render: (text, { productDiscount }) => (
        <div className="flex gap-2 flex-wrap">
          {
            // map item to product name from productDiscount
            productDiscount[0]?.groupId
              ? productDiscount
                  .map((item) => {
                    const product = groupProduct?.data?.items.find((product) => product?.id === item.groupId);
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.name}
                    </span>
                  ))
              : productDiscount
                  .map((item) => {
                    const product = products?.data?.items.find(
                      (product) => product.productUnit?.id === item.productUnitId,
                    );
                    return product;
                  })
                  .map((product, index) => (
                    <span className="bg-[#f0f0f0] rounded px-2 py-1" key={index}>
                      {product?.productUnit?.code +
                        " - " +
                        product?.product?.name +
                        " - " +
                        product?.productUnit?.unitName}
                    </span>
                  ))
          }
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "maxQuantity",
      key: "maxQuantity",
      className: "",
      render: (text) => <span>{formatNumber(text)}</span>,
    },
  ];

  // Define the columns mapping for each combination of target and type
  const columnMap: Record<string, any> = {
    [`${EDiscountType.ORDER}_${EDiscountBillMethod.ORDER_PRICE}`]: columns,
    [`${EDiscountType.ORDER}_${EDiscountBillMethod.PRODUCT_PRICE}`]: columns2,
    [`${EDiscountType.ORDER}_${EDiscountBillMethod.LOYALTY}`]: columns4,
    [`${EDiscountType.ORDER}_${EDiscountBillMethod.GIFT}`]: columns9,
    [`${EDiscountType.PRODUCT}_${EDiscountGoodsMethod.PRODUCT_PRICE}`]: columns5,
    [`${EDiscountType.PRODUCT}_${EDiscountGoodsMethod.GIFT}`]: columns6,
    [`${EDiscountType.PRODUCT}_${EDiscountGoodsMethod.LOYALTY}`]: columns7,
    [`${EDiscountType.PRODUCT}_${EDiscountGoodsMethod.PRICE_BY_BUY_NUMBER}`]: columns8,
  };

  const checkType = (target: EDiscountType, type: string) => {
    const key = `${target}_${type}`;
    return columnMap[key?.toUpperCase()] || columns3;
  };

  return (
    <CustomTable
      dataSource={record?.discountItem}
      columns={checkType(record?.target, record?.type)}
      bordered
      loading={isLoadingProduct}
    />
  );
}
