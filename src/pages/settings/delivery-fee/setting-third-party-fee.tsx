import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { SettingThirdPartyFee } from '@/modules/settings/delivery-fee/setting-third-party-fee';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Sử dụng phí vận chuyển với Giao hàng nhanh"
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
      <SettingThirdPartyFee />
    </Layout>
  );
};

export default Index;
