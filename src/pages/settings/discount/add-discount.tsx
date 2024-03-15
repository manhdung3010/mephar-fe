import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import AddDiscount from '@/modules/settings/discount/add-discount';

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Thêm mới khuyến mại" />
      }
      title={
        <Link href="/settings/discount">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách chương trình KM
          </span>
        </Link>
      }
    >
      <AddDiscount />
    </Layout>
  );
};

export default Index;
