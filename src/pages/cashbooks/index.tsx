import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import { Cashbook } from "@/modules/cashbooks";

const Index = () => {
  return (
    <Layout
      meta={<Meta title="Pharm - Web dashboard" description="Sổ quỹ" />}
      title="Sổ quỹ"
    >
      <Cashbook />
    </Layout>
  );
};

export default Index;
