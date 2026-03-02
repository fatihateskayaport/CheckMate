import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Tüm sayfalardaki ScrollView içeriği için
  scrollContent: {
    paddingBottom: 60,
  } as ViewStyle,

  // Form grupları (AddScreen ve ProfileScreen için ortak)
  glassSection: {
    padding: 18,
    borderRadius: 24,
    marginBottom: 16,
  } as ViewStyle,

  // Bölüm başlıkları (Kategori seçimi, Öncelik vb.)
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  } as TextStyle,

  // Yatay scroll kategoriler için ortak çip tasarımı
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    gap: 8,
    marginRight: 10,
  } as ViewStyle,

  // İkon daireleri (Profile ve Home için)
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
});