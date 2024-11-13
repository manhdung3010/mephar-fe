import Image from "next/image";

import CloseIcon from "@/assets/closeGrayIcon.svg";
import SampleProduct from "@/assets/images/product-sample.png";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { getImage, sliceString } from "@/helpers";
import { cloneDeep } from "lodash";

export function SeriDetailModal({
  isOpen,
  onCancel,
  seriInfo,
  getValues,
  setValue,
  select,
}: {
  isOpen: boolean;
  onCancel: () => void;
  seriInfo: any;
  getValues: any;
  setValue: any;
  select: number;
}) {
  return (
    <CustomModal title="Chi tiết seri đã quét" isOpen={isOpen} onCancel={onCancel} width={900} customFooter={true}>
      <div className="">
        <div className="my-4 h-[1px] w-full border-b border-[#C7C9D9]"></div>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex w-20 h-20 rounded-xl border border-[#C7C9D9] overflow-hidden">
            <Image
              src={getImage(seriInfo?.marketProduct?.imageCenter?.path)}
              width={80}
              height={80}
              objectFit="cover"
              alt=""
            />
          </div>
          <div className="grow">
            <div className="mb-2 text-[#333] font-semibold text-base">{seriInfo?.marketProduct?.product?.name}</div>
            <div
              className={`font-medium ${
                seriInfo?.listSeri?.length === seriInfo?.quantity || seriInfo?.importQuantity === seriInfo?.quantity
                  ? "text-[#05A660]"
                  : "text-[#FF8800]"
              }`}
            >
              Đã thêm: {select === 1 ? seriInfo?.importQuantity : seriInfo?.listSeri?.length}/{seriInfo?.quantity}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {getValues("products") &&
            seriInfo &&
            getValues("products")
              ?.find((item) => item.id === seriInfo?.id)
              ?.listSeri?.map((seri: string, index: number) => (
                <div
                  className="flex items-center justify-between rounded bg-[#F2F2F5] p-3 text-base font-medium text-black"
                  key={index}
                >
                  <span>{seri}</span>
                  <Image
                    src={CloseIcon}
                    className="cursor-pointer w-6 h-6 flex-shrink-0"
                    onClick={() => {
                      // delete seri from listSeri
                      const products: any = cloneDeep(getValues("products"));
                      const productIndex = products.findIndex((p: any) => p.marketOrderProductId === seriInfo.id);
                      const seriIndex = products[productIndex].listSeri.findIndex((s: string) => s === seri);
                      products[productIndex].listSeri.splice(seriIndex, 1);
                      setValue("products", products, { shouldValidate: true });
                    }}
                  />
                </div>
              ))}
        </div>
        <div className="my-4 h-[1px] w-full border-b border-[#C7C9D9]"></div>

        <CustomButton className="ml-auto !h-12 !w-[150px] p-3 text-xl" onClick={onCancel}>
          Xác nhận
        </CustomButton>
      </div>
    </CustomModal>
  );
}
