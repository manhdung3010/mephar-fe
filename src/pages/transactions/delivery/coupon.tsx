import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { DeliveryCoupon } from '@/modules/transactions/delivery/coupon';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Danh sách chuyển hàng"
        />
      }
      title={
        <Link href="/transactions/delivery">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách chuyển hàng
          </span>
        </Link>
      }
    >
      <DeliveryCoupon />
    </Layout>
  );
};

export default Index;
