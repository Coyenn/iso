import { forwardRef, type SVGProps } from "react";
import { cn } from "@/src/lib/utils";

export interface IconBaseProps extends SVGProps<SVGSVGElement> {
	className?: string;
}

export const IconBase = forwardRef<SVGSVGElement, IconBaseProps>(
	({ className, ...props }, ref) => {
		return (
			<svg className={cn(className)} {...props} ref={ref} aria-hidden="true" />
		);
	},
);
