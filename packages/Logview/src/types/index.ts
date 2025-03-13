import type { ReactNode } from 'react';

export interface ParsedLog {
  index: number;
  type: 'error' | 'warning' | 'info';
  group:
    | {
        id: string; // current level group id
        parentChain: string[]; // parent group id chain
        isStart?: boolean;
        isEnd?: boolean;
        duration?: number;
      }
    | undefined;
  detail: string;
  isSearchMatched?: boolean;
}

export interface GroupDuration {
  startLineIndex: number;
  start: number;
  end?: number;
  diff?: number;
}

export type Theme = 'dark' | 'light';

export interface LogAdvice {
  description: ReactNode;
  enableRag: boolean;
  endLineNum: number;
  endRegex: string | null;
  errTypeI18n: string;
  id: number;
  name: string;
  rangeMatch: boolean;
  solution: ReactNode;
  startLineNum: number | number[];
  startRegex: string | null;
  type: string;
}

export type Status = 'success' | 'warning' | 'error' | 'normal';
