import { Radio } from "antd";

import { RadioStyled } from "./styled";

/**
 * CustomRadio component renders a group of radio buttons with custom styling.
 *
 * @param {Object} props - The properties object.
 * @param {(value: any) => void} [props.onChange] - Optional callback function to handle change events.
 * @param {any} [props.value] - The current selected value.
 * @param {Array<{ value: any; label: any }>} props.options - Array of options for the radio buttons.
 * @param {string} [props.className] - Optional additional class name for custom styling.
 *
 * @returns {JSX.Element} The rendered CustomRadio component.
 */
export function CustomRadio({
  onChange,
  value,
  options,
  className,
}: {
  onChange?: (value: any) => void;
  value?: any;
  options: { value: any; label: any }[];
  className?: string;
}) {
  return (
    <RadioStyled>
      <Radio.Group
        onChange={(e) => {
          if (onChange) {
            onChange(e.target.value);
          }
        }}
        className={className}
        value={value}
      >
        {options.map((option) => (
          <Radio key={option.value} value={option.value}>
            {option.label}
          </Radio>
        ))}
      </Radio.Group>
    </RadioStyled>
  );
}
