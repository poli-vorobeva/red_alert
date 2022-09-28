import { BotCommander } from "../../../server/src/botCommander";
import { IRegisteredPlayerInfo } from "../../../server/src/dto";
import { GameModel } from "../../../server/src/gameModel";
import { PlayerController } from "../../../server/src/playerController";
import { IChatMsg, IUserItem, IGameUpdateResponse,ISendItemGame, IInitialData, IGameOptions, } from './dto';
import { IGameObjectData, IObjectInfo } from "./dto";
import { IClientModel } from './IClientModel'
import { IVector, Vector } from '../../../common/vector'
import { INITIAL_DATA } from "../../../server/src/initialData";

export class LocalModel implements IClientModel
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
  sendPrivateMessage: (content: { message: string, type: string }) => void;
  myPlayer: PlayerController;
  player: string;
  game: GameModel;
  map: number[][];
  onMoveBullet: (data: { position: IVector, id: string })=>void;
  constructor(){

  }

  addUser() {
     this.player = 'user' + Math.floor(Math.random() * 100);
  }

  addInitialData({ players, initialData, credits, mapGame }: IGameOptions): Promise<string> {   
    const bots: IRegisteredPlayerInfo[] = new Array(players-1).fill(null).map((item, index) => {
      return {
        id: 'bot' + Math.floor(Math.random() * 100),
        type: 'bot',
        colorIndex: index + 2
      }
    });
    this.onAuth(this.player);
    this.startGame(bots, initialData, credits, mapGame);
    return new Promise(resolve => resolve(''))
  }

  startGame(playersInfo: IRegisteredPlayerInfo[], initialData: IInitialData[][], credits: number, map: number[][]){
    console.log()
    const gamePlayersInfo = playersInfo.slice();
    gamePlayersInfo.push({
      id: this.player,
      type: 'human',
      colorIndex: 1
    });
    const game = new GameModel(gamePlayersInfo,  {map, builds: initialData, credits});
    const myPlayerController: PlayerController = new PlayerController(this.player, game);
    this.myPlayer = myPlayerController;
    const bots = playersInfo.map(it=> {
      const playerController = new PlayerController(it.id, game);
      return new BotCommander(playerController);
    });
    game.onUpdate = (data, action) => {
      if (action === 'update') {
        this.onUpdate(data);
        bots.forEach(item=> item.sendMessage('update', JSON.stringify(data)));
      }
      if (action === 'create') {
        this.onAddObject(data);
        bots.forEach(item=> item.sendMessage('create', JSON.stringify(data)));
      }
      if (action === 'delete') {
        this.onDeleteObject(data);
        bots.forEach(item=> item.sendMessage('delete', JSON.stringify(data)));
      }
    }
    game.onShot = (point, id) => {
      this.onShot({ position: point, id: id });
    }
    game.onMoveBullet = (point, id) => {
     this.onMoveBullet({ position: point, id: id })
    }
    game.sendPrivateResponse = (id, content) => {
      this.sendPrivateMessage(content);
    }

    // game.onUpdate = (id, data)=>{
    //   bots.forEach(player=> player.sendMessage({}));
    //   //this.onCanvasObjectUpdate();
    // }
    game.onSideUpdate = (id, data)=>{
     // bots.find(it=>it).sendMessage(data);
      if (id === this.player) {
        this.onSideUpdate(JSON.parse(data));
      } else {
        bots.find(item => item.playerController.playerId === id).sendMessage('updateSidePanel',data);
      }
    }

    const allPlayers =playersInfo.map(it => it.id);
    allPlayers.push(this.player);
    const sidePanel = game.getState(myPlayerController.playerId);
    this.onStartGame(JSON.stringify({ players: allPlayers, sidePanel, type:'human' }));
    bots.forEach(item => {       
      const sidePanel = game.getState(item.playerController.playerId);      
      item.sendMessage('startGame', JSON.stringify({ players: allPlayers, sidePanel, type: 'bot' }))
      
    })
    game.init();
    this.game = game;
  }

  //side

  startBuild(name: string, playerId: string):Promise<string> {
    const result = this.myPlayer.startBuilding(name);
    return new Promise(resolve => resolve(result));
  }

  pauseBuilding(name: string, playerId: string):Promise<string>{
    const result = this.myPlayer.pauseBuilding(name);
    return new Promise(resolve => resolve(result))
  }

  playBuilding(name: string, playerId: string):Promise<string>{
    const result = this.myPlayer.playBuilding(name);
    return new Promise(resolve => resolve(result))
  }

  cancelBuild(){
  }
  registerGamePlayer(gameID:number) {
  }
  registerSpectator(gameID:number) {
  
  }

  chatSend():Promise<string>{ return new Promise((r)=>r(''))}
  getUsersList():Promise<string>{ return new Promise((r)=>r(''))}
  
  //to map
  addBuild(name: string, position: Vector, playerId: string):Promise<string>{
    const result = this.myPlayer.addGameObject(name, position);
    return new Promise(resolve => resolve(result))
  }


  setPrimary(id: string, name: string):Promise<string>{
    const result = this.myPlayer.setPrimary(id, name);
    return new Promise(resolve => resolve(result))
  }

  moveUnit(id: string, position: Vector): Promise<string>{
    const result =  this.myPlayer.moveUnits(id, position);
    return new Promise(resolve => resolve(result));
  }

  addUnit(name: string, spawn: string, id: string): Promise<string>{
    const result = this.myPlayer.addUnit(name, spawn, id);
    return new Promise(resolve => resolve(result));
  }


  setAttackTarget(id: string, targetId: string):Promise<string>{
    const result = this.myPlayer.setAttackTarget(id, targetId);// , tileSize
    return new Promise(resolve => resolve(result));
  }

}