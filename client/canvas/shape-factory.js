import Konva from 'konva';
import uuidv4 from 'uuid/v4';

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

  const menuRadius = 10;
  const menu = new Konva.Circle({
    x: (config.x + card.width()) - (menuRadius + 4),
    y: (config.y + card.height()) - (menuRadius + 4),
    radius: menuRadius,
    fill: '#ddd',
    strokeEnabled: false,
  });

  group.add(card);
  group.add(menu);
  group.setZIndex(Date.now());

  card.on('mousedown', () => {
    group.setZIndex(Date.now());
    group.getLayer().draw();
  });
  card.on('dblclick', listeners.movetopublic);
  menu.on('click', () => {
    const id = group.id();
    group.destroy();
    listeners.destroyed(id);
  });

  return group;
}
