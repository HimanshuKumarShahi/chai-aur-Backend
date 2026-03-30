import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import apiClient from '../api/client';
import CourseCard from '../components/CourseCard';

export default function CatalogScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetch all courses for the catalog
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

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#f97316" /></View>;
  
  if (error) return (
      <View style={styles.center}>
          <Text style={{color: 'white'}}>Failed to load catalog.</Text>
      </View>
  );

  return (
    <View style={styles.container}>
      {/* Catalog Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Full Catalog</Text>
        <Text style={styles.subtitle}>Browse all available courses</Text>
      </View>

      <FlatList
        data={courses}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CourseCard 
            course={item} 
            // This is the magic line that connects the Catalog to the Details page
            onPress={() => navigation.navigate('DETAILS', { course: item })} 
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#050505' },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#888',
    fontSize: 14,
    marginTop: 5,
  }
});