import { useRef, useEffect } from 'react';

interface FrameProps {
  src: string;
}

const FrameComponent: React.FC<FrameProps> = ({ src }) => {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const adjustFrameSize = () => {
      if (!frame.contentWindow) return;

      frame.style.height = frame.contentWindow.document.body.scrollHeight + 'px';
      frame.style.width = frame.contentWindow.document.body.scrollWidth + 'px';
    };

    frame.onload = adjustFrameSize;

    adjustFrameSize(); // Initial adjustment

    return () => {
      frame.onload = null; // Clean up the event listener
    };
  }, [src]);

  return (
    <iframe
      ref={frameRef}
      src={src}
      className="w-full"
      title="Iframe"
      frameBorder="0"
      scrolling="no"
    ></iframe>
  );
};

export default FrameComponent;
