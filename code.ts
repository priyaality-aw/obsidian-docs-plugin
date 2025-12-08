// =============================================================================
// Configuration Constants
// =============================================================================

const DEFAULT_DO_DONT_ROWS = 1;

const FRAME_PADDING = 64;
const SECTION_PADDING = 32;
const SECTION_SPACING = 32;
const ITEM_SPACING = 16;
const TABLE_CELL_PADDING = 12;

// Colors matching Figma design
const COLORS = {
  background: { r: 1, g: 1, b: 1 },           // White #FFFFFF
  sectionBg: { r: 0.988, g: 0.988, b: 0.973 }, // Cream #FCFCF8
  headerBg: { r: 0.9, g: 0.9, b: 0.9 },       // Gray for table header
  doColor: { r: 0.941, g: 0.973, b: 0.929 },  // #F0F8ED
  dontColor: { r: 0.992, g: 0.945, b: 0.945 }, // #FDF1F1
  doText: { r: 0.267, g: 0.506, b: 0.192 },   // #448131
  dontText: { r: 0.812, g: 0.090, b: 0.090 }, // #CF1717
  border: { r: 0.816, g: 0.816, b: 0.816 },   // #D0D0D0
  text: { r: 0.102, g: 0.102, b: 0.102 },     // #1A1A1A
  placeholder: { r: 0.5, g: 0.5, b: 0.5 },    // Grey
  subtleText: { r: 0.4, g: 0.4, b: 0.4 },     // #666666
};

// Font settings - using Manrope as primary (matching Figma design)
let FONTS = {
  title: { family: "Manrope", style: "Bold" } as FontName,
  heading: { family: "Manrope", style: "Bold" } as FontName,
  subheading: { family: "Manrope", style: "SemiBold" } as FontName,
  body: { family: "Manrope", style: "Regular" } as FontName,
  bold: { family: "Manrope", style: "SemiBold" } as FontName,
  medium: { family: "Manrope", style: "Medium" } as FontName,
};

// =============================================================================
// Font Loading
// =============================================================================

async function loadRequiredFonts(): Promise<boolean> {
  // Try Manrope first (matching Figma design)
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Manrope", style: "Bold" }),
      figma.loadFontAsync({ family: "Manrope", style: "SemiBold" }),
      figma.loadFontAsync({ family: "Manrope", style: "Medium" }),
      figma.loadFontAsync({ family: "Manrope", style: "Regular" }),
    ]);
    FONTS = {
      title: { family: "Manrope", style: "Bold" },
      heading: { family: "Manrope", style: "Bold" },
      subheading: { family: "Manrope", style: "SemiBold" },
      body: { family: "Manrope", style: "Regular" },
      bold: { family: "Manrope", style: "SemiBold" },
      medium: { family: "Manrope", style: "Medium" },
    };
    return true;
  } catch (e) {
    console.log("Manrope not available, trying Inter...");
  }

  // Try Inter as fallback
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Medium" }),
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    ]);
    FONTS = {
      title: { family: "Inter", style: "Bold" },
      heading: { family: "Inter", style: "Bold" },
      subheading: { family: "Inter", style: "Semi Bold" },
      body: { family: "Inter", style: "Regular" },
      bold: { family: "Inter", style: "Semi Bold" },
      medium: { family: "Inter", style: "Medium" },
    };
    return true;
  } catch (e) {
    console.log("Inter not available, trying Roboto...");
  }

  // Try Roboto as fallback
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Roboto", style: "Bold" }),
      figma.loadFontAsync({ family: "Roboto", style: "Medium" }),
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }),
    ]);
    FONTS = {
      title: { family: "Roboto", style: "Bold" },
      heading: { family: "Roboto", style: "Bold" },
      subheading: { family: "Roboto", style: "Medium" },
      body: { family: "Roboto", style: "Regular" },
      bold: { family: "Roboto", style: "Medium" },
      medium: { family: "Roboto", style: "Medium" },
    };
    return true;
  } catch (e) {
    console.log("Roboto not available either");
  }

  return false;
}

// =============================================================================
// Helper Functions - Text Creation
// =============================================================================

function createTextNode(
  content: string,
  font: FontName,
  fontSize: number,
  color: RGB = COLORS.text
): TextNode {
  const text = figma.createText();
  text.fontName = font;
  text.fontSize = fontSize;
  text.characters = content;
  text.fills = [{ type: "SOLID", color }];
  return text;
}

// Title text - 40px Bold (for main title)
function createTitleText(content: string): TextNode {
  return createTextNode(content, FONTS.title, 40);
}

// Section heading - 32px Bold
function createHeadingText(content: string): TextNode {
  return createTextNode(content, FONTS.heading, 32);
}

// Subsection heading - 24px SemiBold
function createSubheadingText(content: string): TextNode {
  return createTextNode(content, FONTS.subheading, 24);
}

// Variant/property title - 20px SemiBold
function createItemTitleText(content: string): TextNode {
  return createTextNode(content, FONTS.subheading, 20);
}

// Body text - 16px for labels, 20px for descriptions
function createBodyText(content: string, isPlaceholder = false): TextNode {
  return createTextNode(
    content,
    FONTS.body,
    20,
    isPlaceholder ? COLORS.placeholder : COLORS.subtleText
  );
}

