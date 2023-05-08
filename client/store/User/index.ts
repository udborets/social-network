import { makeAutoObservable } from "mobx";
import { DBUser } from "@/db/models";
import avatarImage from "@/assets/avatarImage.png";

export class User {
  info: DBUser = {
    email: "",
    id: "",
    name: "",
    posts: [],
    age: null,
    avatarUrl: avatarImage.src,
    city: null,
    univ: null,
  };

  setState(userInfo: DBUser) {
    this.info = userInfo;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const userState = new User();
