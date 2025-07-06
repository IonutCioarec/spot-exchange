import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AdjustIcon from '@mui/icons-material/Adjust';
import { pendingStatusSteps, pendingStatusLabels } from 'config';

interface HorizontalStatusConnectorProps {
  currentStatus: string;
}

const HorizontalStatusConnector: React.FC<HorizontalStatusConnectorProps> = ({ currentStatus }) => {
  const currentIndex = pendingStatusSteps.indexOf(currentStatus);
  const poolFinished = currentStatus == 'Ready';

  return (
    <div className="flex items-center justify-between w-full py-3 px-2">
      {pendingStatusSteps.map((step, index) => {
        const isCompleted = (index < currentIndex);
        const isActive = (index === currentIndex) && (currentStatus !== 'Ready');
        const isFuture = index > currentIndex;

        const displayLabel = pendingStatusLabels[step] || pendingStatusLabels.default;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              {/* icon */}
              <div className="mb-1">
                {(isCompleted || poolFinished) && <CheckCircleIcon className="text-[#3FAC5A] font-size-lg" />}
                {isActive && <AdjustIcon className="text-primary font-size-lg" />}
                {isFuture && <RadioButtonUncheckedIcon className="text-gray-500 font-size-lg" />}
              </div>
              {/* step label */}
              <p className={`font-size-xxs mb-0 text-center font-semibold  ${(isCompleted || poolFinished) ? 'text-[#3FAC5A]' : (isActive ? 'text-primary' : 'text-gray-500')}`}>
                {displayLabel}
              </p>
            </div>

            {/* connector line */}
            {index < pendingStatusSteps.length - 1 && (
              <div className={`flex-1 height-1 mx-3 ${(isCompleted || poolFinished) ? 'bg-[#3FAC5A]' : 'bg-gray-500'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default HorizontalStatusConnector;