import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddDoctor } from '@/modules/partners/doctor/add-doctor';

export const getServerSideProps = (context) => {
  const { id } = context.query;

  return { props: { id: id || null } };
};

const Index = ({ id }: { id?: string }) => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Bác sĩ" />}
      title={
        <Link href="/partners/doctor">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách bác sĩ
          </span>
        </Link>
      }
    >
      <AddDoctor doctorId={id} />
    </Layout>
  );
};

export default Index;
