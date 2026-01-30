/**
 * DEBUG TOOL FOR LOVABLE DOM INSPECTION
 * Run this in Lovable conversation to understand actual DOM structure
 *
 * Copy-paste into browser console to get detailed DOM analysis
 */

export function debugLovableDOM() {
  console.log('=== LOVABLE DOM DEBUG ===\n');

  // 1. Find ALL prose elements
  console.log('1. ALL PROSE ELEMENTS:');
  const proseElements = document.querySelectorAll('[class*="prose"]');
  console.log(`Found ${proseElements.length} prose elements\n`);

  proseElements.forEach((el, index) => {
    const element = el as HTMLElement;
    const text = element.textContent?.slice(0, 50) || '(empty)';
    const classes = element.className;

    // Walk up to find container
    let parent = element.parentElement;
    let containerClass = '';
    let depth = 0;
    while (parent && depth < 5) {
      if (parent.className) {
        containerClass = parent.className;
        break;
      }
      parent = parent.parentElement;
      depth++;
    }

    console.log(`[${index}] "${text}..."`);
    console.log(`    Element classes: ${classes}`);
    console.log(`    Parent classes: ${containerClass}`);
    console.log(`    HTML structure:`);
    console.log(`    ${element.outerHTML.slice(0, 200)}...`);
    console.log('');
  });

  // 2. Find elements with specific class patterns
  console.log('\n2. ELEMENTS WITH PROMPTBOX CLASS:');
  const promptBoxes = document.querySelectorAll('[class*="PromptBox"]');
  console.log(`Found ${promptBoxes.length} PromptBox elements`);
  promptBoxes.forEach((el, i) => {
    console.log(`[${i}] ${(el as HTMLElement).className}`);
    console.log(`    Text: ${el.textContent?.slice(0, 50)}...`);
  });

  // 3. Find justify-end containers
  console.log('\n3. JUSTIFY-END CONTAINERS:');
  const justifyEnds = document.querySelectorAll('[class*="justify-end"]');
  console.log(`Found ${justifyEnds.length} justify-end elements`);
  justifyEnds.forEach((el, i) => {
    const element = el as HTMLElement;
    const text = element.textContent?.slice(0, 50) || '(empty)';
    console.log(`[${i}] "${text}..."`);
    console.log(`    Classes: ${element.className}`);
  });

  // 4. Find all message containers (various patterns)
  console.log('\n4. POTENTIAL MESSAGE CONTAINERS:');
  const patterns = [
    '[class*="message"]',
    '[class*="chat"]',
    '[class*="bubble"]',
    '[role="article"]',
    '[data-role*="message"]'
  ];

  patterns.forEach(pattern => {
    const elements = document.querySelectorAll(pattern);
    if (elements.length > 0) {
      console.log(`${pattern}: ${elements.length} found`);
      Array.from(elements).slice(0, 3).forEach((el, i) => {
        const element = el as HTMLElement;
        const text = element.textContent?.slice(0, 40) || '(empty)';
        console.log(`  [${i}] "${text}..." - ${element.className.slice(0, 60)}...`);
      });
    }
  });

  // 5. Analyze flex containers
  console.log('\n5. FLEX CONTAINERS STRUCTURE:');
  const flexContainers = document.querySelectorAll('[class*="flex"]');
  console.log(`Found ${flexContainers.length} flex containers`);

  // Find ones with text
  Array.from(flexContainers).filter(el => {
    const text = (el as HTMLElement).textContent?.trim() || '';
    return text.length > 10 && text.length < 200;
  }).slice(0, 5).forEach((el, i) => {
    const element = el as HTMLElement;
    const text = element.textContent?.slice(0, 40);
    console.log(`[${i}] "${text}..." `);
    console.log(`    Classes: ${element.className}`);
  });

  // 6. Check for data attributes
  console.log('\n6. DATA ATTRIBUTES:');
  const elementsWithData = document.querySelectorAll('[data-*]');
  const dataAttrs = new Set<string>();
  elementsWithData.forEach(el => {
    Array.from((el as HTMLElement).attributes).forEach(attr => {
      if (attr.name.startsWith('data-')) {
        dataAttrs.add(attr.name);
      }
    });
  });
  console.log(`Found data attributes: ${Array.from(dataAttrs).join(', ') || 'none'}`);

  // 7. Check for ARIA roles
  console.log('\n7. ARIA ROLES:');
  const elementsWithRole = document.querySelectorAll('[role]');
  const roles = new Set<string>();
  elementsWithRole.forEach(el => {
    roles.add((el as HTMLElement).getAttribute('role') || '');
  });
  console.log(`Found roles: ${Array.from(roles).join(', ')}`);

  // 8. Summary
  console.log('\n=== SUMMARY ===');
  console.log(`Total prose elements: ${proseElements.length}`);
  console.log(`PromptBox elements: ${promptBoxes.length}`);
  console.log(`Justify-end containers: ${justifyEnds.length}`);
  console.log('\n=== END DEBUG ===');
}

// Run it
debugLovableDOM();
