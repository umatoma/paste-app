import Konva from 'konva';
import uuidv4 from 'uuid/v4';

export function createCard(config) {
  const card = new Konva.Rect(Object.assign({
    id: uuidv4(),
    width: 100,
    height: 100,
    opacity: 0.5,
    strokeEnabled: false,
    shadowColor: 'gray',
    shadowBlur: 4,
    shadowOffset: { x: 2, y: 2 },
    shadowOpacity: 0.5,
    draggable: true,
  }, config));
  card.setZIndex(Date.now());
  return card;
}
