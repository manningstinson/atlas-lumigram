import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Search: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput 
        placeholder="Search users..." 
        style={{ 
          borderWidth: 1, 
          borderColor: '#ddd', 
          padding: 10, 
          borderRadius: 8 
        }}
      />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Search Results</Text>
      </View>
    </View>
  );
};

export default Search;