function createLabelText(content: string): TextNode {
  return createTextNode(content, FONTS.bold, 16);
}

function createValueText(content: string): TextNode {
  return createTextNode(content, FONTS.body, 16);
}

function createBoldBodyText(content: string): TextNode {
  return createTextNode(content, FONTS.bold, 16);
}

function createMediumText(content: string): TextNode {
  return createTextNode(content, FONTS.medium, 14, COLORS.placeholder);
}

// Create text with mixed bold/regular formatting
function createPromptText(boldPart: string, regularPart: string): TextNode {
  const text = figma.createText();
  const fullText = `${boldPart} ${regularPart}`;

  // IMPORTANT: Must set font BEFORE setting characters
  text.fontName = FONTS.body;
  text.fontSize = 14;
  text.characters = fullText;
  text.fills = [{ type: "SOLID", color: COLORS.text }];

  // Make the bold part bold
  text.setRangeFontName(0, boldPart.length, FONTS.bold);

  return text;
}

// =============================================================================
// Helper Functions - Frame Creation
// =============================================================================

function createAutoLayoutFrame(
  name: string,
  direction: "HORIZONTAL" | "VERTICAL" = "VERTICAL",
  padding: number = 0,
  spacing: number = 0
): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  // Use HUG for auto-sizing behavior
  frame.layoutSizingHorizontal = "HUG";
  frame.layoutSizingVertical = "HUG";
  frame.paddingTop = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.paddingRight = padding;
  frame.itemSpacing = spacing;
  frame.fills = [];
  return frame;
}

function createSectionFrame(name: string): FrameNode {
  const frame = createAutoLayoutFrame(name, "VERTICAL", SECTION_PADDING, SECTION_SPACING);
  frame.fills = [{ type: "SOLID", color: COLORS.sectionBg }];
  frame.cornerRadius = 12;
  // Note: layoutSizingHorizontal must be set AFTER appending to parent
  return frame;
}

// =============================================================================
// Section 1: Description + Behaviour
// =============================================================================

function createSection1Description(component: ComponentNode | ComponentSetNode): FrameNode {
  const section = createSectionFrame("Description + behaviour");

  // Heading
  const heading = createHeadingText("Description + behaviour");
  section.appendChild(heading);

  // Description / starter summary
  const descriptionFrame = createAutoLayoutFrame("Description", "VERTICAL", 0, 8);
  const descLabel = createLabelText("Description:");
  descriptionFrame.appendChild(descLabel);

  const hasDescription = component.description && component.description.trim().length > 0;
  const descValue = createBodyText(
    hasDescription ? component.description : "Write 1-2 sentence definition here",
    !hasDescription
  );
  descriptionFrame.appendChild(descValue);
  descValue.layoutSizingHorizontal = "FILL";
  section.appendChild(descriptionFrame);
  descriptionFrame.layoutSizingHorizontal = "FILL";

  // Three-column prompts layout (matching Figma design)
  const promptsFrame = createAutoLayoutFrame("Prompts", "HORIZONTAL", 0, 16);

  const prompts = [
    {
      bold: "What is this component?",
      regular: "(1-2 sentence definition)",
    },
    {
      bold: "When should it be used?",
      regular: "(bulleted use cases)",
    },
    {
      bold: "Key behavior rules / constraints",
      regular: "(the opinionated rules you want enforced)",
    },
  ];

  for (const prompt of prompts) {
    const promptContainer = createAutoLayoutFrame("Prompt Item", "VERTICAL", 0, 4);

    const promptText = createPromptText(prompt.bold, prompt.regular);
    promptContainer.appendChild(promptText);
    promptText.layoutSizingHorizontal = "FILL";

    const answerText = createBodyText("Your answer here...", true);
    promptContainer.appendChild(answerText);
    answerText.layoutSizingHorizontal = "FILL";

    promptsFrame.appendChild(promptContainer);
    promptContainer.layoutSizingHorizontal = "FILL";
  }

  section.appendChild(promptsFrame);
  promptsFrame.layoutSizingHorizontal = "FILL";

  return section;
}

// =============================================================================
// Section 2: Formal Component Definition
// =============================================================================

interface PropertyInfo {
  name: string;
  type: string;
  allowedValues: string;
  defaultValue: string;
}

interface VisualProperty {
  name: string;
  value: string;
}

// Helper to convert RGB to hex
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

// Helper to get variable name from a VariableAlias
function getVariableNameFromAlias(alias: VariableAlias | undefined): string | null {
  if (!alias || !alias.id) return null;

  const variable = figma.variables.getVariableById(alias.id);
  return variable ? variable.name : null;
}

