// ./packages/core/src/index.js

export * from './wuxing.js';
export * from './bagua.js';
export * from './yijing.js';
export * from './tools.js';

// Also export as namespaces
import * as wuxing from './wuxing.js';
import * as bagua from './bagua.js';
import * as yijing from './yijing.js';
import * as tools from './tools.js';

export { wuxing, bagua, yijing, tools };
