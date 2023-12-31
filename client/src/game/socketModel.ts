import { IVector, Vector } from "../../../common/vector";
import { ClientSocket } from "./clientSocket";
import {
  IGameObjectData,
  IObjectInfo,
  IServerResponseMessage,
  IGameUpdateResponse,
  IChatMsg,
  IUserItem,
  ISendItemGame,
  IGameOptions,
  IInitialData,
} from "./dto";
import { IClientModel } from "./IClientModel";
import session from "../application/session";

import { GameModel } from "../../../server/src/gameModel";
export class SocketModel implements IClientModel {
  game: GameModel;
  onSideUpdate: (data: { sidePanelData: IObjectInfo[]; money: number }) => void;
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
  sendPrivateMessage: (content: { message: string, type: string }) => void;

  private messageHandler: (message: IServerResponseMessage) => void;
  private client: ClientSocket;
  onMoveBullet: (data: { position: IVector, id: string }) => void;

  constructor(client: ClientSocket) {
    this.client = client;
    this.messageHandler = (message: IServerResponseMessage) => {
      //console.log(message.type)
      if (message.type === "update") {
        //console.log("socketModel", message.content);
        this.onUpdate(JSON.parse(message.content));
      }
      if (message.type === "create") {
        this.onAddObject(JSON.parse(message.content));
      }
      if (message.type === "delete") {
        this.onDeleteObject(JSON.parse(message.content));
      }
      if (message.type === "updateSidePanel") {
        this.onSideUpdate(JSON.parse(message.content));
      }
      if (message.type === "startGame") {
        this.onStartGame(message.content);
      }
      if (message.type === "auth") {
        this.onAuth(message.content);
      }
      if (message.type === "shot") {
        this.onShot(JSON.parse(message.content));
      }
      if (message.type === 'moveBullet') {
        this.onMoveBullet(JSON.parse(message.content));
      }
      if (message.type === "chatMsg") {
        this.onChatMsg(JSON.parse(message.content));
      }
      if (message.type === "usersList") {
        this.onUsersList(JSON.parse(message.content));
      }
      if (message.type === "gamesList") {
        this.onGamesList(JSON.parse(message.content));
      }
      if (message.type === "sendPrivateResponse") {
        this.sendPrivateMessage(JSON.parse(message.content));
      }
    };
    this.client.onMessage.add(this.messageHandler);
  }

  //side

  registerSpectator(gameID: number) {
    this.client.sendMessage(
      "registerGamePlayer",
      JSON.stringify({ gameID: gameID, playerType: "spectator" })
    );
  }

  addUser() {
    this.client.sendMessage("auth", JSON.stringify({ user: session.user }));
  }

  registerGamePlayer(gameID: number) {
    this.client.sendMessage(
      "registerGamePlayer",
      JSON.stringify({ gameID: gameID, playerType: "human" })
    );
  }
  
  addInitialData(msg: IGameOptions): Promise<string> {
    const content = JSON.stringify(msg);
    return this.client.sendMessage("createGame", content);
  }

  startBuild(name: string, playerId: string): Promise<string> {
    const content = JSON.stringify({
      type: "startBuild",
      content: { name, playerId },
    });
   // console.log('socketModel', name, playerId)
    //если будет объект, то
    // const result = this.client.sendMessage('gameMove', content).then((r)=>{
    //  const data:ТИП = JSON.stringify(r);
    // return data;
    // })
    //  return result;
    return this.client.sendMessage("gameMove", content);
  }

  pauseBuilding(name: string, playerId: string): Promise<string> {
    const content = JSON.stringify({
      type: "pauseBuild",
      content: { name, playerId },
    });

    return this.client.sendMessage("gameMove", content);
  }

  playBuilding(name: string, playerId: string): Promise<string> {
    const content = JSON.stringify({
      type: "playBuild",
      content: { name, playerId },
    });

    return this.client.sendMessage("gameMove", content);
  }

  setTargetSpectator(targetId: string) {
    const content = JSON.stringify({
      type: "setTargetSpectator",
      content: targetId,
    });
    return this.client.sendMessage("gameMove", content);
  }

  cancelBuild() {}

  //to map
  addBuild(name: string, position: Vector, playerId: string): Promise<string> {
    const content = JSON.stringify({
      type: "addBuild",
      content: { name, position, playerId },
    });
    return this.client.sendMessage("gameMove", content);
  }

  addUnit(name: string, spawn: string, playerId: string, colorIndex: number): Promise<string> {
    const content = JSON.stringify({
      type: "addUnit",
      content: { name,spawn, playerId,colorIndex },
    });
    return this.client.sendMessage("gameMove", content);
  }
  setPrimary(id: string, name: string): Promise<string> {
    const content = JSON.stringify({
      type: "setPrimary",
      content: { id, name },
    });
   // console.log('socketClient')
    return this.client.sendMessage("gameMove", content);
  }

  moveUnit(id: string, position: Vector):Promise<string>{
    const content = JSON.stringify({ type: 'moveUnit', content: {id, position} });
    //console.log('____>>>',content,'&')
    return this.client.sendMessage('gameMove', content);
  }

  setAttackTarget(id: string, targetId: string): Promise<string> {
    const content = JSON.stringify({ type: 'attack', content: { id, targetId } });
    return this.client.sendMessage('gameMove', content);
  }
  
  
  chatSend(msg: IChatMsg): Promise<string> {
    const content = JSON.stringify(msg);
    return this.client.sendMessage("chatSend", content);
  }

  getUsersList(msg: IChatMsg): Promise<string> {
    const content = JSON.stringify(msg);
    return this.client.sendMessage("getUsersList", content);
  }

  destroy() {
    this.client.onMessage.remove(this.messageHandler);
  }

 

  //all game player methods
}
