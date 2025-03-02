import Tooltip from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import { TooltipProps } from "@mui/material/Tooltip";

const CustomTooltip = ({ title, placement = 'bottom', children, ...props }: TooltipProps) => {
  const componentsProps = {
    tooltip: {
      sx: {
        maxWidth: '200px',
        backgroundColor: 'rgba(20,20,20,1)',
        color: 'white',
        fontSize: '13px',
        fontWeight: '400',
        textAlign: 'center',
        borderRadius: '10px',
        padding: '10px',
        top: '-10px',
        fontFamily: 'Red Rose',
        boxShadow: '1px 0 5px rgba(63, 142, 90, 0.2), -1px 0 5px rgba(63, 142, 90, 0.2) !important'
      },
    },
    arrow: {
      sx: {
        color: 'rgba(20,20,20,1)',
        marginLeft: '-5px'
      },
    },
    TransitionComponent: Fade,
  };

  return (
    <Tooltip title={title} arrow placement={placement} componentsProps={componentsProps} {...props}>
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
