import { CustomButton } from '@/components/CustomButton';

import Tab from '../../../../components/CustomTab';
import Info from './Info';
import ScopeApplication from './ScopeApplication';
import TimeApplication from './TimeApplication';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { productSchema, schema } from './schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDiscount } from '@/api/discount.service';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useState } from 'react';
import dayjs from 'dayjs';

const AddDiscount = () => {
  const [target, setTarget] = useState('ORDER');
  const currentDate = dayjs();
  const dateFromDefault = currentDate.format("YYYY-MM-DD HH:mm:ss");
  const dateToDefault = currentDate.add(6, 'month').format("YYYY-MM-DD HH:mm:ss");
  const {
    getValues,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      status: "active",
      branchOp: 1,
      groupCustomerOp: 1,
      target: "ORDER",
      type: "ORDER_PRICE",
      isMultiple: false,
      items: [
        {
          condition: {
            order: {
              from: 0,
            },
            product: {
              from: 1
            }
          },
          apply: {
            discountValue: 0,
            discountType: "AMOUNT",
            pointType: "AMOUNT",
            maxQuantity: 1,
            isGift: false,
            pointValue: 0,
          },
          childItems: [
            {
              condition: {
                product: {
                  from: 1
                },
                productUnitId: []
              },
              apply: {
                changeType: "TYPE_PRICE",
                fixedPrice: 0,
              }
            }
          ]
        }
      ],
      scope: {
        customer: {
          isAll: true,
          ids: []
        },
        branch: {
          isAll: true,
          ids: []
        },
      },
      time: {
        dateFrom: dateFromDefault,
        dateTo: dateToDefault,
      }
    },
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: mutateCreateDiscount, isLoading } =
    useMutation(
      () => {
        if (getValues("type") === "PRICE_BY_BUY_NUMBER") {
          // Combine all childItems of each item into 1 array
          const items: any = getValues("items");
          const childItems = items.map((item: any) => {
            return item.childItems.map((childItem: any) => {
              return {
                condition: {
                  product: {
                    from: childItem.condition.product.from
                  },
                  productUnitId: item.condition.productUnitId
                },
                apply: {
                  changeType: "TYPE_PRICE",
                  fixedPrice: childItem.apply.fixedPrice,
                }
              }
            })

          }).flat();

          return createDiscount({
            ...getValues(),
            items: childItems
          });
        }
        else {
          const discountData: any = getValues();
          const items = discountData.items.map((item: any) => {
            return {
              ...(item.condition.product ? { condition: { product: item.condition.product } } : { condition: { order: item.condition.order } }),
              apply: {
                ...(item.apply.isGift || item.apply.pointValue > 0 ? {} : { discountValue: item.apply.discountValue }),
                pointValue: item.apply.pointValue,
                pointType: item.apply.pointType,
                discountType: item.apply.discountType,
                productUnitId: item.apply.productUnitId,
                maxQuantity: item.apply.maxQuantity,
                isGift: item.apply.isGift
              }
            }
          });
          discountData.items = items;

          return createDiscount(discountData);
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
      }
    );

  const onSubmit = () => {
    mutateCreateDiscount()

    // console.log("values", getValues())
  }

  return (
    <>
      <div className="mt-6 flex items-center justify-between bg-white p-5">
        <div className="text-2xl font-medium uppercase">
          THÊM MỚI KHUYẾN MẠI
        </div>
        <div className="flex gap-4">
          <CustomButton outline={true}>Hủy bỏ</CustomButton>
          <CustomButton onClick={handleSubmit(onSubmit)}>Lưu</CustomButton>
        </div>
      </div>

      <div className="my-6 flex gap-6">
        <div
          className="h-fit flex-[2] bg-white p-5"
          style={{
            boxShadow: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
          }}
        >
          <Tab
            menu={['Thông tin', 'Thời gian áp dụng', 'Phạm vi áp dụng']}
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
