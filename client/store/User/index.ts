import { makeAutoObservable } from "mobx";
import { DBUser } from "@/db/models";
import avatarImage from "@/assets/avatarImage.png";

export class User {
  isAuthed: boolean = false;
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

  setIsAuthed(isAuthed: boolean) {
    this.isAuthed = isAuthed;
  }

  setState(userInfo: DBUser) {
    this.info = userInfo;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const userState = new User();
