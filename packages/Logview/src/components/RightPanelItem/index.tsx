import { ChevronRightIcon } from 'lucide-react';
import { ReactNode, useCallback, useState } from 'react';

import StatusPing from '../StatusPing';

import type { Status } from '../../types';
type PanelItemType = 'link' | 'statusbar' | 'normal';

interface RightPanelItemProps {
  type: PanelItemType;
  status?: Status;
  content?: ReactNode;
  title: string | ReactNode;
  count?: number;
  link?: string;
}

const DEFAULT_MAX_HEIGHT = '100000px';

export default function RightPanelItem(props: RightPanelItemProps) {
  const { status, title, count, content, type = 'normal', link } = props;
  const statusBgColor = status === 'error' ? 'bg-error' : 'bg-normal';
  const headerBgColor = status === 'error' ? 'bg-error/10' : 'bg-normal/10';
  const [maxHeight, setMaxHeight] = useState(DEFAULT_MAX_HEIGHT);

  const onClick = useCallback(() => {
    if (type === 'link') {
      window.open(link);
    } else {
      setMaxHeight(maxHeight === DEFAULT_MAX_HEIGHT ? '0px' : DEFAULT_MAX_HEIGHT);
    }
  }, [type, maxHeight]);

  return (
    <div className="right-panel-item text-foreground max-h-full overflow-auto relative min-h-[38px]">
      <header className={`${headerBgColor} cursor-pointer sticky top-0 h-[38px] lv-border-b`} onClick={onClick}>
        <div className={`h-[4px] rounded-full ${statusBgColor}`}></div>
        <section className="flex items-center justify-between p-2 ">
          <div className="flex items-center gap-2 text-xs">
            {type === 'statusbar' && <StatusPing status={status} />}
            {title}
          </div>
          {type === 'statusbar' && count && (
            <div className="px-4 rounded-full bg-error text-white text-xs">
              {count}
            </div>
          )}
          {type === 'link' && <ChevronRightIcon className="w-4 h-4 text-foreground/50" />}
        </section>
      </header>
      {content && (
        <section
          className={`overflow-hidden transition-all duration-500 ease-in-out px-2 mb-2 max-h-full`}
          style={{ maxHeight }}
        >
          {content}
        </section>
      )}
    </div>
  );
}
