# @savorui/logview

A high-performance UI log component with virtual scrolling, search functionality, and collapsible log sections, capable of handling large-scale datasets efficiently. 

<img width="1308" alt="image" src="https://github.com/user-attachments/assets/f14a654c-4211-4152-af41-47e0127e39a9" />


## Install
```
npm install --save @savorui/logview
```

## Dev
```
tnpm i
npm run dev
```

## Usage
```tsx
import Logview from '@savorui/logview';

<Logview logs={logs_simple} theme='dark' />
```

## API
```tsx
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

export interface GroupingParams {
  startMark: string;
  endMark: string;
  startRegex: RegExp;
  endRegex: RegExp;
}
```
