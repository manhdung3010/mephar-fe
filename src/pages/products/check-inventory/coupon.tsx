import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { CheckInventoryCoupon } from '@/modules/products/check-inventory/coupon';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Kiểm kho" />}
      title={
        <Link href="/products/check-inventory">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về kiểm kho
          </span>
        </Link>
      }
    >
      <CheckInventoryCoupon />
    </Layout>
  );
};

export default Index;
