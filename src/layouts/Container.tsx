export const Container = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element | string;
}) => {
  return (
    <div className="m-auto h-full w-full px-6 md:px-10 lg:w-3/4 xl:w-2/3">
      {children}
    </div>
  );
};
