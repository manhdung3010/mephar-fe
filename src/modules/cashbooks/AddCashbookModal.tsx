import { Checkbox, Select, Spin, message } from "antd";
import Image from "next/image";

import {
  createTransaction,
  deleteTransaction,
  getTransactionDetail,
  getTypeTransaction,
  getUserTransaction,
  updateTransaction,
} from "@/api/cashbook.service";
import { getCustomer, getCustomerDebt } from "@/api/customer.service";
import { getEmployee } from "@/api/employee.service";
import { getProvider } from "@/api/provider.service";
import ArrowDownIcon from "@/assets/arrowDownGray.svg";
import DeleteIcon from "@/assets/deleteRed.svg";
import EditIcon from "@/assets/editGreenIcon.svg";
import PlusCircleIcon from "@/assets/plus-circle.svg";
import ReceiptIcon from "@/assets/receiptIcon.svg";
import { CustomButton } from "@/components/CustomButton";
import { CustomDatePicker } from "@/components/CustomDatePicker";
import { CustomInput } from "@/components/CustomInput";
import Label from "@/components/CustomLabel";
import { CustomModal } from "@/components/CustomModal";
import DeleteModal from "@/components/CustomModal/ModalDeleteItem";
import { CustomSelect } from "@/components/CustomSelect";
import CustomTable from "@/components/CustomTable";
import InputError from "@/components/InputError";
import { formatDateTime, formatMoney, hasPermission } from "@/helpers";
import { branchState, profileState } from "@/recoil/state";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { cloneDeep, debounce } from "lodash";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { RoleAction, RoleModel } from "../settings/role/role.enum";
import { AddCollectType } from "./AddCollectTypeModal";
import { AddOtherUserModal } from "./AddOtherUserModal";
import ConfirmDebtModal from "./ConfirmDebtModal";
import { schema } from "./schema";
const { Option } = Select;

