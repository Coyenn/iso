import { IconBase, type IconBaseProps } from "@/components/ui/icon-base";
import { cn } from "@/lib/utils";

export function PlusIcon({ className, ...props }: IconBaseProps) {
	return (
		<IconBase
			width="12"
			height="12"
			viewBox="0 0 12 12"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			vectorEffect="non-scaling-stroke"
			aria-hidden="true"
			className={cn(className)}
			{...props}
		>
			<path d="M6 0V12M0 6H12" stroke="currentColor" />
		</IconBase>
	);
}
