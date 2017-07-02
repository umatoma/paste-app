import Konva from 'konva';
import uuidv4 from 'uuid/v4';

const imageDelete = new Image();

export function loadImages() {
  imageDelete.onload = () => {
    console.log('onload:imageDelete');
  };
  imageDelete.src = '/delete.png';
}

export function createCard(config, listeners = {}) {
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

  const menuSize = 16;
  const menu = new Konva.Image({
    x: (config.x + card.width()) - (menuSize + 4),
    y: (config.y + card.height()) - (menuSize + 4),
    width: menuSize,
    height: menuSize,
    image: imageDelete,
  });

  group.add(card);
  group.add(menu);
  group.setZIndex(Date.now());

  card.on('mouseenter', () => {
    card.getStage().container().style.cursor = 'move';
  });
  card.on('mouseleave', () => {
    card.getStage().container().style.cursor = 'default';
  });
  card.on('mousedown', () => {
    group.setZIndex(Date.now());
    group.getLayer().draw();
  });
  card.on('dblclick', listeners.movetopublic);
  menu.on('mouseenter', () => {
    menu.getStage().container().style.cursor = 'pointer';
  });
  menu.on('mouseleave', () => {
    menu.getStage().container().style.cursor = 'default';
  });
  menu.on('click', () => {
    const id = group.id();
    menu.off('mouseenter');
    menu.off('mouseleave');
    group.getStage().container().style.cursor = 'default';
    group.destroyChildren();
    group.destroy();
    listeners.destroyed(id);
  });

  return group;
}
