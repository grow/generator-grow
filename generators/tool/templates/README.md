# grow-tool-template

A basic template for creating a simple [grow UI tool](https://grow.io/docs/ui-tools/).

## Conventions

A basic [grow](https://grow.io) UI tool follows a few conventions that make
installation and configuration simple for basic tools.

### Project

The project name should start with `grow-tool-` (ex: `grow-tool-my-project`).

The name should also be used when registering the tool with grow:

```js
// tool.js
grow.ui.tools.push({
  'kind': 'image-swap',
  // ...
}
```

And for styling the grow UI button icon:

```css
/* tool.css */
.grow__icon_my-project {
  /* background-image: url(); */
}
```

### File Names

Grow will attempt to include `tool.js` and `tool.css` from the main project directory.

More advanced tools may have a build process (such as `gulp`) that compiles and minifies
the tool. The product of the build should still produce the files in the main directory
with the same filenames. Otherwise the user will need to configure the tool to look in
a specific directory which makes the tool setup harder.
