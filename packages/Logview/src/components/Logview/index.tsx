import './index.css';

import { useThrottleEffect } from 'ahooks';
import { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { I18nextProvider } from 'react-i18next';

import { useVirtualizer } from '@tanstack/react-virtual';

import useLine from '../../hooks/useLine';
import useSearch from '../../hooks/useSearch';
import i18n from '../../locales';
import Advices from '../Advices/index';
import Line from '../Line';
import OversizeAlert from '../OversizeAlert';
import Split from '../Split';
import TextSelectionBubble from '../TextSelectionBubble';
import Toolbar from '../Toolbar';

import type { Theme, LogAdvice } from '../../types';
// Custom grouping marks
export interface GroupingParams {
  startMark: string;
  endMark: string;
  startRegex: RegExp;
  endRegex: RegExp;
}
export interface LogviewProps {
  logs: string[];
  theme?: Theme;
  width?: number | string;
  height?: number | string;
  currentLogIndex?: number;
  grouping?: GroupingParams;
  toolbarRenderContainer?: Element | undefined | null;
  oversize?: boolean;
  downloadUrl?: string;
  externalUrl?: string;
  style?: CSSProperties;
  lang?: 'zh' | 'en' | 'fr' | 'de' | 'es' | 'ja' | 'ko';
  advices?: LogAdvice[];
  loading?: boolean;
  lineLogParser?: (log: string) => string;
  onTextSelectionChange?: (text: string | undefined) => void;
  renderTextSelectionBubble?: (text: string | undefined) => ReactNode;
  renderRightPanelContent?: () => ReactNode;
  renderGroupName?: (log: string) => string;
  onDownload?: () => void;
}

const SCROLL_THROTTLE_WAIT = 200;

export default function Logview(props: LogviewProps) {
  const {
    logs,
    width = '100%',
    height = 600,
    theme = 'dark',
    currentLogIndex: currentLogIndexProps,
    grouping,
    toolbarRenderContainer,
    oversize = false,
    downloadUrl = '',
    externalUrl = '',
    lang = 'en',
    loading = false,
    style = {},
    advices,
    lineLogParser,
    renderTextSelectionBubble,
    renderRightPanelContent,
    onTextSelectionChange,
    onDownload,
    renderGroupName,
  } = props;

  const logContainerRef = useRef<HTMLDivElement>(null);
  const logContentRef = useRef<HTMLDivElement>(null);
  const virtualContainerRef = useRef<HTMLDivElement>(null);

  const [expandGroups, setExpandGroups] = useState<Set<string>>(new Set());

  const { keyword, onDebounceSearch, searchMatchedLogIndexs, highlightedLogs } = useSearch({
    logs,
    grouping,
    setExpandGroups,
  });

  const {
    currentLineIndex,
    lineGroupChainIds,
    matchIndex,
    virtualLineCount,
    virtualItemIndexHighlightedLogIndexMapping,
    goNextSearchMathLine,
    goPrevSearchMathLine,
    setCurrentLogIndex,
    setFocusedLineIndex,
  } = useLine({
    keyword,
    searchMatchedLogIndexs,
    highlightedLogs,
    expandGroups,
    getParentRef: () => logContainerRef,
  });

  const styles = useMemo(() => {
    return { ...style, width, height };
  }, [width, height, style]);

  const scrollToLine = useCallback((lineIndex: number) => {
    virtualizer.scrollToIndex(lineIndex, { behavior: 'auto', align: 'center' });
  }, []);

  useEffect(() => {
    if (currentLogIndexProps) {
      setCurrentLogIndex(currentLogIndexProps);
    }
  }, [currentLogIndexProps]);

  // auto scroll
  useThrottleEffect(
    () => {
      // scroll to the first advice while advices exist
      if (advices?.length) {
        const firstAdvice = advices?.[0];
        if (firstAdvice) {
          const logIndex =
            typeof firstAdvice.startLineNum === 'number'
              ? firstAdvice.startLineNum
              : firstAdvice.startLineNum[0];
          logIndex && setCurrentLogIndex(logIndex);
        }

        return;
      }

      // scroll to the last line while advices not exist
      setTimeout(() => {
        scrollToLine(logs.length);
      }, SCROLL_THROTTLE_WAIT);
    },
    [logs.length],
    { wait: SCROLL_THROTTLE_WAIT },
  );

  const virtualizer = useVirtualizer({
    count: virtualLineCount,
    getScrollElement: () => virtualContainerRef.current,
    estimateSize: () => 45,
    overscan: 80,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    scrollToLine(currentLineIndex);
  }, [currentLineIndex]);

  useEffect(() => {
    setExpandGroups((set) => {
      lineGroupChainIds?.forEach((id) => set.add(id));
      return new Set(set);
    });
  }, [lineGroupChainIds]);

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang]);

  const toobarContent = (
    <Toolbar
      matchIndex={matchIndex}
      matchCount={searchMatchedLogIndexs.length}
      onDebounceSearch={onDebounceSearch}
      goNextSearchMathLine={goNextSearchMathLine}
      goPrevSearchMathLine={goPrevSearchMathLine}
      logContainerRef={logContainerRef}
      externalUrl={externalUrl}
      downloadUrl={downloadUrl}
      searchMatchedLogIndexs={searchMatchedLogIndexs}
      onDownload={onDownload}
    />
  );

  const showRightPanel = !!(advices?.length || renderRightPanelContent);

  return (
    <I18nextProvider i18n={i18n}>
      <div ref={logContainerRef} style={styles} className="savorui-logview-container">
        <Split
          className={`split flex bg-background text-foreground/70 overflow-hidden w-full h-full ${theme}`}
          sizes={[75, 25]}
        >
          <div className="flex-1 h-full">
            {oversize && <OversizeAlert downloadUrl={downloadUrl} />}
            <div
              className={`relative h-full`}
              // enable div to be focusable
              tabIndex={1}
            >
              {toolbarRenderContainer ? (
                createPortal(toobarContent, toolbarRenderContainer)
              ) : (
                <div className="absolute right-0 top-0 z-10 p-2">
                  {toobarContent}
                </div>
              )}
              <div
                ref={virtualContainerRef}
                className={`virtual-container text-mono overflow-y-auto contain-strict p-4 box-border
        text-xs leading-relax h-full w-full`}
              >
                <div
                  style={{
                    height: virtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-full"
                    style={{
                      transform: `translateY(${virtualItems[0]?.start ?? 0}px)`,
                    }}
                    ref={logContentRef}
                  >
                    {virtualItems.map((virtualRow) => {
                      const highlightedIndex = virtualItemIndexHighlightedLogIndexMapping?.get(
                        virtualRow.index,
                      );
                      const log = highlightedLogs[highlightedIndex!];

                      if (!log) return null;

                      return (
                        <Line
                          key={virtualRow.key}
                          virtualRowIndex={virtualRow.index}
                          measureElement={virtualizer.measureElement}
                          log={log}
                          advices={advices}
                          isCurrentLine={currentLineIndex === virtualRow.index}
                          isFolded={!!log.group?.id && expandGroups.has(log.group?.id)}
                          lineLogParser={lineLogParser}
                          renderGroupName={renderGroupName}
                          onClick={(_lineIndex) => {
                            setFocusedLineIndex(_lineIndex);
                          }}
                          onFoldClick={(groupId) => {
                            setExpandGroups((set) => {
                              log.group && set.delete(groupId);
                              return new Set(set);
                            });
                          }}
                          onUnfoldClick={(groupId) => {
                            setExpandGroups((set) => {
                              log.group && set.add(groupId);
                              return new Set(set);
                            });
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
              <TextSelectionBubble
                renderTextSelectionBubble={renderTextSelectionBubble}
                targetRef={logContentRef}
                onTextSelectionChange={onTextSelectionChange}
              />
            </div>
          </div>
          {showRightPanel && (
            <div className="w-[260px] lv-border-l px-1 py-2 overflow-auto flex flex-col gap-1 h-full box-border justify-start">
              {renderRightPanelContent?.()}
              {!!advices?.length && (
                <Advices
                  advices={advices}
                  onChange={(advice) => {
                    const [startLineNum] = Array.isArray(advice.startLineNum)
                      ? advice.startLineNum
                      : [advice.startLineNum];
                    setCurrentLogIndex(startLineNum!);
                  }}
                />
              )}
            </div>
          )}
        </Split>
        {loading && (
          <div className="spin-container">
            <span className="spin-container-text">{i18n.t('spinTips')}</span>
          </div>
        )}
      </div>
    </I18nextProvider>
  );
}
