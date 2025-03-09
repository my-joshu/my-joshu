import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { createQuestionsInsertChannelName } from '../../utils/channelName';
import { logger } from '../logger';

// Types for realtime service
export type ChannelSubscription = {
  channel: RealtimeChannel;
  presentationId: string;
  channelType: 'questions' | 'answers' | 'custom';
};

/**
 * Service for managing Supabase realtime subscriptions
 */
export class RealtimeService {
  private activeSubscriptions: Map<string, ChannelSubscription> = new Map();
  private supabase: SupabaseClient | null = null;

  /**
   * Initialize the realtime service with a Supabase client
   */
  constructor(supabaseClient?: SupabaseClient) {
    if (supabaseClient) {
      this.setSupabaseClient(supabaseClient);
    }
  }

  /**
   * Set or update the Supabase client
   */
  setSupabaseClient(client: SupabaseClient): void {
    this.supabase = client;
  }

  /**
   * Subscribe to question inserts for a specific presentation
   */
  subscribeToQuestions(
    presentationId: string,
    onInsert: (payload: any) => void,
    onError?: (error: Error) => void
  ): string {
    if (!this.supabase) {
      const error = new Error('Supabase client not initialized');
      if (onError) onError(error);
      logger.error({ presentationId }, 'Failed to subscribe to questions: Supabase client not initialized');
      throw error;
    }

    const channelName = createQuestionsInsertChannelName(presentationId);

    // Return existing subscription if already active
    if (this.activeSubscriptions.has(channelName)) {
      logger.info({ channelName }, 'Using existing question subscription');
      return channelName;
    }

    try {
      const channel = this.supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'questions',
            filter: `presentation_id=eq.${presentationId}`,
          },
          (payload) => {
            logger.info(
              {
                channelName,
                questionId: payload.new?.id,
              },
              'Received new question'
            );
            onInsert(payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            logger.info({ channelName, status }, 'Successfully subscribed to channel');
          } else if (status === 'CHANNEL_ERROR') {
            logger.error({ channelName, status }, 'Channel subscription error');
            if (onError) onError(new Error(`Channel subscription error: ${status}`));
          }
        });

      // Store the subscription
      this.activeSubscriptions.set(channelName, {
        channel,
        presentationId,
        channelType: 'questions',
      });

      logger.info({ channelName, presentationId }, 'Created new question subscription');
      return channelName;
    } catch (error) {
      logger.error({ error, presentationId }, 'Error subscribing to questions');
      if (onError) onError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * Unsubscribe from a specific channel
   */
  unsubscribe(channelName: string): boolean {
    const subscription = this.activeSubscriptions.get(channelName);

    if (!subscription) {
      logger.warn({ channelName }, 'Attempted to unsubscribe from non-existent channel');
      return false;
    }

    try {
      subscription.channel.unsubscribe();
      this.activeSubscriptions.delete(channelName);
      logger.info({ channelName }, 'Successfully unsubscribed from channel');
      return true;
    } catch (error) {
      logger.error({ error, channelName }, 'Error unsubscribing from channel');
      return false;
    }
  }

  /**
   * Unsubscribe from all active channels
   */
  unsubscribeAll(): void {
    // Use Array.from to convert Map entries to an array for compatibility
    const subscriptions = Array.from(this.activeSubscriptions);

    subscriptions.forEach(([channelName, subscription]) => {
      try {
        subscription.channel.unsubscribe();
        logger.info({ channelName }, 'Unsubscribed from channel');
      } catch (error) {
        logger.error({ error, channelName }, 'Error unsubscribing from channel');
      }
    });

    this.activeSubscriptions.clear();
    logger.info('Unsubscribed from all channels');
  }

  /**
   * Get all active subscriptions
   */
  getActiveSubscriptions(): Map<string, ChannelSubscription> {
    return new Map(this.activeSubscriptions);
  }
}

// Export a singleton instance
export const realtimeService = new RealtimeService();
