import type { ColumnsType } from "antd/es/table";
import Image from "next/image";

import CloseIcon from "@/assets/closeIcon.svg";
import EditIcon from "@/assets/editIcon.svg";
import PrintOrderIcon from "@/assets/printOrder.svg";
import SaveIcon from "@/assets/saveIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomInput } from "@/components/CustomInput";
import { CustomSelect } from "@/components/CustomSelect";
import CustomTable from "@/components/CustomTable";
import { formatDateTime, formatMoney, formatNumber, hasPermission } from "@/helpers";
import { useRef, useState } from "react";
import DeleteModal from "./DeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deleteInventoryChecking } from "@/api/check-inventory";
import { useRecoilValue } from "recoil";
import { branchState, profileState } from "@/recoil/state";
import { useReactToPrint } from "react-to-print";
import styles from "./style.module.css";
import InvoicePrint from "./InvoicePrint";
import CopyBlueIcon from "@/assets/copyBlue.svg";
import { RoleAction, RoleModel } from "@/modules/settings/role/role.enum";
import { useRouter } from "next/router";
import { IProduct } from "../../list-product/types";
import { getProductDetail } from "@/api/product.service";
import ProductDetail from "./ProductDetail";

interface IRecord {
  key: number;
  id: string;
  name: string;
  inventoryQuantity: number;
  actualQuantity: number;
  diffQuantity: number;
  diffAmount: number;
  productUnit?: any;
  difference: number;
  realQuantity: number;
}

