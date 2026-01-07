
export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL: string;
  bio: string;
  verified: boolean;
  followers: string[];
  following: string[];
  bookmarks: string[];
  createdAt: any;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  userAvatar: string;
  content: string;
  imageURL?: string;
  likes: string[];
  commentCount: number;
  createdAt: any;
  isStory: boolean;
  expiresAt?: any;
  visibility: 'public' | 'followers' | 'private';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: any;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  createdAt: any;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: any;
  participantDetails?: { [key: string]: UserProfile };
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'request' | 'mention';
  fromUserId: string;
  fromUsername: string;
  read: boolean;
  createdAt: any;
  postId?: string;
}
