import React from 'react';

const updateDimentions = (canvas) => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.setDimensions({ width, height });
};

class Board extends React.Component {
  constructor() {
    super();
    this.canvas = null;
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    updateDimentions(this.canvas);
    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red',
    });
    this.canvas.add(rect);
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
  }

  handleWindowResize() {
    updateDimentions(this.canvas);
  }

  render() {
    return (
      <canvas id="canvas" />
    );
  }
}

export default Board;
