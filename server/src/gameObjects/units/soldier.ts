import { IVector } from '../../../../common/vector';
import { PlayerSide } from '../../playerSide';
import { GameObject } from '../gameObject';
import { AbstractUnitObject } from './abstractUnitObject';

export class Soldier extends AbstractUnitObject{
attackRadius: number = 5;
  findRadius: number = 8;
  damegePower = 10;
  constructor(objects: Record<string, GameObject>, playerSides: PlayerSide[], objectId: string, type: string, state: { position: IVector, playerId: string, colorIndex: number }) {
    super(objects, playerSides, objectId, type, state);
  }
}