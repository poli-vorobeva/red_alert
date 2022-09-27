import { IVector } from '../../../../common/vector';
import { PlayerSide } from '../../playerSide';
import { GameObject } from '../gameObject';
import { AbstractUnitObject } from './abstractUnitObject';

export class Bomber extends AbstractUnitObject{
  attackRadius: number = 2;
  findRadius: number = 20;
  constructor(objects:Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string }) {
    super(objects, playerSides, objectId, type, state);
  }

}