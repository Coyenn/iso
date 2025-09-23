import { GoBackButton } from "@/src/components/common/go-back-button";
import { IframeServiceViewer } from "@/src/components/iframe-service-viewer";
import { AppPageHeader } from "@/src/components/layout/app-page-header";

export interface AppLayoutProps {
	children: React.ReactNode;
}

export default async function AppLayout(props: AppLayoutProps) {
	const { children } = props;

	return (
		<>
			<AppPageHeader />
			<GoBackButton href="/" />
			<IframeServiceViewer />
			<main className="container-wrapper relative mt-18 flex-1">
				{children}
			</main>
		</>
	);
}
