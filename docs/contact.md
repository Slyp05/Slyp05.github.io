---
layout: page
title: Contact
permalink: /contact/
body_class: about-page
description: "Report a bug, ask a question or request a feature for a Juste Tools package."
---
{%- comment -%}
Submissions go to Web3Forms (https://web3forms.com), which emails them to the address
the access key was created with. GitHub Pages can't receive a POST, so a hosted form
backend is the only option on a static site. The access key is public by design: it
can only send mail to that one inbox. It lives in _config.yml as `web3forms_key`.

Spam protection, in order:
  1. `botcheck` honeypot: hidden from people, filled in by naive bots, rejected by Web3Forms.
  2. hCaptcha, through Web3Forms' free integration (the `h-captcha` div plus their
     client script). Web3Forms verifies the token server-side, so skipping the
     widget doesn't get a message through. "Enable hCaptcha" must also be on in the
     Web3Forms dashboard for this form.
  3. Browser-side checks in contact.js, which only spare real visitors a round trip.

The package dropdown is built from _data/packages.yml, so a newly released package
appears here with no edit. `?package=<slug>&category=<value>` preselects both, which
is how the Support buttons on each package page link here.
{%- endcomment -%}
{%- assign live = site.data.packages | where: "released", true -%}

<form id="contact-form" class="contact-form" action="https://api.web3forms.com/submit" method="POST" data-email="{{ site.email }}" novalidate>
  <input type="hidden" name="access_key" value="{{ site.web3forms_key }}">
  <input type="hidden" name="from_name" value="{{ site.title }} contact form">
  <input type="hidden" name="subject" value="New message from {{ site.url | remove: 'https://' }}">

  <!-- Honeypot. Off-screen and out of the tab order; a person never fills it. -->
  <input type="checkbox" name="botcheck" class="contact-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true">

  <div class="contact-row">
    <div class="contact-field">
      <label for="contact-category">Category</label>
      <select id="contact-category" name="category" required>
        <option value="" disabled selected>Choose a category</option>
        <option value="Bug report">Bug report</option>
        <option value="Question">Question</option>
        <option value="Feature request">Feature request</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div class="contact-field">
      <label for="contact-package">Package</label>
      <select id="contact-package" name="package" required>
        <option value="" disabled selected>Choose a package</option>
        {%- for pkg in live %}
        <option value="{{ pkg.title | escape }}" data-slug="{{ pkg.url | remove: '/' }}">{{ pkg.title | escape }}</option>
        {%- endfor %}
        <option value="General" data-slug="general">Not about one package</option>
      </select>
    </div>
  </div>

  <div class="contact-row" id="contact-bug-fields">
    <div class="contact-field">
      <label for="contact-unity">Unity version <span class="contact-optional">optional</span></label>
      <input type="text" id="contact-unity" name="unity_version" maxlength="40" placeholder="6000.0.32f1" autocomplete="off">
    </div>

    <div class="contact-field">
      <label for="contact-pkg-version">Package version <span class="contact-optional">optional</span></label>
      <input type="text" id="contact-pkg-version" name="package_version" maxlength="40" placeholder="2.1.0" autocomplete="off">
    </div>
  </div>

  <div class="contact-row">
    <div class="contact-field">
      <label for="contact-name">Name <span class="contact-optional">optional</span></label>
      <input type="text" id="contact-name" name="name" maxlength="100" autocomplete="name">
    </div>

    <div class="contact-field">
      <label for="contact-email">Email</label>
      <input type="email" id="contact-email" name="email" required maxlength="200" autocomplete="email">
    </div>
  </div>

  <div class="contact-field">
    <label for="contact-title">Subject</label>
    <input type="text" id="contact-title" name="title" required maxlength="150">
  </div>

  <div class="contact-field">
    <label for="contact-message">Message</label>
    <textarea id="contact-message" name="message" rows="8" required minlength="20" maxlength="5000" aria-describedby="contact-message-hint"></textarea>
    <p class="contact-hint" id="contact-message-hint">For a bug: what you did, what you expected, what happened instead, and any console errors.</p>
  </div>

  <div class="h-captcha" data-captcha="true"></div>

  <p class="contact-privacy">Your email is used only to reply to you. Messages are delivered through <a href="https://web3forms.com/privacy" target="_blank" rel="noopener" class="new-tab">Web3Forms<span class="visually-hidden"> (opens in a new tab)</span></a>.</p>

  <button type="submit" class="asset-store-btn contact-submit">Send</button>

  <p class="contact-status" id="contact-status" role="status" aria-live="polite" hidden></p>
</form>

<p class="contact-fallback">Or email <a href="mailto:{{ site.email }}">{{ site.email }}</a>.</p>

<script src="{{ '/assets/js/contact.js' | relative_url }}"></script>
<script src="https://web3forms.com/client/script.js" async defer></script>
