import React from 'react';
import { BoardCanvas } from '../canvas';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.boardCanvas = null;
    this.state = {
      cardMessage: '',
      cardSize: 'medium',
    };
    this.handleChangeCardSize = this.handleChangeCardSize.bind(this);
    this.handleOnClickCardButton = this.handleOnClickCardButton.bind(this);
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

  handleChangeCardSize(event) {
    this.setState({ cardSize: event.target.value });
  }

  handleOnClickCardButton(event) {
    this.addPrivateCard(`${this.state.cardSize}_${event.target.value}`);
  }

  addPrivateCard(type) {
    const message = this.state.cardMessage;
    this.boardCanvas.addPrivateCard(message, type);
    this.setState({ cardMessage: '' });
  }

  render() {
    const { cardSize } = this.state;
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
          <div className="field">
            <p className="control">
              <label className="radio">
                <input type="radio" name="size" value="medium" checked={cardSize === 'medium'} onChange={this.handleChangeCardSize} /> Medium
              </label>
              <label className="radio">
                <input type="radio" name="size" value="large" checked={cardSize === 'large'} onChange={this.handleChangeCardSize} /> Large
              </label>
              <label className="radio">
                <input type="radio" name="size" value="small" checked={cardSize === 'small'} onChange={this.handleChangeCardSize} /> Small
              </label>
            </p>
          </div>
          <div className="columns">
            <div className="column">
              <input type="button" value="blue" className="button is-fullwidth is-info" onClick={this.handleOnClickCardButton} />
            </div>
            <div className="column">
              <input type="button" value="green" className="button is-fullwidth is-success" onClick={this.handleOnClickCardButton} />
            </div>
            <div className="column">
              <input type="button" value="red" className="button is-fullwidth is-warning" onClick={this.handleOnClickCardButton} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Board;
