import { Input } from 'antd';
import type { InputProps, TextAreaProps } from 'antd/es/input';
import cx from 'classnames';
import Image from 'next/image';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import MinusIcon from '@/assets/minusIcon.svg';
import PlusIcon from '@/assets/plusRedIcon.svg';

import { InputStyled } from './styled';

export function CustomInput({
  className,
  bordered = true,
  placeholder,
  prefixIcon,
  wrapClassName,
  suffixIcon,
  type = 'text',
  blurAfterClick = false,
  onChange,
  onClick,
  hideArrow = false,
  value,
  defaultValue,
  forceValue,
  hasPlus = false,
  hasMinus = false,
  onMinus,
  onPlus,
  allowDecimal = false,
  refInput,
  ...rest
}: InputProps & {
  className?: string;
  bordered?: boolean;
  placeholder?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  wrapClassName?: string;
  onChange: (value) => void;
  onClick?: () => void;
  type?: 'text' | 'password' | 'number';
  blurAfterClick?: boolean;
  hideArrow?: boolean;
  value?: any;
  defaultValue?: any;
  forceValue?: any;
  hasPlus?: boolean;
  hasMinus?: boolean;
  onMinus?: (value) => void;
  onPlus?: (value) => void;
  allowDecimal?: boolean;
  refInput?: any;
}) {
  const ref = useRef<any>(null);
  const [label, setLabel] = useState<string>();

  const onChangeValue = (e) => {
    const { value } = e.target;

    if (type === 'number') {
      let regex = /^[1-9]\d*$/;

      if (allowDecimal) {
        regex = /^[1-9]\d*\.?\d{1,3}$/;
      }

      const formatValue = value.replace(/,/g, '');

      if (regex.test(formatValue)) {
        onChange(Number(formatValue));
        setLabel(Number(formatValue).toLocaleString('en-US'));
      } else {
        onChange(0);
        setLabel('');
      }
    } else {
      onChange(value);
      setLabel(value);
    }
  };

  useEffect(() => {
    const inputValue = defaultValue || value;

    if (type === 'number') {
      if (label === undefined) {
        setLabel(inputValue?.toLocaleString('en-US'));
        return;
      }

      const formatValue = label?.replace(/,/g, '');

      if (Number(formatValue) !== inputValue) {
        setLabel(inputValue?.toLocaleString('en-US'));
      }
    } else if (inputValue !== label) {
      setLabel(inputValue);
    }
  }, [value, defaultValue]);

  const onClickInput = () => {
    if (blurAfterClick && ref.current) {
      ref.current.blur();
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <InputStyled className={`${wrapClassName} flex items-center gap-x-2`}>
      {hasMinus && (
        <div className="flex items-center">
          <Image
            src={MinusIcon}
            alt=""
            className="w-4 cursor-pointer"
            onClick={() => {
              if (onMinus) {
                onMinus(value - 1 >= 0 ? value - 1 : value);
                ref.current.focus();
              }
            }}
          />
        </div>
      )}
      <Input
        className={cx(
          'text-[#19191C] leading-normal focus:shadow-none focus-within:shadow-none',
          className,
          {
            'border-b border-t-0 border-l-0 border-r-0 border-[#FBECEE] rounded-none ':
              !bordered,
            'hide-arrow': hideArrow,
          }
        )}
        type={type === 'number' ? 'text' : type}
        placeholder={placeholder}
        prefix={prefixIcon}
        suffix={suffixIcon}
        onChange={onChangeValue}
        onClick={onClickInput}
        ref={refInput ? refInput : ref}
        value={forceValue ?? label}
        {...rest}
      />
      {hasPlus && (
        <div className="flex items-center">
          <Image
            src={PlusIcon}
            alt=""
            className="w-4 cursor-pointer"
            onClick={() => {
              if (onPlus) {
                onPlus(value + 1);
                ref.current.focus();
              }
            }}
          />
        </div>
      )}
    </InputStyled>
  );
}

const { TextArea } = Input;

export function CustomTextarea(props: TextAreaProps) {
  const { className, ...rest } = props;

  return (
    <TextArea
      className={cx(
        'rounded p-3 border-[#D3D5D7] placeholder-[#999999]',
        className
      )}
      {...rest}
    />
  );
}
