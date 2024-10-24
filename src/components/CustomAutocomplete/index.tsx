import { AutoComplete } from "antd";
import cx from "classnames";
import type { ReactNode } from "react";

import { ComponentStyled } from "./styled";

/**
 * CustomAutocomplete component provides an enhanced autocomplete input field with various customization options.
 *
 * @param {Object} props - The properties object.
 * @param {(value: any) => void} [props.onChange] - Callback function triggered when the value changes.
 * @param {any} [props.defaultValue] - The default value of the autocomplete input.
 * @param {any} [props.value] - The current value of the autocomplete input.
 * @param {Array<{ value: any; label: any; disabled?: boolean }>} [props.options=[]] - Array of options for the autocomplete.
 * @param {ReactNode} [props.prefixIcon] - Icon to be displayed at the beginning of the input field.
 * @param {ReactNode} [props.suffixIcon] - Icon to be displayed at the end of the input field.
 * @param {'border-underline' | 'suffix-icon' | string} [props.className] - Additional class names for styling the input field.
 * @param {string} [props.wrapClassName] - Additional class names for styling the wrapper element.
 * @param {boolean} [props.showSearch] - Flag to enable or disable the search functionality.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {(value: string) => void} [props.onSearch] - Callback function triggered when a search is performed.
 * @param {boolean} [props.isLoading] - Flag to indicate if the component is in a loading state.
 * @param {number} [props.listHeight=256] - Height of the dropdown list.
 * @param {(value: any) => void} [props.onSelect] - Callback function triggered when an option is selected.
 * @param {string} [props.popupClassName] - Additional class names for styling the popup dropdown.
 * @param {boolean} [props.disabled] - Flag to disable the input field.
 *
 * @returns {JSX.Element} The rendered CustomAutocomplete component.
 */
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
  disabled,
}: {
  onChange?: (value: any) => void;
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
  onSelect?: (value: any) => void;
  popupClassName?: string;
  disabled?: boolean;
}) {
  const filterOption = () => true;

  return (
    <ComponentStyled
      className={cx(wrapClassName, {
        relative: !!prefixIcon,
      })}
    >
      {prefixIcon && <div className="absolute top-3 left-4 z-[1]">{prefixIcon}</div>}
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
        className={cx("normal-select", className, {
          "suffix-icon": !!suffixIcon,
          "prefix-icon": !!prefixIcon,
        })}
        popupClassName={popupClassName}
        disabled={disabled}
      />
    </ComponentStyled>
  );
}
