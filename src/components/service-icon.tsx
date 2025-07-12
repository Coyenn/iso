import Image from "next/image";
import Link from "next/link";
import type z from "zod";
import type { serviceSchema } from "@/src/config/config";

export type ServiceIconProps = z.infer<typeof serviceSchema>;

export function ServiceIcon(props: ServiceIconProps) {
	const { icon, label, href } = props;

	return (
		<Link
			href={href}
			target="_blank"
			className="flex aspect-square w-[125px] flex-col items-center rounded-lg p-4 transition-colors duration-100 hover:bg-muted focus-visible:bg-muted motion-reduce:duration-0 contrast-more:hover:underline sm:w-[175px] md:w-[225px]"
		>
			<Image src={icon} alt={label} width={225} height={225} />
			<h3 className="font-medium text-lg sm:text-xl">{label}</h3>
		</Link>
	);
}
