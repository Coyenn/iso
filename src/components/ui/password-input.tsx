"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/src/components/ui/button";
import { Input, type InputProps } from "@/src/components/ui/input";
import { cn } from "@/src/lib/utils";

export type PasswordInputProps = InputProps;

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	({ className, ...props }, ref) => {
		const [showPassword, setShowPassword] = React.useState(false);
		const disabled =
			props.value === "" || props.value === undefined || props.disabled;

		return (
			<div className="relative">
				<Input
					type={showPassword ? "text" : "password"}
					className={cn("hide-password-toggle pr-10", className)}
					ref={ref}
					{...props}
				/>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
					onClick={() => setShowPassword((prev) => !prev)}
					disabled={disabled}
					aria-label={showPassword ? "Hide password" : "Show password"}
					aria-expanded={showPassword}
				>
					{showPassword && !disabled ? (
						<EyeIcon className="h-4 w-4" aria-hidden="true" />
					) : (
						<EyeOffIcon className="h-4 w-4" aria-hidden="true" />
					)}
				</Button>

				{/* hides browsers password toggles */}
				<style>{`
					.hide-password-toggle::-ms-reveal,
					.hide-password-toggle::-ms-clear {
						visibility: hidden;
						pointer-events: none;
						display: none;
					}
				`}</style>
			</div>
		);
	},
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
