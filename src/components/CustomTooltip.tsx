import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { TooltipProps } from "@mui/material/Tooltip";

const CustomTooltip = ({ title, children, ...props }: TooltipProps) => {
  const componentsProps = {
    tooltip: {
      sx: {
        maxWidth: '200px',
        backgroundColor: 'black',
        color: 'white',
        fontSize: '14px',
        fontWeight: '400',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '10px',
        top: '-10px',
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
