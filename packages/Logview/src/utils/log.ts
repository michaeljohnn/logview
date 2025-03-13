import { GroupingParams } from '../components/Logview';
import { logger } from '../utils/logger';
import { isFoldedLine } from './line';

import type { ParsedLog, GroupDuration } from '../types';

const DEFAULT_GROUP_START = '::group::';
const DEFAULT_GROUP_END = '::endgroup::';

const DEFAULT_GROUP_START_REGEX = /^::group::([^:\n]*)(::([0-9]+))?$/;
const DEFAULT_GROUP_END_REGEX = /^::endgroup::([0-9]+)?$/;

interface ParseOptions {
  grouping: GroupingParams | undefined;
}

/**
 * Grouping Log Detail Format Sample:
 *  '::group::this is log 4::1732772136198',
 *  'this is log 5',
 *  '::endgroup::1732772136291',
 */
export function parseLog(log: string, { grouping }: ParseOptions) {
  try {
    const {
      startMark = DEFAULT_GROUP_START,
      endMark = DEFAULT_GROUP_END,
      startRegex = DEFAULT_GROUP_START_REGEX,
      endRegex = DEFAULT_GROUP_END_REGEX,
    } = grouping || {};

    if (log?.startsWith(startMark)) {
      const [, detail, , start] = log.match(startRegex) || [];

      return {
        isGroupStart: true,
        detail,
        duration: {
          start: Number(start),
        },
      };
    } else if (log?.startsWith(endMark)) {
      const [, end] = log.match(endRegex) || [];

      return {
        isGroupEnd: true,
        duration: {
          end: Number(end),
        },
      };
    }
  } catch (err) {
    console.error(err);
  }

  return {
    detail: log,
  };
}


const LOG_ERROR_MATCHES = ['\x1b[31m', 'ERROR', 'error', 'Error'];
const LOG_WARNING_MATCHES = ['\x1b[33m', 'WARNING', 'warning', 'Warning'];

export function getLogLineType(logLine: string): ParsedLog['type'] {
  if (!!LOG_ERROR_MATCHES.find((match) => logLine.includes(match))) {
    return 'error';
  }

  if (!!LOG_WARNING_MATCHES.find((match) => logLine.includes(match))) {
    return 'warning';
  }

  return 'info';
}

export function parseLogs(logs: string[], { grouping }: ParseOptions): { logs: ParsedLog[]; errorLineGroupIdSet: Set<string> }  {
  const groupStack: string[] = [];
  let groupIndex = 0;

  const parsedLogs: ParsedLog[] = [];

  const groupDurationMap = new Map<string, GroupDuration>();

  const errorLineGroupIdSet = new Set<string>();

  // ignore groupend line
  let logLineIndex = 0;

  logs.forEach((log) => {
    const { detail = '', isGroupStart, isGroupEnd, duration } = parseLog(log, { grouping });

    if (isGroupStart) {
      groupStack.push(`${groupIndex++}`);
    }

    const currentGroupId = groupStack[groupStack.length - 1];

    if (isGroupStart && currentGroupId) {
      groupDurationMap.set(currentGroupId, { start: duration.start, startLineIndex: logLineIndex });
    }

    const logType = getLogLineType(log);

    if (logType === 'error' && groupStack.length > 0) {
      // add group chain to errorLineGroupIdSet
      groupStack.forEach((groupId) => {
        errorLineGroupIdSet.add(groupId);
      });
    }


    const obj: ParsedLog = {
      index: logLineIndex,
      type: logType,
      group: currentGroupId
        ? {
            id: currentGroupId,
            parentChain: groupStack.slice(0, groupStack.length - 1),
          }
        : undefined,
      detail,
    };

    if (isGroupEnd && currentGroupId) {
      groupStack.pop();
      const _duration = groupDurationMap.get(currentGroupId);
      const diff = Math.floor(duration?.end - _duration?.start!);

      groupDurationMap.set(currentGroupId, {
        ..._duration!,
        end: duration?.end,
        diff,
      });

      // update durtion of the start line in the group
      const starLine = parsedLogs[_duration!.startLineIndex]?.group;
      if (starLine) {
        starLine.duration = diff;
      }
    }

    if (obj.group) {
      obj.group.isStart = isGroupStart;
      obj.group.isEnd = isGroupEnd;
    }

    // Ignore groupend line
    if (!obj.group?.isEnd) {
      parsedLogs.push(obj);
      logLineIndex++;
    }
  });

  return { logs: parsedLogs, errorLineGroupIdSet };
}

interface GetVirtualItemIndexLogMappingProps {
  highlightedLogs: ParsedLog[];
  expandGroups: Set<string>;
}

export function getVirtualItemIndexLogMapping(props: GetVirtualItemIndexLogMappingProps) {
  const { highlightedLogs, expandGroups } = props;
  const virtualIndexLogMap = new Map<number, number>();
  const logIndexVirtualIndexMap = new Map<number, number>();

  let virtualItemIndex = 0;

  logger.debug('[useLine] getVirtualItemIndexLogMapping', highlightedLogs.length);

  highlightedLogs.forEach((log, index) => {
    if (!isFoldedLine(log, expandGroups)) {
      virtualIndexLogMap.set(virtualItemIndex, index);
      logIndexVirtualIndexMap.set(log.index, virtualItemIndex);
      virtualItemIndex++;
    }
  });

  return { virtualIndexLogMap, logIndexVirtualIndexMap };
}
