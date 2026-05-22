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

// Show Vietnamese description for selected test type
function updateTestTypeDescription(select) {
  const descriptions = {
    'Functional Test': 'Kiểm thử chức năng — xác minh từng chức năng hoạt động theo yêu cầu.',
    'Regression Test': 'Kiểm thử hồi quy — đảm bảo các tính năng cũ vẫn hoạt động sau thay đổi.',
    'Integration Test': 'Kiểm thử tích hợp — kiểm tra tương tác giữa các module hoặc hệ thống con.',
    'Performance Test': 'Kiểm thử hiệu năng — đánh giá tốc độ, tải, và khả năng chịu tải.',
    'Security Test': 'Kiểm thử bảo mật — kiểm tra lỗ hổng và bảo vệ dữ liệu.',
    'Usability Test': 'Kiểm thử khả năng sử dụng — đánh giá trải nghiệm người dùng và tính dễ dùng.',
    'Acceptance (UAT)': 'Kiểm thử chấp nhận (UAT) — xác nhận yêu cầu kinh doanh được đáp ứng bởi người dùng cuối.',
    'Smoke Test': 'Smoke Test — kiểm tra nhanh các chức năng chính sau triển khai.',
    'Sanity Test': 'Sanity Test — kiểm tra sơ bộ để đảm bảo tính ổn định sau sửa đổi nhỏ.',
    'Exploratory Test': 'Kiểm thử khám phá — người kiểm thử khám phá hệ thống mà không theo kịch bản cố định.'
  };

  const val = select ? select.value : (document.querySelector('.testtype-select') && document.querySelector('.testtype-select').value) || '';
  const helpEl = document.getElementById('testTypeHelp');
  if (helpEl) {
    helpEl.innerText = descriptions[val] || '';
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

function sharePage() {
  const shareData = {
    title: document.title || 'Nentang',
    text: 'Mẫu Test Case Đầy Đủ — từ Nentang',
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(err => {
      console.log('Share failed:', err);
    });
    return;
  }

  const textToCopy = `${shareData.title}\n${shareData.text}\n${shareData.url}`;

  function fallbackCopyText(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      alert(successful ? 'Liên kết đã được sao chép vào clipboard.' : 'Không thể sao chép liên kết. Vui lòng sao chép thủ công.');
    } catch (err) {
      alert('Không thể sao chép liên kết. Vui lòng sao chép thủ công: ' + text);
    }
    document.body.removeChild(textarea);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Liên kết đã được sao chép vào clipboard.');
    }).catch(() => {
      fallbackCopyText(textToCopy);
    });
  } else {
    fallbackCopyText(textToCopy);
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

  // Initialize test type description
  const testTypeSelect = document.querySelector('.testtype-select');
  if (testTypeSelect) {
    updateTestTypeDescription(testTypeSelect);
    testTypeSelect.addEventListener('change', function (e) {
      updateTestTypeDescription(e.target);
    });
  }

  // Share menu toggle
  const shareToggle = document.getElementById('shareToggle');
  const shareMenu = document.getElementById('shareMenu');
  if (shareToggle && shareMenu) {
    shareToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      const visible = shareMenu.style.display !== 'none';
      shareMenu.style.display = visible ? 'none' : 'block';
      shareToggle.setAttribute('aria-expanded', String(!visible));
      shareMenu.setAttribute('aria-hidden', String(visible));
    });

    document.addEventListener('click', function (e) {
      if (!shareMenu.contains(e.target) && e.target !== shareToggle) {
        shareMenu.style.display = 'none';
        shareToggle.setAttribute('aria-expanded', 'false');
        shareMenu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Import JSON input
  const importInput = document.getElementById('importJsonInput');
  if (importInput) {
    importInput.addEventListener('change', function (e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (ev) {
        try {
          const json = JSON.parse(ev.target.result);
          populateFormFromJson(json);
        } catch (err) {
          alert('Tập tin JSON không hợp lệ.');
        }
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  // Load sample index for provided data files
  loadSampleIndex();
});

// --- Samples loading / preview / apply ---
function loadSampleIndex() {
  fetch('assets/data/index.json').then(r => {
    if (!r.ok) throw new Error('no-index');
    return r.json();
  }).then(list => {
    const select = document.getElementById('sampleSelect');
    if (!select) return;
    select.innerHTML = '';
    list.forEach(item => {
      const opt = document.createElement('option');
      opt.value = item.file;
      opt.text = item.name;
      select.appendChild(opt);
    });
  }).catch(err => {
    const select = document.getElementById('sampleSelect');
    if (select) {
      select.innerHTML = '';
      const opt = document.createElement('option');
      opt.value = '';
      opt.text = 'Không có mẫu sẵn';
      select.appendChild(opt);
    }
    console.log('No sample index:', err);
  });
}

function previewSample() {
  const select = document.getElementById('sampleSelect');
  if (!select || !select.value) return alert('Không có mẫu để xem trước.');
  fetch(select.value).then(r => {
    if (!r.ok) throw new Error('Không tải được mẫu');
    return r.text();
  }).then(txt => {
    const pre = document.getElementById('samplePreviewPre');
    pre.textContent = formatJsonString(txt);
    document.getElementById('samplePreviewModal').style.display = 'flex';
  }).catch(err => {
    alert('Không thể tải mẫu: ' + err.message);
  });
}

function closeSamplePreview() {
  const modal = document.getElementById('samplePreviewModal');
  if (modal) modal.style.display = 'none';
}

function importSampleFromPreview() {
  const pre = document.getElementById('samplePreviewPre');
  if (!pre) return;
  try {
    const json = JSON.parse(pre.textContent);
    populateFormFromJson(json);
    closeSamplePreview();
  } catch (err) {
    alert('Mẫu JSON không hợp lệ.');
  }
}

function applySample() {
  const select = document.getElementById('sampleSelect');
  if (!select || !select.value) return alert('Không có mẫu để áp dụng.');
  fetch(select.value).then(r => r.json()).then(json => {
    populateFormFromJson(json);
  }).catch(err => {
    alert('Không thể tải mẫu: ' + err.message);
  });
}

function formatJsonString(txt) {
  try {
    const obj = JSON.parse(txt);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return txt;
  }
}

// --- Share helpers ---
function shareTo(service) {
  const url = window.location.href;
  const title = document.title || '';
  const text = (document.querySelector('h1') && document.querySelector('h1').innerText) || title;
  let shareUrl = '';

  switch (service) {
    case 'facebook':
      shareUrl = 'https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(url);
      break;
    case 'twitter':
      shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url);
      break;
    case 'linkedin':
      shareUrl = 'https://www.linkedin.com/sharing/share-offsite/?url=' + encodeURIComponent(url);
      break;
    case 'whatsapp':
      shareUrl = 'https://wa.me/?text=' + encodeURIComponent(text + ' ' + url);
      break;
    case 'telegram':
      shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);
      break;
    case 'mailto':
      shareUrl = 'mailto:?subject=' + encodeURIComponent(title) + '&body=' + encodeURIComponent(text + '\n' + url);
      break;
    default:
      return sharePage();
  }

  if (service === 'mailto') {
    window.location.href = shareUrl;
  } else {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=900,height=600');
  }
}

// --- Save / Import JSON ---
function saveToJson() {
  const data = getFormDataAsJson();
  const filenameBase = (data.meta && data.meta.docId) ? data.meta.docId.replace(/[^a-z0-9-_]/gi, '_') : 'testcase';
  const filename = filenameBase + '-' + Date.now() + '.json';
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Normalize a section label (Vietnamese/English) to a stable key
function normalizeInfoLabelToKey(label) {
  if (!label) return '';
  const l = label.replace(':', '').trim().toLowerCase();
  if (l.includes('test case id') || l === 'test case id' || l.includes('mã test case') || l.includes('testcase id') || l === 'test case') return 'testCaseId';
  if (l.includes('tên test case') || l.includes('tên test') || l === 'tên') return 'testCaseName';
  if (l.includes('module')) return 'module';
  if (l.includes('người viết') || l.includes('người tạo') || l.includes('author')) return 'author';
  if (l.includes('ngày tạo') || l.includes('ngày')) return 'createdDate';
  if (l.includes('mức ưu tiên') || l.includes('ưu tiên') || l.includes('priority')) return 'priority';
  if (l.includes('loại kiểm thử') || l.includes('loại')) return 'testType';
  if (l.includes('môi trường test') || l.includes('môi trường') || l.includes('environment')) return 'environment';
  return l.replace(/\s+/g, '_');
}

function getFormDataAsJson() {
  const obj = {};

  // --- General info ("1. Thông tin chung") ---
  const general = {};
  const sections = document.querySelectorAll('section.section');
  let infoSection = null;
  sections.forEach(s => {
    const titleEl = s.querySelector('.section-title');
    if (titleEl && titleEl.innerText && titleEl.innerText.toLowerCase().includes('thông tin chung')) infoSection = s;
  });
  if (infoSection) {
    const rows = infoSection.querySelectorAll('table tr');
    rows.forEach(row => {
      const tds = Array.from(row.querySelectorAll('td'));
      for (let i = 0; i < tds.length; i += 2) {
        const labelTd = tds[i];
        const valueTd = tds[i + 1];
        if (!labelTd || !valueTd) continue;
        const labelText = labelTd.innerText.replace(':', '').trim();
        const key = normalizeInfoLabelToKey(labelText);
        const valueEl = valueTd.querySelector('.input-line, .brand-value, [contenteditable]') || valueTd.querySelector('select');
        let value = '';
        if (valueEl) {
          if (valueEl.tagName === 'SELECT') value = valueEl.value;
          else value = valueEl.innerText.trim();
        } else {
          value = valueTd.innerText.trim();
        }
        general[key] = value;
      }
    });
  }
  obj.general = general;

  const brandCompanyEl = document.querySelector('.brand-company');
  obj.brand = { company: brandCompanyEl ? brandCompanyEl.innerText.trim() : '' };

  const brandItems = document.querySelectorAll('.brand-grid .brand-item');
  brandItems.forEach(item => {
    const label = (item.querySelector('.brand-label') && item.querySelector('.brand-label').innerText.replace(':', '').trim().toLowerCase()) || '';
    const valueEl = item.querySelector('.brand-value');
    const value = valueEl ? valueEl.innerText.trim() : '';
    if (label.includes('địa chỉ')) obj.brand.address = value;
    else if (label.includes('điện thoại')) obj.brand.phone = value;
    else if (label.includes('email')) obj.brand.email = value;
    else if (label.includes('website')) obj.brand.website = value;
    else obj.brand[label] = value;
  });

  const metaSpans = document.querySelectorAll('.document-meta .meta-cell span');
  obj.meta = {
    docId: metaSpans[0] ? metaSpans[0].innerText.trim() : '',
    version: metaSpans[1] ? metaSpans[1].innerText.trim() : '',
    date: metaSpans[2] ? metaSpans[2].innerText.trim() : ''
  };

  obj.title = (document.querySelector('h1') && document.querySelector('h1').innerText.trim()) || '';
  obj.subtitle = (document.querySelector('.subtitle') && document.querySelector('.subtitle').innerText.trim()) || '';

  obj.preconditions = Array.from(document.querySelectorAll('#preconditions .list-row .input-line')).map(el => el.innerText.trim());

  obj.testData = Array.from(document.querySelectorAll('#testDataTable tbody tr')).map(tr => {
    const lines = tr.querySelectorAll('.input-line');
    const label = lines[0] ? lines[0].innerText.trim().replace(/:$/, '') : '';
    const value = lines[1] ? lines[1].innerText.trim() : '';
    return { label, value };
  });

  obj.steps = Array.from(document.querySelectorAll('#stepsTable tbody tr')).map(tr => {
    const stepNo = tr.querySelector('.step-no') ? tr.querySelector('.step-no').innerText.trim() : '';
    const lines = tr.querySelectorAll('.input-line');
    const action = lines[0] ? lines[0].innerText.trim() : '';
    const expected = lines[1] ? lines[1].innerText.trim() : '';
    return { step: stepNo, action, expected };
  });

  obj.expectedOverall = Array.from(document.querySelectorAll('#expectedOverall .list-row .input-line')).map(el => el.innerText.trim());
  obj.actualResult = Array.from(document.querySelectorAll('#actualResult .list-row .input-line')).map(el => el.innerText.trim());
  obj.notes = Array.from(document.querySelectorAll('#notes .list-row .input-line')).map(el => el.innerText.trim());

  const statusEl = document.querySelector('.status-select');
  const severityEl = document.querySelector('.severity-select');
  obj.status = statusEl ? statusEl.value : '';
  obj.severity = severityEl ? severityEl.value : '';

  const footerEl = document.querySelector('.brand-footer div[contenteditable]') || document.querySelector('.brand-footer div');
  obj.footer = footerEl ? footerEl.innerText.trim() : '';

  return obj;
}

function populateFormFromJson(json) {
  if (!json || typeof json !== 'object') return;

  // Brand
  const brandCompanyEl = document.querySelector('.brand-company');
  if (brandCompanyEl && json.brand && json.brand.company) brandCompanyEl.innerText = json.brand.company;

  const brandItems = document.querySelectorAll('.brand-grid .brand-item');
  brandItems.forEach(item => {
    const label = (item.querySelector('.brand-label') && item.querySelector('.brand-label').innerText.replace(':', '').trim().toLowerCase()) || '';
    const valueEl = item.querySelector('.brand-value');
    if (!valueEl) return;
    if (label.includes('địa chỉ') && json.brand && json.brand.address) valueEl.innerText = json.brand.address;
    else if (label.includes('điện thoại') && json.brand && json.brand.phone) valueEl.innerText = json.brand.phone;
    else if (label.includes('email') && json.brand && json.brand.email) valueEl.innerText = json.brand.email;
    else if (label.includes('website') && json.brand && json.brand.website) valueEl.innerText = json.brand.website;
  });

  // Meta
  if (json.meta) {
    const metaSpans = document.querySelectorAll('.document-meta .meta-cell span');
    if (metaSpans[0] && json.meta.docId) metaSpans[0].innerText = json.meta.docId;
    if (metaSpans[1] && json.meta.version) metaSpans[1].innerText = json.meta.version;
    if (metaSpans[2] && json.meta.date) metaSpans[2].innerText = json.meta.date;
  }

  // General info ("1. Thông tin chung")
  if (json.general) {
    const sections = document.querySelectorAll('section.section');
    let infoSection = null;
    sections.forEach(s => {
      const titleEl = s.querySelector('.section-title');
      if (titleEl && titleEl.innerText && titleEl.innerText.toLowerCase().includes('thông tin chung')) infoSection = s;
    });
    if (infoSection) {
      const rows = infoSection.querySelectorAll('table tr');
      rows.forEach(row => {
        const tds = Array.from(row.querySelectorAll('td'));
        for (let i = 0; i < tds.length; i += 2) {
          const labelTd = tds[i];
          const valueTd = tds[i + 1];
          if (!labelTd || !valueTd) continue;
          const labelText = labelTd.innerText.replace(':', '').trim();
          const key = normalizeInfoLabelToKey(labelText);
          if (!json.general.hasOwnProperty(key)) continue;
          const value = json.general[key] || '';
          const inputEl = valueTd.querySelector('.input-line, .brand-value, [contenteditable]') || valueTd.querySelector('select');
          if (inputEl) {
            if (inputEl.tagName === 'SELECT') {
              inputEl.value = value;
              updateSelectColor(inputEl);
            } else {
              inputEl.innerText = value;
            }
          } else {
            valueTd.innerText = value;
          }
        }
      });
    }
  }

  if (json.title) {
    const h1 = document.querySelector('h1');
    if (h1) h1.innerText = json.title;
  }
  if (json.subtitle) {
    const sub = document.querySelector('.subtitle');
    if (sub) sub.innerText = json.subtitle;
  }

  // Lists
  function setList(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    (items || []).forEach(text => {
      const row = document.createElement('div');
      row.className = 'list-row';
      row.innerHTML = `\n        <div class="bullet">•</div>\n        <div class="input-line" contenteditable="true">${text || ''}</div>\n        <button class="row-remove" type="button" onclick="removeRow(this)">−</button>\n      `;
      container.appendChild(row);
    });
    if ((items || []).length === 0) addListItem(containerId);
  }

  setList('preconditions', json.preconditions || []);
  setList('expectedOverall', json.expectedOverall || []);
  setList('actualResult', json.actualResult || []);
  setList('notes', json.notes || []);

  // Test data
  function setTestData(dataArray) {
    const tbody = document.querySelector('#testDataTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    (dataArray || []).forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `\n        <td class="label-wide"><div class="input-line" contenteditable="true">${item.label || ''}</div></td>\n        <td><div class="input-line" contenteditable="true">${item.value || ''}</div></td>\n        <td class="remove-cell"><button class="row-remove" type="button" onclick="removeTableRow(this)">−</button></td>\n      `;
      tbody.appendChild(tr);
    });
    if (!dataArray || dataArray.length === 0) addDataRow();
  }

  setTestData(json.testData || []);

  // Steps
  function setSteps(stepsArray) {
    const tbody = document.querySelector('#stepsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    (stepsArray || []).forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `\n        <td class="step-no"></td>\n        <td><div class="input-line" contenteditable="true">${item.action || ''}</div></td>\n        <td><div class="input-line" contenteditable="true">${item.expected || ''}</div></td>\n        <td class="remove-cell"><button class="row-remove" type="button" onclick="removeStepRow(this)">−</button></td>\n      `;
      tbody.appendChild(tr);
    });
    if (!stepsArray || stepsArray.length === 0) addStepRow();
    renumberSteps();
  }

  setSteps(json.steps || []);

  // Status / severity
  if (json.status) {
    const status = document.querySelector('.status-select');
    if (status) {
      status.value = json.status;
      updateSelectColor(status);
    }
  }
  if (json.severity) {
    const severity = document.querySelector('.severity-select');
    if (severity) {
      severity.value = json.severity;
      updateSelectColor(severity);
    }
  }

  // Footer
  if (json.footer) {
    const footerEl = document.querySelector('.brand-footer div[contenteditable]') || document.querySelector('.brand-footer div');
    if (footerEl) footerEl.innerText = json.footer;
  }
}
