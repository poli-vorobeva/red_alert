import {  IRegisteredPlayerInfo, ISendItem, IServerRequestMessage, IStartGameResponse } from "./dto";
import { GameModel } from "./gameModel";
import { connection } from "websocket";
import { BotCommander } from './botCommander';
import { HumanCommander } from "./humanCommander";
import { PlayerController } from "./playerController";
import { SpectatorCommander } from "./spectatorCommander";
import { Session } from "./serverSocket";

export interface IInitialData {
  name: string;
  position: {
    x: number;
    y: number;
  }
}
export interface IGameOptions {
  id: number;
  credits: number;
  mapID: number;
  speed: number;
  info: string;
  mapGame: number[][];
  players: number;
  initialData: IInitialData[][]
}  

export class GameServer {
  registeredPlayersInfo: IRegisteredPlayerInfo[] = [];

  players: (HumanCommander | BotCommander|SpectatorCommander)[] = [];
  gameModel: GameModel;
  colorIndex = 0;

  private _settings:IGameOptions; 

  constructor(props:IGameOptions){
    this._settings = props;
  }
  get id(){ return this._settings.id };
  get settings(){ return this._settings };
  getPlayersInfo():IRegisteredPlayerInfo[]{ return this.registeredPlayersInfo }; // при регистрации приходит тип: бот, human, зритель
  
  registerPlayer(type:'bot'|'human'|'spectator', userId:string, connection:Session, settings: ISendItem){ // регистрация игрока
    if (this.registeredPlayersInfo.find((x) => x.id === userId)) {
      return {successfully:false};
    } else {
      console.log('colorIndex', this.colorIndex)
      this.registeredPlayersInfo.push({ type, id: userId, connection, colorIndex: this.colorIndex });
      this.colorIndex++;
      if (this.registeredPlayersInfo.filter(item=>item.type ==='human'||item.type ==='bot').length >= settings.players) {
        this.startGame(settings);
      }
      return {successfully:true};
    }
  }
  
  unregisterPlayer(userId:string){
    const user = this.registeredPlayersInfo.find((x)=>x.id===userId)
    if(user){
      const index = this.registeredPlayersInfo.indexOf(user);
      this.registeredPlayersInfo.splice(index,1);
      // this.registeredPlayersInfo.map((item, index) =>{
      //   item.colorIndex = index + 1;
      //   return item;
      // })
      this.colorIndex--;
      return {successfully:true};
    } else {
      return {successfully:false};
    }
  }

  startGame({ mapGame, initialData, credits }: ISendItem) {
    this.gameModel = new GameModel(this.registeredPlayersInfo, { map: mapGame, builds: initialData, credits: credits });
    this.players = this.registeredPlayersInfo.map(it=> {
      const playerController = new PlayerController(it.id, this.gameModel, it.colorIndex);
      if (it.type === 'bot') {
        return new BotCommander(playerController, it.colorIndex );
      } else if (it.type === 'human') {
        return new HumanCommander(playerController, it.connection);
      } else if (it.type === 'spectator') {
        const targetId = this.registeredPlayersInfo.find(it => it.type === 'human'||it.type === 'bot').id;
        return new SpectatorCommander(playerController, it.connection, targetId);
      } else {
        throw new Error('Invalid type');
      }
    });
  //create, delete
    
    this.gameModel.onUpdate = (data, action)=>{
      if (action === 'update') {
         this.players.forEach(player => player.sendMessage('update', JSON.stringify(data)));
      }
      if (action === 'create') {
        this.players.forEach(player => player.sendMessage('create', JSON.stringify(data)));
      }
      if (action === 'delete') {
        this.players.forEach(player=> player.sendMessage('delete', JSON.stringify(data)));

      }     
    }
    this.gameModel.onShot = (point, id) => {
      this.players.forEach(player=> player.sendMessage('shot', JSON.stringify({position: point, id: id})));
    }
    this.gameModel.onSideUpdate = (id, data)=>{
      (this.players.filter(it => it instanceof SpectatorCommander) as SpectatorCommander[])
        .filter(it => it.targetId === id)
        .forEach(item=>item.sendMessage('updateSidePanel', data))
      this.players.find(it => it.playerController.playerId === id).sendMessage('updateSidePanel', data);
      
    }

    this.gameModel.onMoveBullet = (point, id) => {
     this.players.forEach(player=> player.sendMessage('moveBullet', JSON.stringify({position: point, id: id})));
    }
    this.gameModel.sendPrivateResponse = (id, content) => {
      this.players.find(it => it.playerController.playerId === id).sendMessage('sendPrivateResponse', JSON.stringify({ content: content }));
    }
   
    ///start to game, fix it later
    const allPlayers = this.registeredPlayersInfo.map(it => it.id);
    this.players.forEach(item => {
      const sidePanel = this.gameModel.getState(item.playerController.playerId);
      const type = item instanceof BotCommander ? 'bot' : item instanceof HumanCommander ? 'human' : 'spectator';
      const response: IStartGameResponse = { players: allPlayers, sidePanel, type,colorIndex: item.playerController.colorIndex}

      item.sendMessage('startGame', JSON.stringify(response));
      
    })
    
    this.gameModel.init();
  
  }

  createGame(data:{map:number[][] } ) {   
   // this.map = data.map;
    
   // this.gameModel.createMap()
  }
 
  handleMessage(ms: IServerRequestMessage, id:string) {
    return (this.players.find(item=>item.playerController.playerId ===id) as HumanCommander).handleClientMessage(JSON.parse(ms.content))
  }

  sendMessage(connection: connection, msg: string, data: string) {
    connection.sendUTF(JSON.stringify({ msg, data }));
  }
}