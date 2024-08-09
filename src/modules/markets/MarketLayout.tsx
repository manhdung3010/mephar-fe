import type { ReactNode } from 'react';
import MarketHeader from './MarketHeader';

type ILayoutProps = {
  meta: ReactNode;
  title?: string | ReactNode;
  children: ReactNode;
};

const MarketLayout = (props: ILayoutProps) => (
  <div className='market-layout'>
    {props.meta}
    <div className="mx-auto min-h-screen w-full ">
      <MarketHeader />

      <div>
        {props.children}
      </div>
    </div>
  </div>
);

export { MarketLayout };
