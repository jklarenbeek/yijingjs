// Main entry point - exports everything
export * from './wuxing.js';
export * from './bagua.js';
export * from './yijing.js';

// Also export as namespaces
import * as wuxing from './wuxing.js';
import * as bagua from './bagua.js';
import * as yijing from './yijing.js';

export { wuxing, bagua, yijing };
