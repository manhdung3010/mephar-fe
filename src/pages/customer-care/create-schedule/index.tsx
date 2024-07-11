import { Layout } from '@/layouts/Layout';
import { Meta } from '@/layouts/Meta';
import CreateSchedule from '@/modules/customer-care/create-schedule';
import { Customer } from '@/modules/partners/customer';
import Image from 'next/image';
import Link from 'next/link';
import ArrowLeftIcon from '@/assets/arrowLeftIcon.svg';

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Tạo mới lịch trình" />}
      title={
        <Link href="/customer-care/list-schedule">
          <span className="flex cursor-pointer items-center gap-2 text-base font-medium text-[#969696]">
            <Image src={ArrowLeftIcon} /> Quay về danh sách lịch trình
          </span>
        </Link>
      }
    >
      <CreateSchedule />
    </Layout>
  );
};

export default Index;
