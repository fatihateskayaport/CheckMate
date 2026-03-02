import { theme } from "@/src/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  date: Date;
  onDateChange: (date: Date) => void;
};

const TURKISH_MONTHS = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
];

const FormDatePicker = ({ date, onDateChange }: Props) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');

  const formatDateTurkish = (d: Date) => {
    const day = d.getDate();
    const month = TURKISH_MONTHS[d.getMonth()];
    const hour = d.getHours().toString().padStart(2, '0');
    const minute = d.getMinutes().toString().padStart(2, '0');
    return `${day} ${month}, ${hour}:${minute}`;
  };

  const onChange = (event: any, selectedDate?: Date) => {

    if (event.type === "dismissed") {
      setShow(false);
      setMode('date');
      return;
    }

    const currentDate = selectedDate || date;

    if (Platform.OS === 'android') {
      if (mode === 'date') {

        onDateChange(currentDate);
        setMode('time');

        setTimeout(() => setShow(true), 100);
      } else {

        setShow(false);
        setMode('date');
        onDateChange(currentDate);
      }
    } else {
      onDateChange(currentDate);
    }
  };

  const handleToggle = () => {
    if (show) {
      setShow(false);
      setMode('date');
    } else {
      setMode(Platform.OS === 'ios' ? 'datetime' : 'date');
      setShow(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Teslim Tarihi & Saat</Text>
      
      <TouchableOpacity 
        onPress={handleToggle}
        style={[styles.pickerButton, show && styles.activePickerButton]}
        activeOpacity={0.7}
      >
        <View style={styles.leftContent}>
          <View style={[styles.iconCircle, show && styles.activeIconCircle]}>
            <MaterialCommunityIcons 
              name="calendar-clock" 
              size={20} 
              color={show ? "#fff" : theme.colors.primary} 
            />
          </View>
          <Text style={styles.dateText}>{formatDateTurkish(date)}</Text>
        </View>
        <MaterialCommunityIcons 
          name={show ? "chevron-up" : "chevron-right"} 
          size={20} 
          color="#9CA3AF" 
        />
      </TouchableOpacity>

      {show && (
        <View style={styles.pickerWrapper}>
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChange}
            minimumDate={new Date()}
            locale="tr-TR"
            textColor="#000"
          />
          

          {Platform.OS === 'ios' && (
            <TouchableOpacity onPress={() => setShow(false)} style={styles.iosCloseBtn}>
              <Text style={styles.iosCloseBtnText}>Kapat</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4B5563",
    marginBottom: 8,
    marginLeft: 4,
  },
  pickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activePickerButton: {
    borderColor: theme.colors.primary,
    backgroundColor: '#F5F7FF',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconCircle: {
    backgroundColor: theme.colors.primary,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
  },
  pickerWrapper: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  iosCloseBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  iosCloseBtnText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  }
});

export default FormDatePicker;