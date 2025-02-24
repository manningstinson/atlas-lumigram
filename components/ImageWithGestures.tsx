// components/ImageWithGestures.tsx
import React, { useState } from 'react';
import { 
  Image, 
  Alert, 
  StyleSheet, 
  View, 
  Text, 
  Dimensions,
  ImageSourcePropType 
} from 'react-native';
import { 
  GestureHandlerRootView, 
  GestureDetector, 
  Gesture 
} from 'react-native-gesture-handler';

interface ImageWithGesturesProps {
  source: ImageSourcePropType;
  caption: string;
}

const { width } = Dimensions.get('window');

export default function ImageWithGestures({ source, caption }: ImageWithGesturesProps) {
  const [showCaption, setShowCaption] = useState(false);
  
  // Single tap gesture
  const singleTap = Gesture.Tap().onEnd(() => {
    console.log('Single tap detected');
  });
  
  // Double tap gesture
  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      Alert.alert('Double Tap', 'Image double-tapped!');
    });
  
  // Long press gesture
  const longPress = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      setShowCaption(true);
    })
    .onEnd(() => {
      setShowCaption(false);
    });
  
  // Compose gestures
  const gesture = Gesture.Exclusive(
    doubleTap,
    Gesture.Exclusive(longPress, singleTap)
  );
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View>
          <Image 
            source={source} 
            style={styles.image} 
            resizeMode="cover"
          />
          {showCaption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{caption}</Text>
            </View>
          )}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  image: {
    width: width,
    height: width,
    borderRadius: 8,
  },
  captionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  captionText: {
    color: 'white',
    fontSize: 16,
  }
});