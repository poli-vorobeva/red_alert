import { InteractiveObject } from "./builds_and_units/interactiveObject";
import { Vector } from '../../../common/vector';

export class InteractiveList{
  public list:InteractiveObject[] = [];
  hoveredObjects: InteractiveObject[] = [];

  _hovered:InteractiveObject;
  set hovered(value:InteractiveObject){
    let last = this._hovered;
    this._hovered = value;
    this.onChangeHovered?.(last, value);
  }
  get hovered(){
    return this._hovered;
  }
  onChangeHovered: (lastTarget:InteractiveObject, currentTarget:InteractiveObject)=>void;
  onClick: (target:InteractiveObject)=>void;
  constructor(){
    this.list = [];
    this.hoveredObjects = [];
  }


  add(object: InteractiveObject) {

    object.getList = () => {
      return this;
    }
    object.onMouseEnter = ()=>{
      this.hoveredObjects.push(object);
      this.handleHover();
    }
    object.onMouseLeave = ()=>{
      this.hoveredObjects = this.hoveredObjects.filter(it=>it!=object);
      this.handleHover();
    }
    object.onDestroyed = ()=>{
      this.list = this.list.filter(it=>it!=object);
      this.hoveredObjects = this.hoveredObjects.filter(it=>it!=object);
      this.handleHover();
    }
    this.list.push(object);
    // this.list.sort((a,b)=>{
    //  return (a.position.y - b.position.y)*1000 + a.position.x - b.position.x;
    // })
  }

  public handleMove(tile:Vector, cursor:Vector){
    this.list.forEach(it=>it.handleMove(tile, cursor));
  }

  public handleClick(tile:Vector, cursor:Vector){
    this.handleMove(tile, cursor);
    this.hovered?.handleClick(tile, cursor);
    this.onClick(this.hovered);
    //this.list.forEach(it=>it.handleClick(pos));
  }

  private handleHover(){
    let highObject = this.hoveredObjects[this.hoveredObjects.length-1] || null;
    if (this.hovered != highObject) {
      this.hovered = highObject;
    }
  }

  remove(id: string) {
  this.list = this.list.filter(it => it.id != id);  
  }

}