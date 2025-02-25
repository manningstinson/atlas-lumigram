import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { 
  TapGestureHandler, 
  LongPressGestureHandler, 
  State 
} from 'react-native-gesture-handler';
import { colors } from '@/styles/theme';

interface ImageWithGesturesProps {
  source: { uri: string };
  caption?: string;
  onDoubleTap?: () => void;
  onLongPress?: () => void;
}

const ImageWithGestures: React.FC<ImageWithGesturesProps> = ({ 
  source, 
  caption, 
  onDoubleTap,
  onLongPress 
}) => {
  const [showCaptionOverlay, setShowCaptionOverlay] = useState(false);

  const handleDoubleTap = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      onDoubleTap && onDoubleTap();
    }
  };

  const handleLongPress = (event: any) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      setShowCaptionOverlay(true);
      onLongPress && onLongPress();

      // Auto-hide caption overlay after 3 seconds
      setTimeout(() => setShowCaptionOverlay(false), 3000);
    }
  };

  return (
    <LongPressGestureHandler 
      onHandlerStateChange={handleLongPress}
      minDurationMs={500}
    >
      <TapGestureHandler 
        numberOfTaps={2} 
        onHandlerStateChange={handleDoubleTap}
      >
        <View style={styles.container}>
          <Image 
            source={source} 
            style={styles.image}
            resizeMode="cover"
          />
          {showCaptionOverlay && caption && (
            <View style={styles.captionOverlay}>
              <Text style={styles.captionText}>{caption}</Text>
            </View>
          )}
        </View>
      </TapGestureHandler>
    </LongPressGestureHandler>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 5,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1, // This ensures the image is square
    borderRadius: 8,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 17, // Adjusted to account for container padding
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  captionText: {
    color: colors.black,
    fontSize: 14,
  }
});

export default ImageWithGestures;