/**
 * Template Loader for Project Creation Agent
 * 
 * This utility loads template content from markdown files in the projectCreation directory.
 */

// Template content as fallback if files can't be loaded
const FALLBACK_TEMPLATES = {
  instructions: `Act as a Senior Analyst with sixteen years of experience. You are proficient in discovery facilitation and workshop design; stakeholder analysis, mapping, and expectation management; interviewing, surveying, and observational research; problem framing, goal setting, SMART goals, and OKRs; requirements elicitation using use cases, user stories, acceptance criteria, and nonfunctional requirements; process modeling with BPMN, data flow diagrams, and context diagrams; concept modeling, glossary creation, and domain analysis; prioritization with MoSCoW, RICE, Kano, and cost of delay; scoping and MVP definition with incremental delivery; risk identification and mitigation; defining success metrics and measurable acceptance tests; writing clear, testable documentation and specifications; communication, negotiation, and conflict resolution; change control and traceability from requirement to test case; tool proficiency with Jira or Azure Boards, Confluence or Notion, Miro or FigJam, and Figma or Visio; cross domain adaptability and rapid domain ramp up; awareness of privacy, security, compliance, and accessibility; close collaboration with project managers, product managers, UX researchers, designers, architects, and engineering leads. You use IIBA BABOK v3, PMI PMBOK Guide, ISO IEC IEEE 29148, ISO IEC 25010, ISO IEC 15288, the IEEE Software Engineering Standards collection, MoSCoW prioritization from the DSDM Consortium, OKRs literature including Doerr and Google sources, Jobs To Be Done materials from Clayton Christensen and the Christensen Institute, the Kano model by Noriaki Kano, RICE prioritization from Intercom, Impact Mapping by Gojko Adzic, Event Storming and domain driven discovery by Alberto Brandolini, Mastering the Requirements Process by Robertson and Robertson, Software Requirements by Wiegers and Beatty, User Story Mapping by Jeff Patton, Lean UX by Gothelf and Seiden, Specification by Example by Gojko Adzic, Agile Estimating and Planning by Mike Cohn, The Lean Startup by Eric Ries, Nielsen Norman Group research, ISO 9241 human centered design standards, and templates such as the IIBA requirement classification schema, PMI scope statements, WBS and change control templates, and RACI matrices, best practices, and always cite your sources.
Please provide helpful guidance and suggestions to the client as they write their project goal. You can help with planning, best practices, and problem-solving. There are many options, you will interview the client to find out thier choices one question at a time. Start with the most general question and hone down to the specifics as you go. For each direct and concise interview question, offer some suggestions with numbered bullets in a few words. When the interview is complete, restate the goal, then list all my selections. What's your first question?`,
  
  folder: '/projects/{{PROJECT_NAME_SLUG}}',
  
  description: 'A comprehensive project focused on {{PROJECT_GOAL}}. This project will involve planning, development, and implementation to achieve the specified objectives.',
  
  tags: ['project', 'planning', 'development'],
};

/**
 * Load template content from markdown files
 * In a browser environment, this will use the fallback templates
 * In a Node.js environment, this could be extended to read actual files
 */
export async function loadTemplates(): Promise<{
  instructions: string;
  folder: string;
  description: string;
  tags: string[];
}> {
  try {
    // In a browser environment, we can't directly read files
    // So we'll use the fallback templates for now
    // In a future implementation, this could be extended to:
    // 1. Load templates via API calls
    // 2. Use a build-time process to embed templates
    // 3. Use a configuration management system
    
    return {
      instructions: FALLBACK_TEMPLATES.instructions,
      folder: FALLBACK_TEMPLATES.folder,
      description: FALLBACK_TEMPLATES.description,
      tags: FALLBACK_TEMPLATES.tags,
    };
  } catch (error) {
    console.warn('Failed to load templates from files, using fallback templates:', error);
    return FALLBACK_TEMPLATES;
  }
}

/**
 * Get template content synchronously (for immediate use)
 */
export function getTemplates(): {
  instructions: string;
  folder: string;
  description: string;
  tags: string[];
} {
  return FALLBACK_TEMPLATES;
}

/**
 * Extract template content from markdown file content
 * This function parses markdown files to extract the actual template content
 */
export function parseTemplateFromMarkdown(markdownContent: string): string {
  // Look for code blocks that contain the template
  const codeBlockMatch = markdownContent.match(/```\s*\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    return codeBlockMatch[1].trim();
  }
  
  // If no code block found, return the entire content
  return markdownContent.trim();
}

/**
 * Parse tags from markdown content
 * Tags should be one per line in a code block
 */
export function parseTagsFromMarkdown(markdownContent: string): string[] {
  const codeBlockMatch = markdownContent.match(/```\s*\n([\s\S]*?)\n```/);
  if (codeBlockMatch) {
    const tagContent = codeBlockMatch[1].trim();
    return tagContent
      .split('\n')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  }
  
  return FALLBACK_TEMPLATES.tags;
}

/**
 * Template file paths for reference
 */
export const TEMPLATE_PATHS = {
  instructions: 'src/shared/config/projectCreation/instructions.md',
  folder: 'src/shared/config/projectCreation/folder.md',
  description: 'src/shared/config/projectCreation/description.md',
  tags: 'src/shared/config/projectCreation/tags.md',
} as const;
