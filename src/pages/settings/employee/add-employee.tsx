import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddEmployee } from '@/modules/settings/employee/AddEmployee';

export const getServerSideProps = (context) => {
  const { id } = context.query;

  return { props: { id: id || null } };
};

const Index = ({ id }: { id?: string }) => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Thêm mới nhân viên" />
      }
      title={
        <Link href="/settings/employee">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về quản lý người dùng
          </span>
        </Link>
      }
    >
      <AddEmployee employeeId={id} />
    </Layout>
  );
};

export default Index;
