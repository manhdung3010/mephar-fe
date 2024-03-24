import Image from 'next/image';

import InfoIcon from '@/assets/info-circle.svg';

const Label = ({
  required,
  infoText,
  label,
  hasInfoIcon = true,
  className
}: {
  required?: boolean;
  infoText?: string;
  label: string;
  hasInfoIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1 font-medium">
      {required && <span className="text-[#F32B2B]">*</span>}
      <span className={`font-medium text-[#15171A] ${className && className}`}>{label}</span>
      {hasInfoIcon && <Image src={InfoIcon} alt={infoText} />}
    </div>
  );
};

export default Label;
