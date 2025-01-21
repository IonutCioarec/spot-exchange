import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "utils/calculs";

interface Props {
  text: string;
  color?: string
}

const ClipboardCopy = ({text, color = 'white'} : Props) => {
  return (
    <span className={`ms-2 text-[${color}]`} style={{ cursor: 'pointer' }} onClick={() => CopyToClipboard(text)}> <FontAwesomeIcon icon={faCopy} /></span >
  );
}

export default ClipboardCopy;