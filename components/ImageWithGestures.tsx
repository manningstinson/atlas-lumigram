import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, Alert } from 'react-native';
import { 
  TapGestureHandler, 
  LongPressGestureHandler, 
  State 
} from 'react-native-gesture-handler';

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
          {caption && !showCaptionOverlay && (
            <Text style={styles.caption}>{caption}</Text>
          )}
          {showCaptionOverlay && caption && (
            <View style={styles.captionOverlay}>
              <Text style={styles.overlayText}>{caption}</Text>
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
  caption: {
    marginTop: 8,
    fontSize: 14,
  },
  captionOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
  },
  overlayText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  }
});

export default ImageWithGestures;