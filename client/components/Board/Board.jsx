import React from 'react';
import BoardCanvas from './board-canvas';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.boardCanvas = null;
  }

  componentDidMount() {
    this.boardCanvas = new BoardCanvas({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener('resize', this.handleWindowResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize.bind(this));
  }

  handleWindowResize() {
    this.boardCanvas.setStageSize(window.innerWidth, window.innerHeight);
  }

  addPrivateCard(fill) {
    const randomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min;
    const x = randomInt(100, 500);
    const y = randomInt(100, 500);
    this.boardCanvas.addPrivateCard(x, y, fill);
  }

  render() {
    return (
      <div>
        <div ref={(element) => { this.container = element; }} />
        <div style={{ position: 'fixed', top: 24, left: 24 }}>
          <button
            className="button is-info"
            style={{ marginRight: 8 }}
            onClick={() => this.addPrivateCard('hsl(217, 71%, 53%)')}
          >
            BLUE
          </button>
          <button
            className="button is-success"
            style={{ marginRight: 8 }}
            onClick={() => this.addPrivateCard('hsl(141,71%, 48%)')}
          >
            GREEN
          </button>
          <button
            className="button is-warning"
            style={{ marginRight: 8 }}
            onClick={() => this.addPrivateCard('hsl(48, 100%, 67%)')}
          >
            YELLOW
          </button>
        </div>
      </div>
    );
  }
}

export default Board;
