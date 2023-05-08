import { DBUser } from "@/db/models";
import { userState } from "@/store/User";
import { useLocalStorage } from "usehooks-ts";

export const useUserState = () => {
  const [localStorageUser, setLocalStorageUser] = useLocalStorage<DBUser>(
    "user",
    {
      age: null,
      avatarUrl: null,
      city: null,
      email: "",
      id: "",
      name: "",
      posts: [],
      univ: null,
    }
  );
  const setUser = (userInfo: DBUser) => {
    userState.setState(userInfo);
    setLocalStorageUser(userInfo);
  };
  return {
    localStorageUser,
    setUser,
  };
};