function extractVisualProperties(node: SceneNode): VisualProperty[] {
  const properties: VisualProperty[] = [];

  // Check if node has visual properties
  if (!('fills' in node)) return properties;

  const visualNode = node as SceneNode & GeometryMixin & BlendMixin & CornerMixin & RectangleCornerMixin & MinimalStrokesMixin;

  // Extract fills (background colors)
  if (visualNode.fills && Array.isArray(visualNode.fills)) {
    visualNode.fills.forEach((fill, index) => {
      if (fill.type === 'SOLID' && fill.visible !== false) {
        // Check for bound variable on the fill itself
        const fillWithVars = fill as SolidPaint & { boundVariables?: { color?: VariableAlias } };
        const varName = fillWithVars.boundVariables?.color
          ? getVariableNameFromAlias(fillWithVars.boundVariables.color)
          : null;

        if (varName) {
          properties.push({ name: 'Background', value: varName });
        } else {
          // Fallback to hex color
          const hex = rgbToHex(fill.color.r, fill.color.g, fill.color.b);
          const opacity = fill.opacity !== undefined && fill.opacity < 1
            ? ` (${Math.round(fill.opacity * 100)}%)`
            : '';
          properties.push({ name: 'Background', value: `${hex}${opacity}` });
        }
      }
    });
  }

  // Extract strokes (border colors)
  if ('strokes' in visualNode && visualNode.strokes && Array.isArray(visualNode.strokes)) {
    visualNode.strokes.forEach((stroke, index) => {
      if (stroke.type === 'SOLID' && stroke.visible !== false) {
        // Check for bound variable on the stroke itself
        const strokeWithVars = stroke as SolidPaint & { boundVariables?: { color?: VariableAlias } };
        const varName = strokeWithVars.boundVariables?.color
          ? getVariableNameFromAlias(strokeWithVars.boundVariables.color)
          : null;

        if (varName) {
          properties.push({ name: 'Border color', value: varName });
        } else {
          // Fallback to hex color
          const hex = rgbToHex(stroke.color.r, stroke.color.g, stroke.color.b);
          properties.push({ name: 'Border color', value: hex });
        }
      }
    });
  }

  // Extract stroke weight
  if ('strokeWeight' in visualNode && typeof visualNode.strokeWeight === 'number' && visualNode.strokeWeight > 0) {
    const varName = visualNode.boundVariables?.strokeWeight
      ? getVariableNameFromAlias(visualNode.boundVariables.strokeWeight)
      : null;

    if (varName) {
      properties.push({ name: 'Border width', value: varName });
    } else {
      properties.push({ name: 'Border width', value: `${visualNode.strokeWeight}px` });
    }
  }

  // Extract corner radius
  if ('cornerRadius' in visualNode && typeof visualNode.cornerRadius === 'number' && visualNode.cornerRadius > 0) {
    // cornerRadius might be on topLeftRadius, etc. for individual corners
    const nodeWithCorner = visualNode as SceneNode & { boundVariables?: { topLeftRadius?: VariableAlias } };
    const varName = nodeWithCorner.boundVariables?.topLeftRadius
      ? getVariableNameFromAlias(nodeWithCorner.boundVariables.topLeftRadius)
      : null;

    if (varName) {
      properties.push({ name: 'Corner radius', value: varName });
    } else {
      properties.push({ name: 'Corner radius', value: `${visualNode.cornerRadius}px` });
    }
  }

  // Extract effects (shadows, blurs)
  if ('effects' in visualNode && visualNode.effects && Array.isArray(visualNode.effects)) {
    visualNode.effects.forEach((effect, index) => {
      if (!effect.visible) return;

      if (effect.type === 'DROP_SHADOW') {
        const shadow = effect as DropShadowEffect;
        // Check for bound variable on the effect itself
        const effectWithVars = shadow as DropShadowEffect & { boundVariables?: { color?: VariableAlias } };
        const colorVarName = effectWithVars.boundVariables?.color
          ? getVariableNameFromAlias(effectWithVars.boundVariables.color)
          : null;

        if (colorVarName) {
          properties.push({ name: 'Drop shadow', value: colorVarName });
        } else {
          const hex = rgbToHex(shadow.color.r, shadow.color.g, shadow.color.b);
          const alpha = Math.round(shadow.color.a * 100);
          properties.push({
            name: 'Drop shadow',
            value: `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${hex} (${alpha}%)`
          });
        }
      } else if (effect.type === 'INNER_SHADOW') {
        const shadow = effect as InnerShadowEffect;
        const effectWithVars = shadow as InnerShadowEffect & { boundVariables?: { color?: VariableAlias } };
        const colorVarName = effectWithVars.boundVariables?.color
          ? getVariableNameFromAlias(effectWithVars.boundVariables.color)
          : null;

        if (colorVarName) {
          properties.push({ name: 'Inner shadow', value: colorVarName });
        } else {
          const hex = rgbToHex(shadow.color.r, shadow.color.g, shadow.color.b);
          const alpha = Math.round(shadow.color.a * 100);
          properties.push({
            name: 'Inner shadow',
            value: `${shadow.offset.x}px ${shadow.offset.y}px ${shadow.radius}px ${hex} (${alpha}%)`
          });
        }
      } else if (effect.type === 'LAYER_BLUR') {
        const blur = effect as BlurEffect;
        const effectWithVars = blur as BlurEffect & { boundVariables?: { radius?: VariableAlias } };
        const radiusVarName = effectWithVars.boundVariables?.radius
          ? getVariableNameFromAlias(effectWithVars.boundVariables.radius)
          : null;

        if (radiusVarName) {
          properties.push({ name: 'Layer blur', value: radiusVarName });
        } else {
          properties.push({ name: 'Layer blur', value: `${blur.radius}px` });
        }
      } else if (effect.type === 'BACKGROUND_BLUR') {
        const blur = effect as BlurEffect;
        const effectWithVars = blur as BlurEffect & { boundVariables?: { radius?: VariableAlias } };
        const radiusVarName = effectWithVars.boundVariables?.radius
          ? getVariableNameFromAlias(effectWithVars.boundVariables.radius)
          : null;

        if (radiusVarName) {
          properties.push({ name: 'Background blur', value: radiusVarName });
        } else {
          properties.push({ name: 'Background blur', value: `${blur.radius}px` });
        }
      }
    });
  }

  // Extract opacity
  if ('opacity' in visualNode && typeof visualNode.opacity === 'number' && visualNode.opacity < 1) {
    const varName = visualNode.boundVariables?.opacity
      ? getVariableNameFromAlias(visualNode.boundVariables.opacity)
      : null;

    if (varName) {
      properties.push({ name: 'Opacity', value: varName });
    } else {
      properties.push({ name: 'Opacity', value: `${Math.round(visualNode.opacity * 100)}%` });
    }
  }

  return properties;
}

