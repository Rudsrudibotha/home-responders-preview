(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var label = toggle ? toggle.querySelector('.label') : null;

  function setOpen(open, returnFocus) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (label) label.textContent = open ? 'Close menu' : 'Menu';
    nav.classList.toggle('open', open);
    if (!open && returnFocus) toggle.focus();
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if ((e.key === 'Escape' || e.key === 'Esc') && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false, true);
      }
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (mq) {
      if (mq.matches) setOpen(false);
    });
  }

  // Gallery: show all photos
  var gallery = document.getElementById('gallery');
  var more = document.getElementById('gallery-toggle');
  if (gallery && more) {
    more.addEventListener('click', function () {
      var open = !gallery.classList.contains('expanded');
      gallery.classList.toggle('expanded', open);
      more.setAttribute('aria-expanded', open ? 'true' : 'false');
      more.textContent = open ? 'Show fewer photos' : 'See all 20 photos';
      if (!open) gallery.scrollIntoView({ block: 'start' });
    });
  }

  // Service links pre-select the service in the quote form
  var select = document.getElementById('f-service');
  document.querySelectorAll('[data-service]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (select) select.value = a.getAttribute('data-service');
    });
  });

  // Quote form: compose an email (or a text) with the details filled in
  var PHONE = '+18042058521';
  var EMAIL = 'Homeresponders804@gmail.com';
  var form = document.getElementById('quote-form');
  var status = document.getElementById('form-status');
  function v(id) { return (document.getElementById(id).value || '').trim(); }
  function collect(viaText) {
    var name = v('f-name'), phone = v('f-phone'), email = v('f-email');
    if (!name || (!viaText && !phone && !email)) {
      status.textContent = 'Please add your name and a phone number or email so we can reach you.';
      (name ? document.getElementById(phone ? 'f-email' : 'f-phone') : document.getElementById('f-name')).focus();
      return null;
    }
    return { name: name, phone: phone, email: email, service: v('f-service'), area: v('f-area'), msg: v('f-msg') };
  }
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = collect();
      if (!d) return;
      var subject = 'Free quote request: ' + d.service + ' (' + d.area + ')';
      var body = [
        'Hi Home Responders team,', '',
        'I\u2019d like a free quote.', '',
        'Name: ' + d.name,
        'Phone: ' + (d.phone || '-'),
        'Email: ' + (d.email || '-'),
        'Service: ' + d.service,
        'Area: ' + d.area, '',
        'About the job:', (d.msg || '-')
      ].join('\n');
      status.textContent = 'Opening your email app\u2026';
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
    var textBtn = document.getElementById('text-request');
    if (textBtn) {
      textBtn.addEventListener('click', function () {
        var d = collect(true);
        if (!d) return;
        var body = 'Hi Home Responders team, I\u2019d like a free quote for ' + d.service.toLowerCase() + ' in ' + d.area + '. ' +
          (d.msg ? d.msg + ' ' : '') + '\u2014 ' + d.name + (d.email ? ', ' + d.email : '') + (d.phone ? ', ' + d.phone : '');
        status.textContent = 'Opening your messages app\u2026';
        window.location.href = 'sms:' + PHONE + '?&body=' + encodeURIComponent(body);
      });
    }
  }
})();
