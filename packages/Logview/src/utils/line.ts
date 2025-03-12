import type { ParsedLog } from '../types';

/**
 * Whether the current row is collapsed. Rows in the default group (except the first row) are collapsed
 */
export function isFoldedLine(log: ParsedLog, expandedGroups: Set<string>) {
  const { group: { id, parentChain = [], isStart } = {} } = log;

  // Not in any group, expanded by default
  if (!id) return false;

  const isParaentGroupFolded = parentChain.some((chainedId) => !expandedGroups.has(chainedId));

  // Fold as long as there is a parent Group fold
  if (isParaentGroupFolded) return true;

  // The start row of the current Group does not collapse
  if (isStart) return false;

  // Determines whether the current row is expanded
  if (expandedGroups.has(id)) return false;

  // In other cases, the default fold
  return true;
}

export function getLineIndentation(log: ParsedLog) {
  const isInGroup = !!log.group?.id;
  const isFirstLineInGroup = !!log.group?.isStart;
  const parentChainLen = log.group?.parentChain.length || 0;

  if (isInGroup) {
    if (isFirstLineInGroup) {
      return parentChainLen;
    }
    return parentChainLen + 1;
  }

  return 0;
}
