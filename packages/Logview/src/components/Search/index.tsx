import { ChevronDownIcon, ChevronUpIcon, SearchIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { logger } from '../../utils/logger';

import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

interface SearchProps {
  className?: string;
  matchIndex?: number;
  matchCount?: number;
  // Used for Cmd/Ctrl+F shortcut
  getParentRef: () => RefObject<HTMLDivElement>;
  onChange?: (keyword: string) => void;
  onEnterPress?: (keyword: string) => void;
  scrollToPrev: () => void;
  scrollToNext: () => void;
}

export default function Search(props: SearchProps) {
  const {
    className = '',
    matchIndex = 0,
    matchCount = 0,
    onChange,
    onEnterPress,
    getParentRef,
    scrollToNext,
    scrollToPrev,
  } = props;

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);
  const parentRef = getParentRef();

  const [keyword, setKeyword] = useState('');

  const _onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
      setKeyword(e.target.value);
    },
    [onChange],
  );

  const _onEnterPress = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.type === 'keydown' && e.key === 'Enter') {
        onEnterPress?.(keyword);
      }
    },
    [keyword, onEnterPress],
  );

  const keydownListener = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      // Add Cmd/Ctrl+F shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.stopPropagation();
        e.preventDefault();
        logger.debug('Cmd/Ctrl + F was pressed');
        inputRef.current?.focus();
        inputRef.current?.select();
      }

      // Add Cmd/Ctrl+ArrowDown shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowDown') {
        e.stopPropagation();
        e.preventDefault();
        logger.debug('Cmd/Ctrl + ArrowDown was pressed');
        scrollToNext();
      }

      // Add Cmd/Ctrl+ArrowUp shortcut
      if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
        e.stopPropagation();
        e.preventDefault();
        logger.debug('Cmd/Ctrl + ArrowUp was pressed');
        scrollToPrev();
      }
    },
    [parentRef?.current, scrollToNext, scrollToPrev],
  );

  useEffect(() => {
    // @ts-ignore Type definition misreported here
    parentRef?.current?.addEventListener('keydown', keydownListener);

    // @ts-ignore Type definition misreported here
    return () => parentRef?.current?.removeEventListener('keydown', keydownListener);
  }, [parentRef?.current, scrollToNext, scrollToPrev]);

  return (
    <div
      className={`search-container flex gap-1 items-center p-1 rounded-md bg-foreground/10 px-1 py-1 transition-all duration-1000 ${className}`}
    >
      <SearchIcon size={14} />
      <input
        ref={inputRef}
        type="text"
        placeholder={t('search')}
        className="bg-transparent border-0 text-foreground focus-visible:outline-none flex-1 w-[80px]"
        onChange={_onChange}
        onKeyDown={_onEnterPress}
      />
      <div className="text-xs text-foreground/40 flex gap-1 items-center justify-end min-w-[60px]">
        {!!keyword && (
          <>
            <span>{matchCount === 0 ? '0/0' : `${matchIndex + 1}/${matchCount}`}</span>
            <div className="flex items-center gap-1">
              <ChevronUpIcon size={14} className="cursor-pointer" onClick={scrollToPrev} />
              <ChevronDownIcon size={14} className="cursor-pointer" onClick={scrollToNext} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
