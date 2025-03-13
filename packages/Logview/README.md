# @savorui/logview
A high-performance UI log component with virtual scrolling, search functionality, and collapsible log sections, capable of handling large-scale datasets efficiently.

<img width="1308" alt="image" src="https://github.com/user-attachments/assets/f14a654c-4211-4152-af41-47e0127e39a9" />


## Install
```shell
npm install --save @savorui/logview
```


## Usage

```tsx
import Logview from '@savorui/logview';

const logs = ['hello world'];

<Logview logs={logs} theme='dark' />
```


## Dev
```
tnpm i
npm run dev
```

## API

| Name |	Type |	Description |	Required |
| --- | --- | --- | --- |
| logs | string[] | An array of log strings to be displayed. | Yes |
| theme | Theme | The theme to be applied to the log view. | No |
| width | number \| string | The width of the log view component. Can be a number or a string (e.g., "100%", "500px"). | No |
| height | number \| string | The height of the log view component. Can be a number or a string (e.g., "100%", "500px"). | No |
| currentLogIndex | number | The index of the currently selected log entry. | No |
| grouping | GroupingParams | Parameters for grouping logs. | No |
| toolbarRenderContainer| Element \| undefined \| null | A custom container element for rendering the toolbar. | No |
| oversize | boolean | Indicates whether the log view should handle oversize content. | No |
| downloadUrl | string | The URL for downloading logs. | No |
| externalUrl | string | An external URL related to the logs. | No |
| style | CSSProperties | Custom CSS styles to be applied to the log view component. | No |
| lang | 'zh' \| 'en' \| 'fr' \| 'de' \| 'es' \| 'ja' \| 'ko' | The language for the log view component. Supported languages include Chinese, English, French, German, Spanish, Japanese, and Korean. | No |
| advices | LogAdvice[] | An array of log advice objects. | No |
| loading | boolean | Indicates whether the log view is in a loading state. | No |
| lineLogParser | (log: string) => string | A function to parse each log line. | No |
| onTextSelectionChange | (text: string \| undefined) => void | A callback function that is triggered when the text selection changes. | No |
| renderTextSelectionBubble | (text: string \| undefined) => ReactNode | A function to render a custom bubble for text selection. | No |
| renderRightPanelContent | () => ReactNode | A function to render custom content in the right panel. | No |
| renderGroupName | (log: string) => string | A function to render a custom group name for each log entry. | No |
| onDownload | () => void | A callback function that is triggered when the download button is clicked. | No |