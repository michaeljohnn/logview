import { useDebounceFn, useThrottleEffect } from 'ahooks';
import { useEffect, useState } from 'react';

import { GroupingParams } from '../../components/Logview';
import { ParsedLog } from '../../types';
import { parseLogs } from '../../utils/log';
import { logger } from '../../utils/logger';
import { searchByKeyword } from '../../utils/search';

interface UseSearchProps {
  logs: string[];
  grouping: GroupingParams | undefined;
  setExpandGroups: (set: Set<string> | ((set: Set<string>) => Set<string>)) => void;
}

export default function useSearch(props: UseSearchProps) {
  const { logs, grouping, setExpandGroups } = props;

  const [searchMatchedLogIndexs, setSearchMatchedLogIndexs] = useState<number[]>([]);
  const [highlightedLogs, setHighlightedLogs] = useState<ParsedLog[]>([]);
  const [keyword, setKeyword] = useState('');
  const [parsedLogs, setParsedLogs] = useState<ParsedLog[]>([]);

  useThrottleEffect(
    () => {
      const { logs: newParsedLogs, errorLineGroupIdSet } = parseLogs(logs, { grouping });

      setExpandGroups((set) => {
        return new Set([...set, ...errorLineGroupIdSet]);
      });

      logger.debug('updateParsedLogs', logs.length);

      setParsedLogs(newParsedLogs);
    },
    [logs],
    { wait: 200 },
  );

  useEffect(() => {
    const { matchedLogIndexs, highlightedLogs: _highlightedLogs } = searchByKeyword(
      keyword,
      parsedLogs,
    );

    setSearchMatchedLogIndexs(matchedLogIndexs);
    setHighlightedLogs(_highlightedLogs);
  }, [keyword, parsedLogs]);

  const { run: onDebounceSearch, cancel } = useDebounceFn(
    (_keyword: string) => {
      cancel();
      setKeyword(_keyword);
    },
    { wait: 500 },
  );

  return {
    keyword,
    searchMatchedLogIndexs,
    highlightedLogs,
    parsedLogs,
    onDebounceSearch,
    setHighlightedLogs,
  };
}
