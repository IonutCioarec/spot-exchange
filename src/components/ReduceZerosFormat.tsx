import React from 'react';
import CustomTooltip from './CustomTooltip';

interface NumberFormatterProps {
  numberString: string;
}

const ReduceZerosFormat: React.FC<NumberFormatterProps> = ({ numberString }) => {
  const formatNumber = (numStr: string): { formatted: string; isFormatted: boolean } => {
    const regex = /(0{5,})([1-9])/g;  // Match 4 or more consecutive zeros followed by a non-zero digit
    let match;
    let formattedString = '';
    let lastIndex = 0;
    let isFormatted = false;

    while ((match = regex.exec(numStr)) !== null) {
      isFormatted = true;
      const { index } = match;
      formattedString += numStr.slice(lastIndex, index);
      formattedString += `0<span style="position: relative; top: 0.4em; font-size: 0.8em; display: inline-block;">${match[1].length - 1}</span>${match[2]}`;
      lastIndex = index + match[0].length;
    }

    // Append the remaining part of the string
    formattedString += numStr.slice(lastIndex);
    return { formatted: formattedString, isFormatted };
  };

  const { formatted, isFormatted } = formatNumber(numberString);

  if (isFormatted) {
    return (
      <CustomTooltip key="aprModal" title={numberString} placement='bottom' >
        <span dangerouslySetInnerHTML={{ __html: formatted }} />
      </CustomTooltip>
    );
  }

  return <span>{numberString}</span>;
};

export default ReduceZerosFormat;