import { Todo } from "@/src/constants/types";
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  selected: Todo['priority'];
  onSelect: (priority: Todo['priority']) => void;
}

const PrioritySelector = ({ selected, onSelect }: Props) => {
  const priorities: Todo['priority'][] = ['Low', 'Medium', 'High'];

  return (
    <View style={styles.container}>
      {priorities.map((p) => (
        <TouchableOpacity
          key={p}
          style={[
            styles.button,
            selected === p && styles[`selected_${p}` as keyof typeof styles]
          ]}
          onPress={() => onSelect(p)}
        >
          <Text style={[styles.text, selected === p && styles.activeText]}>
            {p === 'Low' ? 'Düşük' : p === 'Medium' ? 'Orta' : 'Yüksek'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default PrioritySelector;

const styles = StyleSheet.create({
  container: { flexDirection: 'row', width: '100%', marginVertical: 15 },
  button: {
    flex: 1, padding: 12, marginHorizontal: 4, borderRadius: 10,
    borderWidth: 1, borderColor: '#eee', alignItems: 'center', backgroundColor: '#f9f9f9'
  },
  text: { fontSize: 13, color: '#666', fontWeight: '500' },
  activeText: { color: '#fff', fontWeight: 'bold' },

  selected_Low: { backgroundColor: '#2ecc71', borderColor: '#27ae60' },
  selected_Medium: { backgroundColor: '#f1c40f', borderColor: '#f39c12' },
  selected_High: { backgroundColor: '#e74c3c', borderColor: '#c0392b' },
}) as any;