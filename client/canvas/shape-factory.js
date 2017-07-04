import Konva from 'konva';
import uuidv4 from 'uuid/v4';

const imageDelete = new Image();
const imageShare = new Image();
const setCursorStyle = (shape, style) => {
  shape.getStage().container().style.cursor = style; // eslint-disable-line no-param-reassign
};

export function loadImages() {
  imageDelete.onload = () => { console.log('onload:imageDelete'); };
  imageDelete.src = '/delete.png';

  imageShare.onload = () => { console.log('onload:imageShare'); };
  imageShare.src = '/share.png';
}

export function createCard(message, config, listeners = {}) {
  const padding = 4;
  const group = new Konva.Group({
    id: uuidv4(),
    draggable: true,
    opacity: 0.5,
  });
  const card = new Konva.Rect({
    x: config.x,
    y: config.y,
    fill: config.fill,
    width: 128,
    height: 128,
    strokeEnabled: false,
    shadowColor: 'gray',
    shadowBlur: 4,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.5,
  });
  const text = new Konva.Text({
    text: message,
    x: card.getAttr('x') + padding,
    y: card.getAttr('y') + padding,
    width: card.width() - (padding * 2),
    height: card.height() - (padding * 2),
    listening: false,
  });

  const iconSize = 16;
  const del = new Konva.Image({
    x: (config.x + card.width()) - (iconSize + padding),
    y: (config.y + card.height()) - (iconSize + padding),
    width: iconSize,
    height: iconSize,
    image: imageDelete,
  });
  const share = new Konva.Image({
    x: config.x + padding,
    y: (config.y + card.height()) - (iconSize + padding),
    width: iconSize,
    height: iconSize,
    image: imageShare,
  });

  group.add(card, text, del, share);
  group.setZIndex(Date.now());

  card.on('mouseenter', () => setCursorStyle(group, 'move'));
  card.on('mouseleave', () => setCursorStyle(group, 'default'));
  card.on('mousedown', () => {
    group.setZIndex(Date.now());
    group.getLayer().draw();
  });
  del.on('mouseenter', () => setCursorStyle(group, 'pointer'));
  del.on('mouseleave', () => setCursorStyle(group, 'default'));
  del.on('click', () => {
    const id = group.id();
    del.off('mouseenter mouseleave');
    share.off('mouseenter mouseleave');
    group.getStage().container().style.cursor = 'default';
    group.destroyChildren();
    group.destroy();
    listeners.destroyed(id);
  });
  share.on('mouseenter', () => setCursorStyle(group, 'pointer'));
  share.on('mouseleave', () => setCursorStyle(group, 'default'));
  share.on('click', () => {
    group.setOpacity(1.0);
    group.on('dragmove', () => listeners.dragmove({
      id: group.id(),
      x: group.x(),
      y: group.y(),
      zIndex: group.getZIndex(),
      fill: card.fill(),
      text: text.text(),
    }));
    share.remove();
    listeners.public();
  });

  return group;
}
