import { IVector, Vector } from "../../../../common/vector";
import { InteractiveObject } from "./interactiveObject";
import { BoundingLayer } from '../ultratiling/boundingLayer';
import { BulletInfoView } from '../ultratiling/bulletInfoView';
import { Camera } from "../ultratiling/camera";

export class Bullet extends InteractiveObject{
  image: HTMLImageElement;
  constructor(boundingLayer: BoundingLayer,res:Record<string, HTMLImageElement>, camera: Camera,position: IVector, id:string) {
    super();
   
    this.id = id;
    this.infoLayer = boundingLayer;
    this.camera = camera;
    this.position = Vector.fromIVector(position).scale(this.camera.getTileSize());
    this.image = res["bullet"];
    // this.info = new BulletInfoView(this.position.clone(), res["bullet"]);
    // this.info.update();
    // this.infoLayer.addObject(this.info);
  
  }

  render(ctx: CanvasRenderingContext2D, camera: Vector) {
    const cameraPos = camera.clone().scale(this.camera.getTileSize());
    //ctx.drawImage(this.image, 100, 100, 50, 50);
    const sz = 5;
    ctx.fillStyle = "#0ff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(-camera.x + this.position.x + sz / 2, -camera.y + this.position.y + sz / 2, sz, sz, 0, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  updateShot(position: IVector) {
    //this.infoLayer._clearTile(this.camera.getTileVector(this.camera.position), this.info, this.camera.getTileSize()); 
    this.position = Vector.fromIVector(position).scale(this.camera.getTileSize());;
    //this.info.position = this.position;
   ///this.infoLayer.updateObject(this.info)
  }
  destroy(): void {
    // this.infoLayer._clearTile(this.camera.getTileVector(this.camera.position), this.info, this.camera.getTileSize());
    // this.infoLayer.deleteObject(this.info);
    super.destroy();
  }
}