// Convert variant name from "State=Hover" format to "State: Hover" format
function formatVariantHeading(variantName: string): string {
  // Variant names are typically "Property=Value" or "Prop1=Val1, Prop2=Val2"
  // Convert to "Property: Value" format
  return variantName.replace(/=/g, ': ');
}

function createVariantVisualRow(variant: ComponentNode): FrameNode {
  const row = createAutoLayoutFrame(`Variant: ${variant.name}`, "HORIZONTAL", 24, 24);
  row.fills = [{ type: "SOLID", color: COLORS.background }];
  row.cornerRadius = 12;
  row.strokes = [{ type: "SOLID", color: COLORS.border }];
  row.strokeWeight = 1;

  // Left side: Instance only (no label)
  const leftSide = createAutoLayoutFrame("Variant Display", "VERTICAL", 0, 12);
  leftSide.counterAxisAlignItems = "CENTER";

  // Create an instance of the variant at its original size
  const instance = variant.createInstance();
  instance.name = `${variant.name} Preview`;
  // Keep original dimensions
  leftSide.appendChild(instance);

  row.appendChild(leftSide);

  // Right side: Visual properties list
  const rightSide = createAutoLayoutFrame("Properties List", "VERTICAL", 0, 8);

  // Use variant name as heading in "Property_name: variant_name" format
  const propsHeading = createItemTitleText(formatVariantHeading(variant.name));
  rightSide.appendChild(propsHeading);

  const visualProps = extractVisualProperties(variant);

  if (visualProps.length === 0) {
    const noProps = createBodyText("No visual properties defined", true);
    rightSide.appendChild(noProps);
  } else {
    for (const prop of visualProps) {
      const propRow = createAutoLayoutFrame("Property Row", "HORIZONTAL", 0, 8);

      const propName = createLabelText(`${prop.name}:`);
      propRow.appendChild(propName);

      const propValue = createValueText(prop.value);
      propRow.appendChild(propValue);

      rightSide.appendChild(propRow);
    }
  }

  row.appendChild(rightSide);

  return row;
}

function mapPropertyType(type: ComponentPropertyType): string {
  switch (type) {
    case "BOOLEAN":
      return "Boolean";
    case "TEXT":
      return "Text";
    case "INSTANCE_SWAP":
      return "Instance swap";
    case "VARIANT":
      return "Variant";
    default:
      return String(type);
  }
}

// Clean up property name by removing Figma's internal ID suffix (e.g., "Show Icon#1234:5678" -> "Show Icon")
function cleanPropertyName(name: string): string {
  // Remove everything from # onwards (handles #1234, #1234:5678, etc.)
  const hashIndex = name.indexOf('#');
  if (hashIndex !== -1) {
    return name.substring(0, hashIndex).trim();
  }
  return name.trim();
}

// Find the node in a component that references a specific property
function findNodeForProperty(
  component: ComponentNode,
  propertyName: string
): SceneNode | null {
  function searchNode(node: SceneNode): SceneNode | null {
    // Check if this node has componentPropertyReferences
    if ('componentPropertyReferences' in node) {
      const refs = (node as any).componentPropertyReferences;
      if (refs) {
        // Check all possible reference types
        for (const refType of ['visible', 'characters', 'mainComponent']) {
          if (refs[refType] === propertyName) {
            return node;
          }
        }
      }
    }

    // Search children
    if ('children' in node) {
      for (const child of (node as ChildrenMixin).children) {
        const found = searchNode(child as SceneNode);
        if (found) return found;
      }
    }

    return null;
  }

  return searchNode(component);
}

// Get the default variant from a component set
function getDefaultVariant(componentSet: ComponentSetNode): ComponentNode | null {
  const variants = componentSet.children.filter(
    (child): child is ComponentNode => child.type === "COMPONENT"
  );

  if (variants.length === 0) return null;

  // Try to find a variant with "Default" in the name, otherwise use first
  const defaultVariant = variants.find(v =>
    v.name.toLowerCase().includes('default')
  );

  return defaultVariant || variants[0];
}

