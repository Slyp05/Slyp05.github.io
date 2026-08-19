---
layout: home
---

<h1 class="home-title"><img src="/assets/images/logo.png" alt="Juste Tools" class="home-image" width="600" height="352" decoding="async"></h1>

<div class="home-intro">
  <p>Juste Tools is where I make the Unity tools I always wished existed: clean APIs, solid architecture, and docs that actually help.</p>
  <p>Each one is shaped by real production experience at top mobile studios, and built to be a pleasure to use.</p>
</div>

{%- assign live = site.data.packages | where: "released", true -%}
{%- assign paid_packages = live | where_exp: "p", "p.free != true" -%}
{%- assign free_packages = live | where_exp: "p", "p.free == true" -%}

## Paid Assets {#assets}

<div class="package-grid">
{% for pkg in paid_packages %}
  <div class="package-card">
    <img src="{{ pkg.card }}" alt="{{ pkg.title }}" class="package-card-image" width="420" height="280" loading="lazy" decoding="async">
    <img src="{{ pkg.icon }}" alt="{{ pkg.title }} icon" class="package-card-icon" width="160" height="160" loading="lazy" decoding="async">
    <div class="package-card-content">
      <h2><a href="{{ pkg.url }}">{{ pkg.title }}</a></h2>
      <div class="card-meta">
        <span class="badge badge-paid">Paid</span>
        <span class="card-updated">{{ pkg.meta }}</span>
      </div>
      <p>{{ pkg.blurb }}</p>
      <a href="{{ pkg.url }}" class="card-link">Learn more →</a>
    </div>
  </div>
{% endfor %}
</div>

## Free Assets {#free-assets}

<div class="package-grid">
{% for pkg in free_packages %}
  <div class="package-card">
    <img src="{{ pkg.card }}" alt="{{ pkg.title }}" class="package-card-image" width="420" height="280" loading="lazy" decoding="async">
    <img src="{{ pkg.icon }}" alt="{{ pkg.title }} icon" class="package-card-icon" width="160" height="160" loading="lazy" decoding="async">
    <div class="package-card-content">
      <h2><a href="{{ pkg.url }}">{{ pkg.title }}</a></h2>
      <div class="card-meta">
        <span class="badge badge-free">Free</span>
        <span class="card-updated">{{ pkg.meta }}</span>
      </div>
      <p>{{ pkg.blurb }}</p>
      <a href="{{ pkg.url }}" class="card-link">Learn more →</a>
    </div>
  </div>
{% endfor %}
</div>

## Support

<div class="about-text about-text--tight">
  <p>Reviews on the Asset Store help a lot: positive ones are how most people find the tools, and critical ones tell me what to fix.</p>
  <p>You can also donate on Ko-fi.</p>
</div>

<a href="https://ko-fi.com/justetools" class="asset-store-btn" target="_blank" rel="noopener">Buy me a coffee ☕</a>

## Contact

Questions or issues? Reach me at [justetools@gmail.com](mailto:justetools@gmail.com). I reply within one business day.
