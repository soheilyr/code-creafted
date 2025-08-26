"use client";

import { followUser, unfollowUser } from "@/services/user";
import { useUserInfo } from "@/store/userInfoStore";
import { useMutation } from "@tanstack/react-query";

export default function FollowBtn({ id }: { id: string }) {
  const { userInfo, fetchUserInfo } = useUserInfo();
  const { mutate: followMutation, isPending: followPending } = useMutation({
    mutationFn: () => followUser(id),
    mutationKey: ["followUser", id],
    onSuccess: () => {
      fetchUserInfo();
    },
  });
  const { mutate: unFollowMutation, isPending: unFollowPending } = useMutation({
    mutationFn: () => unfollowUser(id),
    mutationKey: ["unfollowUser", id],
    onSuccess: () => {
      fetchUserInfo();
    },
  });

  console.log(
    "Follower",
    userInfo?.followers,
    "Following",
    userInfo?.following,

    userInfo?.following.find((item) => item.followingId === id)
  );
  return userInfo?.id === id ? null : !!userInfo?.followers.find(
      (item) => item.followingId === id
    ) ? (
    <button
      disabled={unFollowPending}
      onClick={() => unFollowMutation()}
      className="px-4 py-1 mt-1 rounded-sm bg-[#f1f6f9] text-[#000] cursor-pointer hover:bg-[#c3d9e6]  text-xs font-medium shadow-md transition duration-200"
    >
      unFollow
    </button>
  ) : (
    <button
      disabled={followPending}
      onClick={() => followMutation()}
      className="px-4 py-1 mt-1 rounded-sm bg-[#f1f6f9] text-[#000] cursor-pointer hover:bg-[#c3d9e6]  text-xs font-medium shadow-md transition duration-200"
    >
      Follow
    </button>
  );
}
