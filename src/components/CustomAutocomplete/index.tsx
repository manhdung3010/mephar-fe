import { AutoComplete } from 'antd';
import cx from 'classnames';
import type { ReactNode } from 'react';

import { ComponentStyled } from './styled';

export function CustomAutocomplete({
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
  listHeight = 256,
  onSelect,
  popupClassName,
  isLoading,
}: {
  onChange?: (value: any) => void;
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
  onSelect?: (value: any) => void;
  popupClassName?: string;
}) {
  const filterOption = () => true;

  return (
    <ComponentStyled
      className={cx(wrapClassName, {
        relative: !!prefixIcon,
      })}
    >
      {prefixIcon && (
        <div className="absolute top-3 left-4 z-[1]">{prefixIcon}</div>
      )}
      <AutoComplete
        showSearch={!!showSearch}
        onSelect={onSelect}
        filterOption={filterOption}
        onChange={onChange}
        onSearch={onSearch}
        options={options}
        value={value}
        placeholder={placeholder}
        listHeight={listHeight}
        suffixIcon={suffixIcon}
        className={cx('normal-select', className, {
          'suffix-icon': !!suffixIcon,
          'prefix-icon': !!prefixIcon,
        })}
        popupClassName={popupClassName}
      />
    </ComponentStyled>
  );
}
