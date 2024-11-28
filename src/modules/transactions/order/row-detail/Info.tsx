import Image from "next/image";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import CloseIcon from "@/assets/closeIcon.svg";
import DeliveryIcon from "@/assets/deliveryIcon.svg";
import DocumentIcon from "@/assets/documentBlueIcon.svg";
import DolarIcon from "@/assets/dolarBlueIcon.svg";
import ReportIcon from "@/assets/reportBlueIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { formatMoney, getImage, hasPermission } from "@/helpers";
import { updateMarketOrderStatus } from "@/api/market.service";
import { shipFee } from "@/modules/markets/payment";
import { EOrderMarketStatus, EOrderMarketStatusLabel } from "@/modules/markets/type";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { branchState, profileState } from "@/recoil/state";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { useRecoilValue } from "recoil";
import { OrderHistoryModal } from "./HistoryModal";
import UpdateStatusModal from "@/components/CustomModal/ModalUpdateStatusItem";
import CloseIconRed from "@/assets/closeIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import PaymentModal from "./PaymentModal";
import SelectBranchModal from "./SelectBranchModal";
import CancleModal from "./CancleModal";
import { SeriModal } from "./SeriModal";
import PrintOrderIcon from "@/assets/printOrder.svg";
import { useReactToPrint } from "react-to-print";
import OrderPrint from "./OrderPrint";
import styles from "./orderPrint.module.css";
export function Info({ record }: { record: any }) {
  const router = useRouter();
  const profile = useRecoilValue(profileState);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowCancleModal, setIsShowCancleModal] = useState(false);
  const [isShowSelectBranch, setIsShowSelectBranch] = useState(false);
  const [isShowPaymentModal, setIsShowPaymentModal] = useState(false);
  const [statusTemp, setStatusTemp] = useState<string>("");
  const [isShowSeriModal, setIsShowSeriModal] = useState(false);
  const [seriList, setSeriList] = useState<any>([]);
  const invoiceComponentRef = useRef(null);

  const totalPrice = useMemo(() => {
    return record.products.reduce((total, product) => {
      return total + product.itemPrice * product.quantity;
    }, 0);
  }, [record.products]);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);

  const { mutate: mutateCreateGroupProduct, isLoading: isLoadingCreateGroupProduct } = useMutation(
    (payload: any) => {
      if (payload?.status === EOrderMarketStatus.CLOSED || payload?.status === EOrderMarketStatus.CANCEL) {
        return updateMarketOrderStatus(payload?.id, { status: payload?.status, note: payload?.note });
      }
      if (payload?.status === EOrderMarketStatus.SEND) {
        const newPayload = {
          status: payload?.status,
          delivery: {
            code: "SHIP123123123",
            price: shipFee,
            name: "Giao hàng nhanh",
          },
        };
        return updateMarketOrderStatus(payload?.id, newPayload);
      }
      return updateMarketOrderStatus(payload?.id, { status: payload?.status });
    },
    {
      onSuccess: async (res) => {
        await queryClient.invalidateQueries(["MAKET_ORDER"]);
        setStatusTemp("");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const updateOrderStatus = (id: string, status: string, note?: string) => {
    mutateCreateGroupProduct({ id, status: status, note });
  };

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  console.log("record", record);

  return (
    <div className="gap-12 ">
      <div className="mb-4 grid grid-cols-2 border-b border-[#E8EAEB]">
        <div>
          <div ref={invoiceComponentRef} className={styles.invoicePrint}>
            <OrderPrint saleInvoice={record} />
          </div>
          <div className="mb-4 font-semibold text-black-main">Thông tin đơn hàng</div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Mã đơn hàng:</div>
            <div className="col-span-2 text-black-main">{record.code}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Đại lý phân phối:</div>
            <div className="col-span-2 text-black-main">{record?.store?.name}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Trạng thái:</div>
            <div
              className={`py-1 px-2 rounded-2xl border-[1px]  w-max
              ${record?.status === EOrderMarketStatus.PENDING && " bg-[#fff2eb] border-[#FF8800] text-[#FF8800]"}
              ${
                record?.status === EOrderMarketStatus.CONFIRM ||
                record?.status === EOrderMarketStatus.PROCESSING ||
                (record?.status === EOrderMarketStatus.SEND && " bg-[#e5f0ff] border-[#0063F7] text-[#0063F7]")
              }
              ${record?.status === EOrderMarketStatus.DONE && " bg-[#e3fff1] border-[#05A660] text-[#05A660]"}
              ${
                record?.status === EOrderMarketStatus.CANCEL ||
                (record?.status === EOrderMarketStatus.CLOSED && " bg-[#ffe5e5] border-[#FF3B3B] text-[#FF3B3B]")
              }
              `}
            >
              {EOrderMarketStatusLabel[record.status?.toUpperCase()]}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Ghi chú:</div>
            <div className="col-span-2 text-black-main">{record?.note}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Lý do huỷ:</div>
            <div className="col-span-2 text-black-main">{record?.closedNote || record?.cancelNote}</div>
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-black-main">Thông tin vận chuyển</div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Đơn vị vận chuyển:</div>
            <div className="col-span-2 text-black-main">Giao hàng nhanh</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Mã vận chuyển:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Phí vận chuyển:</div>
            <div className="col-span-2 text-black-main">{formatMoney(shipFee)}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Dự kiến nhận hàng:</div>
            <div className="col-span-2 text-black-main">---</div>
          </div>

          <button className="cursor-pointer text-red-main underline" onClick={() => setOpenHistoryModal(true)}>
            Lịch sử đơn hàng
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 border-b border-[#E8EAEB]">
        <div>
          <div className="mb-4 font-semibold text-black-main">Thông tin NHẬN HÀNG</div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tên người nhận:</div>
            <div className="col-span-2 text-black-main">{record?.fullName}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Số điện thoại:</div>
            <div className="col-span-2 text-black-main">{record?.phone}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Địa chỉ:</div>
            <div className="col-span-2 text-black-main">
              {record?.address}, {record?.ward?.name}
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-black-main">Thông tin Thanh toán</div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tổng tiền sản phẩm:</div>
            <div className="col-span-2 text-black-main">{formatMoney(totalPrice)}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Khuyến mại hóa đơn:</div>
            <div className="col-span-2 text-black-main">{formatMoney(totalPrice - Number(record?.totalPrice))}</div>
          </div>
          <div className="mb-4 grid grid-cols-3 gap-5">
            <div className="text-gray-main ">Tổng tiền thanh toán:</div>
            <div className="col-span-2 text-black-main">{formatMoney(record?.totalPrice)}</div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="mb-4 text-base font-semibold text-black-main">sản phẩm ({record.products.length})</div>

        {record.products.map((product) => (
          <div key={product.productId} className="mb-5 flex items-center gap-x-3">
            <div className="rounded border border-gray-300 overflow-hidden w-[60px] h-[60px]">
              {(product.marketProduct?.imageCenter?.path || product.marketProduct?.imageCenter?.filePath) && (
                <Image
                  width={60}
                  height={60}
                  src={
                    product.marketProduct?.imageCenter?.path
                      ? getImage(product.marketProduct?.imageCenter?.path)
                      : product.marketProduct?.imageCenter?.filePath
                  }
                  alt=""
                  objectFit="cover"
                />
              )}
            </div>
            <div className="text-black-main">
              <div className="font-semibold text-gray-main line-clamp-1">{product?.marketProduct?.product?.name}</div>
              <div className="font-semibold text-gray-main">
                {formatMoney(product?.price)}/ {product?.marketProduct?.productUnit?.unitName}
              </div>
              <div className="flex gap-x-40">
                <div className="w-10 flex-shrink-0">x{product.quantity}</div>
                <div className="text-[#00B63E]">
                  Tổng tiền:{" "}
                  {formatMoney((product?.itemPrice > 0 ? product?.itemPrice : product.price) * product.quantity)}
                </div>
                {product?.series?.length > 0 && (
                  <button
                    className="cursor-pointer text-red-main underline"
                    onClick={() => {
                      setIsShowSeriModal(true);
                      setSeriList(product?.series);
                    }}
                  >
                    Seri đã nhập
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.order, RoleAction.update) && (
          <>
            {record?.status === EOrderMarketStatus.PENDING && (
              <CustomButton
                type="danger"
                outline={true}
                onClick={() => {
                  router.push("/transactions/order/add-order?id=" + record.id);
                }}
                prefixIcon={<Image src={EditIcon} alt="" />}
              >
                Chỉnh sửa đơn hàng
              </CustomButton>
            )}
            {record?.status === EOrderMarketStatus.CONFIRM && (
              <CustomButton
                type="primary"
                outline={true}
                onClick={() => {
                  router.push("/transactions/order/process-order?id=" + record.id);
                }}
                prefixIcon={<Image src={DocumentIcon} alt="" />}
              >
                Xử lý đơn hàng
              </CustomButton>
            )}
            {record?.status === EOrderMarketStatus.PENDING && (
              <CustomButton
                type="primary"
                outline={true}
                prefixIcon={<Image src={ReportIcon} alt="" />}
                onClick={() => {
                  setIsShowSelectBranch(true);
                  setStatusTemp(EOrderMarketStatus.CONFIRM);
                }}
              >
                Xác nhận
              </CustomButton>
            )}
            {record?.status === EOrderMarketStatus.PROCESSING && (
              <CustomButton
                type="primary"
                outline={true}
                prefixIcon={<Image src={DeliveryIcon} alt="" />}
                onClick={() => {
                  setIsShowModal(true);
                  setStatusTemp(EOrderMarketStatus.SEND);
                }}
              >
                Gửi ĐVVC
              </CustomButton>
            )}
            {record?.status === EOrderMarketStatus.SEND && (
              <CustomButton
                type="primary"
                outline={true}
                prefixIcon={<Image src={DeliveryIcon} alt="" />}
                onClick={() => {
                  setIsShowModal(true);
                  setStatusTemp(EOrderMarketStatus.DONE);
                }}
              >
                Giao hàng thành công
              </CustomButton>
            )}
            {record?.status === EOrderMarketStatus.SEND && (
              <CustomButton
                type="danger"
                outline={true}
                prefixIcon={<Image src={CloseIconRed} alt="" />}
                onClick={() => {
                  setIsShowCancleModal(true);
                  setStatusTemp(EOrderMarketStatus.CANCEL);
                }}
              >
                Giao hàng thất bại
              </CustomButton>
            )}
            {record?.isPayment === false &&
              record?.status !== EOrderMarketStatus.CLOSED &&
              record?.status !== EOrderMarketStatus.CANCEL &&
              record?.status !== EOrderMarketStatus.PENDING && (
                <CustomButton
                  type="primary"
                  outline={true}
                  prefixIcon={<Image src={DolarIcon} alt="" />}
                  onClick={() => setIsShowPaymentModal(true)}
                >
                  Đã thanh toán
                </CustomButton>
              )}
          </>
        )}
        {hasPermission(profile?.role?.permissions, RoleModel.order, RoleAction.delete) &&
          record?.status === EOrderMarketStatus.PENDING && (
            <CustomButton
              outline={true}
              prefixIcon={<Image src={CloseIcon} alt="" />}
              onClick={() => {
                setIsShowCancleModal(true);
                setStatusTemp(EOrderMarketStatus.CLOSED);
              }}
            >
              Hủy bỏ
            </CustomButton>
          )}
      </div>
      <OrderHistoryModal
        isOpen={openHistoryModal}
        onCancel={() => setOpenHistoryModal(false)}
        historyPurchase={record?.historyPurchase}
      />
      <SeriModal
        isOpen={isShowSeriModal}
        onCancel={() => {
          setIsShowSeriModal(false);
          setSeriList([]);
        }}
        record={seriList}
      />
      <UpdateStatusModal
        isOpen={isShowModal}
        onCancel={() => setIsShowModal(false)}
        onSuccess={() => {
          updateOrderStatus(record.id, statusTemp);
          setIsShowModal(false);
        }}
        content="trạng thái đơn hàng"
      />
      <CancleModal
        isOpen={isShowCancleModal}
        onCancel={() => setIsShowCancleModal(false)}
        onSuccess={(note) => {
          updateOrderStatus(record.id, statusTemp, note);
          setIsShowCancleModal(false);
        }}
        content="đơn hàng"
      />
      <PaymentModal
        isOpen={isShowPaymentModal}
        onCancel={() => setIsShowPaymentModal(false)}
        id={record?.id}
        totalMoney={record?.totalPrice}
      />
      <SelectBranchModal
        isOpen={isShowSelectBranch}
        onCancel={() => setIsShowSelectBranch(false)}
        id={record?.id}
        products={record?.products}
      />
    </div>
  );
}
