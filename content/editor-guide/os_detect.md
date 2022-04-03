---
date: "2022-03-30"
description: Using Copy to Clipboard and command blocks
draft: false
siderendertoc: true
menu:
  editor:
    parent: Editor Guide
    name: OS Detection
    weight: 15
type: editorguide
title: Displaying something different for different platforms
weight: 60
---

## tl;dr

Use the following _classes_ in your HTML and the following shortcode to display something different for different platforms:

```html
You are viewing this in
<span class="os_detect os_detect_windows os_detect_hidden">Windoows</span>
<span class="os_detect os_detect_linux os_detect_hidden">Linooks</span>
<span class="os_detect os_detect_macos os_detect_hidden">macOOS</span>
<span class="os_detect os_detect_unix os_detect_hidden">some oOther Unix (other than Linux)</span>
<span class="os_detect os_detect_not_all">... umm, I dunno</span>
.

Or more briefly you are viewing this in <span class="os_detect os_detect_any os_detect_osName">... I still don't know</span>
.
{{%/* os-detect-hide */%}}
```

To produce:

You are viewing this in
<span class="os_detect os_detect_windows">Windoows</span>
<span class="os_detect os_detect_linux">Linooks</span>
<span class="os_detect os_detect_macos">macOOS</span>
<span class="os_detect os_detect_unix">some oOther Unix (other than Linux)</span>
<span class="os_detect os_detect_not_all">... umm, I dunno</span>
.

Or more briefly you are viewing this in <span class="os_detect os_detect_any os_detect_osName">... I still don't know</span>
.

## `os_detect`

This is a home-grown JavaScript/CSS functionality that allows certain elements in the HTML to be displayed or not, depending on the OS detected, which you can control using only class names (all starting with `os_detect`).  Any element that you want to conditionally appear depending on the detected OS must have a class `os_detect`.  Other directives can be given as class names starting with `os_detect_`... .

## Partial and shortcode `os-detect-hide.html`

After all of your content that has controlled elements, you should run the shortcode `{{</*os-detect-hide*/>}}` which runs the javascript function to work out what to do with each element.

If you are only using this in partials or templates then you should ensure that `{{ partial "os-detect-init.html" . }}` is run at the top of the page.  If you use `{{</*os-detect-hide*/>}}` as a shortcode then the `head-meta.html` class will run `os-detect-init.html` for you automatically.

{{%div class="inset"%}}
**Important:** You should only call the `{{</*os-detect-hide*/>}}` shortcode *once* at the end of the page, no matter how many os-detect sections you have.
{{%/div%}}

## Toggle button and example

There is a javascript function `osToggleAll()` that can be called to toggle between showing the detected OS elements, and all OS elements.
This is demonstrated below, and you can see what the main class names do.

```html
<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>

Here will be your OS name: <span class="os_detect os_detect_any os_detect_osName">or not if it isn't detected</span><br/>
Here will be your OS id: <span class="os_detect os_detect_any os_detect_osId">or not</span>
<div style="background: pink;" class="os_detect os_detect_windows os_detect_instant">You'll see this in Windows or when ALL is set</div>
<div style="background: sandybrown;" class="os_detect os_detect_linux os_detect_instant">You'll see this in Linux or when ALL is set</div>
<div style="background: lightyellow;" class="os_detect os_detect_macos os_detect_instant">You'll see this in macOS or when ALL is set</div>
<div style="background: lightgreen;" class="os_detect os_detect_unix os_detect_instant">You'll see this in some other Unix (other than Linux) or when ALL is set</div>
<div style="background: lightblue;" class="os_detect os_detect_any os_detect_instant">You'll see this if any OS has been detected</div>
<div style="background: mediumpurple;" class="os_detect os_detect_all os_detect_instant">You'll only see this if ALL is set</div>
<div style="background: violet;" class="os_detect os_detect_any os_detect_not_all os_detect_instant">You'll only see this if ALL is NOT set but an OS is detected</div>
<div style="background: lightgray;" class="os_detect os_detect_any os_detect_not_all">This one doesn't have os_detect_instant so is delayed</div>
{{</*os-detect-hide*/>}}
```

<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>

