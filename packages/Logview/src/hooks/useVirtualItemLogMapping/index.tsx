// virtual list item and logs mapping
import { useEffect, useState } from 'react';

import { getVirtualItemIndexLogMapping } from '../../utils/log';

import type { ParsedLog } from '../../types';

interface UseVirtualItemLogMappingProps {
  highlightedLogs: ParsedLog[];
  expandGroups: Set<string>;
}

export default function useVirtualItemLogMapping(props: UseVirtualItemLogMappingProps) {
  const { highlightedLogs, expandGroups } = props;

  const [
    virtualItemIndexHighlightedLogIndexMapping,
    setVirtualItemIndexHighlightedLogIndexMapping,
  ] = useState<Map<number, number>>();

  const [logIndexVirtualIndexMapping, setLogIndexVirtualIndexMapping] =
    useState<Map<number, number>>();

  useEffect(() => {
    const { virtualIndexLogMap, logIndexVirtualIndexMap } = getVirtualItemIndexLogMapping({
      highlightedLogs,
      expandGroups,
    });
    setVirtualItemIndexHighlightedLogIndexMapping(virtualIndexLogMap);
    setLogIndexVirtualIndexMapping(logIndexVirtualIndexMap);
  }, [highlightedLogs, expandGroups]);

  return {
    virtualItemIndexHighlightedLogIndexMapping,
    logIndexVirtualIndexMapping,
  };
}
