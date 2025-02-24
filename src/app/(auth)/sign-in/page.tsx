import { redirect } from "next/navigation";

import { SignInCard } from "@/features/auth/components/sign-in-card";

import { auth } from "@/auth";

const SignInPage = async () => {
  const session = await auth();

  if (session) {
    redirect("/home");
  }

  return <SignInCard />;
};

export default SignInPage;
