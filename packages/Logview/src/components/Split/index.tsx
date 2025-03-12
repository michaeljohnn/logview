import { Children, ReactNode, useEffect, useRef } from 'react';
import splitjs from 'split.js';

import ErrorBoundary from '../ErrorBoundary';

interface SplitProps {
  sizes?: number[];
  gutterSize?: number;
  minSize?: number;
  snapOffset?: number;
  direction?: 'horizontal' | 'vertical';
  cursor?: string;
  children: ReactNode;
  className?: string;
}

function SplitImpl(props: SplitProps) {
  const { children, className = '', ...rest } = props;

  const ref = useRef<HTMLDivElement>(null);
  const initRef = useRef(false);
  const splitInstanceRef = useRef<ReturnType<typeof splitjs>>();

  useEffect(() => {
    const _children = Array.from(ref.current?.children || []) as HTMLElement[];

    if (Children.toArray(children).length < 2) {
      splitInstanceRef.current?.destroy();
      splitInstanceRef.current = undefined;
      initRef.current = false;
      return;
    }

    try {
      if (initRef.current) return;
      initRef.current = true;
      splitInstanceRef.current = splitjs(_children, {
        ...rest,
      });

    } catch (err) {
      console.error(err);
    }
  }, [children]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export default function (props: SplitProps) {
  return (
    <ErrorBoundary>
      <SplitImpl {...props} />
    </ErrorBoundary>
  );
}
