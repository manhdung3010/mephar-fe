import { Select } from "antd";
import cx from "classnames";
import Image from "next/image";
import type { ReactNode } from "react";

import ArrowDownGrayIcon from "@/assets/arrowDownGray.svg";
import ArrowDownIcon from "@/assets/arrowDownIcon.svg";

import { ComponentStyled } from "./styled";

/**
 * CustomSelect component renders a styled select input with various customization options.
 *
 * @param {Object} props - The properties object.
 * @param {(value: any) => void} props.onChange - Callback function triggered when the selected value changes.
 * @param {any} [props.defaultValue] - The default value of the select input.
 * @param {any} [props.value] - The current value of the select input.
 * @param {Array<{ value: any; label: any; disabled?: boolean }>} [props.options=[]] - Array of options to be displayed in the select input.
 * @param {ReactNode} [props.prefixIcon] - Icon to be displayed at the beginning of the select input.
 * @param {ReactNode} [props.suffixIcon] - Icon to be displayed at the end of the select input.
 * @param {"border-underline" | "suffix-icon" | string} [props.className] - Additional class names for the select input.
 * @param {string} [props.wrapClassName] - Additional class names for the wrapper element.
 * @param {boolean} [props.showSearch] - Whether to show the search input in the select dropdown.
 * @param {string} [props.placeholder] - Placeholder text for the select input.
 * @param {(value: string) => void} [props.onSearch] - Callback function triggered when the search input value changes.
 * @param {boolean} [props.isLoading] - Whether the select input is in a loading state.
 * @param {number} [props.listHeight=256] - Height of the dropdown list.
 * @param {boolean} [props.disabled] - Whether the select input is disabled.
 * @param {"multiple" | "tags"} [props.mode] - Mode of the select input, can be "multiple" or "tags".
 * @param {"large" | "middle" | "small"} [props.size] - Size of the select input.
 * @returns {JSX.Element} The rendered CustomSelect component.
 */
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
  disabled,
  mode,
  size,
}: {
  onChange: (value: any) => void;
  defaultValue?: any;
  value?: any;
  options?: { value: any; label: any; disabled?: boolean }[];
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
  className?: "border-underline" | "suffix-icon" | string;
  wrapClassName?: string;
  showSearch?: boolean;
  placeholder?: string;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
  listHeight?: number;
  disabled?: boolean;
  mode?: "multiple" | "tags";
  size?: "large" | "middle" | "small";
}) {
  // const filterOption = (input, option) => {
  //   return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
  // };

  const filterOption = (input, option) => {
    if (typeof option.label === "string") {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    }
    return false;
  };

  return (
    <ComponentStyled
      className={cx(wrapClassName, {
        relative: !!prefixIcon,
      })}
    >
      {prefixIcon && <div className="absolute top-3 left-4 z-[1]">{prefixIcon}</div>}
      <Select
        showSearch={!!showSearch}
        filterOption={filterOption}
        mode={mode}
        onChange={onChange}
        onSearch={onSearch}
        options={options}
        value={value}
        placeholder={placeholder}
        listHeight={listHeight}
        suffixIcon={
          suffixIcon ??
          (className?.includes("border-underline") ? <Image src={ArrowDownIcon} /> : <Image src={ArrowDownGrayIcon} />)
        }
        className={cx("normal-select", className, {
          "suffix-icon": !!suffixIcon,
          "prefix-icon": !!prefixIcon,
        })}
        size={size}
        loading={isLoading}
        disabled={disabled}
      />
    </ComponentStyled>
  );
}
