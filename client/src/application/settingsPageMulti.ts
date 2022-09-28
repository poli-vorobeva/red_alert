import Control from "../../../common/control";
import {  IInitialData } from "../game/dto";
import { IClientModel } from "../game/IClientModel";
import mapsData from "../game/maps.json";
import style from "./settingsPage.css";
import Range from '../components/range'

export interface IMapsData {
  size: string,
  players: number,
  name: string,
  src: string,
  srcData: string,
  initialData: IInitialData[][]
}

const mapSizes = ["64x64", "64x96", "96x96", "128x96", "128x128"];
/*
const defaultSettings: IGameOptions = {
  map: new Image(),//,defaultMap,
  credits: 10000
  //speed: 7,
}



export class SettingsModel {
  private settings: IGameOptions;
  constructor() {
    this.settings = defaultSettings;
  }

  loadFromStorage() {
    const storageData = localStorage.getItem('settings');
    const checkStorageData = (data: string | null) => {
      return !!data;
    }
    //if (!checkStorageData(storageData)) {
      this.settings = defaultSettings;
    // } else {
    //   const data: IGameOptions = JSON.parse(storageData); //todo не работает сохранение в локалстораж
    //   this.settings = data;
    // }
  }

  getData() {
    console.log(this.settings);
    return JSON.parse(JSON.stringify(this.settings));
  }

  setData(data: IGameOptions) {
    this.settings = data;
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('settings', JSON.stringify(this.settings));
  }
}

*/
export interface IGameOptions {
  map?: HTMLImageElement;
  mapGame?: number[][];
  credits: number;
  mapID?: number;
  speed?: number;
  info?: string;
  initialData: IInitialData[][];
  players: number;
}

export class Settings extends Control {
  onBack: () => void;
  onPlay: (settings: IGameOptions) => void;
  maps: IMapsData[];
  filteredMaps: IMapsData[];
  map: IMapsData;
  mapData: HTMLImageElement = new Image(96, 96)
  initialData: IInitialData[][]
  players: number = 2;
  //mapImage: HTMLImageElement;
  credit: number = 5000;
  // onStartGame: (players: string) => void;
  // onAuth: (name:string) => void;
  nameUser: string;
  onCreate: (settings: IGameOptions) => void;

