import Control from '../common/control';
import { GameModel } from "./gameModel";
import { IObjectInfo } from './dto';
import { IProgress } from './dto';
import { tech } from './techTree';
import { BuildButton } from './buildButton';

export class GameSidePanel extends Control{
  model: GameModel;

  updateHandler: () => void;
  updateProgress: (props: IProgress) => void;
  buildButtons: Record <string, BuildButton> = {};

  constructor(parentNode: HTMLElement,model: GameModel) {
    super(parentNode);
       this.model = model;

    this.updateHandler = () => {
      this.update();
     // const availableObject = this.model.player.availableObject;
      //this.update(availableObject)
    }
    this.model.onUpdateSidePanel.add(this.updateHandler);

    this.updateProgress = (props) => {
      const { progress, name } = props;
      this.updateObject(progress, name);
    }
    this.model.onUpdateSidePanelProgress.add(this.updateProgress);

    const availableObject = this.model.player.availableObject;
    //this.update(availableObject);
    const newArray = [];
    const list = this.model.player.allObject;

    this.update();
  }

  update() {
    const list = this.model.player.allObject;
    list.map(item => {
      if (this.buildButtons[item.object.name]) {
        this.buildButtons[item.object.name].update(item)
      } else {
        const obj = new BuildButton(this.node)
        obj.node.onclick = () => {
          this.model.player.addBuildsInProgress(item.object);
        }
        obj.update(item);
        this.buildButtons[item.object.name] = obj;    
      }      
    })
    const keys = Object.keys(this.buildButtons)
    if (list.length !== keys.length) {
      keys.map(item => {
        if (!list.find(it => it.object.name === item)) {
          this.buildButtons[item].destroy();
        }
      })
    }    
  }


  // update(availableObject: IObjectInfo[]) {
  //   ///todo: отрисовать панель и повесить клик
  //   availableObject.forEach(item => {
  //     const object = new Control(this.node);
  //     object.node.onclick = () => {
  //       this.model.player.addBuildsInProgress(item);
  //     }
  //   })
  // }

  updateObject(progress: number, name: string) {
    
  }

  destroy() {
    this.model.onUpdateSidePanel.remove(this.updateHandler);
    this.model.onUpdateSidePanelProgress.remove(this.updateProgress);
  
  }
}