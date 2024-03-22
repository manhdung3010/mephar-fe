import { Select } from 'antd';
import cx from 'classnames';
import Image from 'next/image';
import type { ReactNode } from 'react';

import ArrowDownGrayIcon from '@/assets/arrowDownGray.svg';
import ArrowDownIcon from '@/assets/arrowDownIcon.svg';

import { ComponentStyled } from './styled';

export function CustomSelect({
  onChange,
  options = [],
  value,
  suffixIcon,
  className,
  wrapClassName,
  showSearch,
  placeholder,
  prefixIcon,
  onSearch,
  isLoading,
  listHeight = 256,
  disabled
}: {
  onChange: (value: any) => void;
  defaultValue?: any;
  value?: any;
  options?: { value: any; label: any; disabled?: boolean }[];
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: 'border-underline' | 'suffix-icon' | string;
  wrapClassName?: string;
  showSearch?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  listHeight?: number;
  disabled?: boolean;
}) {
  const filterOption = (input, option) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  };

  return (
    <ComponentStyled
      className={cx(wrapClassName, {
        relative: !!prefixIcon,
      })}
    >
      {prefixIcon && (
        <div className="absolute top-3 left-4 z-[1]">{prefixIcon}</div>
      )}
      <Select
        showSearch={!!showSearch}
        filterOption={filterOption}
        onChange={onChange}
        onSearch={onSearch}
        options={options}
        value={value}
        placeholder={placeholder}
        listHeight={listHeight}
        suffixIcon={
          suffixIcon ??
          (className?.includes('border-underline') ? (
            <Image src={ArrowDownIcon} />
          ) : (
            <Image src={ArrowDownGrayIcon} />
          ))
        }
        className={cx('normal-select', className, {
          'suffix-icon': !!suffixIcon,
          'prefix-icon': !!prefixIcon,
        })}
        loading={isLoading}
        disabled={disabled}
      />
    </ComponentStyled>
  );
}
