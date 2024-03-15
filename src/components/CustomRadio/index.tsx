import { Radio } from 'antd';

import { RadioStyled } from './styled';

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
