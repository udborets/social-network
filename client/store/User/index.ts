import { makeAutoObservable } from "mobx";

export class User {
  id: string = "";
  username: string = "";
  email: string = "";
  isAuthed: boolean = false;

  setState({
    id,
    username,
    email,
    isAuthed,
  }: {
    id: string;
    username: string;
    email: string;
    isAuthed: boolean;
  }) {
    this.email = email;
    this.id = id;
    this.username = username;
    this.isAuthed = isAuthed;
  }

  getSelf() {
    return this;
  }
  constructor() {
    makeAutoObservable(this);
  }
}

export const userState = new User();
