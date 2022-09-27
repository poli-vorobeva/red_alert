import { IVector } from "../../common/vector";
import { GameModel } from "./gameModel";

export class PlayerController{
  gameModel: GameModel;
  playerId: string;
  
  constructor(playerId:string, gameModel:GameModel){
    this.gameModel = gameModel;
    this.playerId = playerId;
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
  addGameObject(objectType: string, position: IVector) {
    const result = this.gameModel.addGameObject(this.playerId, objectType, position);
    // if(result !== 'false'){
    //   console.log("%c"+this.playerId+ ' строит '+ objectType+ ': '+position.x+': '+position.y, 'color: blue')
    // }
    return result;
  }

  addUnit(name: string, spawn: string, id: string) {
    return this.gameModel.addUnit(name,spawn, id);
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
      return this.gameModel.addGameObject(this.playerId,name, position)
    }
  }
  addInitialMap(map:number[][]){
    return this.gameModel.createMap(map);
  }
  
}