Here will be your OS name: <span class="os_detect os_detect_any os_detect_osName">or not if it isn't detected</span><br/>
Here will be your OS id: <span class="os_detect os_detect_any os_detect_osId">or not</span>
<div style="background: pink;" class="os_detect os_detect_windows os_detect_instant">You'll see this in Windows or when ALL is set</div>
<div style="background: sandybrown;" class="os_detect os_detect_linux os_detect_instant">You'll see this in Linux or when ALL is set</div>
<div style="background: lightyellow;" class="os_detect os_detect_macos os_detect_instant">You'll see this in macOS or when ALL is set</div>
<div style="background: lightgreen;" class="os_detect os_detect_unix os_detect_instant">You'll see this in some other Unix (other than Linux) or when ALL is set</div>
<div style="background: lightblue;" class="os_detect os_detect_any os_detect_instant">You'll see this if any OS has been detected</div>
<div style="background: mediumpurple;" class="os_detect os_detect_all os_detect_instant">You'll only see this if ALL is set</div>
<div style="background: violet;" class="os_detect os_detect_any os_detect_not_all os_detect_instant">You'll only see this if ALL is NOT set but an OS is detected</div>
<div style="background: lightgray;" class="os_detect os_detect_any os_detect_not_all">This one doesn't have os_detect_instant so is delayed</div>

## `os_detect_instant` class

By default there is a short delay from `os_detect_visible` to `os_detect_hidden` (and back) to allow for CSS transitions to take effect.  If you want the change to be instantaneous then add the `os_detect_instant` class.

The reason for this is that browsers do not/cannot use a CSS transition between `display: none;` and not that.  The change is sudden even with a `transition` period.  It is important for the `display: none;` to be applied though as this is a more accessible version of the page (e.g. screen readers will know to ignore these elements).  The delay is set to 1000ms (this is hardcoded in `os-detect.js`) which should be enough time for any CSS transitions to complete.  If it isn't your transitions are taking too long!

## CSS transitions and example

By default, when hiding an element the `display: none` isn't displayed until 1000ms after `osToggleAll()` is applied.  This is to allow for CSS transitions to take effect, since `display: none` cannot have a transition.  In order to make a transition with a specific group of elements (which must already have the `os_detect` class along with others to mark when they are displayed), use the `os_detect_transition` class along with another identifying class or `id` and use CSS styling for that descriptor AND the `os_detect_hiding` and `os_detect_unhiding` classes.  e.g.

```html
<style>
#fader.os_detect_hiding { max-height: 0; opacity: 0; transition: all 0.5s; }
#fader.os_detect_unhiding { max-height: 2rem; opacity: 100%; transition: all 0.5s; }
div.slider { white-space: nowrap; overflow: hidden; } 
div.slider.os_detect_hiding { max-height: 0; max-width: 0; transition: all 1s; }
div.slider.os_detect_unhiding { max-height: 2rem; max-width: 100%; transition: all 1s; }
</style>
<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>

<div id="fader" style="background: pink;" class="os_detect os_detect_transition os_detect_any os_detect_not_all">You'll see this when OS is detected but ALL is NOT set</div>
<div style="background: sandybrown;" class="os_detect os_detect_transition os_detect_linux slider">You'll see this in Linux or when ALL is set</div>
<div style="background: lightyellow;" class="os_detect os_detect_transition os_detect_macos slider">You'll see this in macOS or when ALL is set</div>
<div style="background: lightgreen;" class="os_detect os_detect_transition os_detect_unix slider">You'll see this in some other Unix (other than Linux) or when ALL is set</div>
<div style="background: lightblue;" class="os_detect os_detect_transition os_detect_any slider">You'll see this if any OS has been detected</div>
<div style="background: mediumpurple;" class="os_detect os_detect_transition os_detect_all slider">You'll only see this if ALL is set</div>
<div style="background: violet;" class="os_detect os_detect_transition os_detect_any os_detect_not_all slider">You'll only see this if ALL is NOT set but an OS is detected</div>
```
<style>
#fader.os_detect_hiding { max-height: 0; opacity: 0; transition: all 0.5s; }
#fader.os_detect_unhiding { max-height: 2rem; opacity: 100%; transition: all 0.5s; }
div.slider { white-space: nowrap; overflow: hidden; } 
div.slider.os_detect_hiding { max-height: 0; max-width: 0; transition: all 1s; }
div.slider.os_detect_unhiding { max-height: 2rem; max-width: 100%; transition: all 1s; }
</style>
<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>

<div id="fader" style="background: pink;" class="os_detect os_detect_transition os_detect_any os_detect_not_all">You'll see this when OS is detected but ALL is NOT set</div>
<div style="background: sandybrown;" class="os_detect os_detect_transition os_detect_linux slider">You'll see this in Linux or when ALL is set</div>
<div style="background: lightyellow;" class="os_detect os_detect_transition os_detect_macos slider">You'll see this in macOS or when ALL is set</div>
<div style="background: lightgreen;" class="os_detect os_detect_transition os_detect_unix slider">You'll see this in some other Unix (other than Linux) or when ALL is set</div>
<div style="background: lightblue;" class="os_detect os_detect_transition os_detect_any slider">You'll see this if any OS has been detected</div>
<div style="background: mediumpurple;" class="os_detect os_detect_transition os_detect_all slider">You'll only see this if ALL is set</div>
<div style="background: violet;" class="os_detect os_detect_transition os_detect_any os_detect_not_all slider">You'll only see this if ALL is NOT set but an OS is detected</div>


