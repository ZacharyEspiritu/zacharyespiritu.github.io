(function () {
  function initializeFigure(figure) {
    var hint = figure.querySelector('[data-aux-drag-hint]');
    var histogram = figure.querySelector('[data-aux-histogram]');
    var plot = figure.querySelector('[data-aux-plot]');
    var bars = Array.from(figure.querySelectorAll('[data-aux-bar]'));
    var barCounts = Array.from(figure.querySelectorAll('[data-aux-bar-count]'));
    var orderCells = Array.from(figure.querySelectorAll('[data-order-guess] .paper-example-cell'));
    var orderBrackets = Array.from(figure.querySelectorAll('[data-order-counts] .paper-count'));
    var orderOutcome = figure.querySelector('[data-order-outcome]');
    var summary = figure.querySelector('[data-figure1-summary]');
    var targetCounts = figure.dataset.targetCounts.split(',').map(Number);
    var total = targetCounts.reduce(function (sum, count) { return sum + count; }, 0);
    var letters = ['A', 'B', 'C'];
    var groups = ['paper-group-a', 'paper-group-b', 'paper-group-c'];
    var unitHeight = 12;

    if (!hint || !histogram || !plot || bars.length !== 3 || barCounts.length !== 3 ||
        orderCells.length !== total || orderBrackets.length !== 3 ||
        !orderOutcome || !summary) return;

    var counts = barCounts.map(function (label) { return Number(label.textContent); });
    if (counts.some(function (count) { return !Number.isInteger(count) || count < 1; }) ||
        counts.reduce(function (sum, count) { return sum + count; }, 0) !== total) return;

    function partnerFor(index) {
      return index === 2 ? 1 : 2;
    }

    function maximumFor(index) {
      return counts[index] + counts[partnerFor(index)] - 1;
    }

    function labelAt(position, distribution) {
      if (position < distribution[0]) return 0;
      return position < distribution[0] + distribution[1] ? 1 : 2;
    }

    function updateCells(distribution) {
      var labels = [];
      var wrong = 0;
      orderCells.forEach(function (cell, position) {
        var group = labelAt(position, distribution);
        var mismatched = group !== labelAt(position, targetCounts);
        cell.classList.remove.apply(cell.classList, groups);
        cell.classList.add(groups[group]);
        cell.classList.toggle('paper-example-cell--wrong', mismatched);
        cell.textContent = letters[group];
        labels.push(letters[group]);
        if (mismatched) wrong += 1;
      });
      return { labels: labels, wrong: wrong };
    }

    function updateHistogram() {
      bars.forEach(function (bar, index) {
        var count = counts[index];
        bar.style.setProperty('--bar-height', count * unitHeight + 'px');
        barCounts[index].textContent = count;
        bar.setAttribute('aria-valuemin', '1');
        bar.setAttribute('aria-valuemax', maximumFor(index));
        bar.setAttribute('aria-valuenow', count);
        bar.setAttribute('aria-valuetext', count + (count === 1 ? ' record' : ' records'));
      });
      histogram.setAttribute('aria-label', 'Auxiliary estimate, record counts: A ' + counts[0] +
        ', B ' + counts[1] + ', C ' + counts[2] + '.');
    }

    function render(announce) {
      var order = updateCells(counts);
      updateHistogram();
      orderBrackets.forEach(function (bracket, index) {
        bracket.style.gridColumn = 'span ' + counts[index];
        bracket.textContent = counts[index];
      });

      orderOutcome.textContent = order.wrong === 0
        ? 'All ten labels align'
        : order.wrong + ' of 10 records get wrong label';
      orderOutcome.classList.toggle('paper-example-outcome--wrong', order.wrong > 0);

      if (announce) {
        var targetLabels = targetCounts.flatMap(function (count, index) {
          return Array(count).fill(letters[index]);
        });
        summary.textContent = 'Auxiliary counts: ' + counts.join(', ') + '. Order-only labels: ' +
          order.labels.join(' ') + '; ' + order.wrong + ' of 10 wrong. ' +
          'Order-plus-frequency labels: ' + targetLabels.join(' ') + '.';
      }
    }

    function setCount(index, requested, announce) {
      var next = Math.max(1, Math.min(maximumFor(index), Math.round(requested)));
      var change = next - counts[index];
      if (change !== 0) {
        counts[index] = next;
        counts[partnerFor(index)] -= change;
        render(announce);
      } else if (announce) {
        render(true);
      }
    }

    function startDrag(bar, index, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      var gripOffset = event.clientY - bar.getBoundingClientRect().top;
      var baseline = plot.getBoundingClientRect().bottom;
      var pointerId = event.pointerId;
      var active = true;

      bar.focus({ preventScroll: true });
      bar.classList.add('is-dragging');
      bar.setPointerCapture(pointerId);

      function move(moveEvent) {
        if (moveEvent.pointerId !== pointerId) return;
        var top = moveEvent.clientY - gripOffset;
        setCount(index, (baseline - top) / unitHeight, false);
      }

      function finish(endEvent) {
        if (!active || (endEvent.pointerId !== undefined && endEvent.pointerId !== pointerId)) return;
        active = false;
        bar.removeEventListener('pointermove', move);
        bar.removeEventListener('pointerup', finish);
        bar.removeEventListener('pointercancel', finish);
        bar.removeEventListener('lostpointercapture', finish);
        window.removeEventListener('blur', finish);
        bar.classList.remove('is-dragging');
        render(true);
      }

      bar.addEventListener('pointermove', move);
      bar.addEventListener('pointerup', finish);
      bar.addEventListener('pointercancel', finish);
      bar.addEventListener('lostpointercapture', finish);
      window.addEventListener('blur', finish);
    }

    bars.forEach(function (bar, index) {
      bar.tabIndex = 0;
      bar.setAttribute('role', 'slider');
      bar.setAttribute('aria-orientation', 'vertical');
      bar.setAttribute('aria-label', 'Estimated count for ' + letters[index]);
      bar.setAttribute('aria-describedby', hint.id);
      bar.addEventListener('pointerdown', function (event) { startDrag(bar, index, event); });
      bar.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowUp') next = counts[index] + 1;
        else if (event.key === 'ArrowDown') next = counts[index] - 1;
        else if (event.key === 'PageUp') next = counts[index] + 2;
        else if (event.key === 'PageDown') next = counts[index] - 2;
        else if (event.key === 'Home') next = 1;
        else if (event.key === 'End') next = maximumFor(index);
        else return;
        event.preventDefault();
        setCount(index, next, true);
      });
    });

    plot.removeAttribute('aria-hidden');
    histogram.classList.add('is-interactive');
    hint.hidden = false;
    render(false);
  }

  function initialize() {
    document.querySelectorAll('[data-figure1]').forEach(initializeFigure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
