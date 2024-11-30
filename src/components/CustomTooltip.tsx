import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { TooltipProps } from "@mui/material/Tooltip";

const CustomTooltip = ({ title, children, ...props }: TooltipProps) => {
  const componentsProps = {
    tooltip: {
      sx: {
        maxWidth: '200px',
        backgroundColor: 'rgba(12,12,12, 1)',
        color: 'white',
        fontSize: '12px',
        fontWeight: '400',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '10px',
        top: '-10px',
        fontFamily: 'Red Rose',
      },
    },
    arrow: {
      sx: {
        color: 'black',
      },
    },
    TransitionComponent: Fade,
  };

  return (
    <Tooltip title={title} arrow placement="bottom" componentsProps={componentsProps} {...props}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
