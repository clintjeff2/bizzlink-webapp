// Mock data for messages page
// This file would be replaced with Firebase functionality in the future

// Define types for our data structures
export interface PresenceStatus {
  status: string;
  lastActive: Date;
  typingIn?: {
    conversationId: string;
    timestamp: Date;
  };
}

export interface Attachment {
  attachmentId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  thumbnailUrl?: string;
  duration?: number;
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface AudioMessage {
  duration: number;
  waveformData: number[];
  transcription?: string;
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  senderType: string;
  text: string;
  type: string;
  status: string;
  timestamp: Date;
  readBy: Record<string, Date>;
  deliveredTo: Record<string, Date>;
  attachments?: Attachment[];
  audioMessage?: AudioMessage;
  actions?: {
    actionId: string;
    actionType: string;
    label: string;
    value: string;
    style: string;
  }[];
  reactions?: Record<string, { userId: string; reaction: string; timestamp: Date; }[]>;
  // UI-specific properties
  sender: string;
  isOwn: boolean;
  avatar: string;
}

export interface Conversation {
  conversationId: string;
  clientId?: string;
  freelancerId?: string;
  adminId?: string;
  participants: string[];
  type: string;
  projectId?: string;
  proposalId?: string;
  contractId?: string;
  audienceType?: string;
  lastMessage: {
    text: string;
    preview: string;
    senderId: string;
    timestamp: Date;
    type: string;
  };
  unreadCount: Record<string, number>;
  pinned: boolean;
  isArchived: Record<string, boolean>;
  isMuted: Record<string, boolean>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  metrics?: {
    messageCount: number;
    mediaCount: number;
    responseTime: number;
  };
  callHistory?: {
    callId: string;
    initiator: string;
    type: string;
    participants: string[];
    startTime: Date;
    endTime: Date;
    duration: number;
    status: string;
  }[];
  // UI-specific properties
  name: string;
  avatar: string;
  project: string;
  role: string;
}

// Mock data based on Firebase schema
export const mockPresence: Record<string, PresenceStatus> = {
  "user1": { 
    status: "online", 
    lastActive: new Date(), 
    typingIn: { conversationId: "conv1", timestamp: new Date() } 
  },
  "user2": { 
    status: "away", 
    lastActive: new Date(Date.now() - 1000 * 60 * 15)  // 15 minutes ago
  },
  "user3": { 
    status: "busy", 
    lastActive: new Date(Date.now() - 1000 * 60 * 5)  // 5 minutes ago
  },
  "user4": { 
    status: "offline", 
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2)  // 2 hours ago
  }
}

// Following the Firebase schema for conversations
export const conversations: Conversation[] = [
  {
    conversationId: "conv1",
    clientId: "client1",
    freelancerId: "user1",
    participants: ["client1", "user1"],
    type: "one_to_one",
    projectId: "proj1",
    proposalId: "prop1",
    lastMessage: {
      text: "I've completed the homepage design. Please review and let me know your feedback.",
      preview: "I've completed the homepage design...",
      senderId: "user1",
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
      type: "text"
    },
    unreadCount: { "client1": 2 },
    pinned: false,
    isArchived: {},
    isMuted: {},
    createdBy: "user1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 10),
    metrics: {
      messageCount: 42,
      mediaCount: 5,
      responseTime: 25 // minutes
    },
    // UI-specific properties
    name: "Sarah Chen",
    avatar: "/professional-woman-developer.png",
    project: "E-commerce Website Development",
    role: "freelancer",
  },
  {
    conversationId: "conv2",
    clientId: "client1",
    freelancerId: "user2",
    participants: ["client1", "user2"],
    type: "one_to_one",
    projectId: "proj2",
    lastMessage: {
      text: "The wireframes are ready for your review. I've incorporated all your feedback.",
      preview: "The wireframes are ready for your review...",
      senderId: "user2",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      type: "file"
    },
    unreadCount: { "client1": 0 },
    pinned: true,
    isArchived: {},
    isMuted: {},
    createdBy: "client1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), // 14 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    callHistory: [
      {
        callId: "call1",
        initiator: "user2",
        type: "video",
        participants: ["client1", "user2"],
        startTime: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
        endTime: new Date(Date.now() - 1000 * 60 * 60 * 2.5), // 2.5 hours ago
        duration: 30 * 60, // 30 minutes
        status: "completed"
      }
    ],
    // UI-specific properties
    name: "Marcus Johnson",
    avatar: "/professional-man-designer.png",
    project: "Mobile App UI/UX Design",
    role: "freelancer",
  },
  {
    conversationId: "conv3",
    clientId: "client1",
    freelancerId: "user3",
    participants: ["client1", "user3"],
    type: "one_to_one",
    projectId: "proj3",
    proposalId: "prop3",
    lastMessage: {
      text: "Thank you for choosing me for your SEO project. When can we schedule a kickoff call?",
      preview: "Thank you for choosing me for your SEO project...",
      senderId: "user3",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      type: "text"
    },
    unreadCount: { "client1": 1 },
    pinned: false,
    isArchived: {},
    isMuted: {},
    createdBy: "user3",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    // UI-specific properties
    name: "Elena Rodriguez",
    avatar: "/professional-woman-marketer.png",
    project: "SEO Optimization Campaign",
    role: "freelancer",
  },
  {
    conversationId: "conv4",
    clientId: "user4",
    freelancerId: "client1",
    participants: ["user4", "client1"],
    type: "one_to_one",
    projectId: "proj4",
    contractId: "contract1",
    lastMessage: {
      text: "Great work on the API integration. The payment system is working perfectly now.",
      preview: "Great work on the API integration...",
      senderId: "user4",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      type: "text"
    },
    unreadCount: { "client1": 0 },
    pinned: false,
    isArchived: { "client1": true },
    isMuted: {},
    createdBy: "client1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), // 30 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    // UI-specific properties
    name: "TechStart Inc.",
    avatar: "/business-client.png",
    project: "Backend Development",
    role: "client",
  },
  {
    conversationId: "conv5",
    adminId: "admin1",
    audienceType: "clients",
    participants: ["client1", "client2", "client3"],
    type: "announcement",
    lastMessage: {
      text: "Upcoming platform maintenance: We'll be performing scheduled maintenance on September 15th from 2-4 AM UTC.",
      preview: "Upcoming platform maintenance...",
      senderId: "admin1",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
      type: "system"
    },
    unreadCount: { "client1": 0 },
    pinned: false,
    isArchived: {},
    isMuted: { "client1": true },
    createdBy: "admin1",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    // UI-specific properties
    name: "Platform Announcements",
    avatar: "/placeholder-logo.png",
    project: "System Notification",
    role: "admin",
  },
]

