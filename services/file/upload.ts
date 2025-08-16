import { getToken } from "@/lib/utils";

export const uploadFileService = async (
  data: FormData
): Promise<AxiosResponse<{ url: string }>> => {
  const token = getToken();
  const res = await fetch("/api/file/upload", {
    method: "POST",
    body: data,
    headers: {
      token: token,
    },
  });
  return await res.json();
};