## Force the OS detection with `os` query parameter

You can "force" detection of a particular OS by adding the query string parameter `os`.  That is, stick `?os=` with a value of one of `windows`, `macos`, `linux`, `unix`, `all` to the end of the URL.

e.g.

[This page with `os=windows`](.?os=windows)<br/>
[This page with `os=macos`](.?os=macos)<br/>
[This page with `os=linux`](.?os=linux)


## `<tr>` `max-height` transition complexity

Table rows do not transition in the way you might expect when the `max-height` of the _contents_ of a table cell `<td>` (or the cell itself) change in a transition.  The table row seems to stay the same height until the contents' `max-height` transition has ended.  Similarly the `max-height` of a `<tr>` will not shrink to below the height of its cell contents.  This is clearly not the desirable behaviour!

However what you can do is transition the `max-height` of the table row `<tr>`, the `<td>`s and the cell contents all at the same time, which is what happens with the Download table.  There are predefined CSS descriptors to do this for the class `os_detect_tr` and `cell_content`. These should be added to the `<tr>` and a `<div>` inside the `<td>` respectively (and don't forget the `os_detect_transition` class in the `<tr>`).

A subtle addition to the `os_detect_tr` transitions is that the `max-width` of the final cell (if it's not the first cell) in a hiding row is also reduced.  This is make any column width adjustments less obviously jerky due to disappearing content when the `display: none` is applied after the 1000ms delay.

## Table `<tr>` example

```html
<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>
<table>
  <tr class="os_detect os_detect_all os_detect_transition os_detect_tr"><td><div class="cell_content"><b>Showing all OSes</b></div></td></tr>
  <tr class="os_detect os_detect_hidden os_detect_any os_detect_not_all os_detect_transition os_detect_tr"><td><div class="cell_content"><b>Detected your OS</b></div></td></tr>
  <tr class="os_detect os_detect_windows os_detect_transition os_detect_tr"><td><div class="cell_content">My Windows text</div></td></tr>
  <tr class="os_detect os_detect_macos os_detect_transition os_detect_tr"><td><div class="cell_content">My macOS text</div></td></tr>
  <tr class="os_detect os_detect_linux os_detect_transition os_detect_tr"><td><div class="cell_content">My Linux text</div></td></tr>
</table>
```
<button class="os_detect os_detect_any os_detect_all" onclick="osToggleAll()">toggle "ALL"</button>
<table>
  <tr class="os_detect os_detect_all os_detect_transition os_detect_tr"><td><div class="cell_content"><b>Showing all OSes</b></div></td></tr>
  <tr class="os_detect os_detect_hidden os_detect_any os_detect_not_all os_detect_transition os_detect_tr"><td><div class="cell_content"><b>Detected your OS</b></div></td></tr>
  <tr class="os_detect os_detect_windows os_detect_transition os_detect_tr"><td><div class="cell_content">My Windows text</div></td></tr>
  <tr class="os_detect os_detect_macos os_detect_transition os_detect_tr"><td><div class="cell_content">My macOS text</div></td></tr>
  <tr class="os_detect os_detect_linux os_detect_transition os_detect_tr"><td><div class="cell_content">My Linux text</div></td></tr>
</table>

{{%div class="inset"%}}
I've only added the `os_detect_hidden` class initially to the **Detected your OS** cell, because if javascript doesn't run, that's how I'd want it to appear -- with all OSes showing.  When {{%/*os-detect-hide*/%}} runs it will change the elements with `os_detect_hidden` and `os_detect_visible` anyway, but if javascript doesn't run, think about what is the best option for all users.
{{%/div%}}

## The `osToggleAll()` arrow, transitions with examples

The Download table has a neat "arrow" chevron that rotates (this is a CSS transition).  This is a non-hiding transition which you can achieve by adding the class `os_detect_visible_toggle` which will then add classes `os_detect_toggle_all` and `os_detect_toggle_not_all`.
There is a predefined class `os_detect_rotate` which utilises these classes to perform a rotation transition, which can be used like this:

```html
<button class="os_detect os_detect_alltoggle os_detect_rotate os_detect_visible_toggle os_detect_button" onclick="osToggleAll()">{{</* svg-icon src="chevron-down" */>}}</button>
```
<button class="os_detect os_detect_alltoggle os_detect_rotate os_detect_visible_toggle os_detect_button" onclick="osToggleAll()">{{< svg-icon src="chevron-down" >}}</button>

But it doesn't necessarily have to be a chevron...
```html
<button class="os_detect os_detect_alltoggle os_detect_rotate os_detect_visible_toggle os_detect_button" onclick="osToggleAll()">{{</* svg-icon src="jalview_logo" */>}}</button> &lt;-- CLICK!
```
<button class="os_detect os_detect_alltoggle os_detect_rotate os_detect_visible_toggle os_detect_button" onclick="osToggleAll()">{{< svg-icon src="jalview_logo" >}}</button> &lt;-- CLICK!


## Counting detected elements for your OS and using plurals: `os_detect_count`, `os_detect_count_view`, `os_detect_osCount` with examples{#count}

If you add a `os_detect_count` class to an OS specific element, and that OS is detected, then you can display that count with the classes `os_detect_count_view os_detect_osCount`.  This isn't super helpful in itself, but you can also change text depending on whether a plural number of elements were found, e.g.:
```html
<div class="os_detect os_detect_windows os_detect_count">Windows counted element 1</div>
<div class="os_detect os_detect_macos os_detect_count">macOS counted element 1</div>
<div class="os_detect os_detect_macos os_detect_count">macOS counted element 2</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 1</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 2</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 3</div>
<div>
I have counted <span class="os_detect os_detect_any os_detect_count_view os_detect_osCount">0</span> for <span class="os_detect os_detect_any os_detect_osId"></span>.<br/>
<span class="os_detect os_detect_count_view os_detect_singular">SINGULAR</span><span class="os_detect os_detect_count_view os_detect_plural">PLURAL</span><br/>
This is <span class="os_detect os_detect_count_view os_detect_singular">equal to</span> <span class="os_detect os_detect_count_view os_detect_plural">not equal to</span> 1.
The visible &lt;div&gt; element<span class="os_detect os_detect_count_view os_detect_singular"> has</span><span class="os_detect os_detect_count_view os_detect_plural">s have</span> been counted!
</div>
```
<div class="os_detect os_detect_windows os_detect_count">Windows counted element 1</div>
<div class="os_detect os_detect_macos os_detect_count">macOS counted element 1</div>
<div class="os_detect os_detect_macos os_detect_count">macOS counted element 2</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 1</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 2</div>
<div class="os_detect os_detect_linux os_detect_count">Linux counted element 3</div>
<div>
I have counted <span class="os_detect os_detect_any os_detect_count_view os_detect_osCount">0</span> for <span class="os_detect os_detect_any os_detect_osId"></span>.<br/>
<span class="os_detect os_detect_count_view os_detect_singular">SINGULAR</span><span class="os_detect os_detect_count_view os_detect_plural">PLURAL</span><br/>
This is <span class="os_detect os_detect_count_view os_detect_singular">equal to</span> <span class="os_detect os_detect_count_view os_detect_plural">not equal to</span> 1.
The visible &lt;div&gt; element<span class="os_detect os_detect_count_view os_detect_singular"> has</span><span class="os_detect os_detect_count_view os_detect_plural">s have</span> been counted!
</div>

[Try with `os=windows` (1)](.?os=windows#count)<br/>
[Try with `os=macos` (2)](.?os=macos#count)<br/>
[Try with `os=linux` (3)](.?os=linux#count)<br/>
[Try with `os=unix` (0)](.?os=unix#count)

In case you are wondering why the count being shown doesn't include all of the OS element detections on the rest of this page, it's because they don't have the `os_detect_count` class specified.

{{%div class="inset"%}}
**Note** that you can display the `os_detect_osCount` or the other count dependent classes anywhere on the page (e.g. before the `os_detect_count` elements), since the counting of `os_detect_count` is done in the first pass, and the `os_detect_count_view` element content changes are done in a second pass. 
{{%/div%}}

## Changing an element's content to `os_detect_osName` or `os_detect_osId` with examples

Similarly to the `os_detect_osCount` class, you can display the detected OS's id or display name with
```html
<span class="os_detect os_detect_any os_detect_osId"></span>="<span class="os_detect os_detect_any os_detect_osName"></span>"
```
<span class="os_detect os_detect_any os_detect_osId"></span>="<span class="os_detect os_detect_any os_detect_osName"></span>"

## Other classes

- `os_detect_ignore`

## Files used

- `assets/js/os-detect.js`
- `assets/css/os-detect.css`
- `layouts/partials/os-detect-init.html`
- `layouts/partials/os-detect-hide.html`
- `layouts/shortcodes/os-detect-init.html`
- `layouts/shortcodes/os-detect-hide.html`




{{% os-detect-hide %}}
