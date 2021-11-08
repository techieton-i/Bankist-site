'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// implementing the smooth scrooling

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());
  console.log('current scroll (x/y)', window.pageXOffset, window.pageYOffset);
  console.log('height/width of viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

  // scrolling
  // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});


// PAGE NAVIGATION

// using normal method
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// using events delegation
// 1. you select a common parent and put the event listener on it
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(t => t.addEventListener('click', () => console.log('TAB')));     old method

// using events delegation

tabsContainer.addEventListener('click', function (e) {

  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // active tab
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clicked.getAttribute('data-tab')}`)
    // or use clicked.dataset.tab

    .classList.add('operations__content--active');
});


// console.log(nav);

// ///////Menu fade animation 
// passing args to event handlers

const handleOver = function (e, opacity) {

  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const sibling = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    sibling.forEach(el => {
      if (el !== link)
        el.style.opacity = this;

    });
    logo.style.opacity = this;
  }
};

// using bind

nav.addEventListener('mouseover', handleOver.bind(0.5));

nav.addEventListener('mouseout', handleOver.bind(1.0));


// // sticky nav
// const initCoords = section1.getBoundingClientRect();
// console.log(initCoords);


// window.addEventListener('scroll', function (e) {
//   if (window.scrollY > initCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// sticky nav using intersection Api
// const obsCallback = function (entries, observe) {
//   entries.forEach(entry => {

//     console.log(entry);
//   });
// };

// const obsOption = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallback, obsOption);
// observer.observe(section1);;
const callback = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const headerObserver = new IntersectionObserver(callback, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.20,

});
allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');

});

// ///lazy loading of images
const imgTarget = document.querySelectorAll('.lazy-img[data-src]');
const loadImg = function (entries, observe) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  // entry.target.setAttribute('src', `${entry.target.dataset.src}`);
  // entry.target.classList.remove('lazy-img');

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, { root: null, threshold: 0 });

imgTarget.forEach(img => imgObserver.observe(img));
// //////
// //////////////////////////
// ///slider
const slider = function () {

  const slides = document.querySelectorAll('.slide');
  const sliderBtnRight = document.querySelector('.slider__btn--right');
  const sliderBtnLeft = document.querySelector('.slider__btn--left');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  let maxSlides = slides.length;


  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`);
    });
  };

  const activeSlide = function (slide) {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

    document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active');
  };

  // slides.forEach((s, i) => s.style.transform = `translateX(${100 * i}%)`);
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      // s.style.transform = `translateX(${100 * (i - slide)}%)`;
      s.style.transform = `translateX(${(100 * i) - 100 * slide}%)`;
    });
  };

  // Next slide
  const nextSlide = function () {
    curSlide++;
    if (curSlide === maxSlides) {
      curSlide = 0;
    } else {

    }
    goToSlide(curSlide);
    activeSlide(curSlide);
  };

  // prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlides;
    }
    curSlide--;
    goToSlide(curSlide);
    activeSlide(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
    activeSlide(0);
  };
  init();


  // event handlers
  sliderBtnRight.addEventListener('click', nextSlide);
  sliderBtnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();

  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;
      goToSlide(slide);
      activeSlide(slide);
    }
  });;
};
slider();








// // calling d function
// nav.addEventListener('mouseover', function (e) {
//   handleOver(e, 0.5);
// });

// nav.addEventListener('mouseout', function (e) {
//   handleOver(e, 1.0);
// };



/////////////////////////////////////////////////////////////
///////////////////////////////////////////////////
///////////////////////



// Event Propagation capturing and bubbling
// const randomint = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomint(0, 255)},${randomint(0, 255)},${randomint(0, 255)})`;

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });
// document.querySelector('.nav').addEventListener('click', function (e) {
//   e.preventDefault();
//   this.style.backgroundColor = randomColor();
// });