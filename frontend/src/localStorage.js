/**
 * Client-side storage using localStorage
 * All conversations stay in the browser - completely private
 */

const STORAGE_KEY = 'llm_council_conversations';

export function getConversations() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveConversations(conversations) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
}

export function getConversation(id) {
  const conversations = getConversations();
  return conversations.find(c => c.id === id) || null;
}

export function createConversation(id) {
  const conversations = getConversations();
  const newConversation = {
    id,
    created_at: new Date().toISOString(),
    title: 'New Conversation',
    messages: []
  };
  conversations.push(newConversation);
  saveConversations(conversations);
  return newConversation;
}

export function addUserMessage(conversationId, content) {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) throw new Error('Conversation not found');

  conversation.messages.push({
    role: 'user',
    content
  });
  saveConversations(conversations);
}

export function addAssistantMessage(conversationId, stage1, stage2, stage3) {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) throw new Error('Conversation not found');

  conversation.messages.push({
    role: 'assistant',
    stage1,
    stage2,
    stage3
  });
  saveConversations(conversations);
}

export function updateConversationTitle(conversationId, title) {
  const conversations = getConversations();
  const conversation = conversations.find(c => c.id === conversationId);
  if (!conversation) throw new Error('Conversation not found');

  conversation.title = title;
  saveConversations(conversations);
}

export function listConversationsMetadata() {
  const conversations = getConversations();
  return conversations
    .map(c => ({
      id: c.id,
      created_at: c.created_at,
      title: c.title,
      message_count: c.messages.length
    }))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}
