import { IGameObjectData } from '../../dto';
import { BoundingLayer } from '../../ultratiling/boundingLayer';
import { TilingLayer } from '../../ultratiling/tileLayer';
import { AbstractUnit } from './abstractUnit';
import { Camera } from '../../ultratiling/camera';

export class Bomber extends AbstractUnit{
  // id: string;
  // playerId: string;
  // position: Vector;
  // type: string;
  // selected: boolean;
  constructor(layer: TilingLayer, infoLayer: BoundingLayer, res: Record<string, HTMLImageElement>, camera: Camera, data: IGameObjectData, color: string) {
    super(layer, infoLayer, res, camera, data,color);
  }

}