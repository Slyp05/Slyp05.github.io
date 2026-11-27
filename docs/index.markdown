---
layout: home
---

<h1 class="home-title"><img src="/assets/images/logo.png" alt="Juste Tools" class="home-image" width="600" height="352" decoding="async"></h1>

<div class="home-intro">
  <p>Juste Tools is where I make the Unity tools I always wished existed: hard problems, made simple.</p>
  <p>Each one is shaped by real production experience at top mobile studios, and built to fit into your project, not take it over.</p>
</div>

{%- assign live = site.data.packages | where: "released", true | sort: "released_on" | reverse -%}
{%- assign paid_packages = live | where_exp: "p", "p.free != true" -%}
{%- assign free_packages = live | where_exp: "p", "p.free == true" -%}
{%- assign review_packages = site.data.packages | where_exp: "p", "p.released != true" -%}

## Paid Assets <span class="section-note">On the Unity Asset Store</span> {#assets}

<div class="package-grid">
{% for pkg in paid_packages %}{% include package-card.html pkg=pkg %}{% endfor %}
</div>

## Free Assets <span class="section-note">Free to download on the Asset Store</span> {#free-assets}

<div class="package-grid">
{% for pkg in free_packages %}{% include package-card.html pkg=pkg %}{% endfor %}
</div>
{% if review_packages.size > 0 %}
## In Review <span class="section-note">Awaiting Unity's review</span> {#in-review}

<div class="package-grid">
{% for pkg in review_packages %}{% include package-card.html pkg=pkg %}{% endfor %}
</div>
{% endif %}
