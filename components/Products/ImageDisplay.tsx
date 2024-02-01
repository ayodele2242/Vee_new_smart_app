import React from 'react';
import SingleLoader from '@/loaders/singleLoader';
import ImageLoader from '@/loaders/ImgLoader';
import Image  from 'next/image'; 

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
                  <Image
                    src={product?.images_url[selectedImageIndex]?.url}
                    alt={`Image ${selectedImageIndex + 1}`}
                    width={300} // Set width and height as per your design
                    height={300}
                  />
                ) : (
                  <Image
                    src="/images/logoheader.png"
                    alt="No Image Available"
                    width={300} // Set width and height as per your design
                    height={300}
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
            <Image
              key={index}
              src={image.url}
              alt={`Image ${index + 1}`}
              width={100} 
              height={100}
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
