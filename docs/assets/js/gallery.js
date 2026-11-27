// Package page gallery (_includes/media-gallery.html).
// The stage shows one slide: the video, which loads YouTube only on click, or an
// image. The thumbnails pick a slide. Images open fullscreen in a <dialog>, which
// steps through the images only; the video goes fullscreen from YouTube's own button.
(function () {
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var stage = gallery.querySelector('.gallery-stage');
    var video = stage.querySelector('.gallery-video');
    var image = stage.querySelector('.gallery-image');
    var zoom = stage.querySelector('.gallery-zoom');
    var count = stage.querySelector('.gallery-count');
    var thumbStrip = gallery.querySelector('.gallery-thumbs');
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.gallery-thumb'));
    var box = gallery.querySelector('.gallery-lightbox');
    var boxImage = box.querySelector('.gallery-lightbox-image');
    var boxCaption = box.querySelector('.gallery-lightbox-caption');
    var current = 0;

    function stopVideo() {
      var frame = video && video.querySelector('iframe');
      if (frame) frame.remove();
      if (video) video.classList.remove('is-playing');
    }

    function show(index) {
      current = (index + thumbs.length) % thumbs.length;
      var thumb = thumbs[current];
      var isVideo = thumb.dataset.kind === 'video';

      stopVideo();
      if (video) video.hidden = !isVideo;
      image.hidden = isVideo;
      zoom.hidden = isVideo;
      if (!isVideo) {
        image.src = thumb.dataset.src;
        image.alt = thumb.dataset.alt;
      }

      thumbs.forEach(function (t, i) {
        t.classList.toggle('is-current', i === current);
        t.setAttribute('aria-current', i === current ? 'true' : 'false');
      });
      count.textContent = (current + 1) + ' / ' + thumbs.length;

      // Keep the current thumbnail in view, scrolling the strip only, never the page.
      var left = thumb.offsetLeft - thumbStrip.offsetLeft;
      if (left < thumbStrip.scrollLeft || left + thumb.offsetWidth > thumbStrip.scrollLeft + thumbStrip.clientWidth) {
        thumbStrip.scrollTo({ left: left - (thumbStrip.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
      }
    }

    function imageIndexes() {
      return thumbs.map(function (t, i) { return t.dataset.kind === 'image' ? i : -1; })
                   .filter(function (i) { return i >= 0; });
    }

    function showInBox(index) {
      show(index);
      boxImage.src = thumbs[current].dataset.src;
      boxImage.alt = thumbs[current].dataset.alt;
      boxCaption.textContent = thumbs[current].dataset.alt;
    }

    function stepBox(delta) {
      var list = imageIndexes();
      var at = list.indexOf(current);
      showInBox(list[(at + delta + list.length) % list.length]);
    }

    function openBox() {
      if (thumbs[current].dataset.kind !== 'image') return;
      showInBox(current);
      box.showModal();
    }

    // The JavaScript version: reveal the controls the no-script markup leaves hidden.
    thumbStrip.hidden = false;
    count.hidden = false;
    stage.querySelectorAll('.gallery-arrow').forEach(function (b) { b.hidden = false; });
    gallery.classList.add('is-ready');

    thumbs.forEach(function (t, i) {
      t.addEventListener('click', function () { show(i); });
    });
    stage.querySelector('.gallery-prev').addEventListener('click', function () { show(current - 1); });
    stage.querySelector('.gallery-next').addEventListener('click', function () { show(current + 1); });
    zoom.addEventListener('click', openBox);
    image.addEventListener('click', openBox);

    if (video) {
      video.addEventListener('click', function (e) {
        e.preventDefault();
        if (video.querySelector('iframe')) return;
        var frame = document.createElement('iframe');
        frame.src = 'https://www.youtube-nocookie.com/embed/' + video.dataset.video + '?autoplay=1&rel=0';
        frame.title = video.textContent.trim();
        frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        video.appendChild(frame);
        video.classList.add('is-playing');
      });
    }

    // Arrow keys while focus is in the gallery (not while the video has it).
    gallery.addEventListener('keydown', function (e) {
      if (box.open) return;
      if (e.key === 'ArrowLeft') { show(current - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { show(current + 1); e.preventDefault(); }
    });

    box.querySelector('.gallery-prev').addEventListener('click', function () { stepBox(-1); });
    box.querySelector('.gallery-next').addEventListener('click', function () { stepBox(1); });
    box.querySelector('.gallery-close').addEventListener('click', function () { box.close(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { stepBox(-1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { stepBox(1); e.preventDefault(); }
    });
    // A click on the backdrop, outside the image and the buttons, closes.
    box.addEventListener('click', function (e) {
      if (e.target === box) box.close();
    });

    // Swipe on touch screens, in the stage and in fullscreen.
    function swipe(el, onLeft, onRight) {
      var x = null;
      el.addEventListener('touchstart', function (e) { x = e.touches[0].clientX; }, { passive: true });
      el.addEventListener('touchend', function (e) {
        if (x === null) return;
        var dx = e.changedTouches[0].clientX - x;
        x = null;
        if (Math.abs(dx) > 50) (dx < 0 ? onLeft : onRight)();
      });
    }
    swipe(stage, function () { show(current + 1); }, function () { show(current - 1); });
    swipe(box, function () { stepBox(1); }, function () { stepBox(-1); });

    show(0);
  });
})();
