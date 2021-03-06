import Konva from 'konva';
import uuidv4 from 'uuid/v4';

const SHAPE_TYPES = {
  medium_blue: { fill: 'hsl(217, 71%, 53%)', size: 128 },
  medium_green: { fill: 'hsl(141,71%, 48%)', size: 128 },
  medium_yellow: { fill: 'hsl(48, 100%, 67%)', size: 128 },
  large_blue: { fill: 'hsl(217, 71%, 53%)', size: 192 },
  large_green: { fill: 'hsl(141,71%, 48%)', size: 192 },
  large_yellow: { fill: 'hsl(48, 100%, 67%)', size: 192 },
  small_blue: { fill: 'hsl(217, 71%, 53%)', size: 96 },
  small_green: { fill: 'hsl(141,71%, 48%)', size: 96 },
  small_yellow: { fill: 'hsl(48, 100%, 67%)', size: 96 },
};

const imageDelete = new Image();
const imageShare = new Image();
const setCursorStyle = (shape, style) => {
  shape.getStage().container().style.cursor = style; // eslint-disable-line no-param-reassign
};

function createCard({ id, x, y, type, zIndex, text }, listeners, isPublic) {
  const padding = 4;
  const group = new Konva.Group({
    id: id || uuidv4(),
    name: type,
    x,
    y,
    width: SHAPE_TYPES[type].size,
    height: SHAPE_TYPES[type].size,
    draggable: true,
    opacity: 0.5,
  });
  const card = new Konva.Rect({
    x: 0,
    y: 0,
    fill: SHAPE_TYPES[type].fill,
    width: SHAPE_TYPES[type].size,
    height: SHAPE_TYPES[type].size,
    strokeEnabled: false,
    shadowColor: 'gray',
    shadowBlur: 4,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.5,
  });
  const message = new Konva.Text({
    text,
    x: card.x() + padding,
    y: card.y() + padding,
    width: card.width() - (padding * 2),
    height: card.height() - (padding * 2),
    fill: 'hsl(0, 0%, 29%)',
    listening: false,
  });

  const iconSize = 16;
  const del = new Konva.Image({
    x: (card.x() + card.width()) - (iconSize + padding),
    y: (card.y() + card.height()) - (iconSize + padding),
    width: iconSize,
    height: iconSize,
    image: imageDelete,
  });
  const share = new Konva.Image({
    x: card.x() + padding,
    y: (card.y() + card.height()) - (iconSize + padding),
    width: iconSize,
    height: iconSize,
    image: imageShare,
  });

  group.add(card, message, del, share);
  group.setZIndex(zIndex || Date.now());
  group.isPublic = false;
  group.customDestroy = () => {
    const _id = group.id(); // eslint-disable-line
    const isPublic = group.isPublic;
    del.off('mouseenter mouseleave');
    share.off('mouseenter mouseleave');
    group.getStage().container().style.cursor = 'default';
    group.destroyChildren();
    group.destroy();
    listeners.destroy(_id, isPublic);
  };
  group.customToPublic = () => {
    group.isPublic = true;
    group.setOpacity(1.0);
    group.on('dragmove', () => listeners.dragmove({
      id: group.id(),
      x: group.x(),
      y: group.y(),
      zIndex: group.getZIndex(),
      type: group.name(),
      text: message.text(),
    }));
  };

  card.on('mouseenter', () => setCursorStyle(group, 'move'));
  card.on('mouseleave', () => setCursorStyle(group, 'default'));
  card.on('mousedown', () => {
    group.setZIndex(Date.now());
    group.getLayer().draw();
  });
  del.on('mouseenter', () => setCursorStyle(group, 'pointer'));
  del.on('mouseleave', () => setCursorStyle(group, 'default'));
  del.on('click', () => group.customDestroy());
  share.on('mouseenter', () => setCursorStyle(group, 'pointer'));
  share.on('mouseleave', () => setCursorStyle(group, 'default'));
  share.on('click', () => {
    group.customToPublic();
    share.remove();
    listeners.public({
      id: group.id(),
      x: group.x(),
      y: group.y(),
      zIndex: group.getZIndex(),
      type: group.name(),
      text: message.text(),
    }, group);
  });

  if (isPublic) {
    group.customToPublic();
    share.remove();
  }

  return group;
}

export function loadImages() {
  imageDelete.onload = () => { console.log('onload:imageDelete'); };
  imageDelete.src = '/delete.png';

  imageShare.onload = () => { console.log('onload:imageShare'); };
  imageShare.src = '/share.png';
}

export function createPublicCard(config, listeners) {
  return createCard(config, listeners, true);
}

export function createPrivateCard(config, listeners) {
  return createCard(config, listeners, false);
}