export function AddCashbookModal({
  isOpen,
  onCancel,
  type,
  id = "",
}: {
  isOpen: boolean;
  onCancel: () => void;
  type: string;
  id?: string;
}) {
  const [isOpenAddGroupProduct, setIsOpenAddGroupProduct] = useState(false);
  const [isOpenAddOtherUser, setIsOpenAddOtherUser] = useState(false);
  const [groupProductKeyword, setGroupProductKeyword] = useState("");
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      target: "other",
      paymentDate: dayjs().format("YYYY-MM-DD hh:mm:ss"),
      isPaymentOrder: false,
      isDebt: false,
    },
  });
  const queryClient = useQueryClient();
  const branchId = useRecoilValue(branchState);
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: "",
  });
  const [orderList, setOrderList] = useState([]);
  const [orderListOpen, setOrderListOpen] = useState([]);
  const [confirmDebt, setConfirmDebt] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const profile = useRecoilValue(profileState);
  const [isError, setIsError] = useState(false);

  const { data: groupProduct } = useQuery(["TYPE_TRANSACTION", type], () => getTypeTransaction(type));
  const { data: customers, isLoading } = useQuery(["CUSTOMER_LIST", formFilter], () => getCustomer(formFilter), {
    enabled: !!isOpen,
  });
  const { data: providers, isLoading: isLoadingProvider } = useQuery(
    ["PROVIDER_LIST", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getProvider(formFilter),
    {
      enabled: !!isOpen,
    },
  );
  const { data: employees, isLoading: isLoadingEmployees } = useQuery(
    ["SETTING_EMPLOYEE", formFilter.page, formFilter.limit, formFilter.keyword],
    () => getEmployee(formFilter),
    {
      enabled: !!isOpen,
    },
  );
  const { data: otherUsers, isLoading: isLoadingOtherUsers } = useQuery(["OTHER_USER"], () => getUserTransaction(), {
    enabled: getValues("target") === "other",
  });
  const { data: customerDebt, isLoading: isLoadingCustomerDebt } = useQuery(
    ["OTHER_USER", getValues("target"), getValues("targetId")],
    () => getCustomerDebt({ page: 1, limit: 999, keyword: "" }, getValues("targetId")),
    {
      enabled: getValues("target") === "customer" && getValues("targetId") !== undefined,
    },
  );
  const { data: transactionDetail, isLoading: isLoadingTransactionDetail } = useQuery(
    ["TRANSACTION_DETAIL", id],
    () => getTransactionDetail(id),
    {
      enabled: !!id,
    },
  );

  useEffect(() => {
    if (customerDebt?.data) {
      const newCustomerDebt = customerDebt?.data.map((item, index) => ({
        ...item,
        key: index,
        amount: 0,
      }));
      setOrderList(newCustomerDebt);
    }
  }, [customerDebt?.data]);

  const { mutate: mutateCreateCustomer, isLoading: isLoadingCreateCustomer } = useMutation(
    () => {
      let payload: any = {
        code: getValues("code"),
        target: getValues("target"),
        targetId: getValues("targetId"),
        typeId: getValues("typeId"),
        value: getValues("value"),
        userId: getValues("userId"),
        paymentDate: getValues("paymentDate"),
        note: getValues("note"),
        isDebt: true,
        isPaymentOrder: getValues("isPaymentOrder"),
        orderPayment: orderList
          .filter((i: any) => i.amount > 0)
          .map((item: any) => ({
            orderId: item.orderId,
            amount: item.amount,
          })),
        ballotType: type,
        branchId,
      };
      if (!getValues("isPaymentOrder")) {
        delete payload.orderPayment;
      }
      return createTransaction(payload);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["TRANSACTION"]);
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const { mutate: mutateUpdateTransaction, isLoading: isLoadingUpdate } = useMutation(
    () => {
      let payload: any = {
        typeId: getValues("typeId"),
        value: getValues("value"),
        paymentDate: getValues("paymentDate"),
        note: getValues("note"),
      };
      if (!getValues("isPaymentOrder")) {
        delete payload.orderPayment;
      }
      return updateTransaction(id, payload);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["TRANSACTION"]);
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );
  const { mutate: mutateDeleteTransaction, isLoading: isLoadingDelete } = useMutation(
    () => {
      return deleteTransaction(id);
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["TRANSACTION"]);
        reset();
        onCancel();
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateCustomer();
  };
  const handleDelete = () => {
    mutateDeleteTransaction();
  };
  const columns: any = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      render: (value, record, index) => <span className="cursor-pointer text-[#0070F4]">{record?.order?.code}</span>,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Giá trị hóa đơn",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (value, { amount }) => formatMoney(value || +amount),
    },
    {
      title: "Đã thu trước",
      dataIndex: "receiveUser",
      key: "receiveUser",
      render: (value, record) => formatMoney(record?.totalAmount - +record?.debtAmount || record?.amountCollected),
    },
    ...(transactionDetail?.data?.isPaymentOrder
      ? []
      : [
          {
            title: "Còn cần thu",
            dataIndex: "debtAmount",
            key: "debtAmount",
            render: (value) => formatMoney(+value),
          },
        ]),
    {
      title: "Tiền thu",
      dataIndex: "amount",
      key: "amount",
      render: (value: any, { key, cashOfCustomer, debtAmount }) => (
        <CustomInput
          type="number"
          className="w-28"
          value={value || cashOfCustomer}
          disabled={transactionDetail?.data?.isPaymentOrder}
          onChange={(value: any) => {
            // update quantity of orderList
            if (value <= debtAmount) {
              const newOrderList: any = [...orderList];
              newOrderList[key].amount = value;
              setOrderList(newOrderList);
              setIsError(false);
            } else {
              message.error("Tiền thu không được lớn hơn còn cần thu");
              setIsError(true);
            }
          }}
        />
      ),
    },
    ...(transactionDetail?.data?.isPaymentOrder
      ? [
          {
            title: "Trạng thái",
            dataIndex: "debtAmount",
            key: "debtAmount",
            render: (value) => <span className="italic">Đã thanh toán</span>,
          },
        ]
      : []),
  ];

  const [remainingMoney, setRemainingMoney] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    let value = getValues("value");
    const newOrderList: any = cloneDeep(orderList);
    if (value === 0) {
      newOrderList.forEach((item: any) => {
        item.amount = 0;
      });
      setOrderList(newOrderList);
    }
    if (value && orderList?.length > 0) {
      const totalAmount = orderList.reduce((acc, item: any) => {
        return acc + Number(item.debtAmount);
      }, 0);

      if (value > totalAmount) {
        newOrderList.forEach((item: any) => {
          item.amount = Number(item.debtAmount);
        });
        setRemainingMoney(value - totalAmount);
        setTotalAmount(totalAmount);
        setOrderList(newOrderList);
      } else {
        for (let i = 0; i < newOrderList.length; i++) {
          if (value > 0) {
            if (value >= +newOrderList[i].debtAmount) {
              newOrderList[i].amount = +newOrderList[i].debtAmount;
              value -= +newOrderList[i].debtAmount;
            } else {
              newOrderList[i].amount = value;
              value = 0;
            }
          } else {
            newOrderList[i].amount = 0;
          }
        }
        setRemainingMoney(0);
        setTotalAmount(getValues("value"));
        setOrderList(newOrderList);
      }
    }
  }, [getValues("value")]);

  useEffect(() => {
    if (transactionDetail?.data) {
      const data = transactionDetail?.data;
      const newOrderList = data?.listOrder?.map((item, index) => {
        const order = customerDebt?.data?.find((i) => i.orderId === item.orderId);
        return {
          ...item,
          amount: +item.amount,
          key: index,
        };
      });
      setOrderList(newOrderList);
      setValue("code", data.code, { shouldValidate: true });
      setValue("target", data.target, { shouldValidate: true });
      setValue("targetId", data.targetId, { shouldValidate: true });
      setValue("typeId", data.typeId, { shouldValidate: true });
      setValue("value", data.value, { shouldValidate: true });
      setValue("userId", data.userId, { shouldValidate: true });
      setValue("paymentDate", data.paymentDate, { shouldValidate: true });
      setValue("note", data.note, { shouldValidate: true });
      setValue("isPaymentOrder", data.isPaymentOrder, { shouldValidate: true });
    }
  }, [transactionDetail?.data, customerDebt?.data]);

  const onUpdate = () => {
    mutateUpdateTransaction();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onCancel={onCancel}
      title={`Lập phiếu ${type === "income" ? "thu" : "chi"} (Tiền mặt)`}
      width={1200}
      customFooter={true}
    >
      <div className="my-5 h-[1px] w-full bg-[#C7C9D9]" />

      <div className="grid grid-cols-2 gap-x-8">
        <div className="mb-5">
          <Label infoText="" label="Mã phiếu" />
          <CustomInput
            onChange={(value) => {
              setValue("code", value, { shouldValidate: true });
            }}
            value={getValues("code")}
            placeholder="Mã phiếu tự động"
            className="h-11"
            disabled={id && transactionDetail?.data?.code}
          />
        </div>

        <div className="mb-5">
          <Label infoText="" label={`Đối tượng ${type === "income" ? "nộp" : "nhận"}`} required />
          <CustomSelect
            onChange={(value) => {
              setValue("target", value, { shouldValidate: true });
              setValue("targetId", "", { shouldValidate: true });
            }}
            options={[
              {
                value: "customer",
                label: "Khách hàng",
              },
              {
                value: "supplier",
                label: "Nhà cung cấp",
              },
              {
                value: "user",
                label: "Nhân viên",
              },
              {
                value: "other",
                label: "Khác",
              },
            ]}
            disabled={id && transactionDetail?.data?.target}
            className="h-11 !rounded"
            value={getValues("target")}
            placeholder={`Chọn đối tượng ${type === "income" ? "nộp" : "nhận"}`}
          />
        </div>
        <div className="mb-5">
          <Label infoText="" label="Thời gian" />
          <CustomDatePicker
            showTime
            className="h-11 w-full !rounded"
            value={getValues("paymentDate")}
            onChange={(value) => {
              setValue("paymentDate", value, { shouldValidate: true });
            }}
          />
        </div>
        <div className="mb-5">
          <Label infoText="" label={`Tên người ${type === "income" ? "nộp" : "nhận"}`} required />
          {getValues("target") === "other" ? (
            <div>
              <CustomSelect
                onChange={(value) => {
                  setValue("targetId", value, { shouldValidate: true });
                }}
                options={otherUsers?.data?.items?.map((item) => ({
                  value: item.id,
                  label: item.name,
                }))}
                showSearch={true}
                className="suffix-icon h-11 !rounded"
                placeholder={`Nhập tên người ${type === "income" ? "nộp" : "nhận"}`}
                suffixIcon={
                  <div className="flex items-center">
                    <Image src={ArrowDownIcon} alt="" />
                    <Image src={PlusCircleIcon} alt="" onClick={() => setIsOpenAddOtherUser(true)} />
                  </div>
                }
                value={getValues("targetId")}
                disabled={id && transactionDetail?.data?.targetId}
              />
            </div>
          ) : (
            <Select
              className="h-11 !rounded w-full"
              placeholder={"Tìm kiếm"}
              optionFilterProp="children"
              showSearch
              onSearch={debounce((value) => {
                setFormFilter({
                  ...formFilter,
                  keyword: value,
                });
              }, 300)}
              onChange={(value) => {
                setValue("targetId", value, { shouldValidate: true });
              }}
              disabled={id && transactionDetail?.data?.targetId}
              // loading={isLoadingProduct ?? isLoadingGroup}
              value={getValues("targetId")}
              notFoundContent={
                isLoading || isLoadingProvider || isLoadingEmployees ? (
                  <Spin size="small" className="flex justify-center p-4 w-full" />
                ) : null
              }
              size="large"
            >
              {getValues("target") === "customer"
                ? customers?.data?.items?.map((product) => (
                    <Option key={product.id} value={product?.id}>
                      {product?.fullName}
                    </Option>
                  ))
                : getValues("target") === "supplier"
                ? providers?.data?.items?.map((product) => (
                    <Option key={product.id} value={product?.id}>
                      {product?.name || product?.fullName}
                    </Option>
                  ))
                : getValues("target") === "user"
                ? employees?.data?.items?.map((product) => (
                    <Option key={product.id} value={product?.id}>
                      {product?.fullName}
                    </Option>
                  ))
                : null}
            </Select>
          )}
          <InputError error={errors.targetId?.message} />
        </div>
        <div className="mb-5">
          <Label infoText="" label={`Loại ${type === "income" ? "thu" : "chi"}`} required />
          <CustomSelect
            onChange={(value) => {
              setValue("typeId", value, { shouldValidate: true });
            }}
            options={groupProduct?.data?.items?.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
            disabled={id && transactionDetail?.data?.typeId && transactionDetail?.data?.isPaymentOrder}
            showSearch={true}
            className="suffix-icon h-11 !rounded"
            placeholder={type === "income" ? "Chọn loại thu" : "Chọn loại chi"}
            suffixIcon={
              <div className="flex items-center">
                <Image src={ArrowDownIcon} alt="" />
                <Image src={PlusCircleIcon} alt="" onClick={() => setIsOpenAddGroupProduct(true)} />
              </div>
            }
            value={getValues("typeId")}
          />
        </div>

        <div className="mb-5 ">
          <Label infoText="" label="Giá trị" required />
          <CustomInput
            placeholder="Nhập giá trị "
            disabled={id && transactionDetail?.data?.value && transactionDetail?.data?.isPaymentOrder}
            className="h-11"
            value={getValues("value")}
            type="number"
            onChange={(value) => {
              setValue("value", value, { shouldValidate: true });
            }}
          />
          <InputError error={errors.value?.message} />
        </div>
        <div className="mb-5">
          <Label infoText="" label={`Nhân viên ${type === "income" ? "thu" : "chi"}`} required />
          <CustomSelect
            onChange={(value) => {
              setValue("userId", value, { shouldValidate: true });
            }}
            options={employees?.data?.items?.map((item) => ({
              value: item.id,
              label: item.fullName,
            }))}
            className="h-11 !rounded"
            disabled={id && transactionDetail?.data?.userId}
            placeholder="Chọn nhân viên"
            value={getValues("userId")}
          />
          <InputError error={errors.userId?.message} />
        </div>

        {getValues("target") === "customer" && getValues("targetId") !== undefined && (
          <div className="mb-5 flex items-center">
            <Checkbox
              className="mr-3"
              disabled={id && transactionDetail?.data?.isPaymentOrder}
              checked={getValues("isPaymentOrder")}
              onChange={(e) => {
                setValue("isPaymentOrder", e.target.checked, { shouldValidate: true });
                setValue("isDebt", e.target.checked, { shouldValidate: true });
              }}
            />
            Thanh toán hóa đơn nợ
          </div>
        )}
      </div>

      <div className="mb-5">
        <Label infoText="" label="Ghi chú" />
        <CustomInput
          placeholder="Nhập ghi chú"
          className="h-11"
          value={getValues("note")}
          onChange={(value) => {
            setValue("note", value, { shouldValidate: true });
          }}
        />
      </div>

      {type === "income" &&
        getValues("isPaymentOrder") &&
        getValues("target") === "customer" &&
        getValues("targetId") !== undefined && (
          <>
            <CustomTable loading={isLoadingCustomerDebt} dataSource={orderList} columns={columns} className="mb-5" />
            <div className="ml-auto mb-5 w-[300px]">
              <div className=" mb-3 grid grid-cols-2">
                <div className="text-gray-main">Tổng thanh toán hóa đơn:</div>
                <div className="text-black-main text-right">{formatMoney(totalAmount)}</div>
              </div>
              <div className=" mb-3 grid grid-cols-2">
                <div className="text-gray-main">Cộng vào tài khoản khách hàng:</div>
                <div className="text-black-main text-right">{formatMoney(remainingMoney)}</div>
              </div>
            </div>
          </>
        )}
      <div className="flex justify-end">
        {id && transactionDetail?.data ? (
          <div className="flex">
            {hasPermission(profile?.role?.permissions, RoleModel.cashbook, RoleAction.update) && (
              <CustomButton
                type="success"
                prefixIcon={<Image src={EditIcon} alt="" />}
                outline={true}
                wrapClassName="mx-2"
                onClick={onUpdate}
                loading={isLoadingUpdate}
                disabled={isLoadingUpdate}
              >
                Cập nhật
              </CustomButton>
            )}
            <CustomButton type="danger" outline={true} wrapClassName="mx-2" onClick={onCancel}>
              Đóng
            </CustomButton>
            {hasPermission(profile?.role?.permissions, RoleModel.cashbook, RoleAction.delete) && (
              <CustomButton
                type="danger"
                prefixIcon={<Image src={DeleteIcon} alt="" />}
                wrapClassName="mx-2"
                outline={true}
                onClick={() => {
                  setIsOpenDelete(true);
                }}
                // loading={isLoadingCreateCustomer}
                // disabled={isLoadingCreateCustomer}
              >
                Xóa
              </CustomButton>
            )}
          </div>
        ) : (
          <CustomButton
            type="success"
            prefixIcon={<Image src={ReceiptIcon} alt="" />}
            onClick={() => {
              if (type === "income") {
                setConfirmDebt(true);
              } else {
                handleSubmit(onSubmit)();
              }
            }}
            loading={isLoadingCreateCustomer}
            disabled={isError}
          >
            Lập phiếu {type === "income" ? "thu" : "chi"}
          </CustomButton>
        )}
      </div>

      <AddCollectType
        isOpen={isOpenAddGroupProduct}
        onCancel={() => setIsOpenAddGroupProduct(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
        type={type}
      />
      <AddOtherUserModal
        isOpen={isOpenAddOtherUser}
        onCancel={() => setIsOpenAddOtherUser(false)}
        setGroupProductKeyword={setGroupProductKeyword}
        setProductValue={setValue}
      />
      <ConfirmDebtModal
        isOpen={confirmDebt}
        onCancel={() => setConfirmDebt(false)}
        onSuccess={() => {
          setValue("isDebt", true, { shouldValidate: true });
          handleSubmit(onSubmit)();
          setConfirmDebt(false);
        }}
        content=""
        // isLoading={isLoadingDeleteCustomer}
      />
      <DeleteModal
        isOpen={isOpenDelete}
        onCancel={() => setIsOpenDelete(false)}
        onSuccess={() => {
          handleDelete();
          setIsOpenDelete(false);
        }}
        content={type === "income" ? "phiếu thu" : "phiếu chi"}
        isLoading={isLoadingDelete}
      />
    </CustomModal>
  );
}
