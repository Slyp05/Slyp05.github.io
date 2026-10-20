// Contact form (contact.md). Submits to Web3Forms with fetch so the visitor stays on
// the page. The hCaptcha widget needs JavaScript, so without it Web3Forms rejects the
// post and the email link below the form is the way to reach out.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var category = form.elements.category;
  var pkg = form.elements['package'];
  var bugFields = document.getElementById('contact-bug-fields');
  var hint = document.getElementById('contact-message-hint');
  var status = document.getElementById('contact-status');
  var submit = form.querySelector('.contact-submit');
  var captcha = form.querySelector('.h-captcha');

  // The hCaptcha widget reads data-theme once, when the Web3Forms script renders it.
  // This file loads before that script, so the widget matches the page theme.
  var theme = document.documentElement.getAttribute('data-theme');
  if (!theme) theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  captcha.setAttribute('data-theme', theme);

  // ?category=bug|question|feature|other&package=<slug> preselects the dropdowns.
  var params = new URLSearchParams(location.search);
  var categories = { bug: 'Bug report', question: 'Question', feature: 'Feature request', other: 'Other' };
  if (categories[params.get('category')]) category.value = categories[params.get('category')];
  var slug = params.get('package');
  if (slug) {
    for (var i = 0; i < pkg.options.length; i++) {
      if (pkg.options[i].getAttribute('data-slug') === slug) { pkg.selectedIndex = i; break; }
    }
  }

  function syncCategory() {
    var isBug = category.value === 'Bug report';
    bugFields.hidden = !isBug;
    hint.hidden = !isBug;
  }
  category.addEventListener('change', syncCategory);
  syncCategory();

  function showStatus(text, kind) {
    status.textContent = text;
    status.className = 'contact-status contact-status--' + kind;
    status.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    if (!window.hcaptcha) {
      showStatus('The captcha could not load, so the form cannot be sent. Please email ' + form.getAttribute('data-email') + ' instead.', 'error');
      return;
    }

    var token = form.querySelector('[name="h-captcha-response"]');
    if (!token || !token.value) {
      showStatus('Please complete the captcha.', 'error');
      return;
    }

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    if (bugFields.hidden) {
      delete data.unity_version;
      delete data.package_version;
    }
    data.subject = '[' + data.category + '] ' + data['package'] + ': ' + data.title;

    submit.disabled = true;
    showStatus('Sending...', 'pending');

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        // A rate limit or server error can come back as HTML: report it as a failed
        // send, not as a connection problem.
        return res.json().catch(function () {
          return { success: false, message: 'The server answered with status ' + res.status + '.' };
        });
      })
      .then(function (json) {
        if (json.success) {
          form.reset();
          syncCategory();
          showStatus('Thanks, your message was sent. The reply will come to the email you entered.', 'success');
        } else {
          showStatus((json.message || 'The message could not be sent.') + ' You can also email ' + form.getAttribute('data-email') + '.', 'error');
        }
      })
      .catch(function () {
        showStatus('The message could not be sent. Check your connection, or email ' + form.getAttribute('data-email') + '.', 'error');
      })
      .then(function () {
        submit.disabled = false;
        if (window.hcaptcha) window.hcaptcha.reset();
      });
  });
})();
