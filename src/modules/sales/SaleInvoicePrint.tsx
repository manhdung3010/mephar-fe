import { convertMoneyToString, formatDate, formatDateTime, formatMoney, formatNumber } from "@/helpers";
import Image from "next/image";
import React, { useMemo } from "react";
import Logo from "@/public/apple-touch-icon.png";

function SaleInvoicePrint({ saleInvoice }: any) {
  const getDiscount = (record) => {
    let total = 0;
    record.products?.forEach((item) => {
      total += item.price;
    });
    return formatMoney(total);
  };

  console.log("saleInvoice", saleInvoice);
  const totalNumber = useMemo(() => {
    return saleInvoice.products?.reduce((acc, cur) => acc + cur.quantity, 0);
  }, [saleInvoice.products]);
  return (
    <div>
      <div className="flex items-center flex-col">
        <Image src={Logo} alt="logo" />
        <p className="font-bold">{saleInvoice?.order?.branch?.name ?? saleInvoice?.branch?.name}</p>
        <p>
          Địa chỉ:
          {saleInvoice?.order ? (
            <span>
              {saleInvoice?.order?.branch?.ward?.name} - {saleInvoice?.order?.branch?.district?.name} -{" "}
              {saleInvoice?.order?.branch?.province?.name}
            </span>
          ) : (
            <span>
              {saleInvoice?.branch?.ward?.name} - {saleInvoice?.branch?.district?.name} -{" "}
              {saleInvoice?.branch?.province?.name}
            </span>
          )}
        </p>
        <p>
          SĐT: <span>{saleInvoice?.order?.branch?.phone ?? saleInvoice?.branch?.phone}</span>
        </p>
        <h4 className="text-lg font-bold">HÓA ĐƠN BÁN HÀNG</h4>
        <p className="font-bold">
          Số HĐ: <span>{saleInvoice?.order?.code ?? saleInvoice?.code}</span>
        </p>
        <p>
          Ngày tạo: <span>{formatDateTime(saleInvoice?.order?.createdAt ?? saleInvoice?.createdAt)}</span>
        </p>
      </div>
      <div className="mt-5">
        <p>
          Khách hàng:{" "}
          <span className="ml-1">{saleInvoice?.order?.customer?.fullName ?? saleInvoice?.customer?.fullName}</span>
        </p>
        <p>
          SĐT: <span className="ml-1">{saleInvoice?.order?.customer?.phone ?? saleInvoice?.customer?.phone}</span>
        </p>
        <p>
          Địa chỉ:{" "}
          <span className="ml-1">{saleInvoice?.order?.customer?.address ?? saleInvoice?.customer?.address}</span>
        </p>
      </div>

      <div className="overflow-x-auto my-4">
        <table className="table-auto w-full">
          <thead className="text-left">
            <tr>
              <th className="border-black border-y-[1px] py-2">Tên sản phẩmx</th>
              <th className="border-black border-y-[1px] py-2">Số lượng</th>
              <th className="border-black border-y-[1px] py-2">Đơn giá</th>
              <th className="border-black border-y-[1px] py-2">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {saleInvoice?.products.map((product, index) => {
              return (
                <>
                  <tr key={index}>
                    <td className="border-b-[1px] border-black border-dotted py-2">{product?.product?.name}</td>
                    <td className="border-b-[1px] border-black border-dotted py-2">{formatNumber(product.quantity)}</td>
                    <td className="border-b-[1px] border-black border-dotted py-2">{formatMoney(product.price)}</td>
                    <td className="border-b-[1px] border-black border-dotted py-2">
                      {formatMoney(product.quantity * product.price)}
                    </td>
                  </tr>
                  <div className="flex items-center py-2 gap-2">
                    {product?.batches?.map((b, index) => (
                      <div className="flex items-center rounded  py-1 px-2 border-[1px] " key={index}>
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
              saleInvoice?.order ? formatMoney(saleInvoice?.order?.totalPrice + saleInvoice?.order?.discount) : formatMoney(saleInvoice?.totalPrice + saleInvoice?.discount)
            }
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Giảm giá:</div>
          <div className="text-black-main text-right">
            {formatMoney(saleInvoice?.order?.discount ?? saleInvoice?.discount)}
          </div>
        </div>

        <div className="grid grid-cols-2">
          <div className="">Tổng thanh toán:</div>
          {
            saleInvoice?.order ? <div className="text-black-main text-right">
              {formatMoney(+saleInvoice?.order?.totalPrice)}
            </div> : <div className="text-black-main text-right">
              {formatMoney(+saleInvoice?.totalPrice)}
            </div>
          }
        </div>
      </div> */}
      <div className="ml-auto mb-5 w-[300px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng số lượng:</div>
          <div className="text-black-main">{formatNumber(totalNumber)}</div>
        </div>
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng tiền hàng:</div>
          <div className="text-black-main">{getDiscount(saleInvoice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Giảm giá hóa đơn:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.order?.totalDiscountOrder)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Khách cần trả:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.order?.totalPrice)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Khách đã trả:</div>
          <div className="text-black-main">{formatMoney(saleInvoice?.order?.cashOfCustomer)}</div>
        </div>
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Dư nợ hiện tại:</div>
          <div className="text-black-main">
            {formatMoney(saleInvoice?.order?.cashOfCustomer - saleInvoice?.order?.totalPrice)}
          </div>
        </div>
      </div>
      <div className="text-center">
        {saleInvoice?.order ? (
          <p className="italic mt-4">
            (Bằng chữ: <span className="">{convertMoneyToString(+saleInvoice?.order?.totalPrice)} đồng)</span>
          </p>
        ) : (
          <p className="italic mt-4">
            (Bằng chữ: <span className="">{convertMoneyToString(+saleInvoice?.totalPrice)} đồng)</span>
          </p>
        )}
        <p>
          <span className="font-bold text-center">Quét mã thanh toán</span>
          <p className="italic mt-10">Cảm ơn và hẹn gặp lại!</p>
        </p>
      </div>
    </div>
  );
}

export default SaleInvoicePrint;
