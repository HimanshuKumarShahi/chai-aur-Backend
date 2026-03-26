import React from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const PRIMARY = "#F97316";

const CATEGORIES = ["All", "Coding", "Design", "Marketing", "Business", "Soft Skills"];

const COURSES = [
  {
    id: "1",
    title: "Advanced React Native Architecture",
    instructor: "Himanshu",
    category: "Development",
    rating: "4.9",
    students: "1.2k",
    price: "$49.99",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=500",
  },
  {
    id: "2",
    title: "Mastering UI/UX Principles",
    instructor: "Sarah Chen",
    category: "Design",
    rating: "4.8",
    students: "850",
    price: "Free",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?q=80&w=500",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#050505]">
      {/* 🔥 Proper Status Bar */}
      <StatusBar style="light" backgroundColor="#050505" />

      {/* HEADER */}
      <View className="px-6 pt-2 pb-4 flex-row justify-between items-center">
        <View>
          <View className="flex-row items-center">
            <Text className="text-orange-500 text-2xl font-black">DW</Text>
            <View className="w-1.5 h-1.5 bg-orange-500 rounded-full ml-1 mt-2" />
          </View>
          <Text className="text-gray-500 text-xs mt-1 tracking-widest">
            Classes Academy
          </Text>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="bg-zinc-900 p-2.5 rounded-full border border-zinc-800 mr-3">
            <Feather name="bell" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="border-2 border-orange-500 rounded-full p-0.5">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
              }}
              className="w-10 h-10 rounded-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* TEXT + SEARCH */}
        <View className="px-6 mt-2">
          <Text className="text-white text-3xl font-bold">
            Level up your{"\n"}
            <Text className="text-orange-500">knowledge</Text>
          </Text>

          <View className="bg-zinc-900 flex-row items-center px-5 py-4 rounded-2xl border border-zinc-800 mt-6">
            <Feather name="search" size={20} color="#9ca3af" />
            <TextInput
              placeholder="Search courses..."
              placeholderTextColor="#6b7280"
              className="flex-1 ml-3 text-white"
            />
            <TouchableOpacity className="bg-orange-500 p-2 rounded-lg">
              <Ionicons name="options-outline" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* HERO */}
        <View className="px-6 mt-8">
          <TouchableOpacity className="h-52 rounded-[30px] overflow-hidden">
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800",
              }}
              className="absolute w-full h-full"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.9)"]}
              className="flex-1 justify-end p-6"
            >
              <View className="bg-orange-500 px-3 py-1 rounded-full self-start mb-2">
                <Text className="text-white text-[10px] font-bold">
                  Bestseller
                </Text>
              </View>
              <Text className="text-white text-xl font-bold">
                Fullstack Mastery 2026
              </Text>
              <Text className="text-gray-400 text-sm">
                32+ Hours Content
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* CATEGORIES */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-8 pl-6">
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity
              key={i}
              className={`mr-3 px-6 py-3 rounded-xl ${
                i === 0 ? "bg-orange-500" : "bg-zinc-900 border border-zinc-800"
              }`}
            >
              <Text className={`${i === 0 ? "text-white" : "text-gray-500"} font-bold`}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* COURSES */}
        <View className="mt-8 px-6">
          <Text className="text-white text-xl font-bold mb-4">
            Popular Courses
          </Text>

          {COURSES.map((course) => (
            <TouchableOpacity
              key={course.id}
              className="bg-zinc-900 rounded-2xl p-3 mb-4 flex-row"
            >
              <Image
                source={{ uri: course.image }}
                className="w-24 h-24 rounded-xl"
              />

              <View className="flex-1 ml-4 justify-center">
                <View className="flex-row items-center mb-1">
                  <MaterialCommunityIcons name="star" size={14} color={PRIMARY} />
                  <Text className="text-gray-400 text-xs ml-1">
                    {course.rating} ({course.students})
                  </Text>
                </View>

                <Text className="text-white font-bold text-base" numberOfLines={2}>
                  {course.title}
                </Text>

                <View className="flex-row justify-between mt-2">
                  <Text className="text-orange-500 font-bold">
                    {course.price}
                  </Text>
                  <Text className="text-gray-500 text-xs">
                    {course.instructor}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* FLOATING NAV */}
      <View
        className="absolute left-6 right-6"
        style={{
          bottom: Platform.OS === "android" ? 20 : 30,
        }}
      >
        <View className="bg-zinc-900/95 flex-row justify-between items-center px-8 py-4 rounded-full border border-zinc-800">
          <Ionicons name="home" size={24} color={PRIMARY} />
          <Feather name="play-circle" size={24} color="#555" />

          <View className="bg-orange-500 p-4 rounded-full -mt-10 border-4 border-[#050505]">
            <Feather name="plus" size={22} color="white" />
          </View>

          <Feather name="bookmark" size={24} color="#555" />
          <Feather name="user" size={24} color="#555" />
        </View>
      </View>
    </SafeAreaView>
  );
}