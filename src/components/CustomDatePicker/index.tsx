import { DatePicker } from "antd";
import cx from "classnames";
import dayjs from "dayjs";
import Image from "next/image";
import type { ReactNode } from "react";

import DateIcon from "@/assets/dateIcon.svg";

/**
 * CustomDatePicker component renders a date picker with customizable options.
 *
 * @param {Object} props - The properties object.
 * @param {string} [props.className] - Additional CSS classes to apply to the date picker.
 * @param {ReactNode} [props.suffixIcon] - Custom suffix icon to display in the date picker.
 * @param {string} [props.placeholder] - Placeholder text for the date picker input.
 * @param {(value: any) => void} [props.onChange] - Callback function to handle date change events.
 * @param {any} [props.format] - Custom date format or configuration object.
 * @param {any} [props.value] - Initial value of the date picker.
 * @param {boolean} [props.bordered=true] - Whether the date picker should have borders.
 * @param {boolean} [props.showTime=false] - Whether to show time selection in the date picker.
 *
 * @returns {JSX.Element} The rendered date picker component.
 */
export function CustomDatePicker({
  className,
  suffixIcon,
  placeholder,
  onChange,
  format,
  value,
  bordered = true,
  showTime = false,
}: {
  className?: string;
  suffixIcon?: ReactNode;
  placeholder?: string;
  onChange?: (value) => void;
  format?: any;
  value?: any;
  bordered?: boolean;
  showTime?: boolean;
}) {
  return (
    <DatePicker
      onChange={onChange}
      className={cx(className, "h-11 w-full focus:shadow-none focus-within:shadow-none", {
        "border-b border-t-0 border-l-0 border-r-0 border-[#FBECEE] rounded-none ": !bordered,
      })}
      suffixIcon={suffixIcon || <Image src={DateIcon} alt="" />}
      placeholder={placeholder}
      format={
        format || {
          format: showTime ? "DD/MM/YYYY HH:mm:ss" : "DD/MM/YYYY",
          type: "mask",
        }
      }
      defaultValue={value ? dayjs(value) : undefined}
      value={value ? dayjs(value) : undefined}
      showTime={showTime}
    />
  );
}
