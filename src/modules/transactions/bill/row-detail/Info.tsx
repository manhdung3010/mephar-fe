import { Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import CloseIcon from "@/assets/closeIcon.svg";
import DiscountIcon from "@/assets/gift.svg";
import PrintOrderIcon from "@/assets/printOrder.svg";
import { CustomButton } from "@/components/CustomButton";
import CustomTable from "@/components/CustomTable";
import { EGenderLabel, EOrderStatusLabel } from "@/enums";
import { formatDate, formatMoney, formatNumber, hasPermission } from "@/helpers";
import { message } from "antd";
import { deleteOrder } from "@/api/order.service";
import PlusIconWhite from "@/assets/PlusIconWhite.svg";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { profileState } from "@/recoil/state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactToPrint } from "react-to-print";
import { useRecoilValue } from "recoil";
import { IOrder } from "../../order/type";
import CancelBillModal from "./CancelBillModal";
import InvoicePrint from "./InvoicePrint";
import styles from "./invoicePrint.module.css";
import { useRouter } from "next/router";
import { getDiscountByIdOrder } from "@/api/discount.service";
import { EDiscountGoodsMethod } from "@/modules/settings/discount/add-discount/Info";
import { DiscountDetailModal } from "./DiscountDetailModal";
const { TextArea } = Input;
interface IRecord {
  key: number;
  code: string;
  name: string;
  quantity: number;
  discount: number;
  price: number;
  totalPrice: number;
  refund: number;
  unitName: string;
  batches?: any[];
  itemPrice?: number;
}

export function Info({ record }: { record: IOrder }) {
  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});
  const [openCancelBill, setOpenCancelBill] = useState(false);
  const profile = useRecoilValue(profileState);
  const [discountId, setDiscountId] = useState<any>("");
  const [openDiscountDetail, setOpenDiscountDetail] = useState(false);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: discountDetail } = useQuery(
    ["DISCOUNT_ORDER_DETAIL", record?.id],
    () => getDiscountByIdOrder(Number(record?.id)),
    { enabled: !!record?.id },
  );

  console.log("discountDetail", discountDetail);

  const { mutate: mutateCancelImportProduct, isLoading: isLoadingDeleteProduct } = useMutation(
    () => deleteOrder(Number(record.id)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["ORDER_LIST"]);
        setOpenCancelBill(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCancelImportProduct();
  };

  const invoiceComponentRef = useRef(null);

  useEffect(() => {
    if (record?.products?.length) {
      const expandedRowKeysClone = { ...expandedRowKeys };
      record?.products?.forEach((_, index) => {
        expandedRowKeysClone[index] = true;
      });

      setExpandedRowKeys(expandedRowKeysClone);
    }
  }, [record?.products]);

  const columns: ColumnsType<IRecord> = [
    {
      title: "Mã hàng",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            // const currentState = expandedRowKeys[`${index}`];
            // const temp = { ...expandedRowKeys };
            // if (currentState) {
            //   delete temp[`${index}`];
            // } else {
            //   temp[`${index}`] = true;
            // }
            // setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn vị",
      dataIndex: "unitName",
      key: "unitName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (value, { quantity }) => formatMoney(+value / quantity),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      render: (_, { quantity, price, itemPrice }) => formatMoney(price - Number(itemPrice ?? 0)),
    },
    // {
    //   title: "Giá bán",
    //   dataIndex: "totalPrice",
    //   key: "totalPrice",
    //   render: (_, { quantity, price }) => formatMoney(price),
    // },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (_, { quantity, price, itemPrice }) => formatMoney(itemPrice),
    },
  ];

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  const totalNumber = useMemo(() => {
    return record.products?.reduce((acc, cur) => acc + cur.quantity, 0);
  }, [record.products]);

  const getDiscount = (record) => {
    let total = 0;
    record.products?.forEach((item) => {
      total += item.price;
    });
    return formatMoney(total);
  };

  return (
    <div className="gap-12 ">
      <div className="flex gap-5">
        <div className="mb-4 grid w-2/3 grid-cols-2 gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Mã hóa đơn:</div>
            <div className="text-black-main">{record.code}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Trạng thái:</div>
            <div className="text-[#00B63E]">{EOrderStatusLabel[record.status]}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Thời gian:</div>
            <div className="text-black-main">{record.createdAt}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Chi nhánh:</div>
            <div className="text-black-main">{record.branch?.name}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Khách hàng:</div>
            <div className="text-black-main">{record.customer?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người bán:</div>
            <div className="text-black-main">{record.user?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Bảng giá:</div>
            <div className="text-black-main">Bảng giá chung</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Người tạo:</div>
            <div className="text-black-main">{profile?.fullName}</div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="text-gray-main">Ngày tạo:</div>
            <div className="text-black-main">{record.createdAt}</div>
          </div>
        </div>

        <div className="grow">
          <TextArea rows={8} placeholder="Ghi chú:" value={record.description} readOnly />
        </div>
      </div>

      {record?.prescription && (
        <div className=" mb-4 rounded bg-[#F2F4F5] p-4">
          <div className="#0F1824 mb-4 text-base font-medium">Thông tin đơn thuốc</div>

          <div className="grid grid-cols-3 gap-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Mã đơn thuốc:</div>
              <div className="text-black-main">{record.prescription?.code}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Giới tính:</div>
              <div className="text-black-main">{EGenderLabel[record.prescription?.gender]}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Địa chỉ:</div>
              <div className="text-black-main">{record.prescription?.address}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Bác sĩ kê đơn:</div>
              <div className="text-[#0070F4]">{record.prescription?.doctor?.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Cân nặng:</div>
              <div className="text-black-main">{record.prescription?.weight}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Người giám hộ:</div>
              <div className="text-black-main">{record.prescription?.supervisor}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">CS khám bệnh:</div>
              <div className="text-black-main">{record.prescription?.healthFacility?.name}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">CMND/Căn cước:</div>
              <div className="text-black-main">{record.prescription?.identificationCard}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Số điện thoại:</div>
              <div className="text-black-main">{record.prescription?.phone}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Tuổi:</div>
              <div className="text-black-main">{record.prescription?.age}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Thẻ bảo hiểm y tế:</div>
              <div className="text-black-main">{record?.prescription?.healthInsuranceCard}</div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div className="text-gray-main">Chẩn đoán:</div>
              <div className="text-black-main">{record.prescription?.diagnostic}</div>
            </div>
          </div>
        </div>
      )}

      <CustomTable
        dataSource={record.products?.map((item: any, index) => ({
          ...item,
          code: JSON.parse(item.productUnitData)?.code,
          name: item.product.name,
          quantity: item.quantity,
          discount: item.discount,
          price: item.price,
          unitName: item.productUnit?.unitName,
          key: index,
        }))}
        columns={columns}
        pagination={false}
        className="mb-4"
        expandable={{
          defaultExpandAllRows: true,
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) =>
            record?.batches &&
            record?.batches?.length > 0 && (
              <div className="flex items-center bg-[#FFF3E6] px-6 py-2 gap-2">
                {record?.batches?.map((b, index) => (
                  <div className="flex items-center rounded bg-red-main py-1 px-2 text-white">
                    <span className="mr-2">
                      {b.batch?.name} - {formatDate(b?.batch?.expiryDate)} - SL: {formatNumber(b?.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <div className="flex">
        {discountDetail?.data.length > 0 && (
          <div>
            <div className="border-dashed border-[1px] p-3">
              <div className="flex gap-2 items-center mb-1.5">
                <Image src={DiscountIcon} alt="discount-icon" />
                <span> Khuyến mại</span>
              </div>
              {discountDetail?.data?.map((item, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setDiscountId(item?.discountId);
                    setOpenDiscountDetail(true);
                  }}
                  className="cursor-pointer text-blue-400"
                >
                  - {item.discount.name}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="ml-auto mb-5 w-[300px]">
          <div className=" mb-3 grid grid-cols-2">
            <div className="text-gray-main">Tổng số lượng:</div>
            <div className="text-black-main">{formatNumber(totalNumber)}</div>
          </div>
          <div className=" mb-3 grid grid-cols-2">
            <div className="text-gray-main">Tổng tiền hàng:</div>
            <div className="text-black-main">{getDiscount(record)}</div>
          </div>
          {Number(record?.discountByPoint ?? 0) > 0 && (
            <div className=" mb-3 grid grid-cols-2">
              <div className="text-gray-main">Giảm giá điểm:</div>
              <div className="text-black-main">{formatMoney(record?.discountByPoint)}</div>
            </div>
          )}
          <div className=" mb-3 grid grid-cols-2">
            <div className="text-gray-main">Giảm giá hóa đơn:</div>
            <div className="text-black-main">{formatMoney(record?.discountOrder)}</div>
          </div>

          <div className=" mb-3 grid grid-cols-2">
            <div className="text-gray-main">Khách cần trả:</div>
            <div className="text-black-main">{formatMoney(record?.totalPrice)}</div>
          </div>

          <div className=" mb-3 grid grid-cols-2">
            <div className="text-gray-main">Khách đã trả:</div>
            <div className="text-black-main">{formatMoney(record?.cashOfCustomer)}</div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.bill, RoleAction.delete) && (
          <CustomButton
            outline={true}
            prefixIcon={<Image src={CloseIcon} alt="" />}
            onClick={() => setOpenCancelBill(true)}
          >
            Hủy bỏ
          </CustomButton>
        )}
        {record?.canReturn && (
          <CustomButton
            type="success"
            prefixIcon={<Image src={PlusIconWhite} alt="" />}
            onClick={() => router.push(`/sales?id=${record.id}`)}
          >
            Trả hàng
          </CustomButton>
        )}
      </div>

      <div ref={invoiceComponentRef} className={styles.invoicePrint}>
        <InvoicePrint saleInvoice={record} totalNumber={totalNumber} />
      </div>
      <CancelBillModal
        isOpen={openCancelBill}
        onCancel={() => setOpenCancelBill(false)}
        onSubmit={onSubmit}
        isLoading={isLoadingDeleteProduct}
      />
      <DiscountDetailModal
        isOpen={openDiscountDetail}
        onCancel={() => setOpenDiscountDetail(false)}
        discountId={discountId}
      />
    </div>
  );
}
