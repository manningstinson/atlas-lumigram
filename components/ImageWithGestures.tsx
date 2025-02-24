import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface ImageWithGesturesProps {
  source: { uri: string };
  caption?: string;
}

const ImageWithGestures: React.FC<ImageWithGesturesProps> = ({ source, caption }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={source} 
        style={styles.image}
        resizeMode="cover"
      />
      {caption && <Text style={styles.caption}>{caption}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1, // This ensures the image is square
    borderRadius: 8,
  },
  caption: {
    marginTop: 8,
    fontSize: 14,
  }
});

export default ImageWithGestures;