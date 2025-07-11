import { cn } from "@/lib/utils";
import { type SVGProps, forwardRef } from "react";

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
