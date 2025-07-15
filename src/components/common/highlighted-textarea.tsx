import { Textarea } from "@/src/components/ui/textarea";
import { highlight } from "sugar-high";
import { useRef } from "react";

// Lightweight syntax-highlighted textarea powered by sugar-high
interface HighlightedTextareaProps {
	value: string;
	onChange: (val: string) => void;
}

function HighlightedTextarea(props: HighlightedTextareaProps) {
	const { value, onChange } = props;
	const preRef = useRef<HTMLPreElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// Sync scroll between layers
	const handleScroll = () => {
		if (preRef.current && textareaRef.current) {
			preRef.current.scrollTop = textareaRef.current?.scrollTop ?? 0;
			preRef.current.scrollLeft = textareaRef.current?.scrollLeft ?? 0;
		}
	};

	return (
		<div className="relative font-mono text-sm" style={{ tabSize: 2 }}>
			<pre
				ref={preRef}
				aria-hidden
				className="sugar-high pointer-events-none absolute inset-0 overflow-auto whitespace-pre-wrap break-words rounded-md border border-input bg-background p-3 shadow-xs selection:bg-selection selection:text-selection-foreground"
				{...{ dangerouslySetInnerHTML: { __html: highlight(value) } }}
			/>
			<Textarea
				ref={textareaRef}
				id="customStylesheet"
				placeholder="Custom Stylesheet"
				spellCheck={false}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onScroll={handleScroll}
				className="font-mono text-sm relative z-10 h-40 w-full resize-none overflow-auto !bg-transparent p-3 text-transparent caret-foreground focus:outline-none"
				style={{ lineHeight: "1.5" }}
			/>
		</div>
	);
}

export default HighlightedTextarea;
