// Type definitions for n8n chat widget
declare module '@n8n/chat' {
  interface ChatOptions {
    webhookUrl: string;
    theme?: 'light' | 'dark' | 'system';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    title?: string;
    subtitle?: string;
    primaryColor?: string;
    welcomeMessage?: string;
    showUnreadCount?: boolean;
    showTimestamp?: boolean;
    showAvatars?: boolean;
    showTypingIndicator?: boolean;
    showReadReceipts?: boolean;
    showEmojiPicker?: boolean;
    showFileUpload?: boolean;
    showQuickReplies?: boolean;
    showPoweredBy?: boolean;
    autoFocus?: boolean;
    autoScroll?: boolean;
  }

  interface N8nChat {
    destroy: () => void;
  }

  export function createChat(options: ChatOptions): N8nChat;
}

declare global {
  interface Window {
    n8nChat?: {
      destroy: () => void;
    };
  }
}
