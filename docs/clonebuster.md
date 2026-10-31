---
layout: page
title: CloneBuster
permalink: /clonebuster/
image: /assets/images/clonebuster-social.jpg
sitemap: false
description: "CloneBuster timestamps every version of your project and source art from the moment you import it, and turns that history into a one-page proof and a dated timelapse when someone copies your game."
software:
  name: "CloneBuster: Anti-AI Proof of Creation"
  store_url: ""
---

<img src="/assets/images/clonebuster.jpg" alt="CloneBuster" class="package-image" width="1200" height="800" decoding="async">

**CloneBuster timestamps every version of your project and source art from the moment you import it, and turns that history into a one-page proof and a dated timelapse when someone copies your game.**

## Description

Prove you made it first.

AI tools can now rebuild a game from its build or its trailer in days. Obfuscation can't stop a clone made from a trailer, and AI keeps getting better at reading builds.

CloneBuster doesn't join that race. A clone can copy your finished game, but not the dated history of how you made it. CloneBuster records that history for you, and however good AI gets, it can't make a copy look older than your work.

## How to Use

**1. Import it**

That's the whole setup. Your project is now timestamped.

**2. Work as usual**

Every version is timestamped in the background by two independent authorities: an RFC 3161 timestamp authority and OpenTimestamps, anchored in the Bitcoin blockchain. No account, wallet or fee.

**3. When someone copies you**

Pick the files and versions to show, then export:

- **Proof.pdf:** one page per asset that a store reviewer reads in seconds, with a plain verdict ("This file existed by 2 March 2026, confirmed by two independent timestamps"), your first and latest versions, and the copy's screenshot beside them.
- **Notice text:** one paragraph to paste into a store's takedown form.
- **The raw evidence:** every version's timestamps and preview, with the standard command that checks each one, so anyone can verify it without CloneBuster.

## Show How You Made It

The process reel turns an asset's versions into a GIF or MP4 with a date on every frame. Share it to show how your game came to be, or to answer anyone who claims your work is AI-made.

## Good to Know

- **Only hashes leave your computer:** never your files.
- **Nothing in your game:** it adds no code, data or file to your build.
- **Your purchases never count as evidence:** Asset Store files are recognised, and you can mark other folders as third-party.
- **Source art outside Assets can be recorded too:** add its folders in the settings.
- **Previews:** PNG, JPG, PSD, Aseprite, Krita, Blender, Procreate and models inside Assets. Every other file, code included, is timestamped and provable by its hash.
- **Your repository backs it up:** commit the `CloneBuster Vault` folder with your project.
- Source code and full documentation included, with where to file a takedown on each major store.

## What It Proves

Each version existed by its timestamped date. CloneBuster doesn't stop copying, and it doesn't certify how a version was made. It proves when.

## Requirements

- Unity 6.0 or newer.
- An internet connection to send timestamps. Offline, versions queue until the network returns.
- curl, included with Windows 10 and later, macOS and most Linux distributions.
- MP4 reels need Windows or macOS; GIF reels work everywhere.

## Learn More

<a href="/clonebuster/user-manual/" class="asset-store-btn">User Manual</a>

## Get It

<!-- TODO: unreleased; on release set store_url in the front matter above (the button below switches to the store link) and remove `sitemap: false` (here and the clonebuster scope in _config.yml). -->
{% include store-button.html %}

## Support

<a href="/contact/?package=clonebuster&amp;category=bug" class="asset-store-btn">Report a bug</a>
<a href="/contact/?package=clonebuster&amp;category=question" class="asset-store-btn">Ask a question</a>

## Patch Notes

<details class="patch-note" open>
<summary><strong>v1.0.0</strong> <span class="patch-date">Initial release</span></summary>
<div class="patch-note-body" markdown="1">

Initial release.

</div>
</details>
