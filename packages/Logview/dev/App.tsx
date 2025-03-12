import './App.css';

import { useState } from 'react';

import Logview from '../src';
import logs_grouping from './mock/logs_2level_nested';
import logs_long_list from './mock/logs_bigdata';
import logs_simple from './mock/logs_simple';

const advices = [
  {
    id: 80,
    name: 'optionsBuild',
    description: 'The dependency version number is not configured',
    solution: 'Please see https://github.com/michaeljohnn',
    type: 'user',
    errTypeI18n: 'dependency.version.is.missing',
    startRegex:
      "'dependencies.dependency.version' for .*:jar is missing..*/pom.xml, line .*, column .*|.*dependencies.dependency.version.* for .*:jar is missing..* line .*, column .*|Failed to execute goal on project .* Could not resolve dependencies for project|Malformed POM .*pom.xml: expected|Non-parseable POM .*Unrecognised tag|'dependencies.dependency.version' for .*:jar must be a valid version|.*ERROR.* The project .*pom.xml\\) has 1 error|.*FATAL.* Non-parseable POM .*pom.xml: Duplicated tag",
    endRegex: null,
    rangeMatch: false,
    startLineNum: 1,
    endLineNum: 2,
    enableRag: false,
  },
  {
    id: 165,
    name: 'optionsBuild',
    description: 'Invalid pom',
    solution: 'Please see https://github.com/michaeljohnn',
    type: 'user',
    errTypeI18n: 'maven.pom.invalid',
    startRegex: 'ERROR.* Some problems were encountered while processing the POMs',
    endRegex: null,
    rangeMatch: false,
    startLineNum: 7,
    endLineNum: -1,
    enableRag: false,
  },
]

const LOCAL_KEY = 'savorui_logview_demo_type';

export default function App() {
  const cacheType = localStorage.getItem(LOCAL_KEY) || 'dark';
  const [demoType, setDemoType] = useState(cacheType);

  const SwitchButton = ({ type }: { type: string }) => {
    return <button onClick={() => {
      setDemoType(type)
      localStorage.setItem(LOCAL_KEY, type);
    }} className={`${demoType === type && 'active'}`}>{type.toUpperCase()}</button>
  }

  return <div>
    <div className='pb-4 gap-2 flex items-center'>
      <SwitchButton type='dark' />
      <SwitchButton type='light' />
      <SwitchButton type='long_list' />
      <SwitchButton type='grouping' />
      <SwitchButton type='diagnosis' />
      <SwitchButton type='custom_right_panel' />
      <SwitchButton type='text_selection' />
    </div>
    <div>
      {demoType === 'dark' && <Logview logs={logs_simple} theme='dark' />}
      {demoType === 'light' && <Logview logs={logs_simple} theme='light' />}
      {demoType === 'long_list' && <Logview logs={logs_long_list} theme='dark' />}
      {demoType === 'grouping' && <Logview logs={logs_grouping} theme='dark' />}
      {demoType === 'diagnosis' && <Logview
        logs={logs_grouping}
        theme='dark'
        advices={advices}
      />}
      {demoType === 'custom_right_panel' && <Logview
        logs={logs_simple}
        theme='dark'
        renderRightPanelContent={() => <div className='p-2'>
          <h2>Custom Right Panel Title</h2>
          <p>This is a custom right panel content.</p>
        </div>}
      />}
      {demoType === 'text_selection' && <Logview
        logs={logs_simple}
        theme='dark'
        renderTextSelectionBubble={(text) => <div onClick={(e) => e.stopPropagation()} className='border-solid border-red-200 p-2 bg-slate-300 text-slate-900 cursor-pointer'>Text Selection Bubble</div>}
      />}
    </div>
  </div>
}