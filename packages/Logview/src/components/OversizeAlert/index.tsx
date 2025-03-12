import { CircleAlertIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function OversizeAlert({ downloadUrl }: { downloadUrl: string }) {
  const [visible, setVisible] = useState(true);
  const { t } = useTranslation();

  if (!visible) return null;

  return (
    <section className="bg-background z-10 text-foreground text-xs p-2 flex justify-between items-center lv-border-b">
      <div className="flex items-center gap-2">
        <CircleAlertIcon size={16} color="#facc15" />
        <span>{t('log.oversize.tip')}</span>
        <span
          className="cursor-pointer text-link"
          onClick={() => window.open(downloadUrl)}
        >
          {t('log.oversize.link')}
        </span>
      </div>
      <XIcon
        color="#a8a29e"
        size={16}
        className="cursor-pointer"
        onClick={() => setVisible(false)}
      />
    </section>
  );
}
