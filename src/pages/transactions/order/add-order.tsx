import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ArrowLeftIcon from "@/assets/arrowLeftIcon.svg";
import AddOrder from "@/modules/transactions/order/add-order";

function Index() {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Danh sách đơn hàng" />}
      title={
        <Link href="/transactions/order">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách đơn hàng
          </span>
        </Link>
      }
    >
      <AddOrder />
    </Layout>
  );
}

export default Index;
