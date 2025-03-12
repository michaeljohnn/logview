import {
  ArrowDownToLineIcon, ArrowUpToLineIcon, CircleArrowOutUpRightIcon, CloudDownloadIcon,
  FullscreenIcon
} from 'lucide-react';

import Search from '../Search/index';

interface ToolbarProps {
  logContainerRef: React.RefObject<HTMLDivElement>;
  downloadUrl?: string;
  externalUrl?: string;
  searchMatchedLogIndexs: number[];
  matchIndex: number;
  matchCount: number;
  onDebounceSearch: (keyword: string) => void;
  goNextSearchMathLine: () => void;
  goPrevSearchMathLine: () => void;
  onDownload?: () => void;
}

export default function Toolbar(props: ToolbarProps) {
  const {
    matchIndex,
    matchCount,
    onDebounceSearch,
    goNextSearchMathLine,
    goPrevSearchMathLine,
    logContainerRef,
    downloadUrl,
    externalUrl,
    onDownload,
  } = props;
  return (
    <div
      className="toolbar-container flex items-center justify-end gap-2 bg-background rounded-md"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Search
        matchIndex={matchIndex}
        matchCount={matchCount}
        onChange={onDebounceSearch}
        onEnterPress={goNextSearchMathLine}
        getParentRef={() => logContainerRef}
        scrollToNext={goNextSearchMathLine}
        scrollToPrev={goPrevSearchMathLine}
      />
      <ArrowUpToLineIcon className="cursor-pointer" size={16} onClick={goPrevSearchMathLine} />
      <ArrowDownToLineIcon className="cursor-pointer" size={16} onClick={goNextSearchMathLine} />
      {!!(downloadUrl || onDownload) && (
        <CloudDownloadIcon
          className="cursor-pointer"
          size={16}
          onClick={() => {
            if (downloadUrl) {
              window.open(downloadUrl);
            } else {
              onDownload?.();
            }
          }}
        />
      )}
      {externalUrl && (
        <CircleArrowOutUpRightIcon
          className="cursor-pointer"
          size={16}
          onClick={() => {
            window.open(externalUrl);
          }}
        />
      )}
      <FullscreenIcon
        className="cursor-pointer"
        size={16}
        onClick={() => {
          if (!document.fullscreenElement) {
            logContainerRef.current?.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
      />
    </div>
  );
}
