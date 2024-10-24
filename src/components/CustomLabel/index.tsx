import Image from "next/image";

import InfoIcon from "@/assets/info-circle.svg";

/**
 * A custom label component that displays a label with optional required indicator and info icon.
 *
 * @param {Object} props - The properties object.
 * @param {boolean} [props.required] - Indicates if the label is for a required field.
 * @param {string} [props.infoText] - The text for the info icon's alt attribute.
 * @param {string} props.label - The text to display as the label.
 * @param {boolean} [props.hasInfoIcon] - Determines if an info icon should be displayed.
 * @param {string} [props.className] - Additional CSS classes to apply to the label.
 *
 * @returns {JSX.Element} The rendered label component.
 */
const Label = ({
  required,
  infoText,
  label,
  hasInfoIcon = false,
  className,
}: {
  required?: boolean;
  infoText?: string;
  label: string;
  hasInfoIcon?: boolean;
  className?: string;
}) => {
  return (
    <div className="mb-2 flex items-center gap-1 font-medium">
      {required && <span className="text-[#F32B2B]">*</span>}
      <span className={`font-medium text-[#15171A] ${className && className}`}>{label}</span>
      {hasInfoIcon && <Image src={InfoIcon} alt={infoText} />}
    </div>
  );
};

export default Label;
