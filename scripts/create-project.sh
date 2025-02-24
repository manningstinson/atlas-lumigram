#!/bin/bash

# Create directories
mkdir -p app/\(auth\)
mkdir -p app/\(tabs\)/search
mkdir -p app/\(tabs\)/my-profile
mkdir -p components
mkdir -p context
mkdir -p types
mkdir -p utils
mkdir -p assets/images

# Function to create file only if it doesn't exist
create_file() {
  if [ ! -f "$1" ]; then
    touch "$1"
    echo "Created: $1"
  else
    echo "File already exists: $1"
  fi
}

# Create auth files
create_file app/\(auth\)/login.tsx
create_file app/\(auth\)/register.tsx
create_file app/\(auth\)/_layout.tsx

# Create tabs files
create_file app/\(tabs\)/home.tsx
create_file app/\(tabs\)/search/index.tsx
create_file app/\(tabs\)/search/\[username\].tsx
create_file app/\(tabs\)/add-post.tsx
create_file app/\(tabs\)/favorites.tsx
create_file app/\(tabs\)/my-profile/index.tsx
create_file app/\(tabs\)/my-profile/edit.tsx
create_file app/\(tabs\)/_layout.tsx

# Create root app files
create_file app/index.tsx
create_file app/_layout.tsx

# Create component files
create_file components/PostItem.tsx
create_file components/PostGrid.tsx
create_file components/UserListItem.tsx
create_file components/ImageWithGestures.tsx
create_file components/FormElements.tsx

# Create context files
create_file context/AuthContext.tsx
create_file context/PostContext.tsx

# Create type files
create_file types/index.ts

# Create utils files
create_file utils/placeholder.ts

echo "Project structure creation completed!"