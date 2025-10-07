import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <section className="container-x py-8 flex justify-center">
      <SignUp />
    </section>
  );
}
