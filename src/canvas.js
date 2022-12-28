import {
  Observable,
  debounceTime,
  map,
  distinctUntilChanged,
  fromEvent,
  takeUntil,
  switchMap,
  pairwise,
  take,
  interval,
  timer,
  range,
  tap,
  takeWhile
} from 'rxjs'

const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d')
ctx.lineWidth = 4;
ctx.strokeStyle = '#00f';

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
const clearBtn$ = fromEvent(document.querySelector('#clear'), 'click');
const sizeBtn$ = fromEvent(document.querySelector('#range'), 'change');
const colorBtn$ = fromEvent(document.querySelector('#color'), 'change');


// paint
const point$ = mousemove$.pipe(
  map(e => {
    const { left, top } = canvas.getBoundingClientRect()
    return ({
      x: e.clientX - left,
      y: e.clientY - top
    })
  }),
  pairwise(),
)

mousedown$.pipe(
  switchMap(() => point$.pipe(
    takeUntil(mouseout$),
    takeUntil(mouseup$),
  )),
).subscribe({
  next: drawLine,
  complete: console.log('Complete')
})

// buttons
clearBtn$.subscribe(() => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
})
sizeBtn$.pipe(
  map(e => Number(e.target.value)),
  tap(v => console.log('Tap size', v))
).subscribe((value) => {
  ctx.lineWidth = value;
})
colorBtn$.pipe(
  map(e => Number(e.target.value)),
  tap(v => console.log('Tap color', v))
).subscribe((value) => {
  ctx.strokeStyle = value;
})


// interval(500).pipe(
//   takeWhile(v => v < 6)
// ).subscribe({
//   next: (v) => console.log('Next', v),
//   complete: console.log('Complete')
// })