// Mock messages based on Firebase schema
export const messages: Message[] = [
  {
    messageId: "msg1",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "Hi! I've completed the homepage design for your e-commerce website. I've focused on creating a clean, modern layout that highlights your products effectively.",
    type: "text",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    readBy: { "client1": new Date(Date.now() - 1000 * 60 * 55) }, // 55 min ago
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 58) }, // 58 min ago
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    messageId: "msg2",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "I've also implemented the responsive design so it looks great on all devices. Would you like to schedule a call to review it together?",
    type: "text",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 58), // 58 min ago
    readBy: { "client1": new Date(Date.now() - 1000 * 60 * 55) }, // 55 min ago
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 57) }, // 57 min ago
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    messageId: "msg3",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "",
    type: "image",
    attachments: [
      {
        attachmentId: "att1",
        fileName: "homepage-design.png",
        fileUrl: "/ecommerce-website-homepage.png",
        fileType: "image/png",
        fileSize: 1250000,
        thumbnailUrl: "/ecommerce-website-homepage.png",
        dimensions: { width: 1440, height: 900 }
      }
    ],
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 56), // 56 min ago
    readBy: { "client1": new Date(Date.now() - 1000 * 60 * 55) }, // 55 min ago
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 55.5) }, // 55.5 min ago
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    messageId: "msg4",
    conversationId: "conv1",
    senderId: "client1",
    senderType: "client",
    text: "This looks fantastic! I love the clean design and the way you've organized the product categories. The mobile version is perfect too.",
    type: "text",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    readBy: { "user1": new Date(Date.now() - 1000 * 60 * 44) }, // 44 min ago
    deliveredTo: { "user1": new Date(Date.now() - 1000 * 60 * 44.5) }, // 44.5 min ago
    reactions: {
      "thumbsup": [
        { userId: "user1", reaction: "👍", timestamp: new Date(Date.now() - 1000 * 60 * 43) }
      ]
    },
    // UI-specific properties
    sender: "You",
    isOwn: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    messageId: "msg5",
    conversationId: "conv1",
    senderId: "client1",
    senderType: "client",
    text: "Let's schedule a call for tomorrow at 3 PM to discuss the next phase. Can you also show me how the shopping cart functionality will work?",
    type: "text",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 44), // 44 min ago
    readBy: { "user1": new Date(Date.now() - 1000 * 60 * 43) }, // 43 min ago
    deliveredTo: { "user1": new Date(Date.now() - 1000 * 60 * 43.5) }, // 43.5 min ago
    // UI-specific properties
    sender: "You",
    isOwn: true,
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    messageId: "msg6",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "Perfect! I'll send you a calendar invite for tomorrow at 3 PM. I'll prepare a demo of the shopping cart functionality and show you the checkout process flow.",
    type: "text",
    status: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    readBy: { "client1": new Date(Date.now() - 1000 * 60 * 10) }, // 10 min ago
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 14.5) }, // 14.5 min ago
    actions: [
      {
        actionId: "action1",
        actionType: "button",
        label: "Add to Calendar",
        value: "calendar_add",
        style: "primary"
      }
    ],
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    messageId: "msg7",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "",
    type: "file",
    attachments: [
      {
        attachmentId: "att2",
        fileName: "e-commerce-development-proposal.pdf",
        fileUrl: "/e-commerce-development-proposal.pdf",
        fileType: "application/pdf",
        fileSize: 2450000
      }
    ],
    status: "delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 min ago
    readBy: {},
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 9.5) }, // 9.5 min ago
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  {
    messageId: "msg8",
    conversationId: "conv1",
    senderId: "user1",
    senderType: "freelancer",
    text: "Here's a quick voice note explaining some additional features I'm planning to include.",
    type: "audio",
    audioMessage: {
      duration: 45, // 45 seconds
      waveformData: [0.1, 0.3, 0.5, 0.8, 0.9, 0.7, 0.5, 0.3, 0.6, 0.8, 0.4, 0.2],
      transcription: "I'm thinking of adding an interactive product zoom feature and a quick view modal that will improve the user experience..."
    },
    status: "delivered",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 min ago
    readBy: {},
    deliveredTo: { "client1": new Date(Date.now() - 1000 * 60 * 4.5) }, // 4.5 min ago
    // UI-specific properties
    sender: "Sarah Chen",
    isOwn: false,
    avatar: "/professional-woman-developer.png",
  },
  // Messages for other conversations can be added here
]
