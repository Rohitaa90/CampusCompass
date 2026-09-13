// components/MessageBubble.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { Colors } from '@/lib/colors';

interface MessageBubbleProps {
  text: string;
  role: 'user' | 'ai';
}

export default function MessageBubble({ text, role }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <View style={[styles.wrapper, isUser ? styles.wrapperUser : styles.wrapperAI]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>✨</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
        {isUser ? (
          <Text style={styles.textUser}>
            {text}
          </Text>
        ) : (
          <Markdown style={markdownStyles}>
            {text}
          </Markdown>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '88%',
    gap: 8,
  },
  wrapperUser: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  wrapperAI: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${Colors.amber}20`,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
    flexShrink: 0,
  },
  avatarText: {
    fontSize: 16,
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexShrink: 1,
  },
  bubbleUser: {
    backgroundColor: Colors.sage,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textUser: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.white,
  },
});

const markdownStyles = {
  body: {
    fontSize: 15,
    lineHeight: 22,
    color: Colors.midnight,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  strong: {
    fontWeight: '700',
  },
};
