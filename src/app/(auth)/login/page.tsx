import { redirect } from "next/navigation";
import { LoginForm } from "@/src/components/forms/login-form";
import { auth } from "@/src/server/auth";

export default async function LoginPage() {
	const session = await auth();

	if (session) {
		redirect("/");
	}

	return (
		<div className="h-full w-full max-w-[300px]">
			<LoginForm />
		</div>
	);
}
