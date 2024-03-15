import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import SettingFee from '@/modules/settings/delivery-fee/setting-fee';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Quay về cấu hình phí vận chuyển"
        />
      }
      title={
        <Link href="/settings/delivery-fee">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về cấu hình phí vận chuyển
          </span>
        </Link>
      }
    >
      <SettingFee />
    </Layout>
  );
};

export default Index;
