import { useState } from 'react';

import { Pressable, View, Text, StyleSheet } from 'react-native';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <View style={styles.accordionContainer}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
      </Pressable>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainer: { marginBottom: 10, borderRadius: 8, backgroundColor: '#f0f0f0', overflow: 'hidden' },
  accordionHeader: { padding: 10, backgroundColor: '#ddd' },
  accordionTitle: { fontSize: 18, fontWeight: 'bold' },
  accordionContent: { padding: 10 },
});

export default Accordion;
