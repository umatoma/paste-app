import React from 'react';
import Konva from 'konva';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.stage = null;
    this.publicLayer = null;
  }

  componentDidMount() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.privateLayer = new Konva.Layer();
    this.publicLayer = new Konva.Layer();
    this.stage.add(this.privateLayer);
    this.stage.add(this.publicLayer);
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
  }

  handleWindowResize() {
    this.stage.setAttrs({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  addBox(fill) {
    const randomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;
    const box = new Konva.Rect({
      x: randomInt(100, 500),
      y: randomInt(100, 500),
      width: 100,
      height: 100,
      fill,
      opacity: 0.5,
      strokeEnabled: false,
      shadowColor: 'gray',
      shadowBlur: 4,
      shadowOffset: { x: 2, y: 2 },
      shadowOpacity: 0.5,
      draggable: true,
    });
    box.setZIndex(Date.now());
    box.on('mousedown', () => {
      box.setZIndex(Date.now());
      box.getLayer().draw();
    });
    box.on('dblclick', () => {
      const layer = box.getLayer();
      if (layer === this.privateLayer) {
        box.setOpacity(1.0);
        box.moveTo(this.publicLayer);
        this.stage.draw();
      } else {
        box.destroy();
        this.publicLayer.draw();
      }
    });
    this.privateLayer.add(box);
    this.privateLayer.draw();
  }

  render() {
    return (
      <div>
        <div ref={(element) => { this.container = element; }} />
        <div style={{ position: 'fixed', top: 24, left: 24 }}>
          <button
            className="button is-info"
            style={{ marginRight: 8 }}
            onClick={() => this.addBox('hsl(217, 71%, 53%)')}
          >
            BLUE
          </button>
          <button
            className="button is-success"
            style={{ marginRight: 8 }}
            onClick={() => this.addBox('hsl(141,71%, 48%)')}
          >
            GREEN
          </button>
          <button
            className="button is-warning"
            style={{ marginRight: 8 }}
            onClick={() => this.addBox('hsl(48, 100%, 67%)')}
          >
            YELLOW
          </button>
        </div>
      </div>
    );
  }
}

export default Board;
