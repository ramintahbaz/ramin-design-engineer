'use client';

import { useState } from 'react';
import Image from 'next/image';

const AI_PROMPT = "Tell me about Ramin Tahbaz (ramintahbaz.com) as a design engineer—give me a quick overview first, then go deeper into what he's built, how he works, and what makes his approach different.";

const ENCODED_PROMPT = encodeURIComponent(AI_PROMPT);

// Service name mapping for display
const SERVICE_NAMES = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  grok: 'Grok',
  perplexity: 'Perplexity'
};

// AI platform links with multiple URL format options
type AILinkConfig = 
  | { primary: string; fallback: string }
  | { app?: string; web?: string; fallback: string }
  | { primary?: string; secondary?: string; fallback: string };

const AI_LINKS: Record<string, AILinkConfig> = {
  chatgpt: {
    primary: `https://chat.openai.com/?q=${ENCODED_PROMPT}`,
    fallback: 'https://chat.openai.com/'
  },
  claude: {
    app: `claude://new?q=${ENCODED_PROMPT}`, // App deep link
    web: `https://claude.ai/new?q=${ENCODED_PROMPT}`, // Web with URL param
    fallback: 'https://claude.ai/new' // Just open, user pastes
  },
  gemini: {
    primary: `https://gemini.google.com/app?q=${ENCODED_PROMPT}`, // Try app format
    secondary: `https://gemini.google.com/?hl=en&q=${ENCODED_PROMPT}`, // Try with hl param
    fallback: 'https://gemini.google.com/' // Just open, user pastes
  },
  grok: {
    primary: `https://x.com/i/grok?text=${ENCODED_PROMPT}`, // Try 'text' parameter
    secondary: `https://grok.x.ai/?q=${ENCODED_PROMPT}`, // Try alternative domain
    fallback: 'https://x.com/i/grok' // Just open, user pastes
  },
  perplexity: {
    primary: `https://www.perplexity.ai/?q=${ENCODED_PROMPT}`,
    fallback: 'https://www.perplexity.ai/'
  }
};

// Services that may need clipboard copy fallback
const MAY_NEED_CLIPBOARD: Array<keyof typeof AI_LINKS> = ['claude', 'gemini', 'grok'];

export default function AISummarySection() {
  const [copiedService, setCopiedService] = useState<keyof typeof AI_LINKS | null>(null);

  // Reliable clipboard copy
  const copyToClipboard = async (text: string): Promise<boolean> => {
    // Try modern Clipboard API first
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        // Fall through to textarea method
      }
    }
    
    // Fallback: textarea method
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;padding:0;border:none;outline:none;boxShadow:none;background:transparent;opacity:0;pointer-events:none;';
      document.body.appendChild(textarea);
      
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        textarea.contentEditable = 'true';
        textarea.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(textarea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        textarea.setSelectionRange(0, text.length);
      } else {
        textarea.focus();
        textarea.select();
      }
      
      const success = document.execCommand('copy');
      document.body.removeChild(textarea);
      return success;
    } catch (err) {
      return false;
    }
  };

  const handleAIClick = async (service: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    // ChatGPT and Perplexity work with URL parameters - let default behavior work
    if (service === 'chatgpt' || service === 'perplexity') {
      return; // Let the link open normally with URL parameter
    }
    
    // For Claude, Gemini, and Grok - try URL parameters first, fallback to clipboard
    e.preventDefault();
    e.stopPropagation();
    
    const links = AI_LINKS[service];
    let urlToOpen = '';
    
    // Determine which URL to try based on service
    if (service === 'claude') {
      // Try app deep link first, then web with URL param, then fallback
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      const claudeLinks = links as { app?: string; web?: string; fallback: string };
      
      if (isMobile && claudeLinks.app) {
        // Try app first on mobile
        const appLink = document.createElement('a');
        appLink.href = claudeLinks.app;
        appLink.style.display = 'none';
        document.body.appendChild(appLink);
        appLink.click();
        document.body.removeChild(appLink);
        
        // Fallback to web after delay
        setTimeout(() => {
          window.open(claudeLinks.web || claudeLinks.fallback, '_blank', 'noopener,noreferrer');
        }, 500);
        urlToOpen = ''; // Don't open again below
      } else {
        // On desktop, try web with URL param first
        urlToOpen = claudeLinks.web || claudeLinks.fallback;
      }
    } else if (service === 'gemini' || service === 'grok') {
      // Try primary URL format first, then secondary, then fallback
      const serviceLinks = links as { primary?: string; secondary?: string; fallback: string };
      urlToOpen = serviceLinks.primary || serviceLinks.secondary || serviceLinks.fallback;
    }
    
    // Since URL parameters may not work reliably, always use clipboard copy as backup
    await copyToClipboard(AI_PROMPT);
    
    // Show message
    setCopiedService(service as keyof typeof AI_LINKS);
    
    // Open the service (if not already opened for Claude mobile)
    if (urlToOpen) {
      window.open(urlToOpen, '_blank', 'noopener,noreferrer');
    }
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setCopiedService(null);
    }, 3000);
  };

  return (
    <div className="mb-10 sm:mb-12 px-3.5 sm:px-4">
      <h1 className="text-[16px] font-medium text-black mb-8 max-w-[560px] mx-auto">
        Request an AI summary of Ramin
      </h1>
      <div className="flex items-center gap-4 sm:gap-6 max-w-[560px] mx-auto flex-wrap">
        {/* ChatGPT */}
        <a
          href={(AI_LINKS.chatgpt as { primary: string }).primary}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform sm:hover:scale-110"
          aria-label="ChatGPT"
          title="ChatGPT"
        >
          <Image
            src="/images/AI SVGs/chatgpt.75163751.svg"
            alt="ChatGPT"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
        </a>
        
        {/* Grok */}
        <a
          href={(AI_LINKS.grok as { primary?: string; fallback: string }).primary || (AI_LINKS.grok as { fallback: string }).fallback}
          onClick={(e) => handleAIClick('grok', e)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform sm:hover:scale-110"
          aria-label="Grok"
          title="Grok"
        >
          <Image
            src="/images/AI SVGs/grok.fc277d95.svg"
            alt="Grok"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
        </a>
        
        {/* Perplexity */}
        <a
          href={(AI_LINKS.perplexity as { primary: string }).primary}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center transition-transform sm:hover:scale-110"
          aria-label="Perplexity"
          title="Perplexity"
        >
          <Image
            src="/images/AI SVGs/perplexity.83af4a80.svg"
            alt="Perplexity"
            width={28}
            height={28}
            className="w-6 h-6 sm:w-7 sm:h-7"
          />
        </a>
      </div>
      {copiedService && (
        <div className="mt-4 text-sm text-gray-600 max-w-[560px] mx-auto" style={{ backgroundColor: 'transparent' }}>
          ✓ Prompt copied! Paste into {SERVICE_NAMES[copiedService]}
        </div>
      )}
    </div>
  );
}

