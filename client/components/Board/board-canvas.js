import Konva from 'konva';

class BoardCanvas {
  constructor(stageOption = {}) {
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
      } else {
        card.destroy();
        this.publicLayer.draw();
      }
    });
    this.privateLayer.add(card);
    this.privateLayer.draw();
  }
}

export default BoardCanvas;
