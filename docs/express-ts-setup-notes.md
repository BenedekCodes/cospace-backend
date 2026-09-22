# errors

ECMAScript imports and exports cannot be written in a CommonJS file under 'verbatimModuleSyntax'. Adjust the 'type' field in the nearest 'package.json' to make this file an ECMAScript module, or adjust your 'verbatimModuleSyntax', 'module', and 'moduleResolution' settings in TypeScript.ts(1295)
(alias) function express(): Express

Error is resolved. Also noticed package.json has a typo dependency "exxpress" instead of express — you'll want to fix that (npm uninstall exxpress && npm install express) since index.ts imports express.