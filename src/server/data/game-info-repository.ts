import { IGameinfo } from "./game-repository";

let gameinfos: IGameinfo[] = [];

export function getAllGameInfos() {
  return gameinfos;
}
