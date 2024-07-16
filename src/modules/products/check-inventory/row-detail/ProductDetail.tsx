import classNames from "classnames";
import { useState } from "react";
import { IProduct } from "../../list-product/types";
import Inventory from "../../list-product/row-detail/Inventory";
import ProductExpire from "../../list-product/row-detail/ProductExpire";

const ProductDetail = ({
  record,
  onChangeUnit,
  branchId,
}: {
  record: IProduct;
  onChangeUnit: any;
  branchId: number;
}) => {
  const [select, setSelect] = useState(0);

  console.log(123123123, record);

  const menu = ["Tồn kho", record?.isBatchExpireControl && "Lô/hạn sử dụng"];

  return (
    <div
      className="flex flex-col gap-5 bg-white px-4 pt-4 pb-5"
      style={{ boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)" }}
    >
      <div className="flex flex-col">
        <div className="flex gap-3">
          {menu.map((item, index) => (
            <div
              key={index}
              className={classNames(
                "cursor-pointer px-5 py-[6px] rounded-t-lg",
                index === select
                  ? "bg-[#D64457] text-[white]"
                  : "text-black-main"
              )}
              onClick={() => setSelect(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="h-[1px] w-full bg-[#D64457]" />
      </div>

      {select === 0 && (
        <Inventory productId={record?.id} record={record} branchId={branchId} />
      )}
      {select === 1 && record?.isBatchExpireControl && (
        <ProductExpire
          productId={record?.id}
          branchId={branchId}
          productUnit={record?.productUnit}
        />
      )}
    </div>
  );
};

export default ProductDetail;
