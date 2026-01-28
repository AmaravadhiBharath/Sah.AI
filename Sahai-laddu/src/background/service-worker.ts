import type { ExtractionResult, Message, Mode } from '../types';

console.log('[PromptExtractor] Service worker started');

// Store for side panel connections
const sidePanelPorts = new Set<chrome.runtime.Port>();

// Cache for extraction results
let lastExtractionResult: ExtractionResult | null = null;

// Open side panel on extension icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

// Handle connections from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidepanel') {
    console.log('[PromptExtractor] Side panel connected');
    sidePanelPorts.add(port);
    
    // Send cached result if available
    if (lastExtractionResult) {
      port.postMessage({
        action: 'EXTRACTION_RESULT',
        result: lastExtractionResult,
      });
    }
    
    // Handle messages from side panel
    port.onMessage.addListener((message: Message) => {
      handleSidePanelMessage(message);
    });
    
    port.onDisconnect.addListener(() => {
      console.log('[PromptExtractor] Side panel disconnected');
      sidePanelPorts.delete(port);
    });
  }
});

// Store pending extraction to send when side panel connects
let pendingExtraction: { result: ExtractionResult; mode: Mode } | null = null;

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
  console.log('[PromptExtractor] Received message:', message.action);
  
  switch (message.action) {
    case 'EXTRACTION_FROM_PAGE': {
      // From floating buttons - extract prompts and open side panel
      const { result, mode } = message as { result: ExtractionResult; mode: Mode };
      lastExtractionResult = result;
      pendingExtraction = { result, mode };
      
      // Open the side panel
      const windowId = sender.tab?.windowId;
      if (windowId) {
        chrome.sidePanel.open({ windowId }).then(() => {
          console.log('[PromptExtractor] Side panel opened');
          // Give the side panel time to connect
          setTimeout(() => {
            if (pendingExtraction) {
              broadcastToSidePanels({
                action: 'EXTRACTION_FROM_PAGE_RESULT',
                result: pendingExtraction.result,
                mode: pendingExtraction.mode,
              });
              pendingExtraction = null;
            }
          }, 500);
        }).catch((err) => {
          console.error('[PromptExtractor] Error opening side panel:', err);
        });
      }
      
      sendResponse({ success: true });
      break;
    }
    
    case 'EXTRACTION_RESULT': {
      const result = (message as { result: ExtractionResult }).result;
      lastExtractionResult = result;
      
      // Broadcast to all connected side panels
      broadcastToSidePanels({
        action: 'EXTRACTION_RESULT',
        result,
      });
      
      sendResponse({ success: true });
      break;
    }
    
    case 'STATUS_RESULT': {
      // Content script reporting its status
      broadcastToSidePanels(message);
      sendResponse({ success: true });
      break;
    }
    
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true;
});

// Handle messages from side panel
async function handleSidePanelMessage(message: Message) {
  console.log('[PromptExtractor] Side panel message:', message.action);
  
  switch (message.action) {
    case 'EXTRACT_PROMPTS': {
      const mode = (message as { mode: Mode }).mode;
      
      // Send extraction request to active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'EXTRACT_PROMPTS', mode });
      }
      break;
    }
    
    case 'GET_STATUS': {
      // Get status from active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.id) {
        chrome.tabs.sendMessage(tab.id, { action: 'GET_STATUS' }, (response) => {
          if (response) {
            broadcastToSidePanels(response);
          }
        });
      }
      break;
    }
    
    case 'SUMMARIZE_PROMPTS': {
      // Handle summarization request (will be implemented in AI service)
      const prompts = (message as { prompts: Array<{ content: string }> }).prompts;
      
      // For now, just return the raw prompts
      // TODO: Implement AI summarization
      broadcastToSidePanels({
        action: 'SUMMARY_RESULT',
        result: {
          original: prompts,
          summary: prompts.map(p => p.content).join('\n\n---\n\n'),
          promptCount: {
            before: prompts.length,
            after: prompts.length,
          },
        },
      });
      break;
    }
  }
}

// Broadcast message to all connected side panels
function broadcastToSidePanels(message: unknown) {
  sidePanelPorts.forEach((port) => {
    try {
      port.postMessage(message);
    } catch (e) {
      console.error('[PromptExtractor] Error sending to side panel:', e);
      sidePanelPorts.delete(port);
    }
  });
}

// Install handler
chrome.runtime.onInstalled.addListener(() => {
  console.log('[PromptExtractor] Extension installed');
});
