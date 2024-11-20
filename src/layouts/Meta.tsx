import Head from "next/head";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";

import { appConfig } from "../helpers/AppConfig";

type IMetaProps = {
  title: string;
  description: string;
  canonical?: string;
  vietmap?: boolean;
};

const Meta = (props: IMetaProps) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta charSet="UTF-8" key="charset" />
        <meta name="viewport" content="width=device-width,initial-scale=1" key="viewport" />
        <link rel="apple-touch-icon" href={`${router.basePath}/apple-touch-icon.png`} key="apple" />
        <link rel="icon" type="image/png" sizes="32x32" href={`${router.basePath}/favicon-32x32.png`} key="icon32" />
        <link rel="icon" type="image/png" sizes="16x16" href={`${router.basePath}/favicon-16x16.png`} key="icon16" />
        <link rel="icon" href={`${router.basePath}/favicon.ico`} key="favicon" />
        <>
          <script async src="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.js"></script>
          <link href="https://maps.vietmap.vn/sdk/vietmap-gl/1.15.3/vietmap-gl.css" rel="stylesheet" />
        </>
      </Head>
      <NextSeo
        title={props.title}
        description={props.description}
        canonical={props.canonical}
        openGraph={{
          title: props.title,
          description: props.description,
          url: props.canonical,
          locale: appConfig.locale,
          site_name: appConfig.site_name,
          images: [
            {
              url: "https://pos.mephar.com/_next/image/?url=%2F_next%2Fstatic%2Fmedia%2Fapple-touch-icon.d080ddd2.png&w=128&q=75",
              width: 1200,
              height: 630,
              alt: "Logo or image description",
              type: "image/jpeg",
            },
          ],
        }}
      />
    </>
  );
};

export { Meta };
