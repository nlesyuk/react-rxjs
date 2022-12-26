import {
  Observable,
  debounceTime,
  map,
  distinctUntilChanged,
  fromEvent,
  takeUntil
} from 'rxjs'

// ============
// Observables:
// 1
// const search$ = new Observable(observer => {
//   console.log('Observable')
//   const search = document.querySelector('#search')
//   if (!search) {
//     observer.error('Error')
//   }
//   search.addEventListener('input', event => observer.next(event))
//   // observer.complete(1)
// });

// 2 work with Events
const search$ = fromEvent(
  document.querySelector('#search'),
  'input'
)
const stop$ = fromEvent(
  document.querySelector('#stop'),
  'click'
)

// Subscribes:
console.log('subscribe start')

// 1.1
// search$.subscribe({
//   next: v => console.log('next', v),
//   error: v => console.log('error', v),
//   complete: () => console.log('complete'),
// })

// 1.2
const searchSubscribtion = search$.pipe(
  map(e => e.target.value),
  debounceTime(1000),
  map(value => value.length > 3 ? value : ''),
  distinctUntilChanged(), // if value the same as prev, break
  takeUntil(stop$), // wok until stop$ emmited any value, then unsubscribe
).subscribe(v => console.log(v))

const stopSubscribtion = stop$.subscribe(() => {
  searchSubscribtion.unsubscribe()
  stopSubscribtion.unsubscribe()
})


// setTimeout(() => {
//   console.log('unsubscribe')
//   searchSubscribtion.unsubscribe()
// }, 5 * 1000)
// ============