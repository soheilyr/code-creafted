import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const res = await fetch(`${process.env.BASE_URL}/api/profile`, {
    headers: {
      token: (await cookies()).get("token")?.value,
    },
  });
  console.log(res);
  if (!res.ok) {
    redirect("/");
  }
  const userData: AxiosResponse<User> = await res.json();
  if (userData.data.isAdmin) {
    redirect("/dashboard/admin");
  } else {
    redirect("/dashboard/user");
  }
}
