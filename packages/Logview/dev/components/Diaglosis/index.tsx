import React, { useState } from 'react';

import Logview, { RightPanelItem } from '../../../src';
import logs_2level_nested from '../../mock/logs_2level_nested';
import logs_ansi_escapes_running from '../../mock/logs_ansi_escapes_running';

let mounted = false;

// async function sleep(ms: number) {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, ms);
//   });
// }

interface DiaglosisBubbleProps {
  text: string | undefined;
  onChange?: (text: string) => void;
}

function DiaglosisBubble(props: DiaglosisBubbleProps) {
  const { text, onChange } = props;
  return (
    <div
      className="te-bg-amber-600 te-p-2 te-cursor-pointer te-text-white te-rounded-lg te-text-sm"
      title={text}
      onClick={() => onChange?.(`AI Diaglosis: ${text}`)}
    >
      Trigger AI Diaglosis
    </div>
  );
}

export default function Diaglosis() {

  const [selectText, setSelectText] = useState<string>();
  const [rightContent, setRightContent] = useState<string>();

  return (
    <div className="te-w-[1000px] te-pl-52">
      <div id="toobar-container"></div>
      <Logview
        // logs={logs}
        logs={logs_2level_nested}
        currentLogIndex={482}
        // grouping={{
        //   startMark: '[cloudbuild] [stage:start]',
        //   endMark: '[cloudbuild] [stage:end]',
        //   startRegex: /^\[cloudbuild\] \[stage:start\] ([^:\n]*)(:([0-9.]+))?$/,
        //   endRegex: /^\[cloudbuild\] \[stage:end\] [^:\n]+:[^:\n]+end=([0-9.]+)[^:\n]+$/,
        // }}
        theme="light"
        // lang="zh"
        oversize={true}
        // toolbarRenderContainer={document.getElementById('toobar-container')}
        downloadUrl='/download'
        externalUrl='/external'
        // renderTextSelectionBubble={() => (
        //   <DiaglosisBubble text={selectText} onChange={(text) => setRightContent(text)} />
        // )}
        // onTextSelectionChange={(text) => {
        //   console.log('--- text ---', text);
        //   setSelectText(text);
        // }}
        // renderRightPanelContent={() => (
        //   // <div className="te-py-4">this is custom content {rightContent}</div>
        //   <RightPanelItem type='normal' title={'智能诊断'} content={rightContent || 'this is custom content'} status='normal' />
        // )}
      />
    </div>
  );
}
