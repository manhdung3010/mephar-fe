import { DatePicker } from 'antd';
import cx from 'classnames';
import dayjs from 'dayjs';
import Image from 'next/image';
import type { ReactNode } from 'react';

import DateIcon from '@/assets/dateIcon.svg';

export function CustomDatePicker({
  className,
  suffixIcon,
  placeholder,
  onChange,
  format,
  value,
  bordered = true,
  showTime = false,
}: {
  className?: string;
  suffixIcon?: ReactNode;
  placeholder?: string;
  onChange?: (value) => void;
  format?: any;
  value?: string;
  bordered?: boolean;
  showTime?: boolean;
}) {
  return (
    <DatePicker
      onChange={onChange}
      className={cx(
        className,
        'h-11 w-full focus:shadow-none focus-within:shadow-none',
        {
          'border-b border-t-0 border-l-0 border-r-0 border-[#FBECEE] rounded-none ':
            !bordered,
        }
      )}
      suffixIcon={suffixIcon || <Image src={DateIcon} alt="" />}
      placeholder={placeholder}
      format={format || { format: showTime ? 'DD/MM/YYYY hh:mm:ss' : 'DD/MM/YYYY', type: 'mask' }}
      defaultValue={value ? dayjs(value) : undefined}
      showTime={showTime}
    />
  );
}
