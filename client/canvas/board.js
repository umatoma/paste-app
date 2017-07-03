import EventEmitter from 'eventemitter3';
import Konva from 'konva';
import { loadImages, createCard } from './shape-factory';

class BoardCanvas extends EventEmitter {
  constructor(stageOption = {}) {
    super();
    loadImages();
    this.stage = new Konva.Stage(Object.assign({
      draggable: true,
    }, stageOption));
    this.privateLayer = new Konva.Layer();
    this.publicLayer = new Konva.Layer();
    this.stage.add(this.privateLayer);
    this.stage.add(this.publicLayer);
  }

  setStageSize(width, height) {
    this.stage.setAttrs({ width, height });
  }

  addPrivateCard(message, x, y, fill) {
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
    const stage = this.stage;
    const oldScale = stage.scaleX();
    const oldCenterX = ((stage.x() / oldScale) + (stage.getWidth() / 2.0)) * oldScale;
    const oldCenterY = ((stage.y() / oldScale) + (stage.getHeight() / 2.0)) * oldScale;
    const newCenterX = (oldCenterX / oldScale) - (stage.x() / oldScale);
    const newCenterY = (oldCenterY / oldScale) - (stage.y() / oldScale);
    const posX = ((oldCenterX / newScale) - newCenterX) * newScale;
    const posY = ((oldCenterY / newScale) - newCenterY) * newScale;
    stage.scale({ x: newScale, y: newScale });
    stage.position({ x: posX, y: posY });
    stage.draw();
  }

  zoomInStage() {
    this.zoom(this.stage.scaleX() + 0.1);
  }

  zoomOutStage() {
    this.zoom(this.stage.scaleX() - 0.1);
  }
}

export default BoardCanvas;
