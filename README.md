# Component Documentation Generator

A Figma plugin that generates structured documentation frames for components and component sets in your design system.

## Features

When you run this plugin with a component or component set selected, it creates a documentation frame with three sections:

### Section 1: Description + Behaviour
- Auto-fills component name and description (if available)
- Provides structured prompts for documenting:
  - What the component is
  - When it should be used
  - How it looks and behaves
  - Key behavior rules/constraints

### Section 2: Formal Component Definition
- Auto-generates a property table from the component's properties
- Columns include: Property name, Type, Allowed values, Default, Description
- Handles BOOLEAN, TEXT, INSTANCE_SWAP, and VARIANT property types
- Works with both single components and component sets

### Section 3: Dos / Don'ts
- Template with configurable number of rows (default: 3)
- Each row has DO and DON'T cells with:
  - Title placeholder
  - Description placeholder
  - Screenshot placeholder frame

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma, go to **Plugins > Development > Import plugin from manifest...**
5. Select the `manifest.json` file from this directory

## Usage

1. Select a **Component** or **Component Set** in Figma
2. Run the plugin from **Plugins > Component Documentation Generator**
3. A documentation frame will be created to the right of your selection
4. Fill in the placeholder text with your documentation content

## Configuration

Edit `code.ts` to customize:

```typescript
// Number of Do/Don't rows to generate
const DEFAULT_DO_DONT_ROWS = 3;

// Documentation frame width
const FRAME_WIDTH = 960;

// Spacing and padding values
const SECTION_PADDING = 32;
const ITEM_SPACING = 16;
```

## Development

Watch for changes during development:
```bash
npm run watch
```

## Requirements

- The plugin uses the **Inter** font family. Make sure it's available in your Figma file.
- Figma Plugin API version 1.0.0+
