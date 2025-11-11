import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../scss/main.scss';

const burger = document.querySelector('.burger');
const topbar = document.querySelector('.topbar');

if (burger && topbar) {
  burger.addEventListener('click', () => {
    topbar.classList.toggle('is-open');
  });
}