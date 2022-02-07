import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { BuildingInfoView } from '../../ultratiling/buildingInfoView';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { TileObject } from '../../ultratiling/tileObject';
import { AbstractBuild } from './abstractBuild';

export class Barrack extends AbstractBuild{
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // primary: boolean;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, pos:Vector) {
    super(layer, infoLayer, res, pos);
    const tileMap = [
      [1,1,1,0],
      [1,1,1,0],
      [0,1,1,1],
      [1,1,1,0],
    ];

    /*const infos = new CachedSprite(tileSize*4, tileSize*4, pos.clone().scale(tileSize));
    infos.ctx.drawImage(res['buildingCenter'], 0, 0, tileSize*4, tileSize*4);
    infoLayer.addItem(infos);
    infos.update();

    const texts = new BuildingInfoView(pos.clone().scale(tileSize));
    infoLayer1.addItem(texts);
    texts.update();
    //console.log(infos.canvas);
    //document.body.appendChild(infos.canvas);*/
    const info = new BuildingInfoView(pos.clone(), res["barrack"]);
    info.health = 100;
    info.update();
    infoLayer.addObject(info);
    
    tileMap.forEach((it,i)=>it.forEach((jt, j)=>{
      const tilePos = pos.clone().add(new Vector(j, i));
      if (!tileMap[i][j]){
        return;
      }

      
      //infoLayer.updateScreen();
      
      const tile = new TileObject(1, tilePos);
      //tile.tiling = layer;
      tile.onMouseEnter = ()=>{
        //this.isHovered = true;
        this.hovBalance+=1;
       /* if (this.hovBalance == 1){
          this.tiles.forEach(it1=>it1.tileType = 0);
        }*/
        //texts.health+=1;
        //texts.update();
        //this.update();
      }

      tile.onMouseLeave = ()=>{
        this.hovBalance-=1;
        /*if (this.hovBalance == 0){
          this.tiles.forEach(it1=>it1.tileType = 1);
          //this.update();
        }*/
        //this.tiles.forEach(it=>it.tileType = 0);
      }

      tile.onUpdate = ()=>{
        //layer.updateCamera(layer.camera, layer.tileSize);
        layer.updateCacheTile(layer.camera, tilePos.x, tilePos.y, tile.tileType);
        
        //optimize it, too many updates
        //console.log('upd');
      }
      tile.onUpdate();
      

      //tile.position = pos.clone().add(new Vector(j, i));
      //console.log(tile.position)
      this.tiles.push(tile);
      //updateLayer
    }));
  } 
}