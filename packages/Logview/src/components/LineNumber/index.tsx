interface LineNumberProps {
  lineNo: number;
}

export default function LineNumber(props: LineNumberProps) {
  const { lineNo } = props;

  return (
    <div className="savorui-logview-line-number w-9 shrink-0 flex justify-center items-center text-xs">
      <span className="text-right select-none">{lineNo}</span>
    </div>
  );
}
