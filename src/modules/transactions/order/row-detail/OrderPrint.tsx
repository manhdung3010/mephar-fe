import { convertMoneyToString, formatDate, formatDateTime, formatMoney, formatNumber } from "@/helpers";
import Image from "next/image";
import React from "react";
import Logo from "@/public/apple-touch-icon.png";

function OrderPrint({ saleInvoice, record }: any) {
  const getDiscount = (record) => {
    let total = 0;
    record.products?.forEach((item) => {
      total += item.price;
    });
    return formatMoney(total);
  };

  console.log("saleInvoice", saleInvoice);

  return (
    <div>
      <div className="flex items-center flex-col">
        <Image src={Logo} alt="logo" />
        <p className="font-bold">{saleInvoice?.branch?.name}</p>
        <p>
          Địa chỉ:
          <span>
            {saleInvoice?.address}, {saleInvoice?.ward?.name}, {saleInvoice?.district?.name},{" "}
            {saleInvoice?.province?.name}
            {saleInvoice?.branch?.province?.name}
          </span>
        </p>
        <p>
          SĐT: <span>{saleInvoice?.phone}</span>
        </p>
        <h4 className="text-lg font-bold">HÓA ĐƠN ĐẶT HÀNG</h4>
        <p className="font-bold">
          Số HĐ: <span>{saleInvoice?.code}</span>
        </p>
        <p>
          Ngày tạo: <span>{formatDateTime(saleInvoice?.createdAt)}</span>
        </p>
      </div>
      <div className="mt-5">
        <p>
          Khách hàng: <span className="ml-1">{saleInvoice?.customer?.fullName}</span>
        </p>
        <p>
          SĐT: <span className="ml-1">{saleInvoice?.customer?.phone}</span>
        </p>
        <p>
          Địa chỉ: <span className="ml-1">{saleInvoice?.customer?.address}</span>
        </p>
      </div>

      <div className="overflow-x-auto my-4">
        <table className="table-auto w-full">
          <thead className="text-left">
            <tr>
              <th className="border-black border-y-[1px] py-2">Tên sản phẩm</th>
              <th className="border-black border-y-[1px] py-2">Số lượng</th>
              <th className="border-black border-y-[1px] py-2">Đơn giá</th>
              <th className="border-black border-y-[1px] py-2">Giảm giá</th>
              <th className="border-black border-y-[1px] py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {saleInvoice?.products.map((product, index) => {
              return (
                <>
                  <tr key={index}>
                    <td className="border-b-[1px] border-black border-dotted py-2">
                      {product?.marketProduct?.product?.name} - {product?.marketProduct?.productUnit?.unitName}
                    </td>
                    <td className="border-b-[1px] border-black border-dotted py-2">{formatNumber(product.quantity)}</td>
                    <td className="border-b-[1px] border-black border-dotted py-2">{formatMoney(product.price)}</td>
                    <td className="border-b-[1px] border-black border-dotted py-2">
                      {formatMoney(product.price - Number(product?.itemPrice ?? 0))}
                    </td>
                    <td className="border-b-[1px] border-black border-dotted py-2">
                      {formatMoney(
                        product.quantity * Number(product?.itemPrice > 0 ? product?.itemPrice : product?.price),
                      )}
                    </td>
                  </tr>
                  <div className="flex items-center py-2 gap-2">
                    {product?.batches?.map((b, index) => (
                      <div className="flex items-center rounded  py-1 px-2 border-[1px] ">
                        <span className="mr-2">
                          {b.batch?.name} - {formatDate(b?.batch?.expiryDate)} - SL: {formatNumber(b?.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* <div className="ml-auto mb-5 w-[200px]">

        <div className="grid grid-cols-2">
          <div className="">Tổng cộng:</div>
          <div className="text-black-main text-right">
            {
              formatMoney(saleInvoice?.totalPrice + saleInvoice?.discount)
            }
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Giảm giá:</div>
          <div className="text-black-main text-right">
            {formatMoney(saleInvoice?.discount)}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Tổng thanh toán:</div>
          <div className="text-black-main text-right">
            {formatMoney(+saleInvoice?.totalPrice)}
          </div>
        </div>
      </div> */}
      <div className="ml-auto mb-5 w-[300px]">
        {/* <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số lượng:</div>
          <div className="text-black-main">{formatNumber(totalNumber)}</div>
        </div> */}
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng tiền hàng:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá hóa đơn:</div>
          <div className="text-black-main">
            {saleInvoice?.discountType === 1 ? saleInvoice?.discount + "%" : formatMoney(saleInvoice?.discount)}
          </div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Khách cần trả:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Khách đã trả:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.cashOfCustomer)}</div>
        </div>
        {/* <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Dư nợ hiện tại:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.cashOfCustomer - saleInvoice?.totalPrice)}</div>
        </div> */}
      </div>
      <div className="text-center">
        <p className="italic mt-4">
          (Bằng chữ: <span className="">{convertMoneyToString(+saleInvoice?.totalPrice)} đồng)</span>
        </p>
        <p>
          <span className="font-bold text-center">Quét mã thanh toán</span>
          <p className="italic mt-10">Cảm ơn và hẹn gặp lại!</p>
        </p>
      </div>
    </div>
  );
}

export default OrderPrint;
