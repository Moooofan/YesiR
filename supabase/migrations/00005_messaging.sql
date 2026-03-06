-- ============================================================
-- Messaging system: Conversations & Messages
-- ============================================================

-- 1. Conversations table
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vendor_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (school_user_id, vendor_user_id)
);

CREATE INDEX idx_conversations_school ON public.conversations(school_user_id);
CREATE INDEX idx_conversations_vendor ON public.conversations(vendor_user_id);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- 2. Messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);

-- 3. Trigger: update conversation.last_message_at on new message
CREATE OR REPLACE FUNCTION public.update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.update_conversation_last_message();

-- 4. Helper: get conversation IDs for current user (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.user_conversation_ids()
RETURNS SETOF UUID AS $$
  SELECT id FROM public.conversations
  WHERE school_user_id = auth.uid() OR vendor_user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================================
-- RLS Policies
-- ============================================================

-- Conversations
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Own conversations readable" ON public.conversations
  FOR SELECT USING (
    school_user_id = (SELECT auth.uid()) OR vendor_user_id = (SELECT auth.uid())
  );

CREATE POLICY "Users can start conversations" ON public.conversations
  FOR INSERT WITH CHECK (
    school_user_id = (SELECT auth.uid()) OR vendor_user_id = (SELECT auth.uid())
  );

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conversation messages readable" ON public.messages
  FOR SELECT USING (
    conversation_id IN (SELECT public.user_conversation_ids())
  );

CREATE POLICY "Participants can send messages" ON public.messages
  FOR INSERT WITH CHECK (
    sender_id = (SELECT auth.uid())
    AND conversation_id IN (SELECT public.user_conversation_ids())
  );

CREATE POLICY "Recipients can mark messages read" ON public.messages
  FOR UPDATE USING (
    conversation_id IN (SELECT public.user_conversation_ids())
    AND sender_id != (SELECT auth.uid())
  );

-- 5. Enable Realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
