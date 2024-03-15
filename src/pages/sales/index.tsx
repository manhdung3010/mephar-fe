import dynamic from 'next/dynamic';

import { Meta } from '@/layouts/Meta';

const SaleComponent = dynamic(() => import('@/modules/sales'), {
  ssr: false,
});

const Index = () => {
  return (
    <div title="Bán hàng">
      <Meta title="Pharm - Web dashboard" description="Bán hàng" />
      <SaleComponent />
    </div>
  );
};

export default Index;
