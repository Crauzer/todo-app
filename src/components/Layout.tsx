type LayoutProps = React.PropsWithChildren;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="">
      <div className="navbar h-16 bg-base-300">
        <a className="btn-ghost btn text-xl normal-case">ToDo</a>
      </div>
      <div className="max-h-[calc(100vh-4rem)] overflow-y-scroll">
        {children}
      </div>
    </div>
  );
};
