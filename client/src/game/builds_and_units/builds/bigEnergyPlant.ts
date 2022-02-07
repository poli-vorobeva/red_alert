import { Vector } from '../../../../../common/vector';
import { IGameObjectContent, IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { Camera } from '../../ultratiling/camera';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { AbstractBuild } from './abstractBuild';

export class BigEnergyPlant extends AbstractBuild{
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // primary: boolean;
  constructor(layer:TilingLayer, infoLayer:BoundingLayer, res:Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData) {
     super(layer, infoLayer, res, camera, data);
  }
    
}