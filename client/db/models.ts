export type DBUser = {
  id: string;
  name: string;
  email: string;
  posts: DBPost[] | null;
};

export type DBPost = {
  likes: number;
  text?: string;
  imageUrl?: string;
  ownerId: string;
  owner: DBUser;
  id: string;
} | null;

export type DBFriends = {
  id: string;
  userId: string;
  friendId: string;
};
