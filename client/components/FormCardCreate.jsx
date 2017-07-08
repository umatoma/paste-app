import React, { PropTypes } from 'react';

const FormCardCreate = ({ style, message, size, onChangeMessage, onChangeSize, onClickCreate }) => (
  <div style={style}>
    <div className="field">
      <label className="label" htmlFor="card">Card Message</label>
      <p className="control" style={{ width: 320 }}>
        <textarea
          name="card"
          className="textarea"
          placeholder="..."
          value={message}
          onChange={event => onChangeMessage(event.target.value)}
        />
      </p>
    </div>
    <div className="field">
      <p className="control">
        <label className="radio">
          <input
            type="radio"
            name="size"
            value="medium"
            checked={size === 'medium'}
            onChange={event => onChangeSize(event.target.value)}
          /> Medium
        </label>
        <label className="radio">
          <input
            type="radio"
            name="size"
            value="large"
            checked={size === 'large'}
            onChange={event => onChangeSize(event.target.value)}
          /> Large
        </label>
        <label className="radio">
          <input
            type="radio"
            name="size"
            value="small"
            checked={size === 'small'}
            onChange={event => onChangeSize(event.target.value)}
          /> Small
        </label>
      </p>
    </div>
    <div className="columns">
      <div className="column">
        <input
          type="button"
          value="blue"
          className="button is-fullwidth is-info"
          onClick={event => onClickCreate({ message, size, color: event.target.value })}
        />
      </div>
      <div className="column">
        <input
          type="button"
          value="green"
          className="button is-fullwidth is-success"
          onClick={event => onClickCreate({ message, size, color: event.target.value })}
        />
      </div>
      <div className="column">
        <input
          type="button"
          value="yellow"
          className="button is-fullwidth is-warning"
          onClick={event => onClickCreate({ message, size, color: event.target.value })}
        />
      </div>
    </div>
  </div>
);

FormCardCreate.defaultProps = {
  style: {},
};

FormCardCreate.propTypes = {
  style: PropTypes.object,
  message: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  onChangeMessage: PropTypes.func.isRequired,
  onChangeSize: PropTypes.func.isRequired,
  onClickCreate: PropTypes.func.isRequired,
};

export default FormCardCreate;
