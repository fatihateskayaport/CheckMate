import { useTodoStore } from "@/src/services/useTodoStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  user: string;
  weather?: { temp: number; condition: string; icon: string } | null;
  isHome?: boolean;
};

export default function CustomHeader({ user, weather, isHome = true }: Props) {
  const insets = useSafeAreaInsets();
  const userImage = useTodoStore((state) => state.userImage);
  const navigation = useNavigation<any>();
  const [isOpen, setIsOpen] = useState(false);

  const hour = new Date().getHours();
  let message = "";
  if (hour< 12) {
    message= "Günaydın,";    
  }else if (hour< 17){
    message = "Tünaydın,";
  }else {
    message = "İyi akşamlar,";
  }

  const toggleSheet = () => {
    if (!isHome) return; 
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View style={[styles.outerWrapper, !isHome && { borderBottomWidth: 1, borderColor: '#F1F5F9' }]}>
      {/* ANA HEADER */}
      <View style={[styles.headerBody, { paddingTop: insets.top + 10 }]}>
        <View style={styles.mainRow}>
          
          <View style={styles.leftSide}>
            {!isHome ? (
              // ADDSCREEN BAŞLIĞI
              <View style={styles.backTitleRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                  <MaterialCommunityIcons name="chevron-left" size={32} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.pageTitle}>Yeni Görev</Text>
              </View>
            ) : (
              // ANA SAYFA KARŞILAMA VE HAVA DURUMU
              <>
                <Text style={styles.greeting}>{message} {user.split(' ')[0]} 👋</Text>
                <TouchableOpacity onPress={toggleSheet} activeOpacity={0.7} style={styles.smartChip}>
                  <MaterialCommunityIcons name={weather?.icon as any || 'weather-sunny'} size={14} color="#6366F1" />
                  <Text style={styles.chipText}>{weather ? `${weather.temp}°C • ${weather.condition}` : 'Hava Durumu'}</Text>
                  <MaterialCommunityIcons name={isOpen ? "chevron-up" : "chevron-down"} size={14} color="#6366F1" style={{marginLeft: 4}} />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* PROFİL FOTOĞRAFI (Her zaman orada) */}
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <View style={styles.avatarWrapper}>
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.avatar} />
              ) : (
                <View style={styles.initials}><Text style={styles.initialsText}>{user[0]}</Text></View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ÜSTTEN AŞAĞI AÇILAN PANEL (Sadece isHome ise çalışır) */}
      {isHome && isOpen && (
        <View style={styles.sheetContainer}>
          <BlurView intensity={80} tint="light" style={styles.glassPanel}>
            <View style={styles.contentRow}>
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Bugün</Text>
                <Text style={styles.infoValue}>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })}</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Hava</Text>
                <Text style={styles.infoValue}>{weather?.temp ?? '--'}°C</Text>
              </View>
              <View style={styles.verticalDivider} />
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Durum</Text>
                <Text style={styles.infoValue}>{weather?.condition ?? 'Bulutlu'}</Text>
              </View>
            </View>
            <View style={styles.adviceBox}>
                <Text style={styles.adviceText}>✨ Bugün odaklanman için harika bir gün, hadi listeni eritelim!</Text>
            </View>
          </BlurView>
        </View>
      )}

      {/* ÇEKME TUTAMAĞI (Sadece isHome ise gözükür) */}
      {isHome && (
        <TouchableOpacity onPress={toggleSheet} style={styles.dragHandle}>
           <View style={styles.handleBar} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    zIndex: 1000,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  headerBody: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  mainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  leftSide: { flex: 1 },
  greeting: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  smartChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 12, fontWeight: '700', color: '#475569', marginLeft: 5 },
  avatarWrapper: { width: 44, height: 44, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E2E8F0' },
  avatar: { width: '100%', height: '100%' },
  initials: { flex: 1, backgroundColor: '#6366F1', justifyContent: 'center', alignItems: 'center' },
  initialsText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  
  // ADDSCREEN ÖZEL STİLLER
  backTitleRow: { flexDirection: 'row', alignItems: 'center' },
  backButton: { marginLeft: -10, marginRight: 5 },
  pageTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B' },

  // SHEET STILLERI
  sheetContainer: { paddingHorizontal: 20, paddingVertical: 15 },
  glassPanel: {
    borderRadius: 20,
    padding: 20,
    backgroundColor: 'rgba(99, 102, 241, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    overflow: 'hidden',
  },
  contentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  infoBox: { alignItems: 'center', flex: 1 },
  infoLabel: { fontSize: 11, color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginTop: 4 ,textAlign:'center'},
  verticalDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
  adviceBox: { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  adviceText: { fontSize: 13, color: '#6366F1', fontWeight: '600', textAlign: 'center', fontStyle: 'italic' },
  
  dragHandle: { width: '100%', height: 20, justifyContent: 'center', alignItems: 'center' },
  handleBar: { width: 36, height: 4, backgroundColor: '#E2E8F0', borderRadius: 2 }
});