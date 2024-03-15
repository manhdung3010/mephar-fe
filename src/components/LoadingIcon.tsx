import Image from 'next/image';

import Loading from '@/assets/images/loadingIcon.png';

export function LoadingIcon({ size = 24 }: { size?: number }) {
  return (
    <Image
      src={Loading}
      alt=""
      className="animate-spin"
      width={size}
      height={size}
    />
  );
}
