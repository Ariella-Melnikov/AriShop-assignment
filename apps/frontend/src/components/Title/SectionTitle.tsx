type TitleProps = {
    children: React.ReactNode;
  };
  
  export const SectionTitle = ({ children }: TitleProps) => {
    return (
      <div className="section-title-container">
        <h2 className="section-title">{children}</h2>
      </div>
    );
  };