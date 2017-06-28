import EventEmitter from 'eventemitter3';
import Konva from 'konva';
import uuidv4 from 'uuid/v4';

class BoardCanvas extends EventEmitter {
  constructor(stageOption = {}) {
    super();
    this.stage = new Konva.Stage(stageOption);
    this.privateLayer = new Konva.Layer();
    this.publicLayer = new Konva.Layer();
    this.stage.add(this.privateLayer);
    this.stage.add(this.publicLayer);
  }

  setStageSize(width, height) {
    this.stage.setAttrs({ width, height });
  }

  addPrivateCard(x, y, fill) {
    const card = new Konva.Rect({
      id: uuidv4(),
      x,
      y,
      fill,
      width: 100,
      height: 100,
      opacity: 0.5,
      strokeEnabled: false,
      shadowColor: 'gray',
      shadowBlur: 4,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.5,
      draggable: true,
    });
    card.setZIndex(Date.now());
    card.on('mousedown', () => {
      card.setZIndex(Date.now());
      card.getLayer().draw();
    });
    card.on('dblclick', () => {
      const layer = card.getLayer();
      if (layer === this.privateLayer) {
        card.setOpacity(1.0);
        card.moveTo(this.publicLayer);
        this.stage.draw();
        this.emit('card:movetopublic', card);
      } else {
        const id = card.id();
        card.destroy();
        this.publicLayer.draw();
        this.emit('card:destroy', id);
      }
    });
    this.privateLayer.add(card);
    this.privateLayer.draw();
    this.emit('card:addprivate', card);
  }
}

export default BoardCanvas;
