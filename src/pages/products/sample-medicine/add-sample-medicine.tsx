import Image from 'next/image';
import Link from 'next/link';

import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';
import { formatBoolean } from '@/helpers';
import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import AddSampleMedicine from '@/modules/products/sample-medicine/add-sample-medicine';

export const getServerSideProps = (context) => {
  const { id, copy } = context.query;

  return { props: { id: id || null, copy: formatBoolean(copy) } };
};

const Index = ({ id }: { id?: number }) => {
  return (
    <Layout
      meta={
        <Meta
          title="Pharm - Web dashboard"
          description="Thêm mới ĐƠN THUỐC MẪU"
        />
      }
      title={
        <Link href="/products/sample-medicine">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách đơn thuốc mẫu
          </span>
        </Link>
      }
    >
      <AddSampleMedicine sampleMedicineId={id} />
    </Layout>
  );
};

export default Index;
