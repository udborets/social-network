export type DBUser = {
  id: string;
  name: string;
  email: string;
  posts: DBPost[];
  avatarUrl: string | null;
  univ: string | null;
  city: string | null;
  age: number | null;
  createdAt?: string;
};

export type Friends = {
  id: string;
  userId: string;
  friendId: string;
  createdAt?: string;
};

export type DBPost = {
  likedBy: string[];
  likes: number;
  text?: string;
  imageUrl?: string;
  ownerId: string;
  id: string;
  createdAt?: string;
  owner: DBUser;
};

export type DBFriends = {
  id: string;
  userId: string;
  friendId: string;
  createdAt?: string;
};
