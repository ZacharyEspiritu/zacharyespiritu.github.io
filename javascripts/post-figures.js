(function () {
  function fallbackCopy(text) {
    var input = document.createElement('textarea');
    input.value = text;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    var copied = false;
    try {
      copied = document.execCommand('copy');
    } catch (error) {
      copied = false;
    }
    input.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error('Copy unavailable'));
  }

  function copyLink(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () {
        return fallbackCopy(text);
      });
    }
    return fallbackCopy(text);
  }

  function figureLetter(number) {
    var letters = '';
    while (number > 0) {
      number -= 1;
      letters = String.fromCharCode(65 + number % 26) + letters;
      number = Math.floor(number / 26);
    }
    return letters;
  }

  function initialize() {
    var article = document.querySelector('.blog-post-content');
    if (!article || article.classList.contains('figure-links-ready')) return;

    var figures = Array.from(article.children).filter(function (element) {
      return element.tagName === 'FIGURE' && element.querySelector(':scope > figcaption');
    });
    var lettersById = new Map();

    figures.forEach(function (figure, index) {
      var letter = figureLetter(index + 1);
      var caption = figure.querySelector(':scope > figcaption');

      if (!figure.id) {
        var base = 'figure-' + letter.toLowerCase();
        var id = base;
        var suffix = 2;
        while (document.getElementById(id)) id = base + '-' + suffix++;
        figure.id = id;
      }
      lettersById.set(figure.id, letter);

      var link = document.createElement('a');
      var icon = document.createElement('span');
      var announcement = document.createElement('span');
      var label = 'Figure ' + letter;
      var resetTimer;

      link.className = 'figure-permalink';
      link.href = '#' + encodeURIComponent(figure.id);
      link.title = 'Copy link to ' + label;
      link.setAttribute('aria-label', 'Copy link to ' + label);
      link.appendChild(document.createTextNode(label));

      icon.className = 'figure-permalink-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = '#';
      link.appendChild(icon);

      announcement.className = 'figure-copy-announcement';
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      caption.prepend(link, document.createTextNode('. '), announcement);

      link.addEventListener('click', function () {
        copyLink(link.href).then(function () {
          icon.textContent = '✓';
          link.title = 'Link copied';
          announcement.textContent = 'Link to ' + label + ' copied to clipboard.';
        }, function () {
          icon.textContent = '!';
          link.title = 'Copy unavailable; use the browser’s Copy Link command';
          announcement.textContent = 'Could not copy automatically. Use the browser’s Copy Link command.';
        }).then(function () {
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            icon.textContent = '#';
            link.title = 'Copy link to ' + label;
            announcement.textContent = '';
          }, 2500);
        });
      });
    });

    article.querySelectorAll('a[data-figure-ref]').forEach(function (reference) {
      var letter = lettersById.get(decodeURIComponent(reference.hash.slice(1)));
      if (letter) reference.textContent = 'Figure ' + letter;
    });

    article.classList.add('figure-links-ready');

    var targetId = decodeURIComponent(window.location.hash.slice(1));
    if (lettersById.has(targetId)) {
      var scrollToFigure = function () {
        document.getElementById(targetId).scrollIntoView();
      };
      if (document.readyState === 'complete') scrollToFigure();
      else window.addEventListener('load', scrollToFigure, { once: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
