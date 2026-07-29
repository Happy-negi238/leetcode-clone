import { onBoardUser } from "@/modules/auth/actions";
import protect from "@/modules/protect/actions";
import { UserButton } from "@clerk/nextjs";

export default async function Home() {
  await protect();
  await onBoardUser();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="">Hello World</div>
      <UserButton />
    </div>
  );
}