  constructor(parentNode: HTMLElement) {
    //, initialSettings: IGameOptions/*, maps: IMapsData[]*/) {

    super(parentNode, "div", style["main_wrapper"]); // TODO сделать анимацию страницы //{default: style["main_wrapper"], hidden: style["hide"]});
    // this.socket = socket;
    // socket.onAuth = (name) => {
    //   //this.onAuth(name);
    //   this.nameUser = name;
    // }

    // socket.onStartGame = (data: string) => {
    //   this.onStartGame(data);
    // }

    this.credit = 10000; /*initialSettings.credits;*/
    this.loadMapsData().then((result) => {
      this.map = this.maps[0];
      this.render();
    });
    // this.map = {
    //   size: '64x64',
    //   players: 4,
    //   name: 'some map',
    //   src: '../assets/png/gold_min.png'
    // }

    // this.render();
  }
  render() {
    const settingsWrapper = new Control(
      this.node,
      "div",
      style["settings_wrapper"]
    );

    const basicSettingsWrapper = new Control(
      settingsWrapper.node,
      "div",
      style["basic_settings_wrapper"]
    );
    const moneyWrapper = new Control(
      basicSettingsWrapper.node,
      "div",
      style["item_wrapper"]
    );
    const moneyLabel = new Control<HTMLLabelElement>(moneyWrapper.node, 'label', style['item_settings'], 'Your credit')

    const money = new Range(moneyWrapper.node,
      'money',
      '1000', '10000', '1000', '1000', '10000');

    money.onChange = (value) => {
      this.credit = value;
    }

    money.setValue('5000');

    const playerWrapper = new Control(
      basicSettingsWrapper.node,
      "div",
      style["item_wrapper"]
    );
    const playersdLabel = new Control<HTMLLabelElement>(playerWrapper.node, 'label', style['item_settings'], 'Players')


    const playersInput = new Range(playerWrapper.node,
      'speed',
      '2', '4', '1', '2', '4');
    playersInput.onChange = (value) => {
      this.players = value;
    }


    const selectedMapWrapper = new Control(
      basicSettingsWrapper.node,
      "div",
      style["item_wrapper"]
    );
    const selectedMapLabel = new Control<HTMLLabelElement>(
      selectedMapWrapper.node,
      "label",
      "",
      "Выбранная карта:"
    );
    const selectedMapInput = new Control<HTMLInputElement>(
      selectedMapWrapper.node,
      "input",
      style["input_settings"]
    );
    selectedMapInput.node.type = "text";
    selectedMapInput.node.value = this.map.name + "  " + this.map.size;
    selectedMapInput.node.readOnly = true;

    const playersWrapper = new Control(
      settingsWrapper.node,
      "div",
      style["players_wrapper"]
    );
    const players = new Control<HTMLLabelElement>(
      playersWrapper.node,
      "textarea",
      style["players_area"],
      "Игроки"
    );

    const infoWrapper = new Control(
      settingsWrapper.node,
      "div",
      style["info_wrapper"]
    );
    const info = new Control<HTMLInputElement>(
      infoWrapper.node,
      "textarea",
      style["info_area"],
      "Информация"
    );

    const mapWrapper = new Control(
      settingsWrapper.node,
      "div",
      style["map_wrapper"]
    );
    const selectWrapper = new Control(
      mapWrapper.node,
      "div",
      style["map_select_wrapper"],
      "Choose map"
    );

    // const selectLabel = new Control<HTMLLabelElement>(selectWrapper.node, 'label', style["map_label"], 'Choose map')
    const mapSlider = new Control(mapWrapper.node, "div", style["map_slider"]);

    //const imageWrapper = new AnimatedControl(mapSlider.node, 'div', {default:style['image_map'], hidden:style['hide_map']});
    const imageWrapper = new Control(mapSlider.node, "div", style["image_map"]);
    const imageMap = new Image(200, 200);

    imageWrapper.node.append(imageMap);

    this.setImageMap(imageMap);
    const nameMap = new Control(
      imageWrapper.node,
      "div",
      style["name_map"],
      `${this.map.name}`
    );
    const prevButton = new Control(
      mapSlider.node,
      "button",
      style["prev_slider_button"],
      `&#10094;`
    );
    prevButton.node.onclick = () => {
      // imageWrapper.node.classList.add(style['hide_map']);
      // imageWrapper.node.ontransitionend = () => {
      //   imageWrapper.node.classList.remove(style['hide_map']);
      let index = this.maps.indexOf(this.map);
      if (index == 0) {
        index = this.maps.length - 1;
      } else index--;
      this.setImageMap(imageMap, index);
      selectedMapInput.node.value = this.map.name + "  " + this.map.size;
      // }
    };
    const nextButton = new Control(
      mapSlider.node,
      "button",
      style["next_slider_button"],
      `&#10095;`
    );
    nextButton.node.onclick = () => {
      // imageWrapper.node.classList.add(style['hide_map']);
      // imageWrapper.node.ontransitionend = () => {

      let index = this.maps.indexOf(this.map);
      if (index == this.maps.length - 1) index = 0;
      else index++;
      this.setImageMap(imageMap, index);
      selectedMapInput.node.value = this.map.name + "  " + this.map.size;
      //   imageWrapper.node.classList.remove(style['hide_map']);
      // }
    };
    const buttonsWrapper = new Control(
      settingsWrapper.node,
      "div",
      style["buttons_wrapper"]
    );
    const backButton = new Control(buttonsWrapper.node, "button", "", "back");
    backButton.node.onclick = () => {
      this.onBack();
    };

    const playButton = new Control(buttonsWrapper.node, "button", "", "play");
    playButton.node.onclick = () => {
      //TODO сформироать IGameOptions
      const settings: IGameOptions = {
        map: this.mapData,//this.mapImage,
        credits: this.credit,
        initialData: this.initialData,
        players: this.players,
      };
      // socket.onAuth = (name) => {
      //   this.onAuth(name);
      // }
      //socket.addUser();
      this.onCreate(settings);
    };
  }

  public async loadMapsData() {
    const res = await fetch(mapsData);
    this.maps = await res.json();
    return this.maps;
  }

  setImageMap(imageMap: HTMLImageElement, num: number = 0) {
    imageMap.src = this.maps[num].src;
    imageMap.alt = `Карта ${this.maps[num].name} размером ${this.maps[num].size}`;
    this.map = this.maps[num];

    this.mapData.src = this.maps[num].srcData;
    this.initialData = this.maps[num].initialData;
    //this.mapImage = imageMap;
  }

  // changeMap(imageMap: HTMLImageElement, selectedMapInput: Control<HTMLInputElement>, num:number = 0){
  //   this.setImageMap(imageMap, num);
  //   selectedMapInput.node.value = this.map.name + '  '+ this.map.size;
  //   //this.mapImage = imageMap;
  // }
}
