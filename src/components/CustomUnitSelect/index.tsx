import { Select } from 'antd';

import { UnitSelectedStyled } from './styled';

export function CustomUnitSelect({
  options,
  value,
  onChange,
}: {
  options?: { value: any; label: string }[];
  value?: any;
  onChange?: (value: any) => void;
}) {
  return (
    <UnitSelectedStyled>
      <Select
        value={value}
        style={{ width: 100 }}
        onChange={onChange}
        options={options}
        suffixIcon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="16"
            viewBox="0 0 17 16"
            fill="none"
          >
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