// Create a visual row for a non-variant property
function createPropertyVisualRow(
  propertyName: string,
  propertyDef: ComponentPropertyDefinitions[string],
  defaultVariant: ComponentNode
): FrameNode {
  const row = createAutoLayoutFrame(`Property: ${propertyName}`, "HORIZONTAL", 24, 24);
  row.fills = [{ type: "SOLID", color: COLORS.background }];
  row.cornerRadius = 12;
  row.strokes = [{ type: "SOLID", color: COLORS.border }];
  row.strokeWeight = 1;

  // Left side: Instance with blue bounding box overlay
  const leftSide = createAutoLayoutFrame("Property Visual", "VERTICAL", 0, 8);

  // Create a container frame for the instance and overlay
  const visualContainer = figma.createFrame();
  visualContainer.name = "Visual Container";
  visualContainer.fills = [];

  // Create an instance of the default variant
  const instance = defaultVariant.createInstance();
  instance.name = `${propertyName} Preview`;

  // Find the node that this property is associated with
  const associatedNodeInComponent = findNodeForProperty(defaultVariant, propertyName);

  // Check if the associated element is hidden and make it visible
  if (associatedNodeInComponent) {
    // If this property itself is a boolean visibility property with default false, set it to true
    if (propertyDef.type === "BOOLEAN" && propertyDef.defaultValue === false) {
      try {
        instance.setProperties({ [propertyName]: true });
      } catch (e) {
        console.log(`Could not set property ${propertyName} to true:`, e);
      }
    }

    // Check if the associated node has a visibility property that's hiding it
    if ('componentPropertyReferences' in associatedNodeInComponent) {
      const refs = (associatedNodeInComponent as any).componentPropertyReferences;
      if (refs && refs.visible) {
        // There's a boolean property controlling visibility - set it to true
        try {
          instance.setProperties({ [refs.visible]: true });
        } catch (e) {
          console.log(`Could not set visibility property ${refs.visible} to true:`, e);
        }
      }
    }
  }

  visualContainer.appendChild(instance);

  // Size the container to match the instance
  visualContainer.resize(instance.width, instance.height);

  // Find the corresponding node in the instance by name/path
  let associatedNode: SceneNode | null = null;
  if (associatedNodeInComponent) {
    // Search for the same node in the instance
    function findNodeInInstance(node: SceneNode, targetName: string): SceneNode | null {
      if (node.name === targetName) return node;
      if ('children' in node) {
        for (const child of (node as ChildrenMixin).children) {
          const found = findNodeInInstance(child as SceneNode, targetName);
          if (found) return found;
        }
      }
      return null;
    }
    associatedNode = findNodeInInstance(instance, associatedNodeInComponent.name);
  }

  if (associatedNode && associatedNode.absoluteBoundingBox) {
    // Calculate the relative position of the associated node within the instance
    const instanceBounds = instance.absoluteBoundingBox;
    const nodeBounds = associatedNode.absoluteBoundingBox;

    if (instanceBounds && nodeBounds) {
      const relativeX = nodeBounds.x - instanceBounds.x;
      const relativeY = nodeBounds.y - instanceBounds.y;

      // Create blue bounding box overlay
      const overlay = figma.createRectangle();
      overlay.name = "Property Highlight";
      overlay.x = relativeX;
      overlay.y = relativeY;
      overlay.resize(nodeBounds.width, nodeBounds.height);
      overlay.fills = [{ type: "SOLID", color: { r: 0.051, g: 0.412, b: 0.831 }, opacity: 0.1 }]; // #0D69D4 with 10% opacity
      overlay.strokes = [{ type: "SOLID", color: { r: 0.051, g: 0.412, b: 0.831 } }]; // #0D69D4
      overlay.strokeWeight = 1;
      overlay.cornerRadius = 0;

      visualContainer.appendChild(overlay);
    }
  }

  leftSide.appendChild(visualContainer);
  row.appendChild(leftSide);

  // Right side: Property information
  const rightSide = createAutoLayoutFrame("Property Info", "VERTICAL", 0, 12);

  // Property name as heading (cleaned up without Figma's internal ID)
  const displayName = cleanPropertyName(propertyName);
  const propHeading = createItemTitleText(displayName);
  rightSide.appendChild(propHeading);

  // Property details
  const detailsContainer = createAutoLayoutFrame("Details", "VERTICAL", 0, 8);

  // Type
  const typeRow = createAutoLayoutFrame("Type Row", "HORIZONTAL", 0, 8);
  const typeLabel = createLabelText("Type:");
  const typeValue = createValueText(mapPropertyType(propertyDef.type));
  typeRow.appendChild(typeLabel);
  typeRow.appendChild(typeValue);
  detailsContainer.appendChild(typeRow);

  // Allowed/preferred values
  let allowedValues = "";
  let defaultValue = "";

  switch (propertyDef.type) {
    case "BOOLEAN":
      allowedValues = "true, false";
      defaultValue = String(propertyDef.defaultValue);
      break;
    case "TEXT":
      allowedValues = "Any text";
      defaultValue = (propertyDef.defaultValue as string) || "(empty)";
      break;
    case "INSTANCE_SWAP":
      if (propertyDef.preferredValues && propertyDef.preferredValues.length > 0) {
        const valueNames = propertyDef.preferredValues
          .map((pv: InstanceSwapPreferredValue) => {
            if (pv.type === "COMPONENT" || pv.type === "COMPONENT_SET") {
              const node = figma.getNodeById(pv.key);
              return node ? node.name : pv.key;
            }
            return pv.key;
          })
          .filter(Boolean);
        allowedValues = valueNames.join(", ") || "Any instance";
      } else {
        allowedValues = "Any instance";
      }
      defaultValue = propertyDef.defaultValue ? "Set" : "None";
      break;
  }

  const allowedRow = createAutoLayoutFrame("Allowed Row", "HORIZONTAL", 0, 8);
  const allowedLabel = createLabelText("Allowed values:");
  const allowedValue = createValueText(allowedValues);
  allowedRow.appendChild(allowedLabel);
  allowedRow.appendChild(allowedValue);
  detailsContainer.appendChild(allowedRow);

  // Default value
  const defaultRow = createAutoLayoutFrame("Default Row", "HORIZONTAL", 0, 8);
  const defaultLabel = createLabelText("Default:");
  const defaultValueText = createValueText(defaultValue);
  defaultRow.appendChild(defaultLabel);
  defaultRow.appendChild(defaultValueText);
  detailsContainer.appendChild(defaultRow);

  // Description placeholder
  const descRow = createAutoLayoutFrame("Description Row", "VERTICAL", 0, 4);
  const descLabel = createLabelText("Description:");
  const descValue = createBodyText("Describe what this property controls...", true);
  descRow.appendChild(descLabel);
  descRow.appendChild(descValue);
  detailsContainer.appendChild(descRow);

  rightSide.appendChild(detailsContainer);

  row.appendChild(rightSide);

  return row;
}

