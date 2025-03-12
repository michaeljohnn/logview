import { ParsedLog } from '../types';

export function searchByKeyword(keyword: string, parsedLogs: ParsedLog[]) {
  const matchedLogIndexs: number[] = [];

  let highlightedLogs: ParsedLog[];

  if (keyword) {
    highlightedLogs = parsedLogs.map((log, logIndex) => {
      if (log.detail.toLowerCase().includes(keyword.toLowerCase())) {
        const highlightedLogDetail = log.detail.replaceAll(
          new RegExp(keyword, 'gi'),
          `<span class="savorui-search-matched">${keyword}</span>`,
        );

        matchedLogIndexs.push(logIndex);

        return {
          ...log,
          detail: highlightedLogDetail,
          isSearchMatched: true,
        };
      }
      return log;
    });
  } else {
    highlightedLogs = parsedLogs;
  }

  return { matchedLogIndexs, highlightedLogs };
}
