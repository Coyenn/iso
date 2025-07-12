import Image from "next/image";
import Link from "next/link";
import type z from "zod";
import type { serviceSchema } from "@/src/config/config";

export type ServiceIconProps = z.infer<typeof serviceSchema>;

export function ServiceIcon(props: ServiceIconProps) {
	const { icon, label, href } = props;

	return (
		<div className="flex aspect-square w-[125px] flex-col items-center gap-2 sm:w-[175px] md:w-[225px]">
			<Link href={href} target="_blank">
				<Image src={icon} alt={label} width={225} height={225} />
			</Link>
			<p>{label}</p>
		</div>
	);
}
