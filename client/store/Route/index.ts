import { makeAutoObservable } from "mobx";

export class Route {
  current: string = "";

  setCurrent(newCurrent: string) {
    this.current = newCurrent;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export const routeState = new Route();
