import React, { PropTypes } from 'react';


const BoardButtons = ({ style, onClickZoomIn, onClickZoomOut }) => (
  <div style={style}>
    <div className="field">
      <button className="button is-medium" onClick={onClickZoomIn}>
        <span className="icon is-medium">
          <i className="fa fa-plus" />
        </span>
      </button>
    </div>
    <div className="field">
      <button className="button is-medium" onClick={onClickZoomOut} >
        <span className="icon is-medium">
          <i className="fa fa-minus" />
        </span>
      </button>
    </div>
  </div>
);

BoardButtons.defaultProps = {
  style: {},
};

BoardButtons.propTypes = {
  style: PropTypes.object,
  onClickZoomIn: PropTypes.func.isRequired,
  onClickZoomOut: PropTypes.func.isRequired,
};

export default BoardButtons;
