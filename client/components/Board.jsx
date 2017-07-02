import React from 'react';
import { BoardCanvas } from '../canvas';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.boardCanvas = null;
    this.state = {
      cardMessage: '',
    };
  }

  componentDidMount() {
    this.boardCanvas = new BoardCanvas({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    this.boardCanvas.on('card:addprivate', (card) => {
      console.log('card:addprivate', card);
    });
    this.boardCanvas.on('card:movetopublic', (card) => {
      console.log('card:movetopublic', card);
    });
    this.boardCanvas.on('card:destroy', (id) => {
      console.log('card:destroy', id);
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
    const message = this.state.cardMessage;
    const x = randomInt(100, 500);
    const y = randomInt(100, 500);
    this.boardCanvas.addPrivateCard(message, x, y, fill);
    this.setState({ cardMessage: '' });
  }

  render() {
    return (
      <div>
        <div ref={(element) => { this.container = element; }} />
        <div style={{ position: 'fixed', bottom: 12, left: 24 }}>
          <div className="field">
            <label className="label" htmlFor="card">Message</label>
            <p className="control">
              <textarea
                name="card"
                className="textarea"
                placeholder="Textarea"
                value={this.state.cardMessage}
                onChange={event => this.setState({ cardMessage: event.target.value })}
              />
            </p>
          </div>
          <div>
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
      </div>
    );
  }
}

export default Board;
