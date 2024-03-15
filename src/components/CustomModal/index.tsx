import { Button, Modal } from 'antd';
import cx from 'classnames';
import type { ComponentProps, ReactNode } from 'react';

type SelectProps = ComponentProps<typeof Modal>;

export function CustomModal({
  title,
  isOpen,
  onCancel,
  onSubmit,
  children,
  width,
  customFooter,
  textCancel,
  textOk,
  className,
  isLoading,
  forceRender,
  ...rest
}: {
  title?: string | ReactNode;
  isOpen: boolean;
  onCancel: () => void;
  onSubmit?: () => void;
  children: any;
  width?: number;
  customFooter?: boolean;
  textCancel?: string;
  textOk?: string;
  className?: string;
  isLoading?: boolean;
  forceRender?: boolean;
} & SelectProps) {
  return (
    <Modal
      title={title}
      width={width}
      open={isOpen}
      className={cx('custom-modal', className)}
      onCancel={onCancel}
      centered
      forceRender={forceRender}
      footer={
        customFooter
          ? null
          : [
              <Button
                key="back"
                onClick={onCancel}
                danger
                ghost
                className="h-[46px] min-w-[150px] py-2 px-4"
              >
                {textCancel || 'Hủy bỏ'}
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={onSubmit}
                danger
                disabled={isLoading}
                className="h-[46px] min-w-[150px] py-2 px-4"
              >
                {textOk || 'Xong'}
              </Button>,
            ]
      }
      {...rest}
    >
      {children}
    </Modal>
  );
}
