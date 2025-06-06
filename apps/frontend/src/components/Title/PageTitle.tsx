type TitleProps = {
    children: React.ReactNode
  }
  
  export const PageTitle = ({ children }: TitleProps) => {
    return (
        <div className="title-container">
            <h1 className="title">{children}</h1>
        </div>
    )
  }