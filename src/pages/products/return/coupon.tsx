import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';

const ReturnCouponComponent = dynamic(
  () => import('@/modules/products/return-product/coupon'),
  {
    ssr: false,
  }
);

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Nhập sản phẩm" />}
      title={
        <Link href="/products/return">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về trả hàng nhập
          </span>
        </Link>
      }
    >
      <ReturnCouponComponent />
    </Layout>
  );
};

export default Index;
