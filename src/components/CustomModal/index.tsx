import { Button, Modal } from "antd";
import cx from "classnames";
import type { ComponentProps, ReactNode } from "react";

type SelectProps = ComponentProps<typeof Modal>;

/**
 * CustomModal component renders a modal dialog with customizable properties.
 *
 * @param {Object} props - The properties object.
 * @param {string | ReactNode} [props.title] - The title of the modal.
 * @param {boolean} props.isOpen - Determines if the modal is open.
 * @param {() => void} props.onCancel - Callback function to handle modal cancellation.
 * @param {() => void} [props.onSubmit] - Callback function to handle modal submission.
 * @param {any} props.children - The content to be displayed inside the modal.
 * @param {number} [props.width] - The width of the modal.
 * @param {boolean} [props.customFooter] - Flag to determine if a custom footer should be used.
 * @param {string} [props.textCancel] - Text for the cancel button.
 * @param {string} [props.textOk] - Text for the submit button.
 * @param {string} [props.className] - Additional class names for the modal.
 * @param {boolean} [props.isLoading] - Flag to indicate if the submit button should be disabled.
 * @param {boolean} [props.forceRender] - Flag to force render the modal.
 * @param {SelectProps} rest - Additional properties passed to the modal component.
 *
 * @returns {JSX.Element} The rendered CustomModal component.
 */
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
      className={cx("custom-modal", className)}
      onCancel={onCancel}
      centered
      forceRender={forceRender}
      footer={
        customFooter
          ? null
          : [
              <Button key="back" onClick={onCancel} danger ghost className="h-[46px] min-w-[150px] py-2 px-4">
                {textCancel || "Hủy bỏ"}
              </Button>,
              <Button
                key="submit"
                type="primary"
                onClick={onSubmit}
                danger
                disabled={isLoading}
                className="h-[46px] min-w-[150px] py-2 px-4"
              >
                {textOk || "Xong"}
              </Button>,
            ]
      }
      {...rest}
    >
      {children}
    </Modal>
  );
}
