(function () {
  function initializeFigure(figure) {
    var panel = figure.querySelector('[data-sampled-panel]');
    var table = figure.querySelector('[data-sampled-table]');
    var chart = figure.querySelector('[data-birth-chart]');
    var counts = figure.querySelector('[data-sampled-counts]');
    var note = figure.querySelector('[data-sampled-note]');
    var summary = figure.querySelector('[data-snapshot-summary]');
    var labels = [1, 2, 3].map(function (number) {
      return figure.querySelector('[data-snapshot-label="' + number + '"]');
    });
    var rows = [1, 2, 3].map(function (number) {
      return figure.querySelector('[data-snapshot-row="' + number + '"]');
    });
    var ids = figure.dataset.recordIds.split(',').map(Number);
    var trueEdges = [0].concat(figure.dataset.trueBoundaries.split(',').map(Number), [ids.length]);
    var groupClasses = ['paper-group-a', 'paper-group-b', 'paper-group-c', 'paper-group-d'];
    var plots = chart ? Array.from(chart.children) : [];
    var total = Math.max.apply(null, ids);

    if (!panel || !table || !chart || !counts || !note || !summary ||
        labels.some(function (item) { return !item; }) ||
        rows.some(function (item) { return !item || item.children.length !== ids.length; }) ||
        plots.length !== ids.length || !ids.every(Number.isInteger) ||
        trueEdges.length !== groupClasses.length + 1) return;

    var cutoffs = rows.map(function (row) {
      return Number(row.style.getPropertyValue('--snapshot-row'));
    });
    if (!(cutoffs[0] >= 1 && cutoffs[0] < cutoffs[1] &&
          cutoffs[1] < cutoffs[2] && cutoffs[2] === total)) return;

    function bounds(index) {
      return index === 0 ? [1, cutoffs[1] - 1] : [cutoffs[0] + 1, total - 1];
    }

    function updateLabel(label, cutoff) {
      var sub = document.createElement('sub');
      sub.textContent = cutoff;
      label.replaceChildren(document.createTextNode('T'), sub);
      label.style.setProperty('--snapshot-row', cutoff);
    }

    function updateTable(births) {
      rows.forEach(function (row, snapshotIndex) {
        var cutoff = cutoffs[snapshotIndex];
        updateLabel(labels[snapshotIndex], cutoff);
        row.style.setProperty('--snapshot-row', cutoff);
        Array.from(row.children).forEach(function (cell, position) {
          var visible = ids[position] <= cutoff;
          cell.classList.toggle('paper-smush-stamp', visible);
          cell.classList.toggle('paper-smush-cell--empty', !visible);
          cell.textContent = visible ? births[position] : '';
        });
      });
    }

    function updateChart(births) {
      plots.forEach(function (plot, position) {
        var birth = births[position];
        var nextBirth = births[position + 1];
        var descent = plot.querySelector('[data-observed-descent]');
        var lost = plot.querySelector('[data-lost-boundary]');
        var isDescent = birth > nextBirth;

        plot.style.setProperty('--point-height', birth * 25 + '%');
        if (nextBirth !== undefined) plot.style.setProperty('--next-height', nextBirth * 25 + '%');
        if (descent) descent.hidden = !isDescent;
        if (lost) lost.hidden = isDescent;
      });
    }

    function updateFrequencies(births) {
      var edges = [0];
      for (var position = 0; position < births.length - 1; position += 1) {
        if (births[position] > births[position + 1]) edges.push(position + 1);
      }
      edges.push(births.length);

      var frequencies = [];
      var brackets = [];
      for (var index = 0; index < edges.length - 1; index += 1) {
        var start = edges[index];
        var end = edges[index + 1];
        var size = end - start;
        var bracket = document.createElement('span');
        var trueGroup = trueEdges.findIndex(function (edge, trueIndex) {
          return edge === start && trueEdges[trueIndex + 1] === end;
        });
        bracket.className = 'paper-count ' +
          (trueGroup < 0 ? 'paper-smush-merged' : groupClasses[trueGroup]);
        bracket.style.gridColumn = 'span ' + size;
        bracket.textContent = size;
        brackets.push(bracket);
        frequencies.push(size);
      }
      counts.replaceChildren.apply(counts, brackets);
      note.textContent = 'Observed frequencies: (' + frequencies.join(', ') + ')';
      return note.textContent;
    }

    function render(announce) {
      var births = ids.map(function (id) {
        return cutoffs.findIndex(function (cutoff) { return id <= cutoff; }) + 1;
      });
      updateTable(births);
      updateChart(births);
      var outcome = updateFrequencies(births);

      rows.slice(0, 2).forEach(function (row, index) {
        var limits = bounds(index);
        row.setAttribute('aria-valuemin', limits[0]);
        row.setAttribute('aria-valuemax', limits[1]);
        row.setAttribute('aria-valuenow', cutoffs[index]);
        row.setAttribute('aria-valuetext', 'T' + cutoffs[index] + ', after ' +
          cutoffs[index] + ' insertions');
      });

      var description = 'Snapshots T' + cutoffs.join(', T') + '. ' + outcome;
      panel.setAttribute('aria-label', description + ' First-seen times in sorted index order are ' +
        births.join(', ') + '.');
      if (announce) summary.textContent = description;
    }

    function setTime(index, time, announce) {
      var limits = bounds(index);
      var next = Math.max(limits[0], Math.min(limits[1], time));
      if (next !== cutoffs[index]) {
        cutoffs[index] = next;
        render(announce);
      } else if (announce) {
        render(true);
      }
    }

    function startDrag(handle, index, event) {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      event.preventDefault();
      var row = rows[index];
      var rowRect = row.getBoundingClientRect();
      var tableTop = table.getBoundingClientRect().top;
      var step = rowRect.height + parseFloat(getComputedStyle(table).rowGap || '0');
      var grabOffset = event.clientY - rowRect.top;
      var pointerId = event.pointerId;
      var active = true;

      row.focus({ preventScroll: true });
      row.classList.add('is-dragging');
      handle.classList.add('is-dragging');
      handle.setPointerCapture(pointerId);

      function move(moveEvent) {
        if (moveEvent.pointerId !== pointerId) return;
        var time = Math.round((moveEvent.clientY - grabOffset - tableTop) / step) + 1;
        setTime(index, time, false);
      }

      function finish(endEvent) {
        if (!active || (endEvent.pointerId !== undefined && endEvent.pointerId !== pointerId)) return;
        active = false;
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', finish);
        handle.removeEventListener('pointercancel', finish);
        handle.removeEventListener('lostpointercapture', finish);
        window.removeEventListener('blur', finish);
        row.classList.remove('is-dragging');
        handle.classList.remove('is-dragging');
        render(true);
      }

      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', finish);
      handle.addEventListener('pointercancel', finish);
      handle.addEventListener('lostpointercapture', finish);
      window.addEventListener('blur', finish);
    }

    rows.slice(0, 2).forEach(function (row, index) {
      var label = labels[index];
      row.classList.add('paper-smush-row--draggable');
      label.classList.add('paper-smush-label--draggable');
      row.tabIndex = 0;
      row.setAttribute('role', 'slider');
      row.setAttribute('aria-orientation', 'vertical');
      row.setAttribute('aria-label', 'Snapshot ' + (index + 1) + ' time');

      [row, label].forEach(function (handle) {
        handle.addEventListener('pointerdown', function (event) { startDrag(handle, index, event); });
      });
      row.addEventListener('keydown', function (event) {
        var next;
        if (event.key === 'ArrowUp') next = cutoffs[index] - 1;
        else if (event.key === 'ArrowDown') next = cutoffs[index] + 1;
        else if (event.key === 'Home') next = bounds(index)[0];
        else if (event.key === 'End') next = bounds(index)[1];
        else return;
        event.preventDefault();
        setTime(index, next, true);
      });
    });

    panel.classList.add('is-interactive');
    table.classList.add('is-interactive');
    render(false);
  }

  function initialize() {
    document.querySelectorAll('[data-snapshot-figure]').forEach(initializeFigure);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
}());
