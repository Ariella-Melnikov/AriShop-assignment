type BannerProps = {
    imgUrl: string;
    alt?: string;
  };
  
  export const Banner = ({ imgUrl, alt = 'Banner' }: BannerProps) => {
    return (
      <div className="banner">
        <img src={imgUrl} alt={alt} className="banner-img" />
      </div>
    );
  };
  