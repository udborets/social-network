import { makeAutoObservable } from "mobx";

export class User {
  id: number = 0;
  isAuthed: boolean = false;

  setIsAuthed(isAuthed: boolean) {
    this.isAuthed = isAuthed;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const userState = new User();
