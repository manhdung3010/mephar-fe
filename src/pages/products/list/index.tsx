import { Layout } from "@/layouts/Layout";
import { Meta } from "@/layouts/Meta";
import ProductList from "@/modules/products/list-product";

const Index = () => {
  return (
    <Layout
      meta={
        <Meta title="Pharm - Web dashboard" description="Danh sách sản phẩm" />
      }
      title="Danh sách sản phẩm"
    >
      <ProductList />
    </Layout>
  );
};

export default Index;