// Extract non-variant property definitions (not converted to PropertyInfo)
function getNonVariantProperties(
  definitions: ComponentPropertyDefinitions
): Array<{ name: string; def: ComponentPropertyDefinitions[string] }> {
  const properties: Array<{ name: string; def: ComponentPropertyDefinitions[string] }> = [];

  for (const [key, def] of Object.entries(definitions)) {
    if (def.type !== "VARIANT") {
      properties.push({ name: key, def });
    }
  }

  return properties;
}

function createTableCell(
  content: string,
  isHeader: boolean,
  width: number
): FrameNode {
  const cell = createAutoLayoutFrame("Cell", "VERTICAL", TABLE_CELL_PADDING, 0);
  cell.resize(width, cell.height);
  // These are OK because cell is an auto-layout frame itself
  cell.layoutSizingHorizontal = "FIXED";
  cell.layoutSizingVertical = "HUG";

  if (isHeader) {
    cell.fills = [{ type: "SOLID", color: COLORS.headerBg }];
  } else {
    cell.fills = [{ type: "SOLID", color: COLORS.background }];
  }

  // Add border
  cell.strokes = [{ type: "SOLID", color: COLORS.border }];
  cell.strokeWeight = 1;

  const text = isHeader
    ? createBoldBodyText(content)
    : createBodyText(content, content.includes("Explain"));
  text.textAutoResize = "HEIGHT";
  cell.appendChild(text);
  // Must set after appending to auto-layout parent
  text.layoutSizingHorizontal = "FILL";

  return cell;
}

function createTableRow(
  cells: string[],
  isHeader: boolean,
  columnWidths: number[]
): FrameNode {
  const row = createAutoLayoutFrame("Row", "HORIZONTAL", 0, 0);
  row.layoutSizingHorizontal = "HUG";

  for (let i = 0; i < cells.length; i++) {
    const cell = createTableCell(cells[i], isHeader, columnWidths[i]);
    row.appendChild(cell);
  }

  return row;
}

