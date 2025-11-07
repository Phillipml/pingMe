import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get("accessToken")
  const refreshToken = cookieStore.get("refreshToken")
  if(!accessToken || !refreshToken) {
     redirect("/login")
  } else {
    redirect("/feed")
  }
}