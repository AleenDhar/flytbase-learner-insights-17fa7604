
import React from "react";

interface BrandLogoProps {
  className?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({ className = "" }) => {
  return (
    <img 
      src="/lovable-uploads/826fdf9d-0d97-4ab3-bc53-3008748ed0b7.png" 
      alt="FlytBase Academy Logo" 
      className={`h-8 ${className}`}
    />
  );
};

export default BrandLogo;
