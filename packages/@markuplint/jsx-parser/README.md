# @markuplint/jsx-parser

[![npm version](https://badge.fury.io/js/%40markuplint%2Fjsx-parser.svg)](https://www.npmjs.com/package/@markuplint/jsx-parser)
[![Build Status](https://travis-ci.org/markuplint/markuplint.svg?branch=main)](https://travis-ci.org/markuplint/markuplint)
[![Coverage Status](https://coveralls.io/repos/github/markuplint/markuplint/badge.svg?branch=main)](https://coveralls.io/github/markuplint/markuplint?branch=main)

## Install

```sh
$ npm install -D @markuplint/jsx-parser

$ yarn add -D @markuplint/jsx-parser
```

## Usage

Add `parser` option into your [confugration file](https://markuplint.dev/configuration#parser).

```json
{
  "parser": {
    ".[jt]sx?$": "@markuplint/jsx-parser"
  }
}
```

### Unsupported rule

- [`indentation`](https://markuplint.dev/rules/indentation)
