type TitleProps = {
    children: React.ReactNode
  }
  
  export const Title = ({ children }: TitleProps) => {
    return <h1 className="title">{children}</h1>
  }