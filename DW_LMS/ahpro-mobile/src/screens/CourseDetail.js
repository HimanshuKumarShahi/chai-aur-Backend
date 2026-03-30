import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { PlayCircle, Clock, Award, FileText } from 'lucide-react-native';

export default function CourseDetail({ route }) {
  const { course } = route.params;
  const [activeTab, setActiveTab] = useState('About');

  const getMobileEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    if (!videoId) return "";
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&controls=1&playsinline=1`;
  };

  return (
    <View style={styles.container}>
      {/* Video Player */}
      <View style={styles.videoWrapper}>
        <WebView 
          source={{ uri: getMobileEmbedUrl(course.videoUrl) }} 
          style={styles.video}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsFullscreenVideo={true}
          allowsInlineMediaPlayback={true} 
        />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Title & Meta Info */}
        <View style={styles.headerArea}>
          <Text style={styles.title}>{course.title || "Untitled Lecture"}</Text>
          <Text style={styles.instructor}>By {course.instructor || "Expert Instructor"}</Text>
          
          <View style={styles.quickStats}>
            <View style={styles.statBadge}><Clock size={14} color="#aaa" /><Text style={styles.statText}>2h 45m</Text></View>
            <View style={styles.statBadge}><FileText size={14} color="#aaa" /><Text style={styles.statText}>12 Lessons</Text></View>
            <View style={styles.statBadge}><Award size={14} color="#aaa" /><Text style={styles.statText}>Certificate</Text></View>
          </View>
        </View>

        {/* Custom Tab Navigation */}
        <View style={styles.tabContainer}>
          {['About', 'Lessons', 'Reviews'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        {activeTab === 'About' && (
          <View style={styles.tabSection}>
            <Text style={styles.sectionTitle}>Course Description</Text>
            <Text style={styles.description}>{course.description || "No description provided for this course. Start watching the video above to learn more."}</Text>
          </View>
        )}

        {activeTab === 'Lessons' && (
          <View style={styles.tabSection}>
            <Text style={styles.sectionTitle}>Curriculum</Text>
            {/* Mock Curriculum List */}
            {[1, 2, 3, 4].map((item) => (
              <TouchableOpacity key={item} style={styles.lessonRow}>
                <View style={styles.lessonIcon}><PlayCircle size={20} color={item === 1 ? "#f97316" : "#666"} /></View>
                <View style={styles.lessonDetails}>
                  <Text style={[styles.lessonTitle, item === 1 && {color: '#f97316'}]}>Module {item}: Introduction</Text>
                  <Text style={styles.lessonTime}>15:00 mins</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#050505' },
  videoWrapper: { width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000' },
  video: { flex: 1 },
  content: { padding: 20 },
  
  headerArea: { marginBottom: 20 },
  title: { color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 8, lineHeight: 32 },
  instructor: { color: '#f97316', fontSize: 14, fontWeight: '600', marginBottom: 15 },
  
  quickStats: { flexDirection: 'row', gap: 15 },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#111', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  statText: { color: '#aaa', fontSize: 12, fontWeight: '600' },

  tabContainer: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#222', marginBottom: 20 },
  tabButton: { paddingVertical: 12, marginRight: 20 },
  activeTabButton: { borderBottomWidth: 2, borderBottomColor: '#f97316' },
  tabText: { color: '#666', fontSize: 16, fontWeight: '600' },
  activeTabText: { color: 'white' },

  tabSection: { paddingBottom: 20 },
  sectionTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { color: '#E0E0E0', fontSize: 15, lineHeight: 24 },

  lessonRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#1A1A1A' },
  lessonIcon: { marginRight: 15 },
  lessonDetails: { flex: 1 },
  lessonTitle: { color: 'white', fontSize: 15, fontWeight: '600', marginBottom: 4 },
  lessonTime: { color: '#666', fontSize: 12 }
});