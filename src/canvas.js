import {
  Observable,
  debounceTime,
  map,
  distinctUntilChanged,
  fromEvent,
  takeUntil,
  switchMap,
  pairwise,
  take
} from 'rxjs'

const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')

ctx.lineWidth = 4;

function drawLine([prev, next]) {
  ctx.beginPath();
  ctx.moveTo(prev.x, prev.y)
  ctx.lineTo(next.x, next.y)
  ctx.stroke();
}

const mousemove$ = fromEvent(canvas, 'mousemove');
const mousedown$ = fromEvent(canvas, 'mousedown');
const mouseup$ = fromEvent(canvas, 'mouseup');
const mouseout$ = fromEvent(canvas, 'mouseout');


const point$ = mousemove$.pipe(
  map(e => {
    const { left, top } = canvas.getBoundingClientRect()
    return ({
      x: e.clientX - left,
      y: e.clientY - top
    })
  }),
  pairwise()
)

mousedown$.pipe(
  // switchMap переключаємось на інший потік
  switchMap(() => point$.pipe(
    takeUntil(mouseout$), // умови виходу
    takeUntil(mouseup$),
  ))
).subscribe(drawLine)