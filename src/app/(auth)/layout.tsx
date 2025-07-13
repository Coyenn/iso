import { GoBackButton } from "@/src/components/common/go-back-button";
import { AuthPageHeader } from "@/src/components/layout/auth-page-header";

export interface AuthLayoutProps {
	children: React.ReactNode;
}

export default async function AuthLayout(props: AuthLayoutProps) {
	const { children } = props;

	return (
		<>
			<AuthPageHeader />
			<GoBackButton href="/" title="Go back" />
			<main className="container-wrapper relative flex-1 items-center justify-center p-4">
				{children}
			</main>
		</>
	);
}
