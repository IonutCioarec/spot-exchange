import 'assets/css/loader.css';
import { useMobile } from 'utils/responsive';

interface ToolWidgetProps {
  tokenImage: string;
  handleToken: Function;
  title: string;
  active: boolean;
}

const ToolWidget = ({tokenImage, handleToken, title, active} : ToolWidgetProps) => {
  const isMobile = useMobile();
  
  return (
    <div className={`tool-container ${active ? 'tool-active' : ''}`} onClick={() => handleToken()}>
      <div className='p-2'>
        <img
          src={tokenImage}
          alt={'tokenImage'}
          className='d-inline'
          style={{ width: isMobile ? 100 : 110, height: isMobile ? 100 : 110 }}
        />
        <p className='mb-2 small text-white text-uppercase text-center'>{title}</p>
      </div>
    </div>
  );
};

export default ToolWidget;