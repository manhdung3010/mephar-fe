import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddProvider } from '@/modules/partners/provider/add-provider';

export const getServerSideProps = (context) => {
  const { id } = context.query;

  return { props: { id: id || null } };
};

const Index = ({ id }: { id?: string }) => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Nhà cung cấp" />}
      title={
        <Link href="/partners/provider">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách nhà cung cấp
          </span>
        </Link>
      }
    >
      <AddProvider providerId={id} />
    </Layout>
  );
};

export default Index;
