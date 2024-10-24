import cx from "classnames";

/**
 * A functional component that displays an error message with styling.
 *
 * @param {Object} props - The component props.
 * @param {any} [props.error] - The error message to display. If not provided, the component will render with minimal height.
 * @param {string} [props.className] - Additional class names to apply to the error message element.
 * @returns {JSX.Element} The rendered error message component.
 */
export default function InputError({ error, className }: { error?: any; className?: string }) {
  return (
    <p
      className={cx(
        "mt-1 ml-1 italic transition-all duration-300",
        error ? " h-4 text-[#fc033d]" : " h-[0]",
        className,
      )}
    >
      {error}
    </p>
  );
}
