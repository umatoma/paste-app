import React from 'react';
import Konva from 'konva';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.stage = null;
    this.layer = null;
  }

  componentDidMount() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    const box = new Konva.Rect({
      x: 50,
      y: 50,
      width: 100,
      height: 50,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true,
    });
    this.layer.add(box);
    this.layer.draw();
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

  render() {
    return (
      <div ref={(element) => { this.container = element; }} />
    );
  }
}

export default Board;
