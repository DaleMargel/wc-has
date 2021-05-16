# **wc-has**
> Data binding at industrial scale

This was written to help port logic from spreadsheets to web pages. It can emulate all calculation and dependencies that you would have in a typical spreadsheet.

- written as smallish 3.6k custom element, about 120 LOC
- uses very simple conventions, so there is little to learn or go wrong
- can handle equations and their dependencies
- can initialize the values of elements
- NB: control is still being fine tuned so changes can still happen


## Usage

The following will bind an `input`, a `select` and some `text` through `choice`. When one is changed, the `<wc-has>` will intercept the value `change` event and propagate the change to the others.

The attribute value `choice` is just used to label the topic, it can have any unique name.

```html
<wc-has>
    <input has="choice" />
    <select has="choice">
        <option value="one">one</option>
        <option value="two">two</option>
        <option value="three">three</option>
    <select>
    <p>You selected <span has="choice">?</span></p>
<wc-has>
```

In more complex cases, such as web components, we want to be able to set changes through attributes. These do not generate events in the normal sense, so the web-component will generate an `attributechanged` custom event when it makes changes to its attributes.

To receive changes, the element can list a number of names in the `has` attribute.

```html
<wc-has>
    <input has="height" />
    <input has="width" />
    <input has="depth" />
    <wc-volume has="height width depth"></wc-volume>
<wc-has>
```

In this case, the `<wc-volume>` receives values for height, width and depth to presumably calculate the volume. For simple calculations, a web component is overkill. An easier way would be:

```html
<wc-has>
    <input has="height" />
    <input has="width" />
    <input has="depth" />
    <input has="volume" readonly/>
<wc-has>
<script>
    class Calc {
        volume(height,width,depth){ return height * width * depth }
    }
    document.querySelector('wc-has').calculations = new Calc();
</script>
```

Here, `<wc-has>` will now recalculate `volume` whenever `height`, `width` or `depth` changes. The Calc class name is not relevant and there can be any number of methods. It is important to match the case of the methods and arguments to the names used in the `has` attribute.

**NB**: HTML is case insensitive. If you stick to lower case there should be no problems.

To make life a bit easier, calculation methods with no arguments are used to initialize the values. This can be used in place of inline attributes and can lead to simpler code.

```html
<wc-has>
    <input has="height" />
    <input has="width" />
    <input has="depth" />
    <input has="volume" readonly/>
<wc-has>
<script>
    class Calc {
        volume(height,width,depth){ return height * width * depth }
        height(){ return 0 }
        width(){ return 0 }
        depth(){ return 0 }
    }
    document.querySelector('wc-has').calculations = new Calc();
</script>
```
As a general rule, only put necessary methods in this class. The `<wc-has>` must read these and determine dependencies. No sense in giving it unneeded work. 

## Demo
Use this link : <https://dalemargel.github.io/wc-has>


