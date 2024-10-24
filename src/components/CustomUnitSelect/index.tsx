import { Select } from "antd";

import { UnitSelectedStyled } from "./styled";

/**
 * CustomUnitSelect component renders a styled select input with custom options and a suffix icon.
 *
 * @param {Object} props - The properties object.
 * @param {Array<{ value: any; label: string }>} [props.options] - The array of options for the select input.
 * @param {any} [props.value] - The current value of the select input.
 * @param {(value: any) => void} [props.onChange] - The callback function to handle value changes.
 * @param {boolean} [props.disabled] - Flag to disable the select input.
 *
 * @returns {JSX.Element} The rendered CustomUnitSelect component.
 */
export function CustomUnitSelect({
  options,
  value,
  onChange,
  disabled,
}: {
  options?: { value: any; label: string }[];
  value?: any;
  onChange?: (value: any) => void;
  disabled?: boolean;
}) {
  return (
    <UnitSelectedStyled>
      <Select
        value={value}
        style={{ width: 100 }}
        onChange={onChange}
        options={options}
        disabled={disabled}
        suffixIcon={
          <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path
              d="M3.5 6L8.5 11L13.5 6"
              stroke="#0070F4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    </UnitSelectedStyled>
  );
}
