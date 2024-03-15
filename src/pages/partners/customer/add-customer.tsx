import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import { AddCustomer } from '@/modules/partners/customer/add-customer';

export const getServerSideProps = (context) => {
  const { id } = context.query;

  return { props: { id: id || null } };
};

const Index = ({ id }: { id?: string }) => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Khách hàng" />}
      title={
        <Link href="/partners/customer">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách khách hàng
          </span>
        </Link>
      }
    >
      <AddCustomer customerId={id} />
    </Layout>
  );
};

export default Index;
