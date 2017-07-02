import EventEmitter from 'eventemitter3';
import Konva from 'konva';
import { createCard } from './shape-factory';

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
    const card = createCard({ x, y, fill }, {
      movetopublic: () => {
        card.setOpacity(1.0);
        card.moveTo(this.publicLayer);
        this.stage.draw();
        this.emit('card:movetopublic', card);
      },
      destroyed: (id) => {
        this.publicLayer.draw();
        this.emit('card:destroy', id);
      },
    });
    this.privateLayer.add(card);
    this.privateLayer.draw();
    this.emit('card:addprivate', card);
  }
}

export default BoardCanvas;
