import { Button } from 'antd';
import cx from 'classnames';
import type { ReactNode } from 'react';

import { ButtonStyled } from './styled';

export function CustomButton({
  children,
  prefixIcon,
  suffixIcon,
  className,
  type = 'danger',
  onClick,
  outline,
  wrapClassName,
  disabled = false,
  onEnter,
  htmlType,
  loading
}: {
  children: any;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: string;
  type?: 'success' | 'danger' | 'primary' | 'disable' | 'original';
  onClick?: (value?: any) => void;
  outline?: boolean;
  wrapClassName?: string;
  disabled?: boolean;
  onEnter?: () => void;
  htmlType?: 'submit' | 'button' | 'reset';
  loading?: boolean;
}) {
  return (
    <ButtonStyled className={wrapClassName}>
      <Button
        onClick={onClick}
        type="primary"
        className={cx(
          className,
          type,
          outline ? 'btn-outline' : '',
          'flex items-center'
        )}
        disabled={disabled}
        onKeyUp={(e) => {
          if (e.keyCode === 13 && onEnter) {
            onEnter();
          }
        }}
        htmlType={htmlType}
        loading={loading}
      >
        {prefixIcon ? <div className="mr-2 mt-[5px]">{prefixIcon}</div> : <></>}
        {children}
        {suffixIcon ? <div className="ml-2 mt-[5px]">{suffixIcon}</div> : <></>}
      </Button>
    </ButtonStyled>
  );
}
