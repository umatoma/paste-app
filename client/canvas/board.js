import EventEmitter from 'eventemitter3';
import Konva from 'konva';
import io from 'socket.io-client';
import { loadImages, createCard } from './shape-factory';

const SCALE_STEP = 0.1;
const MAX_SCALE = 2.0;
const MIN_SCALE = 0.5;

class BoardCanvas extends EventEmitter {
  constructor(stageOption = {}) {
    super();
    loadImages();
    this.stage = new Konva.Stage(Object.assign({
      draggable: true,
    }, stageOption));
    this.privateLayer = new Konva.Layer();
    this.publicLayer = new Konva.Layer();
    this.stage.add(this.publicLayer, this.privateLayer);

    // WebSocket
    this.socket = io('http://localhost:3000');
    this.socket.on('connect', () => {
      console.log(`connect ${this.socket.id}`);
    });
  }

  setStageSize(width, height) {
    this.stage.setAttrs({ width, height });
  }

  // TODO: 初回描画位置に規則性を持たせる
  addPrivateCard(message, fill) {
    const randomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;
    const stage = this.stage;
    const scale = stage.scaleX();
    const x = (randomInt(24, 224) - stage.position().x) / scale;
    const y = (randomInt(24, stage.getHeight() - 376) - stage.position().y) / scale;
    const card = createCard(message, { x, y, fill }, {
      public: () => {
        card.moveTo(this.publicLayer);
        this.stage.draw();
        this.emit('card:movetopublic', card);
      },
      destroyed: (id) => {
        this.stage.draw();
        this.emit('card:destroy', id);
      },
    });
    this.privateLayer.add(card);
    this.privateLayer.draw();
    this.emit('card:addprivate', card);
  }

  zoom(newScale) {
    if (newScale > MAX_SCALE || newScale < MIN_SCALE) {
      return;
    }
    const stage = this.stage;
    const x = ((stage.getWidth() / 2.0) - stage.position().x) / stage.scaleX();
    const y = ((stage.getHeight() / 2.0) - stage.position().y) / stage.scaleX();
    const posX = ((stage.getWidth() / 2.0) - (x * newScale));
    const posY = ((stage.getHeight() / 2.0) - (y * newScale));
    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: posX, y: posY });
    stage.batchDraw();
  }

  zoomInStage() {
    this.zoom(this.stage.scaleX() + SCALE_STEP);
  }

  zoomOutStage() {
    this.zoom(this.stage.scaleX() - SCALE_STEP);
  }
}

export default BoardCanvas;
