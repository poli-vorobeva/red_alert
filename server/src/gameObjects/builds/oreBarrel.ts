import { IVector } from '../../../../common/vector';
import { PlayerSide } from '../../playerSide';
import { GameObject } from '../gameObject';
import { AbstractBuildObject } from './abstractBuildObject';

export class OreBarrel extends AbstractBuildObject{
  constructor(objects: Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string, colorIndex: number }) {
    super(objects, playerSides, objectId, type, state);
  } 
}