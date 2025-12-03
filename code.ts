// =============================================================================
// Configuration Constants
// =============================================================================

const DEFAULT_DO_DONT_ROWS = 3;

const FRAME_WIDTH = 960;
const SECTION_PADDING = 32;
const ITEM_SPACING = 16;
const TABLE_CELL_PADDING = 12;

// Colors
const COLORS = {
  background: { r: 1, g: 1, b: 1 },           // White
  sectionBg: { r: 0.98, g: 0.98, b: 0.98 },   // Light gray
  headerBg: { r: 0.9, g: 0.9, b: 0.9 },       // Gray for table header
  doColor: { r: 0.929, g: 0.973, b: 0.941 },  // #EDF8F0
  dontColor: { r: 0.980, g: 0.937, b: 0.937 }, // #FAEFEF
  border: { r: 0.8, g: 0.8, b: 0.8 },         // Border gray
  text: { r: 0.1, g: 0.1, b: 0.1 },           // Dark text
  placeholder: { r: 0.5, g: 0.5, b: 0.5 },    // Gray placeholder text
};

// Font settings - using Roboto which is reliably available in Figma
let FONTS = {
  heading: { family: "Roboto", style: "Bold" } as FontName,
  subheading: { family: "Roboto", style: "Medium" } as FontName,
  body: { family: "Roboto", style: "Regular" } as FontName,
  bold: { family: "Roboto", style: "Bold" } as FontName,
};

// =============================================================================
// Font Loading
// =============================================================================

