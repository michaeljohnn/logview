import './index.css';

import ansiHTML from 'ansi-html';
import { LegacyRef, memo, useCallback, useMemo } from 'react';

import UnfoldIcon from '../../icons/Unfold';
import { getLineIndentation } from '../../utils/line';
import { formateDuration } from '../../utils/time';
import LineNumber from '../LineNumber';

import type { ParsedLog, LogAdvice } from '../../types';

interface LineProps {
  measureElement: LegacyRef<HTMLDivElement>;
  virtualRowIndex: number;
  log: ParsedLog;
  advices?: LogAdvice[];
  isCurrentLine: boolean;
  isFolded: boolean;
  lineLogParser?: (log: string) => string;
  onFoldClick: (groupId: string) => void;
  onUnfoldClick: (groupId: string) => void;
  onClick?: (lineIndex: number) => void;
  renderGroupName?: (log: string) => string;
}

const INDENT_SPACE = 24;

function Line(props: LineProps) {
  const {
    measureElement,
    virtualRowIndex,
    log,
    advices,
    isCurrentLine,
    isFolded,
    lineLogParser,
    onFoldClick,
    onUnfoldClick,
    onClick,
    renderGroupName,
  } = props;

  const indentation = getLineIndentation(log);
  const foldIconClassName = `cursor-pointer w-[${INDENT_SPACE - 4}px] h-[${INDENT_SPACE - 4}px]`;

  const html = useMemo(() => {
    try {
      let __html = log.detail;

      if (log.group?.isStart && renderGroupName) {
        __html = renderGroupName(__html);
      }

      if (lineLogParser) {
        __html = lineLogParser(__html);
      } else {
        __html = ansiHTML(__html);
      }

      return __html;
    } catch (error) {
      return log.detail;
    }
  }, [log.detail, log.group?.isStart, lineLogParser, renderGroupName]);

  const _onClick = useCallback(() => {
    onClick?.(virtualRowIndex);
  }, [onClick, virtualRowIndex]);

  const { isAdviceLine, adviceIndex } = useMemo(() => {
    if (!advices)
      return {
        isAdviceLine: false,
        adviceIndex: -1,
      };
    let matchIndex = -1;
    const match = advices.some((advice, index) => {
      if (
        Array.isArray(advice.startLineNum)
          ? advice.startLineNum.includes(log.index)
          : advice.startLineNum === log.index
      ) {
        matchIndex = index;
        return true;
      }
      return false;
    });

    return {
      isAdviceLine: match,
      adviceIndex: matchIndex,
    };
  }, [log, advices]);

  return (
    <div
      data-index={virtualRowIndex}
      data-logindex={log.index}
      data-islinecontainer
      ref={measureElement}
      onClick={_onClick}
    >
      <div
        className={`flex items-start p-1 gap-4 hover:text-foreground 
          ${isCurrentLine ? 'current-log-line' : ''}`}
      >
        <LineNumber lineNo={log.index + 1} />
        <div
          className={`flex justify-between flex-1 ${isAdviceLine ? 'bg-error/50' : ''}`}
        >
          <div
            className={`flex items-center gap-2`}
            style={{
              paddingLeft: `${indentation * INDENT_SPACE}px`,
            }}
          >
            {log.group?.isStart && (
              <div className="flex justify-center items-center">
                {isFolded ? (
                  <UnfoldIcon
                    className={foldIconClassName}
                    onClick={() => {
                      onFoldClick(log.group?.id!);
                    }}
                  />
                ) : (
                  <UnfoldIcon
                    className={`-rotate-90 ${foldIconClassName}`}
                    onClick={() => {
                      onUnfoldClick(log.group?.id!);
                    }}
                  />
                )}
              </div>
            )}
            <pre
              className="m-0 p-0 whitespace-pre-wrap max-w-full break-all"
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
          </div>
          {isAdviceLine && (
            <span
              className="text-white bg-error text-xs select-none rounded-full min-w-4 h-4 
            flex items-center justify-center mx-1"
            >
              {adviceIndex + 1}
            </span>
          )}
          {!!Number(log.group?.duration) && (
            <span className="savorui-logview-duration select-none">
              {formateDuration(log.group?.duration)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// It's important to avoid unnecessary duplicate rendering, as this is crucial for improving rendering performance.
export default memo(Line, (prevProps, nextProps) => {
  try {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  } catch (err) {
    console.error('Line memo diff', err);
    return false;
  }
});
