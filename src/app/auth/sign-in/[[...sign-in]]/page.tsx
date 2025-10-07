import { SignIn } from "@clerk/nextjs";

export default function Page() {
  // Use the theme to set Clerk's appearance
  return (
    <section className="container-x py-8 flex justify-center">
      <SignIn />
    </section>
  );
}
