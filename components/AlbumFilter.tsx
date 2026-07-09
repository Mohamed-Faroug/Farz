import { GREEN, TEXT_COLOR } from "@/constants/constants";
import { AlbumOption } from "@/hooks/useAlbums";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Props = {
  options: AlbumOption[];
  selectedAlbumId: string | null;
  onSelect: (albumId: string | null) => void;
};

const AlbumFilter = ({ options, selectedAlbumId, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {options.map((option) => {
          const isSelected = option.id === selectedAlbumId;
          return (
            <Pressable
              key={option.id ?? "all"}
              onPress={() => onSelect(option.id)}
              style={[
                styles.chip,
                isSelected ? styles.chipSelected : styles.chipDefault,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  isSelected ? styles.chipTextSelected : styles.chipTextDefault,
                ]}
              >
                {option.title}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default AlbumFilter;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
  },
  scrollContent: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
  },
  chipDefault: {
    backgroundColor: "white",
    borderColor: "black",
  },
  chipSelected: {
    backgroundColor: GREEN,
    borderColor: "black",
  },
  chipText: {
    fontFamily: "Goldman-Bold",
    fontSize: 13,
  },
  chipTextDefault: {
    color: TEXT_COLOR,
  },
  chipTextSelected: {
    color: "black",
  },
});
