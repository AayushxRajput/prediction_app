import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Video } from 'expo-av';
import { StatusBar } from 'expo-status-bar';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);

  const videoRef = useRef(null);

  const question = "What happened in the video?";
  const options = ["Catch", "Six", "Out", "Run"];
  const correctAnswer = "Out"; // Define the correct answer

  useEffect(() => {
    // Timer to show options after 10 seconds
    const timer = setTimeout(() => {
      setShowOptions(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    setShowSubmit(true);
  };

  const handleSubmit = () => {
    setShowSubmit(false);
    if (videoRef.current) {
      videoRef.current.playAsync(); // Replay video
    }
    setVideoFinished(false); // Reset video finish state
  };

  const handlePlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      setVideoFinished(true);
    }
  };

  return (
    <View style={styles.container}>
      {/* Video in the upper half */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={require('../assets/cricket_video.mp4')} // Local video from assets
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay
          isLooping={false}
          style={styles.video}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
          useNativeControls={false} // Disable controls
        />
      </View>

      {/* Question and options in the lower half */}
      <View style={styles.questionContainer}>
        <Text style={styles.question}>{question}</Text>

        {showOptions && options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === option && styles.selectedOptionButton
            ]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showSubmit && selectedOption && (
          <Button
            title="Submit"
            onPress={handleSubmit}
          />
        )}

        {videoFinished && selectedOption && (
          <Text style={styles.resultText}>
            {selectedOption === correctAnswer ? "Correct!" : "Incorrect. The correct answer is: " + correctAnswer}
          </Text>
        )}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  questionContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  selectedOptionButton: {
    backgroundColor: '#dcdcdc',
  },
  optionText: {
    fontSize: 16,
  },
  resultText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
