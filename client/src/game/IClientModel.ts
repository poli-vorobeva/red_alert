import { IVector, Vector } from "../../../common/vector";
import { IGameUpdateResponse, IChatMsg, IUserItem, IInitialData} from "./dto";
import { IGameObjectData, IObjectInfo, ISendItemGame } from "./dto";
import {IGameOptions} from '../application/settingsPageMulti'
import { GameModel } from "../../../server/src/gameModel";

export class IClientModel
{
  onSideUpdate: (data: {sidePanelData: IObjectInfo[], money: number})=>void;
  onCanvasObjectUpdate: (response: IGameUpdateResponse) => void;
  onStartGame: (data: string) => void;
  onAuth: (data: string) => void;
  onUpdate: (data: IGameObjectData) => void;
  onAddObject: (data: IGameObjectData) => void;
  onDeleteObject: (data: IGameObjectData) => void;
  onShot: (data: { position: IVector, id: string }) => void;
  onChatMsg: (msg: IChatMsg) => void;
  onUsersList: (msg: IUserItem[]) => void;
  onGamesList: (msg: ISendItemGame[]) => void;
  addUser: (players?: number, initialData?: IInitialData[][], credit?: number, mapGame?:number[][]) => void;
   onMoveBullet: (data: { position: IVector, id: string })=> void;

  registerGamePlayer: (gameID:number) => void;

  startBuild: (name: string, playerId: string) => Promise<string>;

  pauseBuilding: (name: string, playerId: string) => Promise<string>;
  playBuilding: (name: string, playerId: string) => Promise<string>;
  cancelBuild: () => void;

  //to map
  addBuild: (name: string, position: Vector, playerId: string) => Promise<string>;

  addInitialData: (state: IGameOptions) => Promise<string>;

  setPrimary: (id: string, name: string) => Promise<string>;
  moveUnit: (id: string, position: Vector)=> Promise<string>;

  setAttackTarget:(id: string, targetId: string)=>Promise<string>;
  registerSpectator: (gameID:number) => void;

  chatSend: (msg?: IChatMsg)=>Promise<string>;

  getUsersList: (msg?: IChatMsg) => Promise<string>;
  sendPrivateMessage: (content: { message: string, type: string }) => void;
  addUnit: (name: string,spawn: string, id: string)=> Promise<string> ; //all game player methods
  game: GameModel;
}
