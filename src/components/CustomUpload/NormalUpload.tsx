import cx from 'classnames';
import Image from 'next/image';

import PhotographIcon from '@/assets/photograph.svg';

const NormalUpload = ({ className }: { className?: string }) => {
  return (
    <div
      className={cx(
        className,
        'flex h-[300px] w-full flex-col items-center justify-center gap-[5px] rounded-lg border-2 border-dashed border-[#9CA1AD] p-5 mb-3'
      )}
    >
      <Image src={PhotographIcon} alt="" />
      <div className="font-semibold">
        <span className="text-[#E03]">Tải ảnh lên</span>{' '}
        <span className="text-[#6F727A]">hoặc kéo và thả</span>
      </div>
      <div className="font-thin text-[#6F727A]">PNG, JPG, GIF up to 2MB</div>
    </div>
  );
};

export default NormalUpload;
