import { useTranslations } from "next-intl";
import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { cn } from "@/src/lib/utils";

export interface FileInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	/**
	 * Optional custom button label. If not provided, a translated default is used.
	 */
	buttonLabel?: string;
	/**
	 * Called when a file is selected. Mirrors the native onChange event.
	 */
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

/**
 * A11y-friendly custom file input that respects the current locale.
 * It renders a visually hidden native `<input type="file"/>` and a stylable
 * button that triggers the file picker. The native element remains in the DOM
 * so it works seamlessly with React-Hook-Form and browser validation.
 */
export const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
	({ className, buttonLabel, onChange, ...props }, ref) => {
		const t = useTranslations("forms");
		const [fileName, setFileName] = React.useState<string | null>(null);
		const localRef = React.useRef<HTMLInputElement | null>(null);
		const combinedRef = React.useCallback(
			(node: HTMLInputElement) => {
				localRef.current = node;
				if (typeof ref === "function") ref(node);
				else if (ref)
					(ref as React.MutableRefObject<HTMLInputElement | null>).current =
						node;
			},
			[ref],
		);

		const handleButtonClick = () => {
			localRef.current?.click();
		};

		const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
			setFileName(e.target.files?.[0]?.name ?? null);
			onChange?.(e);
		};

		return (
			<div className={cn("flex w-full items-center gap-2", className)}>
				<input
					{...props}
					type="file"
					ref={combinedRef}
					className="sr-only"
					onChange={handleChange}
				/>

				<Button
					type="button"
					onClick={handleButtonClick}
					variant="outline"
					className="flex-1"
				>
					{fileName ?? buttonLabel ?? t("chooseFile")}
				</Button>
			</div>
		);
	},
);

FileInput.displayName = "FileInput";
