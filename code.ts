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
  doColor: { r: 0.85, g: 0.95, b: 0.85 },     // Light green
  dontColor: { r: 0.95, g: 0.85, b: 0.85 },   // Light red
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
function createBulletPromptText(boldPart: string, regularPart: string): TextNode {
  const text = figma.createText();
  const fullText = `- ${boldPart} ${regularPart}`;

  // IMPORTANT: Must set font BEFORE setting characters
  text.fontName = FONTS.body;
  text.fontSize = 14;
  text.characters = fullText;
  text.fills = [{ type: "SOLID", color: COLORS.text }];

  // Make the bold part bold (including bullet)
  const boldEnd = 2 + boldPart.length; // "- " + boldPart
  text.setRangeFontName(0, boldEnd, FONTS.bold);

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
  const section = createSectionFrame("Section 1: Description + behaviour");

  // Heading
  const heading = createHeadingText("Section 1: Description + behaviour");
  section.appendChild(heading);

  // Component name display
  const componentNameFrame = createAutoLayoutFrame("Component Info", "VERTICAL", 0, 8);
  const nameLabel = createBoldBodyText("Component Name:");
  const nameValue = createBodyText(component.name);
  componentNameFrame.appendChild(nameLabel);
  componentNameFrame.appendChild(nameValue);
  section.appendChild(componentNameFrame);
  componentNameFrame.layoutSizingHorizontal = "FILL";

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
      bold: "How does it look and behave?",
      regular: "(structure + main interactions, in plain language)",
    },
    {
      bold: "Key behavior rules / constraints",
      regular: "(the opinionated rules you want enforced)",
    },
  ];

  for (const prompt of prompts) {
    const promptContainer = createAutoLayoutFrame("Prompt Item", "VERTICAL", 0, 4);

    const promptText = createBulletPromptText(prompt.bold, prompt.regular);
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

function mapPropertyType(type: ComponentPropertyType): string {
  switch (type) {
    case "BOOLEAN":
      return "Boolean property";
    case "TEXT":
      return "Text property";
    case "INSTANCE_SWAP":
      return "Instance property";
    case "VARIANT":
      return "Variant property";
    default:
      return String(type);
  }
}

function extractPropertyInfo(
  definitions: ComponentPropertyDefinitions
): PropertyInfo[] {
  const properties: PropertyInfo[] = [];

  for (const [key, def] of Object.entries(definitions)) {
    let allowedValues = "";
    let defaultValue = "";

    switch (def.type) {
      case "BOOLEAN":
        allowedValues = "true | false";
        defaultValue = String(def.defaultValue);
        break;
      case "TEXT":
        allowedValues = "Any text";
        defaultValue = def.defaultValue as string || "";
        break;
      case "INSTANCE_SWAP":
        // Try to get preferred values if available
        if (def.preferredValues && def.preferredValues.length > 0) {
          const valueNames = def.preferredValues
            .map((pv) => {
              if (pv.type === "COMPONENT") {
                const node = figma.getNodeById(pv.key);
                return node ? node.name : pv.key;
              } else if (pv.type === "COMPONENT_SET") {
                const node = figma.getNodeById(pv.key);
                return node ? node.name : pv.key;
              }
              return pv.key;
            })
            .filter(Boolean);
          allowedValues = valueNames.join(" | ") || "Any instance";
        } else {
          allowedValues = "Any instance";
        }
        defaultValue = def.defaultValue ? "Set" : "none";
        break;
      case "VARIANT":
        if (def.variantOptions && def.variantOptions.length > 0) {
          allowedValues = def.variantOptions.join(" | ");
        }
        defaultValue = def.defaultValue as string || "";
        break;
    }

    properties.push({
      name: key,
      type: mapPropertyType(def.type),
      allowedValues,
      defaultValue,
    });
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
  const section = createSectionFrame("Section 2: The formal component definition");

  // Heading
  const heading = createHeadingText("Section 2: The formal component definition");
  section.appendChild(heading);

  // Get component properties
  let allDefinitions: ComponentPropertyDefinitions = {};

  if (componentOrSet.type === "COMPONENT_SET") {
    // For component sets, get properties from the set level
    allDefinitions = componentOrSet.componentPropertyDefinitions || {};
  } else {
    // For single components, get properties directly
    allDefinitions = componentOrSet.componentPropertyDefinitions || {};
  }

  // Table column widths
  const columnWidths = [150, 120, 200, 100, 280]; // Total ~850px

  // Create table container
  const table = createAutoLayoutFrame("Properties Table", "VERTICAL", 0, 0);
  table.layoutSizingHorizontal = "HUG";

  // Header row
  const headerRow = createTableRow(
    ["Property name", "Type", "Allowed / preferred values", "Default", "Description / meaning"],
    true,
    columnWidths
  );
  table.appendChild(headerRow);

  // Extract and create property rows
  const properties = extractPropertyInfo(allDefinitions);

  if (properties.length === 0) {
    // Add a placeholder row if no properties found
    const placeholderRow = createTableRow(
      [
        "No properties",
        "—",
        "—",
        "—",
        "This component has no exposed properties",
      ],
      false,
      columnWidths
    );
    table.appendChild(placeholderRow);
  } else {
    for (const prop of properties) {
      const row = createTableRow(
        [
          prop.name,
          prop.type,
          prop.allowedValues,
          prop.defaultValue,
          "Explain what this prop does in the UI",
        ],
        false,
        columnWidths
      );
      table.appendChild(row);
    }
  }

  section.appendChild(table);

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
  frame.fills = [{ type: "SOLID", color: COLORS.border }];
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
  const section = createSectionFrame("Section 3: Dos / Don'ts");

  // Heading
  const heading = createHeadingText("Section 3: Dos / Don'ts");
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

  docFrame.resize(FRAME_WIDTH, docFrame.height);
  docFrame.layoutSizingHorizontal = "FIXED";
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
  title.layoutSizingHorizontal = "FILL";

  // Subtitle with component type
  const componentType =
    component.type === "COMPONENT_SET" ? "Component Set" : "Component";
  const subtitle = figma.createText();
  subtitle.fontName = FONTS.body;
  subtitle.fontSize = 14;
  subtitle.characters = `Type: ${componentType}`;
  subtitle.fills = [{ type: "SOLID", color: COLORS.placeholder }];
  docFrame.appendChild(subtitle);
  subtitle.layoutSizingHorizontal = "FILL";

  // Section 1
  const section1 = createSection1Description(component);
  docFrame.appendChild(section1);
  section1.layoutSizingHorizontal = "FILL";

  // Section 2
  const section2 = createSection2FormalDefinition(component);
  docFrame.appendChild(section2);
  section2.layoutSizingHorizontal = "FILL";

  // Section 3
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
