# @metalsmith/in-place

A metalsmith plugin for transforming your source files

[![metalsmith: core plugin][metalsmith-badge]][metalsmith-url]
[![npm: version][npm-badge]][npm-url]
[![ci: build][ci-badge]][ci-url]
[![code coverage][codecov-badge]][codecov-url]
[![license: MIT][license-badge]][license-url]

This plugin allows you to render templating syntax in your source files. It uses file extensions to infer which templating engine to use. So files ending in `.njk` will be processed as nunjucks, `.md` as markdown, etc. You can even chain transformations by appending multiple extensions, which will be processed right-to-left.

If you want to wrap your source files in a common template, you can use [@metalsmith/layouts](https://github.com/metalsmith/metalsmith/layouts). For usage examples check out our [wiki](https://github.com/metalsmith/metalsmith/in-place/wiki). Feel free to contribute an example if anything is missing, or update the existing ones. For templating engine specific questions try the aforementioned channels, as well as the documentation for [jstransformers](https://github.com/jstransformers) and your templating engine of choice.

## Installation

NPM:

```bash
npm install @metalsmith/in-place
```

Yarn:

```bash
yarn add @metalsmith/in-place
```

## Usage

This plugin uses [jstransformers](https://github.com/jstransformers/jstransformer) to transform files. Since there are a lot of jstransformers we don't install them automatically, so you'll also need to install the appropriate jstransformers.

For example, to render markdown you would install [jstransformer-markdown](https://github.com/jstransformers/jstransformer-markdown). To render handlebars you would install [jstransformer-handlebars](https://github.com/jstransformers/jstransformer-handlebars). Other popular templating options are: Nunjucks, Twig, Pug, EJS. See the [jstransformer organisation](https://github.com/jstransformers) for all available jstransformers and [this dictionary](https://github.com/jstransformers/inputformat-to-jstransformer/blob/master/dictionary.json) to see which extensions map to which jstransformer.

## Options

You can pass options to `@metalsmith/in-place` with the [Javascript API](https://github.com/segmentio/metalsmith#api) or [CLI](https://github.com/segmentio/metalsmith#cli). The options are:

- [pattern](#pattern): optional. Only files that match this pattern will be processed. Accepts a string or an array of strings. The default is `**`.
- [engineOptions](#engineoptions): optional. Use this to pass options to the jstransformer that's rendering your files. The default is `{}`.
- [suppressNoFilesError](#suppressnofileserror): optional. The no-files-to-process error will be suppressed. The default is `false`.
- [setFilename](#setfilename): optional. Some templating engines, like [pug](https://github.com/pugjs/pug), need a `filename` property to be present in the options to be able to process relative includes, extends, etc. Setting this option to `true` will add the current filename to the options passed to each jstransformer. The default is `false`.

### `pattern`

Only files that match this pattern will be processed. So this `metalsmith.json`:

```json
{
  "source": "src",
  "destination": "build",
  "plugins": {
    "@metalsmith/in-place": {
      "pattern": "blog/**/*"
    }
  }
}
```

Would only process files within the `./src/blog` folder, because the pattern is
relative to your source folder. See [Metalsmith#match](https://metalsmith.io/api/#Metalsmith+match)
for further details.

### `engineOptions`

Use this to pass options to the jstransformer that's rendering your templates. So this
`metalsmith.json`:

```json
{
  "source": "src",
  "destination": "build",
  "plugins": {
    "@metalsmith/in-place": {
      "engineOptions": {
        "cache": false
      }
    }
  }
}
```

Would pass `{ "cache": false }` to each used jstransformer.

### `suppressNoFilesError`

`@metalsmith/in-place` exits with [an error](#no-files-to-process) if it can’t find any files to process. If you’re doing any kind of incremental builds via something like `metalsmith-watch`, this is problematic as you’re likely only rebuilding files that have changed. This flag allows you to suppress that error. So this `metalsmith.json`:

```json
{
  "source": "src",
  "destination": "build",
  "plugins": {
    "@metalsmith/in-place": {
      "suppressNoFilesError": true
    }
  }
}
```

Would suppress the error if there aren't any files to process. Note that when this option is turned on, if you're logging [debug messages](#errors-and-debugging), you’ll still see a message denoting when there aren't any files for metalsmith-layouts to process.

### `setFilename`

Set this option to `true` if you want to pass the current filename to each jstransformer. The default is `false`. So this `metalsmith.json`:

```json
{
  "source": "src",
  "destination": "build",
  "plugins": [
    {
      "@metalsmith/in-place": {
        "setFilename": true
      }
    }
  ]
}
```

Would overwrite `engineOptions.filename` with the absolute path for the file that's currently being processed, and pass that to the jstransformer. For now we're just passing `filename`, but if you encounter a jstransformer that requires a different property, like `path` or something else, let us know and we can add it.

## Errors and debugging

If you're encountering problems you can use [debug](https://www.npmjs.com/package/debug) to enable verbose logging. To enable `debug` prefix your build command with `DEBUG=@metalsmith/in-place`. So if you normally run `metalsmith` to build, use `DEBUG=@metalsmith/in-place metalsmith` (on windows the syntax is [slightly different](https://www.npmjs.com/package/debug#windows-note)).

### No files to process

There are several things that might cause you to get a `no files to process` error:

- Your [pattern](#pattern) does not match any files
- None of your files pass validation, validation fails for files that:
  - Have no extension
  - Are not utf-8
  - Need a jstransformer that hasn't been installed

### Debug

To enable debug logs, set the `DEBUG` environment variable to `@metalsmith/in-place`:

Linux/Mac:

```bash
export DEBUG=@metalsmith/in-place
```

Windows:

```bat
set "DEBUG=@metalsmith/in-place"
```

Alternatively you can set `DEBUG` to `@metalsmith/*` to debug all Metalsmith core plugins.

## Credits

- [Ismay Wolff](https://github.com/ismay) for improving upon metalsmith-templates & diligently maintaining its successor
- [Ian Storm Taylor](https://github.com/ianstormtaylor) for creating [metalsmith-templates](https://github.com/segmentio/metalsmith-templates), on which this plugin was based
- [Rob Loach](https://github.com/RobLoach) for creating [metalsmith-jstransformer](https://github.com/RobLoach/metalsmith-jstransformer), which inspired our switch to jstransformers

## License

[MIT](LICENSE)

[npm-badge]: https://img.shields.io/npm/v/@metalsmith/in-place.svg
[npm-url]: https://www.npmjs.com/package/@metalsmith/in-place
[ci-badge]: https://github.com/metalsmith/in-place/actions/workflows/test.yml/badge.svg
[ci-url]: https://github.com/metalsmith/in-place/actions/workflows/test.yml
[metalsmith-badge]: https://img.shields.io/badge/metalsmith-core_plugin-green.svg?longCache=true
[metalsmith-url]: https://metalsmith.io
[codecov-badge]: https://img.shields.io/coveralls/github/metalsmith/in-place
[codecov-url]: https://coveralls.io/github/metalsmith/in-place
[license-badge]: https://img.shields.io/github/license/metalsmith/in-place
[license-url]: LICENSE
