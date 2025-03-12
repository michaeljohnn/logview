import { useCallback, useEffect, useState } from 'react';

import { ParsedLog } from '../../types';
import { logger } from '../../utils/logger';
import useVirtualItemLogMapping from '../useVirtualItemLogMapping';

import type { KeyboardEvent, RefObject } from 'react';

interface UserLineProps {
  keyword: string;
  searchMatchedLogIndexs: number[];
  highlightedLogs: ParsedLog[];
  expandGroups: Set<string>;
  getParentRef: () => RefObject<HTMLDivElement>;
}

export default function useLine(props: UserLineProps) {
  const { keyword, searchMatchedLogIndexs, highlightedLogs, expandGroups, getParentRef } = props;

  const [currentLogIndex, setCurrentLogIndex] = useState(-1);
  // Autoscroll current line into view when currentLineIndex changed
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(-1);
  // Used for shortcut Keydown/Keyup
  const [focusedLineIndex, setFocusedLineIndex] = useState<number>(-1);
  const [matchIndex, setMatchIndex] = useState(0);
  const [lineGroupChainIds, setLineGroupChainIds] = useState<string[]>();

  const parentRef = getParentRef();

  const updateLogGroupId = useCallback(
    (logIndex: number) => {
      if(logIndex < 0 || logIndex === undefined || highlightedLogs.length === 0) return;

      const log = highlightedLogs[logIndex];
      const groupChainIds = log?.group?.id
        ? [...(log?.group?.parentChain || []), log?.group?.id]
        : [...(log?.group?.parentChain || [])];
      setLineGroupChainIds(groupChainIds);
    },
    [highlightedLogs],
  );

  const { virtualItemIndexHighlightedLogIndexMapping, logIndexVirtualIndexMapping } =
    useVirtualItemLogMapping({
      highlightedLogs,
      expandGroups,
    });

  const virtualLineCount = virtualItemIndexHighlightedLogIndexMapping?.size || 0;

  useEffect(() => {
    const nextLineIndex = logIndexVirtualIndexMapping?.get(currentLogIndex)!;

    setCurrentLineIndex(nextLineIndex);
  }, [logIndexVirtualIndexMapping, currentLogIndex]);

  useEffect(() => {
    setFocusedLineIndex(currentLineIndex);
  }, [currentLineIndex]);

  useEffect(() => {
    updateLogGroupId(currentLogIndex);
  }, [highlightedLogs, currentLogIndex]);

  const updateLineState = useCallback(
    (nextMatchIndex: number) => {

      setMatchIndex(nextMatchIndex);

      const nextLogIndex = searchMatchedLogIndexs[nextMatchIndex]!;

      setCurrentLogIndex(nextLogIndex);

      updateLogGroupId(nextLogIndex);
    },
    [searchMatchedLogIndexs],
  );

  const goNextSearchMathLine = useCallback(() => {
    try {
      // has no search result matches
      if (!searchMatchedLogIndexs?.length) {
        setCurrentLineIndex(virtualLineCount);
      }

      let nextMatchIndex = matchIndex + 1;

      if (nextMatchIndex > searchMatchedLogIndexs.length - 1) {
        nextMatchIndex = 0;
      }

      updateLineState(nextMatchIndex);
    } catch (err) {
      console.error(err);
    }
  }, [matchIndex, searchMatchedLogIndexs, virtualLineCount]);

  const goPrevSearchMathLine = useCallback(() => {
    try {
      // has no search result matches
      if (!searchMatchedLogIndexs?.length) {
        setCurrentLineIndex(0);
      }

      let nextMatchIndex = matchIndex - 1;

      if (nextMatchIndex < 0) {
        nextMatchIndex = searchMatchedLogIndexs.length - 1;
      }

      updateLineState(nextMatchIndex);
    } catch (err) {
      console.error(err);
    }
  }, [matchIndex, searchMatchedLogIndexs]);

  useEffect(() => {
    if (keyword) {
      setMatchIndex(-1);
      setCurrentLineIndex(0);
    }
  }, [keyword]);

  const goNextLine = useCallback(() => {
    let nextLineIndex = (focusedLineIndex || currentLineIndex || 0) + 1;

    if (nextLineIndex > highlightedLogs.length - 1) {
      nextLineIndex = 0;
    }

    setCurrentLineIndex(nextLineIndex);
  }, [currentLineIndex, focusedLineIndex, highlightedLogs.length]);

  const goPrevLine = useCallback(() => {
    let nextLineIndex = (focusedLineIndex || currentLineIndex || 0) - 1;

    if (nextLineIndex < 0) {
      nextLineIndex = highlightedLogs.length;
    }

    setCurrentLineIndex(nextLineIndex);
  }, [currentLineIndex, focusedLineIndex, highlightedLogs.length]);

  const keydownListener = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Add ArrowDown shortcut
      if (e.key === 'ArrowDown') {
        e.stopPropagation();
        e.preventDefault();
        logger.debug('ArrowDown was pressed');
        goNextLine();
      }

      // Add ArrowUp shortcut
      if (e.key === 'ArrowUp') {
        e.stopPropagation();
        e.preventDefault();
        logger.debug('ArrowUp was pressed');
        goPrevLine();
      }
    },
    [parentRef?.current, goNextLine, currentLineIndex, focusedLineIndex, highlightedLogs.length],
  );

  useEffect(() => {
    // @ts-ignore Type definition misreported here
    parentRef?.current?.addEventListener('keydown', keydownListener);

    // @ts-ignore Type definition misreported here
    return () => parentRef?.current?.removeEventListener('keydown', keydownListener);
  }, [parentRef?.current, currentLineIndex, focusedLineIndex]);

  return {
    currentLogIndex,
    currentLineIndex,
    lineGroupChainIds,
    matchIndex,
    virtualLineCount,
    virtualItemIndexHighlightedLogIndexMapping,
    goNextSearchMathLine,
    goPrevSearchMathLine,
    setCurrentLogIndex,
    setFocusedLineIndex
  };
}