export function Info({ record }: { record: any }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const branchId = useRecoilValue(branchState);
  const invoiceComponentRef = useRef(null);
  const [openDelete, setOpenDelete] = useState(false);
  const profile = useRecoilValue(profileState);

  const [valueChange, setValueChange] = useState<number | undefined>(undefined);
  const [selectedList, setSelectedList] = useState<IProduct[]>([]);
  const [selectIdProduct, setIdProduct] = useState();
  const [productDetail, setProductDetail] = useState();

  const [expandedRowKeys, setExpandedRowKeys] = useState<Record<string, boolean>>({});

  const handleChangeUnitValue = (value, record) => {
    setValueChange(value);
    const filter = selectedList.filter((item) => item?.id !== record.id);
    const newRecord = record?.productUnit?.find((unit) => unit.id === value);
    setSelectedList(
      [
        ...filter,
        {
          ...record,
          price: newRecord?.price,
          code: newRecord?.code,
          barCode: newRecord.barCode,
          unitId: value,
          unitQuantity: Number(record?.inventory) / newRecord?.exchangeValue,
          tempPrimePrice: record?.primePrice * newRecord?.exchangeValue,
        },
      ]?.sort(function (a, b) {
        return b.id - a.id;
      }),
    );
  };

  const { data } = useQuery(["DETAIL_PRODUCT", selectIdProduct], () => getProductDetail(Number(selectIdProduct)), {
    enabled: !!selectIdProduct,
    onSuccess: (data) => {
      setProductDetail(data?.data);
    },
  });

  const columns: ColumnsType<IRecord> = [
    {
      title: "Mã hàng",
      dataIndex: "productUnit",
      key: "productUnit",
      render: (productUnit) => <span className="cursor-pointer text-[#0070F4]">{productUnit?.code}</span>,
    },
    {
      title: "Tên hàng",
      dataIndex: "name",
      key: "name",
      render: (_, record) => <span>{record?.productUnit?.product?.name}</span>,
    },
    {
      title: "ĐVT",
      dataIndex: "name",
      key: "name",
      render: (_, { productUnit }) => <span>{productUnit?.unitName}</span>,
    },
    {
      title: "Tồn kho",
      dataIndex: "inventoryQuantity",
      key: "inventoryQuantity",
      render: (_, record) => (
        <span>
          {formatNumber(
            record?.difference >= 0
              ? record?.realQuantity - record?.difference
              : Math.abs(record?.difference) + record?.realQuantity,
          )}
        </span>
      ),
    },
    {
      title: "Thực tế",
      dataIndex: "realQuantity",
      key: "realQuantity",
      render: (realQuantity) => formatNumber(realQuantity),
    },
    {
      title: "Số lượng lệch",
      dataIndex: "difference",
      key: "difference",
      render: (difference) => formatNumber(difference),
    },
    {
      title: "Giá trị lệch",
      dataIndex: "diffAmount",
      key: "diffAmount",
      render: (_, record) => formatNumber(record?.difference * record?.productUnit?.price),
    },
  ];

  const { mutate: mutateDeleteInventory, isLoading: isLoadingDeleteInventory } = useMutation(
    () => deleteInventoryChecking(Number(record.id), Number(branchId)),
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["INVENTORY_CHECKING"]);
        setOpenDelete(false);
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const handlePrint = useReactToPrint({
    content: () => invoiceComponentRef.current,
  });

  return (
    <div className="gap-12 ">
      <div ref={invoiceComponentRef} className={`${styles.invoicePrint} invoice-print`}>
        <InvoicePrint data={record} columns={columns} />
      </div>
      <div className="mb-4 grid flex-1 grid-cols-2 gap-4">
        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Mã nhập hàng:</div>
          <div className="text-black-main">{record?.code}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Người cân bằng:</div>
          <div className="w-3/4">
            {/* <CustomSelect onChange={() => {}} className="border-underline" /> */}
            {record?.userCreate?.fullName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Thời gian:</div>
          <div className="text-black-main">{formatDateTime(record?.createdAt)}</div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">
            {/* <Image src={EditIcon} /> */}
            <span className="">Ghi chú:</span>
          </div>
          <div className="w-3/4">
            {/* <CustomInput bordered={false} onChange={() => {}} /> */}
            {record?.note}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="text-gray-main">Trạng thái:</div>
          <div className="text-[#00B63E]">Đã cân bằng kho</div>
        </div>
      </div>

      <CustomTable
        dataSource={record?.inventoryCheckingProduct.map((item, index) => ({
          ...item,
          key: index,
        }))}
        columns={columns}
        pagination={false}
        className="mb-4"
        onRow={(record) => ({
          onClick: (event) => {
            if (
              (event.target as Element).closest(".ant-table-cell.unit-col") ||
              (event.target as Element).closest(".rc-virtual-list-holder-inner")
            ) {
              return;
            }

            setExpandedRowKeys((prevKeys) => {
              const { [record.key]: value, ...remainingKeys } = prevKeys;
              return value ? remainingKeys : { ...prevKeys, [record.key]: true };
            });
          },
        })}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: any) => {
            setIdProduct(record.productUnit.product.id);
            return (
              <>
                {productDetail && (
                  <ProductDetail
                    record={productDetail}
                    onChangeUnit={(value) => handleChangeUnitValue(value, productDetail)}
                    branchId={branchId}
                  />
                )}
              </>
            );
          },
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <div className="ml-auto mb-5 w-[380px]">
        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng thực tế {"(" + record?.totalRealQuantity + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.totalVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch tăng {"(" + formatNumber(record?.totalIncrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.increaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">Tổng lệch giảm {"(" + formatNumber(record?.totalDecrease) + ")"}:</div>
          <div className="text-black-main">{formatMoney(record?.decreaseVal)}</div>
        </div>

        <div className=" mb-3 grid grid-cols-2">
          <div className="text-gray-main">
            Tổng chênh lệch {"(" + formatNumber(record?.totalIncrease + record?.totalDecrease) + ")"}:
          </div>
          <div className="text-black-main">{formatMoney(record?.increaseVal + record?.decreaseVal)}</div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {hasPermission(profile?.role?.permissions, RoleModel.check_inventory, RoleAction.delete) && (
          <CustomButton
            outline={true}
            prefixIcon={<Image src={CloseIcon} alt="" />}
            onClick={() => setOpenDelete(true)}
          >
            Hủy bỏ
          </CustomButton>
        )}
      </div>

      <DeleteModal
        isOpen={openDelete}
        onCancel={() => setOpenDelete(false)}
        onSubmit={() => mutateDeleteInventory()}
        isLoading={isLoadingDeleteInventory}
      />
    </div>
  );
}
