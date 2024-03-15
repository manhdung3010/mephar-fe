import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddMarketSetting } from '@/modules/markets/setting/add-setting';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Chợ - Cấu hình sản phẩm lên chợ"
        />
      }
      title={
        <Link href="/markets/setting">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách sản phẩm
          </span>
        </Link>
      }
    >
      <AddMarketSetting />
    </Layout>
  );
};

export default Index;