async function loadRequiredFonts(): Promise<boolean> {
  // Try Roboto first (commonly available)
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Roboto", style: "Bold" }),
      figma.loadFontAsync({ family: "Roboto", style: "Medium" }),
      figma.loadFontAsync({ family: "Roboto", style: "Regular" }),
    ]);
    FONTS = {
      heading: { family: "Roboto", style: "Bold" },
      subheading: { family: "Roboto", style: "Medium" },
      body: { family: "Roboto", style: "Regular" },
      bold: { family: "Roboto", style: "Bold" },
    };
    return true;
  } catch (e) {
    console.log("Roboto not available, trying Inter...");
  }

  // Try Inter as fallback
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
    ]);
    FONTS = {
      heading: { family: "Inter", style: "Bold" },
      subheading: { family: "Inter", style: "Semi Bold" },
      body: { family: "Inter", style: "Regular" },
      bold: { family: "Inter", style: "Bold" },
    };
    return true;
  } catch (e) {
    console.log("Inter not available, trying Arial...");
  }

  // Final fallback to Arial (should always be available)
  try {
    await Promise.all([
      figma.loadFontAsync({ family: "Arial", style: "Bold" }),
      figma.loadFontAsync({ family: "Arial", style: "Regular" }),
    ]);
    FONTS = {
      heading: { family: "Arial", style: "Bold" },
      subheading: { family: "Arial", style: "Bold" },
      body: { family: "Arial", style: "Regular" },
      bold: { family: "Arial", style: "Bold" },
    };
    return true;
  } catch (e) {
    console.log("Arial not available either");
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

function createHeadingText(content: string): TextNode {
  return createTextNode(content, FONTS.heading, 24);
}

function createSubheadingText(content: string): TextNode {
  return createTextNode(content, FONTS.subheading, 18);
}

function createBodyText(content: string, isPlaceholder = false): TextNode {
  return createTextNode(
    content,
    FONTS.body,
    14,
    isPlaceholder ? COLORS.placeholder : COLORS.text
  );
}

function createBoldBodyText(content: string): TextNode {
  return createTextNode(content, FONTS.bold, 14);
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
  const frame = createAutoLayoutFrame(name, "VERTICAL", SECTION_PADDING, ITEM_SPACING);
  frame.fills = [{ type: "SOLID", color: COLORS.sectionBg }];
  frame.cornerRadius = 8;
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
  const descLabel = createBoldBodyText("Description:");
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

  // Separator
  const separator = figma.createRectangle();
  separator.name = "Separator";
  separator.resize(100, 1);
  separator.fills = [{ type: "SOLID", color: COLORS.border }];
  section.appendChild(separator);
  separator.layoutSizingHorizontal = "FILL";

  // Bullet prompts
  const promptsFrame = createAutoLayoutFrame("Prompts", "VERTICAL", 0, 16);

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
  const row = createAutoLayoutFrame(`Variant: ${variant.name}`, "HORIZONTAL", 16, 24);
  row.fills = [{ type: "SOLID", color: COLORS.background }];
  row.cornerRadius = 8;
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
  const propsHeading = createSubheadingText(formatVariantHeading(variant.name));
  rightSide.appendChild(propsHeading);

  const visualProps = extractVisualProperties(variant);

  if (visualProps.length === 0) {
    const noProps = createBodyText("No visual properties defined", true);
    rightSide.appendChild(noProps);
  } else {
    for (const prop of visualProps) {
      const propRow = createAutoLayoutFrame("Property Row", "HORIZONTAL", 0, 8);

      const propName = createBoldBodyText(`${prop.name}:`);
      propRow.appendChild(propName);

      const propValue = createBodyText(prop.value);
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
  const row = createAutoLayoutFrame(`Property: ${propertyName}`, "HORIZONTAL", 16, 24);
  row.fills = [{ type: "SOLID", color: COLORS.background }];
  row.cornerRadius = 8;
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
  const propHeading = createSubheadingText(displayName);
  rightSide.appendChild(propHeading);

  // Property details
  const detailsContainer = createAutoLayoutFrame("Details", "VERTICAL", 0, 8);

  // Type
  const typeRow = createAutoLayoutFrame("Type Row", "HORIZONTAL", 0, 8);
  const typeLabel = createBoldBodyText("Type:");
  const typeValue = createBodyText(mapPropertyType(propertyDef.type));
  typeRow.appendChild(typeLabel);
  typeRow.appendChild(typeValue);
  detailsContainer.appendChild(typeRow);

  // Allowed/preferred values
  let allowedValues = "";
  let defaultValue = "";

  switch (propertyDef.type) {
    case "BOOLEAN":
      allowedValues = "true | false";
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
  const allowedLabel = createBoldBodyText("Allowed values:");
  const allowedValue = createBodyText(allowedValues);
  allowedRow.appendChild(allowedLabel);
  allowedRow.appendChild(allowedValue);
  detailsContainer.appendChild(allowedRow);

  // Default value
  const defaultRow = createAutoLayoutFrame("Default Row", "HORIZONTAL", 0, 8);
  const defaultLabel = createBoldBodyText("Default:");
  const defaultValueText = createBodyText(defaultValue);
  defaultRow.appendChild(defaultLabel);
  defaultRow.appendChild(defaultValueText);
  detailsContainer.appendChild(defaultRow);

  // Description placeholder
  const descRow = createAutoLayoutFrame("Description Row", "VERTICAL", 0, 4);
  const descLabel = createBoldBodyText("Description:");
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

    // Display variants visually first
    const variantsHeading = createSubheadingText("Variants");
    section.appendChild(variantsHeading);

    const variants = componentOrSet.children.filter(
      (child): child is ComponentNode => child.type === "COMPONENT"
    );

    if (variants.length > 0) {
      const variantsContainer = createAutoLayoutFrame("Variants Container", "VERTICAL", 0, 16);

      for (const variant of variants) {
        const variantRow = createVariantVisualRow(variant);
        variantsContainer.appendChild(variantRow);
      }

      section.appendChild(variantsContainer);
      // variantsContainer stays HUG (default)
    } else {
      const noVariants = createBodyText("No variants found in this component set", true);
      section.appendChild(noVariants);
    }
  } else {
    // For single components, show a single visual display
    allDefinitions = componentOrSet.componentPropertyDefinitions || {};

    const componentHeading = createSubheadingText("Component");
    section.appendChild(componentHeading);

    const visualRow = createVariantVisualRow(componentOrSet);
    section.appendChild(visualRow);
    // visualRow stays HUG (default)
  }

  // Extract non-variant properties
  const nonVariantProps = getNonVariantProperties(allDefinitions);

  // Only show if there are non-variant properties
  if (nonVariantProps.length > 0) {
    // Separator
    const separator = figma.createRectangle();
    separator.name = "Separator";
    separator.resize(100, 1);
    separator.fills = [{ type: "SOLID", color: COLORS.border }];
    section.appendChild(separator);

    // Other properties heading
    const otherPropsHeading = createSubheadingText("Other Properties");
    section.appendChild(otherPropsHeading);

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

      section.appendChild(propsContainer);
      // propsContainer stays HUG (default)
    }
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

  const label = createBodyText("Drop screenshot here", true);
  label.textAlignHorizontal = "CENTER";
  frame.appendChild(label);

  // Center the content
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";

  return frame;
}

function createDoOrDontCell(type: "DO" | "DON'T"): FrameNode {
  const cell = createAutoLayoutFrame(`${type} Cell`, "VERTICAL", 16, 12);
  // layoutSizingHorizontal will be set after appending to parent
  cell.fills = [
    {
      type: "SOLID",
      color: type === "DO" ? COLORS.doColor : COLORS.dontColor,
    },
  ];
  cell.cornerRadius = 8;

  // Label
  const label = createSubheadingText(type);
  label.fills = [
    {
      type: "SOLID",
      color:
        type === "DO"
          ? { r: 0.2, g: 0.6, b: 0.2 }
          : { r: 0.7, g: 0.2, b: 0.2 },
    },
  ];
  cell.appendChild(label);

  // Title placeholder
  const title = createBoldBodyText(`${type === "DO" ? "Do" : "Don't"}: Short title`);
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

  // Heading
  const heading = createHeadingText("Dos / Don'ts");
  section.appendChild(heading);

  // Instructions
  const instructions = createBodyText(
    "Fill in examples of correct and incorrect usage patterns for this component.",
    true
  );
  section.appendChild(instructions);
  instructions.layoutSizingHorizontal = "FILL";

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

function createDocumentationFrame(
  component: ComponentNode | ComponentSetNode
): FrameNode {
  const docFrame = createAutoLayoutFrame(
    `Documentation: ${component.name}`,
    "VERTICAL",
    SECTION_PADDING,
    SECTION_PADDING
  );

  docFrame.layoutSizingHorizontal = "HUG";
  docFrame.layoutSizingVertical = "HUG";
  docFrame.fills = [{ type: "SOLID", color: COLORS.background }];
  docFrame.cornerRadius = 12;

  // Add drop shadow
  docFrame.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 4 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  // Title
  const title = figma.createText();
  title.fontName = FONTS.heading;
  title.fontSize = 32;
  title.characters = `${component.name} - Documentation`;
  title.fills = [{ type: "SOLID", color: COLORS.text }];
  docFrame.appendChild(title);

  // Section 1: fill-container
  const section1 = createSection1Description(component);
  docFrame.appendChild(section1);
  section1.layoutSizingHorizontal = "FILL";

  // Section 2: hug-contents
  const section2 = createSection2FormalDefinition(component);
  docFrame.appendChild(section2);

  // Section 3: fill-container
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
      "⚠️ Failed to load fonts. Please ensure Roboto, Inter, or Arial is available.",
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
