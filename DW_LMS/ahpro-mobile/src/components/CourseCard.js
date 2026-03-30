import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, User, ArrowUpRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CourseCard({ course, onPress }) {
    if (!course) return null;

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.card}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: course.thumbnail || 'https://via.placeholder.com/300' }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                />

                <View style={styles.badge}>
                    <Text style={styles.badgeText}>AD FREE</Text>
                </View>

                <View style={styles.playButton}>
                    <Play fill="black" size={14} color="black" />
                </View>
            </View>

            <View style={styles.content}>
                <View style={styles.meta}>
                    <User size={12} color="#888" />
                    <Text style={styles.instructor}>{course.instructor || "EXPERT"}</Text>
                </View>

                <Text style={styles.title} numberOfLines={1}>
                    {course.title?.toUpperCase() || "UNTITLED COURSE"}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>START LEARNING</Text>
                    <ArrowUpRight size={14} color="#f97316" />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        marginBottom: 20,
        overflow: 'hidden'
    },
    imageContainer: {
        height: 180,
        backgroundColor: '#111',
        position: 'relative'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    badge: {
        position: 'absolute',
        top: 15,
        left: 15,
        backgroundColor: '#f97316',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold'
    },
    playButton: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'white',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 2 // optically center the play icon
    },
    content: {
        padding: 16
    },
    meta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8
    },
    instructor: {
        color: '#888',
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    title: {
        color: 'white',
        fontSize: 23,
        fontWeight: 'bold'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#2A2A2A'
    },
    footerText: {
        color: '#aaa',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 1
    }
});