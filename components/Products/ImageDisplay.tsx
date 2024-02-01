import React from 'react';
import SingleLoader from '@/loaders/singleLoader';
import ImageLoader from '@/loaders/ImgLoader';

interface ImageDisplayProps {
  loading: boolean;
  product: any;
  selectedImageIndex: number;
  handleImageClick: (index: number) => void;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ loading, product, selectedImageIndex, handleImageClick }) => {
  return (
    <>
      {loading && !product ? (
        <div>
          <ImageLoader numberOfItems={1} />
        </div>
      ) : (
        <>
          {!loading && product && (
            <>
              <div className="imgScreen">
                {product?.images_url && selectedImageIndex !== undefined && product?.images_url.length > 0 ? (
                  <img src={product?.images_url[selectedImageIndex]?.url} alt={`Image ${selectedImageIndex + 1}`} />
                ) : (
                  <img
                    src="/images/logoheader.png"
                    alt="No Image Available"
                    className="relative"
                  />
                )}
              </div>
            </>
          )}
        </>
      )}

      {loading && !product && (
        <div>
          <SingleLoader numberOfItems={1} />
        </div>
      )}

      {!loading && product && (
        <div className="imgListing">
          {product?.images_url.map((image: any, index: number) => (
            <img
              key={index}
              src={image.url}
              alt={`Image ${index + 1}`}
              onClick={() => handleImageClick(index)}
              className={index === selectedImageIndex ? "active" : ""}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default ImageDisplay;
