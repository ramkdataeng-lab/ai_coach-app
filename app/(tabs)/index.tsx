
import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CoachCard } from '@/components/coach-card';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Sparkles, Activity, BrainCircuit, Plus, Trash2, Dumbbell, Briefcase, Brain, Heart, DollarSign } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { PersistenceService } from '@/utils/persistence';
import { CoachIcon } from '@/components/coach-icon';
import { AppHeader } from '@/components/app-header';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const colorScheme = 'light'; // Forced light mode
  const [userName, setUserName] = React.useState('Guest');
  const [customCoaches, setCustomCoaches] = React.useState<any[]>([]);

  // Check for context and load coaches on every focus
  const loadData = async () => {
    // User Context
    const context = await PersistenceService.getUserContext();
    if (!context) {
      setTimeout(() => {
        router.replace('/context');
      }, 100);
    } else if (context.name) {
      setUserName(context.name);
    }

    // Load Custom Coaches
    const customs = await PersistenceService.getCustomCoaches();
    setCustomCoaches(customs.map(c => ({
      id: c.id,
      name: c.text,
      description: c.subtitle,
      icon: <CoachIcon name={c.icon || 'Sparkles'} size={24} color={Colors.light.tint} />
    })));
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleDeleteCoach = (id: string, name: string) => {
    Alert.alert(
      "Delete Coach",
      `Are you sure you want to delete "${name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            // Optimistic Update
            setCustomCoaches(prev => prev.filter(c => c.id !== id));
            await PersistenceService.deleteCustomCoach(id);
            // loadData(); // No need to reload if state is updated
          }
        }
      ]
    );
  };

  const renderRightActions = (id: string, name: string) => {
    return (
      <View style={{ width: 80, marginBottom: 12, marginLeft: 12 }}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteCoach(id, name)}
          activeOpacity={0.6}
        >
          <Trash2 size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
    );
  };

  const defaultCoaches = [
    {
      id: '1',
      name: 'Fitness Coach',
      description: 'Personalized workout plans, nutrition guidance, and progress tracking.',
      icon: <Dumbbell size={24} color={Colors.light.tint} />,
    },
    {
      id: '2',
      name: 'Career Coach',
      description: 'Resume optimization, interview prep, and professional development.',
      icon: <Briefcase size={24} color={Colors.light.tint} />,
    },
    {
      id: '3',
      name: 'Mindfulness Coach',
      description: 'Stress management, meditation techniques, and mental wellness.',
      icon: <Brain size={24} color={Colors.light.tint} />,
    },
    {
      id: '4',
      name: 'Relationship Coach',
      description: 'Communication skills, conflict resolution, and healthy relationships.',
      icon: <Heart size={24} color={Colors.light.tint} />,
    },
    {
      id: '5',
      name: 'Finance Coach',
      description: 'Budgeting strategies, investment advice, and financial goal setting.',
      icon: <DollarSign size={24} color={Colors.light.tint} />,
    },
    {
      id: '6',
      name: 'Productivity Coach',
      description: 'Time management, goal setting, habit formation, and workflow optimization.',
      icon: <Activity size={24} color={Colors.light.tint} />,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <AppHeader style={{ marginBottom: 32 }}>
            <View>
              <ThemedText style={styles.greeting} type="subtitle">Good Morning,</ThemedText>
              <ThemedText style={styles.username} type="title">{userName}</ThemedText>
            </View>
          </AppHeader>

          {customCoaches.length > 0 && (
            <>
              <ThemedView style={styles.sectionHeader}>
                <ThemedText type="defaultSemiBold">My Custom Coaches</ThemedText>
              </ThemedView>

              {customCoaches.map((coach) => (
                <Swipeable
                  key={coach.id}
                  renderRightActions={() => renderRightActions(coach.id, coach.name)}
                >
                  <CoachCard
                    id={coach.id}
                    name={coach.name}
                    description={coach.description}
                    icon={coach.icon}
                    onPress={() => router.push({ pathname: '/chat/[id]', params: { id: coach.id, name: coach.name } })}
                  />
                </Swipeable>
              ))}
              <View style={{ height: 24 }} />
            </>
          )}

          <ThemedView style={styles.sectionHeader}>
            <ThemedText type="defaultSemiBold">Featured Coaches</ThemedText>
          </ThemedView>

          {defaultCoaches.map((coach) => (
            <CoachCard
              key={coach.id}
              id={coach.id}
              name={coach.name}
              description={coach.description}
              icon={coach.icon}
              onPress={() => router.push({ pathname: '/chat/[id]', params: { id: coach.id, name: coach.name } })}
            />
          ))}


        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create-coach')}
        >
          <Plus size={32} color="#fff" />
        </TouchableOpacity>

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
    padding: 24,
    paddingBottom: 100, // Space for FAB
  },
  header: {
    marginBottom: 32,
    backgroundColor: 'transparent',
  },
  greeting: {
    opacity: 0.6,
    marginBottom: 4,
  },
  username: {
    fontSize: 32,
    fontFamily: 'Outfit_700Bold',
  },
  sectionHeader: {
    marginBottom: 16,
    backgroundColor: 'transparent',
    fontFamily: 'Outfit_600SemiBold',
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#fee2e2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  }
});
