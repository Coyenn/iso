import { PageHeader } from "@/src/components/layout/page-header";

export interface AppLayoutProps {
	children: React.ReactNode;
}

export default async function AppLayout(props: AppLayoutProps) {
	const { children } = props;

	return (
		<>
			<PageHeader />
			<main className="container-wrapper relative flex-1">{children}</main>
		</>
	);
}
