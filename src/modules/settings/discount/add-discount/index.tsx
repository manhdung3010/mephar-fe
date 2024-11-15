import { CustomButton } from "@/components/CustomButton";

import Tab from "../../../../components/CustomTab";
import Info from "./Info";
import ScopeApplication from "./ScopeApplication";
import TimeApplication from "./TimeApplication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema, schema } from "./schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createDiscount, getDiscountDetail, updateDiscount } from "@/api/discount.service";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

const AddDiscount = () => {
  const [target, setTarget] = useState("ORDER");
  const currentDate = dayjs();
  const dateFromDefault = currentDate.format("YYYY-MM-DD HH:mm:ss");
  const dateToDefault = currentDate.add(6, "month").format("YYYY-MM-DD HH:mm:ss");

  const router = useRouter();
  const { id, copy } = router.query;
  const queryClient = useQueryClient();

  const { data: discountDetail } = useQuery(["DISCOUNT_DETAIL", id], () => getDiscountDetail(Number(id)), {
    enabled: !!id || !!copy,
  });
  const dcDetail = discountDetail?.data?.data;
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      status: dcDetail?.status || "active",
      name: dcDetail?.name || "",
      note: dcDetail?.note || "",
      branchOp: 1,
      groupCustomerOp: 1,
      target: dcDetail?.target?.toUpperCase() || "ORDER",
      type: dcDetail?.type?.toUpperCase() || "ORDER_PRICE",
      isMultiple: dcDetail?.isMultiple || false,
      items: [
        {
          condition: {
            order: {
              from: 0,
            },
            product: {
              from: 1,
            },
          },
          apply: {
            discountValue: 0,
            discountType: "AMOUNT",
            pointType: "AMOUNT",
            maxQuantity: 1,
            isGift: false,
            pointValue: 0,
          },
        },
      ],
      scope: {
        customer: {
          isAll: true,
          ids: [],
        },
        branch: {
          isAll: true,
          ids: [],
        },
        channel: {
          isAll: true,
          types: [],
        },
      },
      time: {
        dateFrom: dateFromDefault,
        dateTo: dateToDefault,
      },
    },
  });

  useEffect(() => {
    if (dcDetail) {
      dcDetail.code ? setValue("code", dcDetail.code) : undefined;

      setValue("name", dcDetail.name);
      setValue("note", dcDetail.note || "");
      setValue("status", dcDetail.status);
      setValue("target", dcDetail.target?.toUpperCase());
      setValue("type", dcDetail.type?.toUpperCase());
      setValue("isMultiple", dcDetail.isMultiple);
      setValue("items", dcDetail.items);
      if (dcDetail.type === "order_price") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              order: {
                from: item.orderFrom,
              },
            },
            apply: {
              discountValue: item.discountValue,
              discountType: item.discountType?.toUpperCase(),
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "order" && dcDetail.type === "product_price") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              order: {
                from: item.orderFrom,
              },
            },
            apply: {
              discountValue: item.discountValue,
              discountType: item.discountType?.toUpperCase(),
              productUnitId: item.productDiscount?.map((product: any) => product.productUnitId),
              maxQuantity: item.maxQuantity,
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "order" && dcDetail.type === "gift") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              order: {
                from: item.orderFrom,
              },
            },
            apply: {
              discountValue: 1,
              discountType: item.discountType?.toUpperCase(),
              productUnitId: item.productDiscount?.map((product: any) => product.productUnitId),
              maxQuantity: item.maxQuantity,
              isGift: item.isGift,
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "order" && dcDetail.type === "loyalty") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              order: {
                from: item.orderFrom,
              },
            },
            apply: {
              pointValue: item.pointValue,
              discountType: item.discountType?.toUpperCase(),
              discountValue: 1,
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "product" && dcDetail.type === "product_price") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              product: {
                from: item.fromQuantity,
              },
              order: {
                from: 1,
              },
              productUnitId: item.productDiscount
                ?.filter((item) => item.isCondition)
                ?.map((product: any) => product.productUnitId),
            },
            apply: {
              discountValue: item.discountValue,
              discountType: item.discountType?.toUpperCase(),
              maxQuantity: item.maxQuantity,
              productUnitId: item.productDiscount
                ?.filter((item) => !item.isCondition)
                ?.map((product: any) => product.productUnitId),
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "product" && dcDetail.type === "gift") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              product: {
                from: item.fromQuantity,
              },
              order: {
                from: 1,
              },
              productUnitId: item.productDiscount
                ?.filter((product: any) => product?.isCondition)
                ?.map((i) => i.productUnitId),
            },
            apply: {
              discountValue: 1,
              discountType: item.discountType?.toUpperCase(),
              maxQuantity: item.maxQuantity,
              productUnitId: item.productDiscount
                ?.filter((product: any) => !product.isCondition)
                ?.map((i) => i.productUnitId),
              isGift: item.isGift,
            },
          };
        });
        setValue("items", formatItem);
      } else if (dcDetail.target === "product" && dcDetail.type === "loyalty") {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              product: {
                from: item.fromQuantity,
              },
              order: {
                from: 1,
              },
              productUnitId: item.productDiscount?.map((product: any) => product.productUnitId),
            },
            apply: {
              pointValue: item.pointValue,
              pointType: item.pointType?.toUpperCase(),
              discountValue: 1,
            },
          };
        });
        setValue("items", formatItem);
      } else {
        const formatItem = dcDetail.discountItem.map((item: any) => {
          return {
            id: item?.id,
            condition: {
              order: {
                from: item.fromQuantity,
              },
              product: {
                from: item.fromQuantity,
              },
              productUnitId: item.productDiscount?.map((product: any) => product.productUnitId),
            },
            apply: {
              discountValue: item?.discountValue,
              discountType: item?.discountType?.toUpperCase(),
              maxQuantity: item?.maxQuantity,
              productUnitId: item?.productDiscount?.map((product: any) => product.productUnitId),
              fixedPrice: item?.fixedPrice,
              changeType: item?.changeType?.toUpperCase(),
              type: dcDetail?.type?.toUpperCase(),
            },
          };
        });
        // Combine items with the same productUnitId into 1 item, that item is push in key childItems

        const items = formatItem.reduce((acc: any, item: any) => {
          const existingItem = acc.find((i: any) => i.condition.productUnitId[0] === item.condition.productUnitId[0]);
          if (existingItem) {
            existingItem.childItems.push(item);
          } else {
            acc.push({
              id: item.id,
              condition: {
                order: {
                  from: item.condition.order.from,
                },
                product: {
                  from: item.condition.product.from,
                },
                productUnitId: item.condition.productUnitId,
              },
              apply: {
                discountValue: item?.apply?.discountValue,
                discountType: item?.apply?.discountType?.toUpperCase(),
                maxQuantity: item?.apply?.maxQuantity,
                productUnitId: item?.apply?.productUnitId,
                fixedPrice: item?.apply?.fixedPrice,
                changeType: item?.apply?.changeType?.toUpperCase(),
                type: item?.apply?.type?.toUpperCase(),
              },
              childItems: [item],
            });
          }

          return acc;
        }, []);
        setValue("items", items);
      }
      setValue("scope", {
        customer: {
          isAll: dcDetail.discountCustomer?.length > 0 ? false : true,
          ids:
            dcDetail.discountCustomer?.length > 0
              ? dcDetail.discountCustomer.map((customer: any) => customer.groupCustomerId)
              : [],
        },
        branch: {
          isAll: dcDetail.discountBranch?.length > 0 ? false : true,
          ids:
            dcDetail.discountBranch?.length > 0
              ? dcDetail.discountBranch.map((customer: any) => customer.branchId)
              : [],
        },
        channel: {
          isAll: dcDetail.discountChannel?.length > 0 ? false : true,
          types:
            dcDetail.discountChannel?.length > 0
              ? dcDetail.discountChannel.map((customer: any) => customer.channel?.toUpperCase())
              : [],
        },
      });
      setValue(
        "time",
        {
          dateFrom: dcDetail.discountTime[0].dateFrom,
          dateTo: dcDetail.discountTime[0].dateTo,
          byDay: dcDetail.discountTime[0].byDay
            ?.split("//")
            .filter((element) => element !== "")
            .map(Number),
          byMonth: dcDetail.discountTime[0].byMonth
            ?.split("//")
            .filter((element) => element !== "")
            .map(Number),
          byHour: dcDetail.discountTime[0].byHour
            ?.split("//")
            .filter((element) => element !== "")
            .map(Number),
          byWeekDay: dcDetail.discountTime[0].byWeekDay
            ?.split("//")
            .filter((element) => element !== "")
            .map(Number),
          isWarning: dcDetail.discountTime[0].isWarning,
          isBirthday: dcDetail.discountTime[0].isBirthday,
        },
        { shouldValidate: true },
      );
    }
  }, [dcDetail]);

  const { mutate: mutateCreateDiscount, isLoading } = useMutation(
    () => {
      if (getValues("type") === "PRICE_BY_BUY_NUMBER") {
        // Combine all childItems of each item into 1 array
        const items: any = getValues("items");
        const childItems = items
          .map((item: any) => {
            return item.childItems.map((childItem: any) => {
              return {
                condition: {
                  product: {
                    from: childItem.condition.product.from,
                  },
                  productUnitId: item.condition.productUnitId,
                },
                apply: {
                  changeType: childItem.apply.changeType,
                  fixedPrice: childItem.apply.fixedPrice,
                },
              };
            });
          })
          .flat();

        return id && !copy
          ? updateDiscount(
              {
                ...getValues(),
                items: childItems,
              },
              Number(id),
            )
          : createDiscount({
              ...getValues(),
              items: childItems,
            });
      } else {
        const discountData: any = getValues();
        const itemsDiscount: any = getValues("items");
        const items = itemsDiscount.map((item: any) => {
          return {
            ...item,
            apply: {
              ...(item.apply.isGift || item.apply.pointValue > 0 ? {} : { discountValue: item.apply.discountValue }),
              pointValue: item.apply.pointValue,
              pointType: item.apply.pointType,
              discountType: item.apply.discountType,
              productUnitId: item.apply.productUnitId,
              maxQuantity: item.apply.maxQuantity,
              isGift: item.apply.isGift,
              groupId: item.apply.groupId,
            },
          };
        });
        discountData.items = items;

        return id && !copy ? updateDiscount(discountData, Number(id)) : createDiscount(discountData);
      }
    },
    {
      onSuccess: async () => {
        await queryClient.invalidateQueries(["DISCOUNT_LIST"]);
        router.push("/settings/discount");
      },
      onError: (err: any) => {
        message.error(err?.message);
      },
    },
  );

  const onSubmit = () => {
    mutateCreateDiscount();
  };

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">{id && !copy ? "CẬP NHẬT" : "THÊM MỚI"} KHUYẾN MẠI</div>
        <div className="flex gap-4">
          <CustomButton outline={true} onClick={() => router.push("/settings/discount")}>
            Hủy bỏ
          </CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)} loading={isLoading} disabled={isLoading}>
            Lưu
          </CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div
          className="h-fit flex-[2] bg-white p-5"
          style={{
            boxShadow: "0px 8px 13px -3px rgba(0, 0, 0, 0.07)",
          }}
        >
          <Tab
            menu={["Thông tin", "Thời gian áp dụng", "Phạm vi áp dụng"]}
            components={[
              <Info key="0" setValue={setValue} getValues={getValues} errors={errors} useForm={useForm} />,
              <TimeApplication key="1" setValue={setValue} getValues={getValues} errors={errors} />,
              <ScopeApplication key="2" setValue={setValue} getValues={getValues} />,
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default AddDiscount;
