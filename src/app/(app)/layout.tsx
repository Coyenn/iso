import { GoBackButton } from "@/src/components/common/go-back-button";
import { AppPageHeader } from "@/src/components/layout/app-page-header";

export interface AppLayoutProps {
	children: React.ReactNode;
}

export default async function AppLayout(props: AppLayoutProps) {
	const { children } = props;

	return (
		<>
			<AppPageHeader />
			<GoBackButton href="/" title="Go back" />
			<main className="container-wrapper relative flex-1">{children}</main>
		</>
	);
}
