import React, { PropTypes } from 'react';
import { BoardCanvas } from '../canvas';
import BoardButtons from './BoardButtons';
import FormCardCreate from './FormCardCreate';

class Board extends React.Component {
  constructor() {
    super();
    this.container = null;
    this.boardCanvas = null;
    this.state = {
      cardMessage: '',
      cardSize: 'medium',
    };
  }

  componentDidMount() {
    const { boardId } = this.props.match.params;
    this.boardCanvas = new BoardCanvas({
      container: this.container,
      width: window.innerWidth,
      height: window.innerHeight,
    }, boardId);
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

  handleOnClickCardButton(event) {
    this.addPrivateCard(`${this.state.cardSize}_${event.target.value}`);
  }

  addPrivateCard({ message, size, color }) {
    const type = `${size}_${color}`;
    this.boardCanvas.addPrivateCard(message, type);
    this.setState({ cardMessage: '' });
  }

  render() {
    const { boardId } = this.props.match.params;
    return (
      <div>
        <div ref={(element) => { this.container = element; }} />
        <h1 className="title" style={{ position: 'fixed', top: 24, right: 24 }}>{boardId}</h1>
        <BoardButtons
          style={{ position: 'fixed', top: 24, left: 24 }}
          onClickZoomIn={() => this.boardCanvas.zoomInStage()}
          onClickZoomOut={() => this.boardCanvas.zoomOutStage()}
        />
        <FormCardCreate
          style={{ position: 'fixed', bottom: 24, left: 24 }}
          message={this.state.cardMessage}
          size={this.state.cardSize}
          onChangeMessage={value => this.setState({ cardMessage: value })}
          onChangeSize={value => this.setState({ cardSize: value })}
          onClickCreate={({ message, size, color }) => this.addPrivateCard({ message, size, color })}
        />
      </div>
    );
  }
}

Board.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Board;
