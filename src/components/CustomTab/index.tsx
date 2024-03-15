import classNames from 'classnames';
import React, { useState } from 'react';

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  menu: Array<string>;
  defaultIndex?: number;
  components: Array<React.ReactNode>;
}

const Tab = (props: Props) => {
  const { menu, components, defaultIndex, ...rest } = props;
  const [select, setSelect] = useState(defaultIndex ?? 0);

  return (
    <div {...rest}>
      <div className="flex flex-col">
        <div className="flex gap-3">
          {menu.map((item, index) => (
            <div
              key={index}
              className={classNames(
                'cursor-pointer px-5 py-[6px] rounded-t-lg',
                index === select
                  ? 'bg-[#D64457] text-[white]'
                  : 'text-black-main'
              )}
              onClick={() => setSelect(index)}
            >
              {item}
            </div>
          ))}
        </div>
        <div className="h-[1px] w-full bg-[#D64457]" />
      </div>
      {components[select]}
    </div>
  );
};

export default Tab;