function createSection2FormalDefinition(
  componentOrSet: ComponentNode | ComponentSetNode
): FrameNode {
  const section = createSectionFrame("Component definition");

  // Heading
  const heading = createHeadingText("Component definition");
  section.appendChild(heading);

  // Get component properties
  let allDefinitions: ComponentPropertyDefinitions = {};

  if (componentOrSet.type === "COMPONENT_SET") {
    // For component sets, get properties from the set level
    allDefinitions = componentOrSet.componentPropertyDefinitions || {};

    // Variants subsection with header and container
    const variantsSection = createAutoLayoutFrame("Variants", "VERTICAL", 0, 16);

    const variantsHeading = createSubheadingText("Variants");
    variantsSection.appendChild(variantsHeading);

    const variants = componentOrSet.children.filter(
      (child): child is ComponentNode => child.type === "COMPONENT"
    );

    if (variants.length > 0) {
      const variantsContainer = createAutoLayoutFrame("Variants Container", "VERTICAL", 0, 16);

      for (const variant of variants) {
        const variantRow = createVariantVisualRow(variant);
        variantsContainer.appendChild(variantRow);
      }

      variantsSection.appendChild(variantsContainer);
    } else {
      const noVariants = createBodyText("No variants found in this component set", true);
      variantsSection.appendChild(noVariants);
    }

    section.appendChild(variantsSection);
  } else {
    // For single components, show a single visual display
    allDefinitions = componentOrSet.componentPropertyDefinitions || {};

    const componentSection = createAutoLayoutFrame("Component", "VERTICAL", 0, 16);
    const componentHeading = createSubheadingText("Component");
    componentSection.appendChild(componentHeading);

    const visualRow = createVariantVisualRow(componentOrSet);
    componentSection.appendChild(visualRow);

    section.appendChild(componentSection);
  }

  // Extract non-variant properties
  const nonVariantProps = getNonVariantProperties(allDefinitions);

  // Only show if there are non-variant properties
  if (nonVariantProps.length > 0) {
    // Other Properties subsection with header and container
    const otherPropsSection = createAutoLayoutFrame("Other Properties", "VERTICAL", 0, 16);

    const otherPropsHeading = createSubheadingText("Other properties");
    otherPropsSection.appendChild(otherPropsHeading);

    // Get the default variant to use for visual display
    let defaultVariant: ComponentNode | null = null;

    if (componentOrSet.type === "COMPONENT_SET") {
      defaultVariant = getDefaultVariant(componentOrSet);
    } else {
      defaultVariant = componentOrSet;
    }

    if (defaultVariant) {
      const propsContainer = createAutoLayoutFrame("Properties Container", "VERTICAL", 0, 16);

      for (const { name, def } of nonVariantProps) {
        const propRow = createPropertyVisualRow(name, def, defaultVariant);
        propsContainer.appendChild(propRow);
      }

      otherPropsSection.appendChild(propsContainer);
    }

    section.appendChild(otherPropsSection);
  }

  return section;
}

// =============================================================================
// Section 3: Dos / Don'ts
// =============================================================================

function createScreenshotPlaceholder(): FrameNode {
  const frame = createAutoLayoutFrame("Screenshot Placeholder", "VERTICAL", 16, 8);
  frame.resize(300, 150);
  // layoutSizingHorizontal will be set after appending to parent
  frame.layoutSizingVertical = "FIXED";
  frame.fills = [{ type: "SOLID", color: COLORS.background }]; // #FFFFFF
  frame.cornerRadius = 4;

  const label = createMediumText("Drop screenshot here");
  label.textAlignHorizontal = "CENTER";
  frame.appendChild(label);

  // Center the content
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";

  return frame;
}

function createDoOrDontCell(type: "DO" | "DON'T"): FrameNode {
  const cell = createAutoLayoutFrame(`${type} Cell`, "VERTICAL", 24, 12);
  // layoutSizingHorizontal will be set after appending to parent
  cell.fills = [
    {
      type: "SOLID",
      color: type === "DO" ? COLORS.doColor : COLORS.dontColor,
    },
  ];
  cell.cornerRadius = 12;

  // Label - 20px Bold with color
  const label = createTextNode(
    type,
    FONTS.heading,
    20,
    type === "DO" ? COLORS.doText : COLORS.dontText
  );
  cell.appendChild(label);

  // Title placeholder - 16px Bold
  const title = createTextNode(
    `${type === "DO" ? "Do" : "Don't"}: Short title`,
    FONTS.heading,
    16,
    COLORS.text
  );
  cell.appendChild(title);
  title.layoutSizingHorizontal = "FILL";

  // Description placeholder
  const description = createBodyText(
    "Describe why this is a good/bad practice...",
    true
  );
  cell.appendChild(description);
  description.layoutSizingHorizontal = "FILL";

  // Screenshot placeholder
  const screenshot = createScreenshotPlaceholder();
  cell.appendChild(screenshot);
  screenshot.layoutSizingHorizontal = "FILL";

  return cell;
}

function createDoDontRow(index: number): FrameNode {
  const row = createAutoLayoutFrame(`Do/Don't Row ${index + 1}`, "HORIZONTAL", 0, 16);
  // layoutSizingHorizontal will be set after appending to parent

  const doCell = createDoOrDontCell("DO");
  const dontCell = createDoOrDontCell("DON'T");

  row.appendChild(doCell);
  doCell.layoutSizingHorizontal = "FILL";
  row.appendChild(dontCell);
  dontCell.layoutSizingHorizontal = "FILL";

  return row;
}

function createSection3DosDonts(): FrameNode {
  const section = createSectionFrame("Dos / Don'ts");

  // Header container with heading and description
  const headerContainer = createAutoLayoutFrame("Header", "VERTICAL", 0, 16);

  // Heading
  const heading = createHeadingText("Dos / Don'ts");
  headerContainer.appendChild(heading);

  // Instructions
  const instructions = createBodyText(
    "Fill in examples of correct and incorrect usage patterns for this component.",
    true
  );
  headerContainer.appendChild(instructions);
  instructions.layoutSizingHorizontal = "FILL";

  section.appendChild(headerContainer);
  headerContainer.layoutSizingHorizontal = "FILL";

  // Create DO/DON'T rows
  for (let i = 0; i < DEFAULT_DO_DONT_ROWS; i++) {
    const row = createDoDontRow(i);
    section.appendChild(row);
    row.layoutSizingHorizontal = "FILL";
  }

  return section;
}

