// Centralized user utilities for consistent avatar handling

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400&h=400&fit=crop";

export interface UserData {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  bio?: string;
  tokens?: number;
  isPremium?: boolean;
}

/**
 * Get user from localStorage with normalized avatar
 */
export function getUserFromStorage(): UserData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    const userData: UserData = JSON.parse(userStr);
    
    // Ensure avatar has a valid URL - use the exact avatar from storage or default
    if (!userData.avatar || userData.avatar.trim() === "") {
      userData.avatar = DEFAULT_AVATAR;
    }
    
    return userData;
  } catch (error) {
    console.error("Error parsing user data from storage:", error);
    return null;
  }
}

/**
 * Update user in localStorage and ensure avatar consistency
 */
export function updateUserInStorage(userData: UserData): void {
  if (typeof window === "undefined") return;
  
  try {
    // Ensure avatar is valid
    if (!userData.avatar || userData.avatar.trim() === "") {
      userData.avatar = DEFAULT_AVATAR;
    }
    
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Dispatch event to update all components
    window.dispatchEvent(new Event('userUpdated'));
    
    // Also trigger storage event for cross-tab sync
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'user',
      newValue: JSON.stringify(userData),
    }));
  } catch (error) {
    console.error("Error updating user in storage:", error);
  }
}

/**
 * Get avatar URL with fallback
 */
export function getAvatarUrl(user: UserData | null | undefined): string {
  if (!user || !user.avatar || user.avatar.trim() === "") {
    return DEFAULT_AVATAR;
  }
  return user.avatar;
}

