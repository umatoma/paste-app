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
    this.socket = io();
    this.socket.on('connect', () => {
      console.log(`connect ${this.socket.id}`);
    });
    this.socket.on('card:dragmove', (attrs) => {
      const node = this.stage.findOne(`#${attrs.id}`);
      if (node) {
        node.setAttrs(attrs);
      } else {
        const card = new Konva.Rect(Object.assign({
          width: 128,
          height: 128,
          strokeEnabled: false,
          shadowColor: 'gray',
          shadowBlur: 4,
          shadowOffset: { x: 2, y: 2 },
          shadowOpacity: 0.5,
        }, attrs));
        this.publicLayer.add(card);
      }
      this.publicLayer.batchDraw();
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
    const posX = (randomInt(24, 224) - stage.position().x) / scale;
    const posY = (randomInt(24, stage.getHeight() - 376) - stage.position().y) / scale;
    const card = createCard(message, { x: posX, y: posY, fill }, {
      dragmove: (attrs) => {
        this.socket.emit('card:dragmove', attrs);
      },
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
