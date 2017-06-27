import React from 'react';

class Board extends React.Component {
  constructor() {
    super();
    this.canvas = null;
  }

  componentDidMount() {
    this.canvas = new fabric.Canvas('canvas');
    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red',
    });
    this.canvas.add(rect);
  }

  render() {
    return (
      <canvas id="canvas" width="300" height="300" />
    );
  }
}

export default Board;
