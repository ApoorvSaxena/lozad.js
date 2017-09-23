import lozad from '../src/lozad';

const observer = lozad('.lozad', {
  rootMargin: '10px 0px 0px 0px', // syntax similar to that of CSS Margin
  threshold: 0.1 ,// ratio of element convergence
  load: (el) => {
      console.log('loading element');
      el.src = el.dataset.src;
  }
});
observer.observe();

// ... code to dynamically add elements
const container = document.getElementById('container')

container.onscroll = () => {
  if (container.scrollHeight - container.scrollTop < document.body.clientHeight - 40 ) {
    container.innerHTML += `<img class="lozad" data-src="/lozad.png" /><img class="lozad" data-src="/lozad.png" />`
    observer.observe();
  }
}