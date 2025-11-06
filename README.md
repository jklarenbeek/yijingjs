# @yijingjs/core

Core library for Yijing (I Ching) hexagram calculations, transformations, and analysis.

## Installation
```bash
npm install @yijingjs/core
```

## Usage
```javascript
import * as Yijing from '@yijingjs/core';
import * as Wuxing from '@yijingjs/core/wuxing';
import * as Bagua from '@yijingjs/core/bagua';

// Get hexagram properties
const hex = 21;
const upper = Yijing.yijing_upper(hex);
const lower = Yijing.yijing_lower(hex);
const lineCount = Yijing.yijing_lineCount(hex);

// Get symmetry classification
const symmetry = Yijing.yijing_symmetryName(hex);

// Get neighbors (single-bit changes)
const neighbors = Yijing.yijing_neighbors(hex);

// Get wuxing element for trigram
const element = Bagua.bagua_toWuxing(upper);
const emoji = Wuxing.wuxing_toEmojiChar(element);
```

## API Documentation

See [full documentation](https://github.com/jklarenbeek/yijingjs).

## License

MIT