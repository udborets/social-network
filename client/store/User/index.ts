import { makeAutoObservable } from "mobx";
import { DBUser } from "@/db/models";

export class User {
  isAuthed: boolean = false;
  info: DBUser = { email: "", id: "", name: "", posts: null };

  setState(userInfo: DBUser) {
    this.info = userInfo;
  }

  getSelf() {
    return this;
  }
  constructor() {
    makeAutoObservable(this);
  }
}

export const userState = new User();