// =============================================================================
// Main Documentation Frame
// =============================================================================

// Create component container section with placeholder
function createComponentContainer(): FrameNode {
  const container = createAutoLayoutFrame("Component container", "VERTICAL", FRAME_PADDING, 0);
  container.cornerRadius = 12;
  container.primaryAxisAlignItems = "CENTER";
  container.counterAxisAlignItems = "CENTER";

  // Component placeholder
  const placeholder = createAutoLayoutFrame("Component Placeholder", "VERTICAL", 16, 0);
  placeholder.fills = [{ type: "SOLID", color: COLORS.background }];
  placeholder.strokes = [{ type: "SOLID", color: COLORS.border }];
  placeholder.strokeWeight = 1;
  placeholder.dashPattern = [4, 4]; // Dashed border
  placeholder.cornerRadius = 4;
  placeholder.resize(500, 150);
  placeholder.layoutSizingVertical = "FIXED";
  placeholder.primaryAxisAlignItems = "CENTER";
  placeholder.counterAxisAlignItems = "CENTER";

  const placeholderText = createMediumText("Drop component here");
  placeholderText.textAlignHorizontal = "CENTER";
  placeholder.appendChild(placeholderText);

  // Append placeholder to container FIRST, then set FILL sizing
  container.appendChild(placeholder);
  placeholder.layoutSizingHorizontal = "FILL";

  return container;
}

function createDocumentationFrame(
  component: ComponentNode | ComponentSetNode
): FrameNode {
  const docFrame = createAutoLayoutFrame(
    `Documentation: ${component.name}`,
    "VERTICAL",
    FRAME_PADDING,
    SECTION_SPACING
  );

  docFrame.layoutSizingHorizontal = "HUG";
  docFrame.layoutSizingVertical = "HUG";
  docFrame.fills = [{ type: "SOLID", color: COLORS.background }];
  docFrame.cornerRadius = 32;
  docFrame.strokes = [{ type: "SOLID", color: COLORS.border }];
  docFrame.strokeWeight = 1;

  // Title - 40px Bold
  const title = createTitleText(`${component.name} - Documentation`);
  docFrame.appendChild(title);

  // Component container section with placeholder
  const componentContainer = createComponentContainer();
  docFrame.appendChild(componentContainer);
  componentContainer.layoutSizingHorizontal = "FILL";

  // Section 1: Description + behaviour
  const section1 = createSection1Description(component);
  docFrame.appendChild(section1);
  section1.layoutSizingHorizontal = "FILL";

  // Section 2: Component definition
  const section2 = createSection2FormalDefinition(component);
  docFrame.appendChild(section2);

  // Section 3: Dos / Don'ts
  const section3 = createSection3DosDonts();
  docFrame.appendChild(section3);
  section3.layoutSizingHorizontal = "FILL";

  return docFrame;
}

// =============================================================================
// Main Plugin Entry Point
// =============================================================================

async function main(): Promise<void> {
  // Validate selection
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.notify("⚠️ Please select a component or component set", {
      error: true,
    });
    figma.closePlugin();
    return;
  }

  if (selection.length > 1) {
    figma.notify("⚠️ Please select only one component or component set", {
      error: true,
    });
    figma.closePlugin();
    return;
  }

  const selected = selection[0];

  if (selected.type !== "COMPONENT" && selected.type !== "COMPONENT_SET") {
    figma.notify(
      "⚠️ Selection must be a Component or Component Set. Selected: " +
        selected.type,
      { error: true }
    );
    figma.closePlugin();
    return;
  }

  // Load fonts
  const fontsLoaded = await loadRequiredFonts();
  if (!fontsLoaded) {
    figma.notify(
      "⚠️ Failed to load fonts. Please ensure Manrope, Inter, or Roboto is available.",
      { error: true }
    );
    figma.closePlugin();
    return;
  }

  // Create documentation frame
  const component = selected as ComponentNode | ComponentSetNode;

  try {
    console.log("Creating documentation frame...");
    const docFrame = createDocumentationFrame(component);
    console.log("Documentation frame created");

    // Position the documentation frame
    // Place it to the right of the selected component
    const componentBounds = component.absoluteBoundingBox;
    if (componentBounds) {
      docFrame.x = componentBounds.x + componentBounds.width + 100;
      docFrame.y = componentBounds.y;
    } else {
      // Fallback position
      docFrame.x = component.x + component.width + 100;
      docFrame.y = component.y;
    }

    // Add to page
    figma.currentPage.appendChild(docFrame);

    // Select and zoom to the new frame
    figma.currentPage.selection = [docFrame];
    figma.viewport.scrollAndZoomIntoView([docFrame]);

    // Notify success
    figma.notify(`Documentation created for "${component.name}"`, {
      timeout: 3000,
    });
  } catch (error) {
    console.error("Error creating documentation:", error);
    figma.notify(`Error: ${error}`, { error: true });
  }

  figma.closePlugin();
}

// Run the plugin
main().catch((error) => {
  console.error("Plugin error:", error);
  figma.notify(`Plugin error: ${error}`, { error: true });
  figma.closePlugin();
});
