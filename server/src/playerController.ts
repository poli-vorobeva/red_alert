import { IVector } from "../../common/vector";
import { GameModel } from "./gameModel";

export class PlayerController{
  gameModel: GameModel;
  playerId: string;
  colorIndex: number;
  
  constructor(playerId:string, gameModel:GameModel, colorIndex:number){
    this.gameModel = gameModel;
    this.playerId = playerId;
    this.colorIndex = colorIndex;
  }

  //  на сайд панели постройку запускает
  startBuilding(objectType: string) {
   return this.gameModel.startBuilding(this.playerId, objectType);
  }

  pauseBuilding(objectType: string) {
    return this.gameModel.pauseBuilding(this.playerId, objectType);
  }

  playBuilding(objectType: string) {
    return this.gameModel.playBuilding(this.playerId, objectType);
  }

  // Добавление объекта на канвас
  addGameObject(objectType: string, position: IVector, colorIndex:number) {
    const result = this.gameModel.addGameObject(this.playerId, objectType, position, colorIndex);
    // if(result !== 'false'){
    //   console.log("%c"+this.playerId+ ' строит '+ objectType+ ': '+position.x+': '+position.y, 'color: blue')
    // }
    return result;
  }

  addUnit(name: string, spawn: string, id: string, colorIndex:number) {
    return this.gameModel.addUnit(name,spawn, id, colorIndex);
  }

  moveUnits(unitId:string, target:IVector){
    return this.gameModel.moveUnits(this.playerId, unitId, target);
  }

  updateSidePanel(targetId: string) {
    const state = this.gameModel.getState(targetId);
    this.gameModel.onSideUpdate(this.playerId, JSON.stringify(state));
  }

  getSidePanelState() {
    return this.gameModel.getState(this.playerId)
  }

  getObjects() {
    return this.gameModel.getObjects();
  }

  setAttackTarget(unitId:string, targetId:string){
    return this.gameModel.setAttackTarget(this.playerId, unitId, targetId)
  }

  setPrimary(buildId: string, name: string) {   
    return this.gameModel.setPrimary(this.playerId, buildId, name);
  }
  
  addInitialData(name: string, playerId: string, position: IVector) {
    if (playerId === this.playerId) {
      return this.gameModel.addGameObject(this.playerId,name, position,this.colorIndex)
    }
  }
  addInitialMap(map:number[][]){
    return this.gameModel.createMap(map);
  }
  
}