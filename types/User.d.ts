interface User {
  name: string | null;
  id: string;
  email: string;
  isAdmin: boolean;
  isBlocked: boolean;
  avatar: string | null;
  following: {
    id: string;
    followerId: string;
    followingId: string;
  }[];
  followers: {
    id: string;
    followerId: string;
    followingId: string;
  }[];
}
