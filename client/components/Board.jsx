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

  addPrivateCard(type) {
    const message = this.state.cardMessage;
    this.boardCanvas.addPrivateCard(message, type);
    this.setState({ cardMessage: '' });
  }

  render() {
    return (
      <div>
        <div ref={(element) => { this.container = element; }} />
        <div style={{ position: 'fixed', top: 24, left: 24 }}>
          <div className="field">
            <button
              className="button is-medium"
              onClick={() => this.boardCanvas.zoomInStage()}
            >
              <span className="icon is-medium">
                <i className="fa fa-plus" />
              </span>
            </button>
          </div>
          <div className="field">
            <button
              className="button is-medium"
              onClick={() => this.boardCanvas.zoomOutStage()}
            >
              <span className="icon is-medium">
                <i className="fa fa-minus" />
              </span>
            </button>
          </div>
        </div>
        <div style={{ position: 'fixed', bottom: 24, left: 24 }}>
          <div className="field">
            <label className="label" htmlFor="card">Card Message</label>
            <p className="control" style={{ width: 320 }}>
              <textarea
                name="card"
                className="textarea"
                placeholder="..."
                value={this.state.cardMessage}
                onChange={event => this.setState({ cardMessage: event.target.value })}
              />
            </p>
          </div>
          <div className="columns">
            <div className="column">
              <button
                className="button is-fullwidth is-info"
                onClick={() => this.addPrivateCard('blue')}
              >
                BLUE
              </button>
            </div>
            <div className="column">
              <button
                className="button is-fullwidth is-success"
                onClick={() => this.addPrivateCard('green')}
              >
                GREEN
              </button>
            </div>
            <div className="column">
              <button
                className="button is-fullwidth is-warning"
                onClick={() => this.addPrivateCard('red')}
              >
                YELLOW
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
