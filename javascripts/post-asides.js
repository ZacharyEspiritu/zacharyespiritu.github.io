(function () {
  function initialize() {
    var article = document.querySelector('.blog-post-content');
    if (!article || article.classList.contains('post-footnotes-ready')) return;

    var asides = Array.from(article.children).filter(function (child) {
      return child.classList.contains('post-aside');
    });
    if (!asides.length) return;

    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var list = document.createElement('ol');

    section.className = 'post-footnotes';
    section.setAttribute('aria-labelledby', 'post-footnotes-heading');
    heading.id = 'post-footnotes-heading';
    heading.textContent = 'Footnotes';
    section.appendChild(heading);
    section.appendChild(list);

    asides.forEach(function (aside, index) {
      var number = index + 1;
      var reference = document.createElement('sup');
      var referenceLink = document.createElement('a');
      var note = document.createElement('li');
      var numberLabel = document.createElement('span');
      var backLink = document.createElement('a');

      reference.className = 'post-footnote-ref';
      reference.id = 'post-footnote-ref-' + number;
      reference.tabIndex = -1;
      referenceLink.href = '#post-footnote-' + number;
      referenceLink.textContent = '[' + number + ']';
      referenceLink.setAttribute('aria-label', 'Footnote ' + number);
      reference.appendChild(referenceLink);

      var next = aside.nextElementSibling;
      var previous = aside.previousElementSibling;
      var paragraph = next && next.tagName === 'P' ? next :
        previous && previous.tagName === 'P' ? previous : null;
      if (paragraph) {
        paragraph.appendChild(document.createTextNode(' '));
        paragraph.appendChild(reference);
      } else {
        aside.after(reference);
      }

      note.id = 'post-footnote-' + number;
      note.tabIndex = -1;
      numberLabel.className = 'post-footnote-number';
      numberLabel.textContent = '[' + number + ']';
      note.appendChild(numberLabel);
      Array.from(aside.childNodes).forEach(function (child) {
        note.appendChild(child.cloneNode(true));
      });

      backLink.className = 'post-footnote-backref';
      backLink.href = '#' + reference.id;
      backLink.textContent = '↩';
      backLink.setAttribute('aria-label', 'Back to footnote reference ' + number);
      var last = note.lastElementChild;
      var backLinkContainer = last && last.tagName === 'P' ? last : note;
      backLinkContainer.appendChild(document.createTextNode(' '));
      backLinkContainer.appendChild(backLink);
      list.appendChild(note);
    });

    var ending = article.querySelector(':scope > .post-acknowledgments, :scope > .post-ending');
    article.insertBefore(section, ending || null);
    article.classList.add('post-footnotes-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
