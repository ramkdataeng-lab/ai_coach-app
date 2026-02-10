import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CoachCard } from '@/components/coach-card';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, TrendingUp, Sparkles, Heart, BookOpen, Dumbbell, Code, Palette, Target, Users } from 'lucide-react-native';
import { router } from 'expo-router';

export default function ExploreScreen() {
  const colorScheme = 'light';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'all', name: 'All', icon: Sparkles },
    { id: 'productivity', name: 'Productivity', icon: Target },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'learning', name: 'Learning', icon: BookOpen },
    { id: 'fitness', name: 'Fitness', icon: Dumbbell },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'tech', name: 'Tech', icon: Code },
  ];

  const featuredCoaches = [
    {
      id: 'minimalist-chef',
      name: 'Minimalist Chef',
      description: 'Simple recipes with 5 ingredients or less',
      icon: <Sparkles size={24} color={Colors.light.tint} />,
      creator: 'Sarah K.',
      uses: '2.3k',
      rating: 4.8,
    },
    {
      id: 'study-buddy',
      name: 'Study Buddy',
      description: 'Master any subject with proven learning techniques',
      icon: <BookOpen size={24} color={Colors.light.tint} />,
      creator: 'Alex M.',
      uses: '5.1k',
      rating: 4.9,
    },
    {
      id: 'fitness-tracker',
      name: 'Fitness Coach',
      description: 'Personalized workout plans and nutrition advice',
      icon: <Dumbbell size={24} color={Colors.light.tint} />,
      creator: 'Mike R.',
      uses: '3.7k',
      rating: 4.7,
    },
    {
      id: 'code-mentor',
      name: 'Code Mentor',
      description: 'Learn programming concepts and debug code',
      icon: <Code size={24} color={Colors.light.tint} />,
      creator: 'Dev Team',
      uses: '8.2k',
      rating: 5.0,
    },
    {
      id: 'creative-writer',
      name: 'Creative Writer',
      description: 'Overcome writer\'s block and craft compelling stories',
      icon: <Palette size={24} color={Colors.light.tint} />,
      creator: 'Emma L.',
      uses: '1.9k',
      rating: 4.6,
    },
  ];

  const trendingCoaches = [
    {
      id: 'morning-routine',
      name: 'Morning Routine Coach',
      description: 'Start your day with intention and energy',
      icon: <TrendingUp size={24} color={Colors.light.tint} />,
      trending: true,
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      description: 'Manage finances and achieve savings goals',
      icon: <Target size={24} color={Colors.light.tint} />,
      trending: true,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title} type="title">Explore</ThemedText>
            <ThemedText style={styles.subtitle}>Discover AI coaches from the community</ThemedText>
          </ThemedView>

          {/* Search Bar */}
          <ThemedView style={styles.searchContainer}>
            <Search size={20} color="#a8a29e" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coaches..."
              placeholderTextColor="#a8a29e"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </ThemedView>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.name;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Icon
                    size={16}
                    color={isSelected ? '#fff' : Colors.light.tint}
                  />
                  <ThemedText
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected
                    ]}
                  >
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Trending Section */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <TrendingUp size={20} color={Colors.light.tint} />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Trending Now
              </ThemedText>
            </ThemedView>
            {trendingCoaches.map((coach) => (
              <TouchableOpacity
                key={coach.id}
                style={styles.trendingCard}
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: coach.id, name: coach.name } })}
              >
                <View style={styles.trendingIcon}>
                  {coach.icon}
                </View>
                <View style={styles.trendingInfo}>
                  <ThemedText style={styles.trendingName}>{coach.name}</ThemedText>
                  <ThemedText style={styles.trendingDesc}>{coach.description}</ThemedText>
                </View>
                <View style={styles.trendingBadge}>
                  <TrendingUp size={14} color="#fff" />
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {/* Featured Coaches */}
          <ThemedView style={styles.section}>
            <ThemedView style={styles.sectionHeader}>
              <Sparkles size={20} color={Colors.light.tint} />
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Featured Coaches
              </ThemedText>
            </ThemedView>
            {featuredCoaches.map((coach) => (
              <TouchableOpacity
                key={coach.id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: coach.id, name: coach.name } })}
              >
                <View style={styles.featuredHeader}>
                  <View style={styles.featuredIcon}>
                    {coach.icon}
                  </View>
                  <View style={styles.featuredInfo}>
                    <ThemedText style={styles.featuredName}>{coach.name}</ThemedText>
                    <ThemedText style={styles.featuredCreator}>by {coach.creator}</ThemedText>
                  </View>
                </View>
                <ThemedText style={styles.featuredDesc}>{coach.description}</ThemedText>
                <View style={styles.featuredStats}>
                  <View style={styles.stat}>
                    <Users size={14} color="#a8a29e" />
                    <ThemedText style={styles.statText}>{coach.uses}</ThemedText>
                  </View>
                  <View style={styles.stat}>
                    <Sparkles size={14} color="#fbbf24" />
                    <ThemedText style={styles.statText}>{coach.rating}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ThemedView>

          {/* Coming Soon */}
          <ThemedView style={styles.comingSoon}>
            <Sparkles size={32} color={Colors.light.tint} />
            <ThemedText style={styles.comingSoonTitle}>More coaches coming soon!</ThemedText>
            <ThemedText style={styles.comingSoonDesc}>
              Share your custom coaches with the community
            </ThemedText>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f4',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter_400Regular',
    color: '#1c1917',
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e7e5e4',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Outfit_600SemiBold',
    color: Colors.light.tint,
  },
  categoryTextSelected: {
    color: '#fff',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: 'transparent',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
  },
  trendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fef3f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  trendingName: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 2,
  },
  trendingDesc: {
    fontSize: 14,
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  trendingBadge: {
    backgroundColor: Colors.light.tint,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fef3f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredInfo: {
    flex: 1,
    marginLeft: 12,
  },
  featuredName: {
    fontSize: 16,
    fontFamily: 'Outfit_600SemiBold',
    marginBottom: 2,
  },
  featuredCreator: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'Inter_400Regular',
  },
  featuredDesc: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
    lineHeight: 20,
  },
  featuredStats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'Inter_500Medium',
  },
  comingSoon: {
    alignItems: 'center',
    padding: 32,
    marginHorizontal: 24,
    backgroundColor: '#fef3f2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderStyle: 'dashed',
  },
  comingSoonTitle: {
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
    marginTop: 12,
    marginBottom: 4,
  },
  comingSoonDesc: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
    fontFamily: 'Inter_400Regular',
  },
});
