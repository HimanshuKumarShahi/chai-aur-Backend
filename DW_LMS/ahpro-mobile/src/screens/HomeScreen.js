import React, { useEffect, useState } from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { Search, Bell } from 'lucide-react-native';
import apiClient from '../api/client';
import CourseCard from '../components/CourseCard';

const CATEGORIES = ['All', 'Development', 'Design', 'Business', 'Marketing', 'IT & Software'];

export default function HomeScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    apiClient.get('/course')
      .then(res => {
          setCourses(res.data?.courses || res.data || []); 
      })
      .catch(err => {
          console.log("Fetch Error:", err);
          setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // --- UI Components for the Header ---

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Top Bar: Greeting & Notifications */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greeting}>Hello, Learner 👋</Text>
          <Text style={styles.subGreeting}>Let's start learning!</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Bell size={22} color="white" />
          <View style={styles.badge} />
        </TouchableOpacity>
      </View>

      {/* 2. Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color="#888" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Search for courses, skills..."
          placeholderTextColor="#666"
        />
      </View>

      {/* 3. Categories List */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesWrapper}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.categoryChip, activeCategory === cat && styles.activeCategoryChip]}
            onPress={() => setActiveCategory(cat)}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.activeCategoryText]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 4. Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- Main Render ---

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#f97316" /></View>;
  
  if (error) return (
      <View style={styles.center}>
          <Text style={styles.errorText}>Failed to load courses. Please check your connection.</Text>
      </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        keyExtractor={(item, index) => item._id || index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            onPress={() => navigation.navigate('DETAILS', { course: item })} 
          />
        )}
        // Shows when the list is empty (but successfully fetched)
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No courses found in this category.</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#050505' 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#050505' 
  },
  listContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 60, // Adjust based on your device safe area / notch
    paddingBottom: 15,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
  },
  
  // Search Styles
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#222',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  
  // Category Styles
  categoriesWrapper: {
    marginBottom: 25,
    marginHorizontal: -20, // Negative margin to allow items to bleed off-screen
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#222',
  },
  activeCategoryChip: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  categoryText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  activeCategoryText: {
    color: '#000',
    fontWeight: 'bold',
  },

  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
  },

  // Utility Styles
  errorText: { color: 'white', fontSize: 16 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: '#666', fontSize: 14, fontStyle: 'italic' }
});