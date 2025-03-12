import { memo } from 'react';

import type { Status } from '../../types';

interface StatusPingProps {
  status?: Status;
}

function StatusPing(props: StatusPingProps) {
  const { status = 'normal' } = props;
  const bgColor = status === 'error' ? 'bg-error' : 'bg-normal';
  return (
    <span className="relative flex h-3 w-3">
      <span className="animaping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${bgColor}`}></span>
    </span>
  );
}

export default memo(StatusPing);
