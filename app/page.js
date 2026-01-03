import { onBoardUser } from "@/modules/auth/actions/page";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  await onBoardUser();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <UserButton />
    </div>
  );
}
