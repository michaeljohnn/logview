import { MouseEventHandler, ReactNode, useCallback, useEffect, useState } from 'react';

import { getSelectionText } from '../../utils/selection';

interface TextSelectionBubbleProps {
  renderTextSelectionBubble?: (text: string | undefined) => ReactNode;
  targetRef: React.RefObject<HTMLDivElement>;
  onTextSelectionChange?: (text: string | undefined) => void;
}

interface Position {
  x: number;
  y: number;
}

export default function TextSelectionBubble(props: TextSelectionBubbleProps) {
  const { targetRef, renderTextSelectionBubble, onTextSelectionChange } = props;
  const [selectText, setSelectText] = useState<string>();
  const [position, setPosition] = useState<Position>();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMouseUp = (e: MouseEvent) => {
      const text = getSelectionText();

      if (!!text?.trim()) {
        setSelectText(text);
        setPosition({ x: e.clientX, y: e.clientY + 12 });
        setVisible(true);

        onTextSelectionChange?.(text);
      }
    };

    targetRef.current?.addEventListener('mouseup', onMouseUp);

    return () => targetRef.current?.removeEventListener('mouseup', onMouseUp);
  }, [targetRef.current, onTextSelectionChange]);

  useEffect(() => {
    const fn = () => {
      if (!document.getSelection()?.toString()?.trim()) {
        setVisible(false);
      }
    };
    document.body.addEventListener('click', fn);

    return () => document.body.removeEventListener('click', fn);
  }, [selectText]);

  const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);

  if (!visible || !renderTextSelectionBubble) return null;

  return (
    <div className="fixed z-20" style={{ left: position?.x, top: position?.y }} onClick={onClick}>
      {renderTextSelectionBubble?.(selectText)}
    </div>
  );
}
