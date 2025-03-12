import { ListXIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LogAdvice } from '../../types';
import { wrapLinks } from '../../utils/text';
import RightPanelItem from '../RightPanelItem';

interface AdvicesProps {
  advices: LogAdvice[];
  onChange?: (advice: LogAdvice) => void;
}

export default function Advices(props: AdvicesProps) {
  const { t } = useTranslation();
  const { advices, onChange } = props;
  const [current, setCurrnet] = useState<number | undefined>(advices?.[0]?.id);

  const onClick = useCallback((advice: LogAdvice) => {
    onChange?.(advice);
    setCurrnet(advice.id);
  }, []);

  if (!advices?.length) return null;

  return (
    <RightPanelItem
      type="statusbar"
      status="error"
      title={t('log.advices.title')}
      count={advices.length}
      content={
        <section className="text-xs">
          {advices.map((advice, index) => (
            <div key={advice.id} className="rounded-lg lv-border mb-2 overflow-hidden">
              <header
                className={`p-2 text-sm flex gap-2 items-center cursor-pointer text-white
                ${current === advice.id ? 'bg-error' : 'bg-zinc-700'}`}
                onClick={() => onClick(advice)}
              >
                <ListXIcon size={16} />
                <span>
                  {t('error')}
                  {index + 1}:
                </span>
                <span>{advice.name}</span>
              </header>
              <section className="p-2 text-secondary-foreground/60">
                <div className="py-2">
                  <div>{t('advice.reason')}:</div>
                  <div>{advice.description}</div>
                </div>
                <div className="divider-horizontal"></div>
                <div className="py-2">
                  <div>{t('advice.solution')}:</div>
                  {typeof advice.solution === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: wrapLinks(advice.solution) }} />
                  ) : (
                    <div>{advice.solution}</div>
                  )}
                </div>
              </section>
            </div>
          ))}
        </section>
      }
    />
  );
}
