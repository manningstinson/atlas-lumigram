#!/bin/bash

# Function to create or update a file with React component content
create_component_file() {
  local file=$1
  local component_name=$2
  
  # Create content for the component
  local content="import React from 'react';
import { View, Text } from 'react-native';

export default function ${component_name}() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>${component_name}</Text>
    </View>
  );
}
"
  
  # Write content to file
  echo "$content" > "$file"
  echo "Updated: $file"
}

# Function to create layout file
create_layout_file() {
  local file=$1
  local layout_type=$2
  
  local content=""
  
  if [ "$layout_type" = "root" ]; then
    content="import React from 'react';
import { Slot } from 'expo-router';

export default function RootLayout() {
  return <Slot />;
}
"
  elif [ "$layout_type" = "auth" ]; then
    content="import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name=\"login\" options={{ title: \"Login\" }} />
      <Stack.Screen name=\"register\" options={{ title: \"Register\" }} />
    </Stack>
  );
}
"
  elif [ "$layout_type" = "tabs" ]; then
    content="import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen 
        name=\"home\" 
        options={{ 
          title: \"Home\",
          tabBarIcon: ({ color }) => <Ionicons name=\"home\" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name=\"search\" 
        options={{ 
          title: \"Search\",
          tabBarIcon: ({ color }) => <Ionicons name=\"search\" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name=\"add-post\" 
        options={{ 
          title: \"Add Post\",
          tabBarIcon: ({ color }) => <Ionicons name=\"add-circle\" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name=\"favorites\" 
        options={{ 
          title: \"Favorites\",
          tabBarIcon: ({ color }) => <Ionicons name=\"heart\" size={24} color={color} /> 
        }} 
      />
      <Tabs.Screen 
        name=\"my-profile\" 
        options={{ 
          title: \"Profile\",
          tabBarIcon: ({ color }) => <Ionicons name=\"person\" size={24} color={color} /> 
        }} 
      />
    </Tabs>
  );
}
"
  fi
  
  echo "$content" > "$file"
  echo "Updated: $file"
}

# Create index file
cat > app/index.tsx << 'EOL'
import { Redirect } from 'expo-router';

export default function Index() {
  // For now, redirect to the login screen
  return <Redirect href="/(auth)/login" />;
}
EOL
echo "Updated: app/index.tsx"

# Create layout files
create_layout_file "app/_layout.tsx" "root"
create_layout_file "app/(auth)/_layout.tsx" "auth"
create_layout_file "app/(tabs)/_layout.tsx" "tabs"

# Create screen components
create_component_file "app/(auth)/login.tsx" "Login"
create_component_file "app/(auth)/register.tsx" "Register"
create_component_file "app/(tabs)/home.tsx" "Home"
create_component_file "app/(tabs)/search/index.tsx" "Search"
create_component_file "app/(tabs)/search/[username].tsx" "UserProfile"
create_component_file "app/(tabs)/add-post.tsx" "AddPost"
create_component_file "app/(tabs)/favorites.tsx" "Favorites"
create_component_file "app/(tabs)/my-profile/index.tsx" "MyProfile"
create_component_file "app/(tabs)/my-profile/edit.tsx" "EditProfile"

echo "Basic components created successfully!"