import { cookies } from "next/headers";
import UsersTable from "./_components/UsersTable";

export default async function Users() {
  const token = (await cookies()).get("token")?.value;
  const res = await fetch(`${process.env.BASE_URL}/api/user`, {
    headers: {
      token,
    },
  });
  if (!res.ok) {
    return <div>Something wen&apos;t wrong!</div>;
  }
  const result = await res.json();
  console.log("result :", result.data.users);
  return (
    <>
      <UsersTable users={result.data.users} />
    </>
  );
}
