function removeRow(button) {
  const container = button.closest('.box');
  const rows = container.querySelectorAll('.list-row');

  if (rows.length <= 1) {
    const line = button.closest('.list-row').querySelector('.input-line');
    line.innerText = '';
    line.focus();
    return;
  }

  button.closest('.list-row').remove();
}

function removeTableRow(button) {
  const tbody = button.closest('tbody');

  if (tbody.rows.length <= 1) {
    button.closest('tr').querySelectorAll('.input-line').forEach(cell => {
      cell.innerText = '';
    });
    return;
  }

  button.closest('tr').remove();
}

function addListItem(containerId) {
  const container = document.getElementById(containerId);
  const row = document.createElement('div');
  row.className = 'list-row';
  row.innerHTML = `
    <div class="bullet">•</div>
    <div class="input-line" contenteditable="true"></div>
    <button class="row-remove" type="button" onclick="removeRow(this)">−</button>
  `;
  container.appendChild(row);
  row.querySelector('.input-line').focus();
}

function addDataRow() {
  const tbody = document.querySelector('#testDataTable tbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="label-wide"><div class="input-line" contenteditable="true">Tên dữ liệu:</div></td>
    <td><div class="input-line" contenteditable="true"></div></td>
    <td class="remove-cell"><button class="row-remove" type="button" onclick="removeTableRow(this)">−</button></td>
  `;

  tbody.appendChild(tr);
  tr.querySelectorAll('.input-line')[0].focus();
}

function addStepRow() {
  const tbody = document.querySelector('#stepsTable tbody');
  const tr = document.createElement('tr');

  tr.innerHTML = `
    <td class="step-no"></td>
    <td><div class="input-line" contenteditable="true"></div></td>
    <td><div class="input-line" contenteditable="true"></div></td>
    <td class="remove-cell"><button class="row-remove" type="button" onclick="removeStepRow(this)">−</button></td>
  `;

  tbody.appendChild(tr);
  renumberSteps();
  tr.querySelectorAll('.input-line')[0].focus();
}

function removeStepRow(button) {
  const tbody = document.querySelector('#stepsTable tbody');

  if (tbody.rows.length <= 1) {
    button.closest('tr').querySelectorAll('.input-line').forEach(cell => {
      cell.innerText = '';
    });
    return;
  }

  button.closest('tr').remove();
  renumberSteps();
}

function renumberSteps() {
  document.querySelectorAll('#stepsTable tbody tr').forEach((tr, index) => {
    tr.querySelector('.step-no').innerText = index + 1;
  });
}

function updateSelectColor(select) {
  const value = select.value;

  select.classList.remove(
    'status-pass',
    'status-fail',
    'status-blocked',
    'status-not-run',
    'status-na',
    'severity-low',
    'severity-medium',
    'severity-high',
    'severity-critical'
  );

  if (select.classList.contains('status-select')) {
    const map = {
      'Pass': 'status-pass',
      'Fail': 'status-fail',
      'Blocked': 'status-blocked',
      'Not Run': 'status-not-run',
      'N/A': 'status-na'
    };
    select.classList.add(map[value] || 'status-not-run');
  }

  if (select.classList.contains('severity-select')) {
    const map = {
      'Low': 'severity-low',
      'Medium': 'severity-medium',
      'High': 'severity-high',
      'Critical': 'severity-critical'
    };
    select.classList.add(map[value] || 'severity-low');
  }
}

function loadLogo(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const logo = document.getElementById('brandLogo');
    const box = document.getElementById('brandLogoBox');

    logo.src = e.target.result;
    box.classList.add('has-logo');
  };

  reader.readAsDataURL(file);
}

function resetSample() {
  document.querySelectorAll('[data-sample]').forEach(el => {
    const sample = el.getAttribute('data-sample') || '';

    if (el.tagName === 'SELECT') {
      el.value = sample;
      updateSelectColor(el);
      return;
    }

    el.innerText = sample;
  });

  renumberSteps();
}

function clearForm() {
  document.querySelectorAll('[contenteditable="true"]').forEach(el => {
    if (el.tagName === 'H1') return;
    if (el.classList.contains('subtitle')) return;
    el.innerText = '';
  });

  const status = document.querySelector('.status-select');
  const severity = document.querySelector('.severity-select');

  if (status) {
    status.value = 'Not Run';
    updateSelectColor(status);
  }

  if (severity) {
    severity.value = 'Low';
    updateSelectColor(severity);
  }
}

document.addEventListener('keydown', function (event) {
  const isEditable = event.target && event.target.isContentEditable;
  if (!isEditable) return;

  if (event.key === 'Tab') {
    event.preventDefault();

    const fields = Array.from(document.querySelectorAll('[contenteditable="true"], .select-field'))
      .filter(el => el.offsetParent !== null);

    const currentIndex = fields.indexOf(event.target);
    const nextIndex = event.shiftKey ? currentIndex - 1 : currentIndex + 1;
    const next = fields[(nextIndex + fields.length) % fields.length];

    next.focus();

    if (next.isContentEditable) {
      const range = document.createRange();
      range.selectNodeContents(next);
      range.collapse(false);

      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.select-field').forEach(updateSelectColor);
});
