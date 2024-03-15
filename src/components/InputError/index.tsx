import cx from 'classnames';

export default function InputError({ error }: { error?: any }) {
  return (
    <p
      className={cx(
        'mt-1 ml-1 italic transition-all duration-300',
        error ? ' h-4 text-[#fc033d]' : ' h-[0]'
      )}
    >
      {error}
    </p>
  );
}
