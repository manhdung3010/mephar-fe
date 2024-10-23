import { getBranch } from "@/api/branch.service";
import { updateMarketOrderStatus } from "@/api/market.service";
import { getProduct, getSaleProducts } from "@/api/product.service";
import { CustomButton } from "@/components/CustomButton";
import { CustomModal } from "@/components/CustomModal";
import { CustomSelect } from "@/components/CustomSelect";
import CustomTable from "@/components/CustomTable";
import { formatMoney, formatNumber, getImage } from "@/helpers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { ColumnsType } from "antd/es/table";
import Image from "next/image";
import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

function SelectBranchModal({
  isOpen,
  onCancel,
  id,
  products,
}: {
  isOpen: boolean;
  onCancel: () => void;
  id: string;
  products: any;
}) {
  const queryClient = useQueryClient();
  const [branchId, setBranchId] = React.useState<any>(null);
  const [filterProduct, setFilterProduct] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });

  const { mutate: mutateConfirm, isLoading: isLoadingCreate } = useMutation(
    () => {
      return updateMarketOrderStatus(id, { status: "confirm", toBranchId: branchId });
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["MAKET_ORDER"]);
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const { data: productStore, isLoading: isLoadingProduct } = useQuery(
    ["LIST_PRODUCT", formFilter.page, formFilter.limit, formFilter.keyword, branchId, products],
    () => {
      const listProductUnitId = products.map((item) => item?.marketProduct?.productUnit?.id).join(",");
      return getSaleProducts({ ...formFilter, branchId: branchId, listProductUnitId });
    },
    {
      enabled: !!isOpen,
      onSuccess: (data) => {
        const newData = data?.data?.items.map((item) => {
          const product = products.find((product) => product?.marketProduct?.product?.id === item?.product?.id);
          return {
            ...product,
            image: item?.product?.image,
            name: item?.product?.name,
            realQuantity: item?.quantity,
          };
        });
        setFilterProduct(newData);
      },
    },
  );

  const { data: branches, isLoading: isLoading } = useQuery(["SETTING_BRANCH_1"], () => getBranch(), {
    enabled: !!isOpen,
    onSuccess: (data) => {
      if (data?.data?.items?.length) {
        const defaultBranch = data?.data?.items.find((item) => item.isDefaultBranch);
        setBranchId(defaultBranch?.id || data?.data?.items[0].id);
      }
    },
  });

  const onSubmit = () => {
    if (!branchId) {
      message.error("Vui lòng chọn chi nhánh bán hàng");
      return;
    }
    // validate if product quantity > realQuantity
    const invalidProduct = filterProduct.find((item: any) => item.quantity > item.realQuantity);
    if (invalidProduct) {
      setOpenConfirm(true);
      return;
    }
    mutateConfirm();
  };

  const columns: ColumnsType<any> = [
    {
      title: "Ảnh sản phẩm",
      dataIndex: "image",
      key: "image",
      render: (image, record) =>
        image ? (
          <Image
            src={getImage(image?.path)}
            alt={record?.name}
            width={60}
            height={60}
            className="rounded border border-[#f0f0f0]"
            objectFit="cover"
          />
        ) : (
          <div className="rounded border border-[#f0f0f0] h-[60px] w-[60px]"></div>
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
    },
    {
      title: "ĐVT",
      dataIndex: "code",
      key: "code",
      render: (_, record) => record?.marketProduct?.productUnit?.unitName,
    },
    {
      title: "Giá bán trên chợ",
      dataIndex: "price",
      key: "price",
      render: (value, record) => formatMoney(value),
    },
    {
      title: "Số lượng mua",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => formatNumber(quantity),
    },
    {
      title: "Tồn kho chi nhánh",
      dataIndex: "realQuantity",
      key: "realQuantity",
      render: (realQuantity) => formatNumber(realQuantity),
    },
  ];

  return (
    <CustomModal title="Chọn chi nhánh bán hàng" isOpen={isOpen} onCancel={onCancel} width={1200} customFooter={true}>
      <div className="my-5">
        <CustomSelect
          value={branchId}
          onChange={(value) => {
            setBranchId(value);
          }}
          options={branches?.data?.items?.map((item) => ({
            label: item.name,
            value: item.id,
          }))}
          isLoading={true}
          className="h-11 !rounded"
          placeholder={`Chọn chi nhánh bán hàng`}
        />
      </div>
      <CustomTable dataSource={filterProduct} columns={columns} loading={isLoadingProduct} />
      <CustomButton className="ml-auto !h-11 !w-[120px] mt-3" loading={isLoadingCreate} onClick={onSubmit}>
        Xác nhận
      </CustomButton>
      <ConfirmModal
        isOpen={openConfirm}
        onCancel={() => setOpenConfirm(false)}
        content="đơn hàng"
        isLoading={false}
        onSuccess={() => {
          setOpenConfirm(false);
          mutateConfirm();
        }}
      />
    </CustomModal>
  );
}

export default SelectBranchModal;
