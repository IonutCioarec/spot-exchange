import React from 'react';

interface NumberFormatterProps {
  numberString: string;
  size?: string;
  top?: string;
}

const ReduceZerosFormat: React.FC<NumberFormatterProps> = ({ numberString, size = '0.8em', top = '0.3em' }) => {
  const formatNumber = (numStr: string): string => {
    const regex = /(0{4,})([1-9])/g;
    let match;
    let formattedString = '';
    let lastIndex = 0;

    while ((match = regex.exec(numStr)) !== null) {
      const { index } = match;
      formattedString += numStr.slice(lastIndex, index);
      formattedString += `0<span style="position: relative; top: ${top}; font-size: ${size}; display: inline-block;">${match[1].length - 1}</span>${match[2]}`;
      lastIndex = index + match[0].length;
    }

    formattedString += numStr.slice(lastIndex);
    return formattedString;
  };

  return (
    <span dangerouslySetInnerHTML={{ __html: formatNumber(numberString) }} />
  );
};

export default ReduceZerosFormat;