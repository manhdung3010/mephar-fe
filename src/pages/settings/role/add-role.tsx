import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddRole } from '@/modules/settings/role/AddRole';

export const getServerSideProps = (context) => {
  const { id } = context.query;

  return { props: { id: id || null } };
};

const Index = ({ id }: { id?: string }) => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="THÊM MỚI Vai trò" />
      }
      title={
        <Link href="/settings/role">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về quản lý vai trò
          </span>
        </Link>
      }
    >
      <AddRole roleId={id} />
    </Layout>
  );
};

export default Index;
