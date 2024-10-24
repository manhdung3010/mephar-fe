import classNames from "classnames";
import React, { useState } from "react";

interface Props extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  menu: Array<string>;
  defaultIndex?: number;
  components: Array<React.ReactNode>;
}

/**
 * A custom tab component that renders a set of tabs and their corresponding content.
 *
 * @component
 * @param {Props} props - The properties object.
 * @param {string[]} props.menu - An array of strings representing the tab labels.
 * @param {React.ReactNode[]} props.components - An array of React nodes representing the content for each tab.
 * @param {number} [props.defaultIndex=0] - The index of the tab to be selected by default.
 * @param {object} [props.rest] - Additional properties to be spread onto the root div element.
 *
 * @returns {JSX.Element} The rendered tab component.
 */
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
                "cursor-pointer px-5 py-[6px] rounded-t-lg",
                index === select ? "bg-[#D64457] text-[white]" : "text-black-main",
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
