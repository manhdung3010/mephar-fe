import ArrowLeftIcon from "@/assets/arrowLeftIcon.svg";
import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import CreateSchedule from "@/modules/customer-care/create-schedule";
import Image from "next/image";
import Link from "next/link";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Tạo mới lịch trình" vietmap />}
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
