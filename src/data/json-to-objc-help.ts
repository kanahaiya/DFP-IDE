/**
 * Help content for JSON to Objective-C converter
 */

export const jsonToObjCHelp = [
  {
    title: 'Getting Started',
    content: `
## JSON to Objective-C Converter

Convert your JSON data to Objective-C model classes with NSObject.

### Quick Start
1. Paste your JSON data
2. Configure class prefix and options
3. Copy or download the generated header (.h) and implementation (.m) files

### Output Files
- **Header (.h)** - Interface declarations
- **Implementation (.m)** - Method implementations
    `.trim(),
  },
  {
    title: 'Property Attributes',
    content: `
## Property Annotations

| Option | Description |
|--------|-------------|
| nonatomic | Non-thread-safe (faster) |
| atomic | Thread-safe access |
| strong | Strong reference (default for objects) |
| copy | Copy on assignment (for NSString, NSArray) |
| assign | Primitive types |
| readonly | Read-only property |
    `.trim(),
  },
  {
    title: 'Type Mapping',
    content: `
## Type Inference

| JSON Value | Objective-C Type |
|------------|------------------|
| String | NSString * |
| Integer | NSInteger / NSNumber * |
| Float | double / NSNumber * |
| Boolean | BOOL / NSNumber * |
| Null | nil |
| Array | NSArray<T> * |
| Object | Custom class * |
    `.trim(),
  },
  {
    title: 'Keyboard Shortcuts',
    content: `
## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Format JSON | Ctrl/Cmd + Shift + F |
| Copy Output | Ctrl/Cmd + Shift + C |
| Clear Input | Ctrl/Cmd + Shift + X |
    `.trim(),
  },
];
