import type { ReactNode } from 'react';

import { Footer } from './Footer';
import { Header } from './Header';
import SideBar from './SideBar';

type ILayoutProps = {
  meta: ReactNode;
  title?: string | ReactNode;
  children: ReactNode;
};

const Layout = (props: ILayoutProps) => (
  <div>
    {props.meta}

    <div className="mx-auto min-h-screen w-full ">
      <div className="flex">
        <SideBar />

        <div className=" content  flex h-screen w-full flex-col overflow-y-auto">
          <div className="flex grow flex-col">
            <Header title={props.title} />

            <div className="main-content grow bg-[#f0f1f1] px-8">
              {props.children}
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  </div>
);

export { Layout };
