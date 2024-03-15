import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { formatBoolean } from '@/helpers';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import AddPackage from '@/modules/products/list-product/add-package';

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id, copy }: { id?: string; copy?: boolean }) => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Thêm mới hàng hóa" />
      }
      title={
        <Link href="/products/list">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách sản phẩm
          </span>
        </Link>
      }
    >
      <AddPackage productId={id} isCopy={copy} />
    </Layout>
  );
};

export default Index;
