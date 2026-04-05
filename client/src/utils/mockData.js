export const mockVideos = [
    {
        _id: "bunny-1",
        title: "Build a YouTube Clone Dashboard in React",
        description:
            "A complete walkthrough for creating a modern video dashboard, feed layout, and responsive sidebar.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        duration: 596,
        views: 182340,
        createdAt: "2026-03-20T10:30:00.000Z",
        owner: {
            _id: "creator-1",
            fullName: "Code Studio",
            username: "codestudio",
            email: "hello@codestudio.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=CS",
        },
    },
    {
        _id: "sintel-2",
        title: "Node.js Backend for Video Uploads and Auth",
        description:
            "Set up JWT auth, file uploads, and Cloudinary storage for a creator platform backend.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
        duration: 888,
        views: 94210,
        createdAt: "2026-03-18T15:20:00.000Z",
        owner: {
            _id: "creator-2",
            fullName: "Server Side",
            username: "serverside",
            email: "team@serverside.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=SS",
        },
    },
    {
        _id: "elephant-3",
        title: "Tailwind UI Patterns for Streaming Apps",
        description:
            "Design cards, chips, and responsive layouts that feel polished on desktop and mobile.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
        duration: 653,
        views: 51200,
        createdAt: "2026-03-14T08:00:00.000Z",
        owner: {
            _id: "creator-3",
            fullName: "Pixel Craft",
            username: "pixelcraft",
            email: "design@pixelcraft.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PC",
        },
    },
    {
        _id: "forbiggerjoyrides-4",
        title: "Creator Analytics and Channel Management",
        description:
            "Track views, likes, uploads, and subscriber growth using a focused creator dashboard.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
        duration: 240,
        views: 22400,
        createdAt: "2026-03-10T12:45:00.000Z",
        owner: {
            _id: "creator-4",
            fullName: "Growth Lab",
            username: "growthlab",
            email: "contact@growthlab.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GL",
        },
    },
    {
        _id: "forbiggermeltdowns-5",
        title: "How Search and Recommendations Work",
        description:
            "Implement quick search, related videos, and saved collections with simple state management.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        duration: 150,
        views: 73120,
        createdAt: "2026-03-04T11:00:00.000Z",
        owner: {
            _id: "creator-5",
            fullName: "Product Path",
            username: "productpath",
            email: "team@productpath.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PP",
        },
    },
    {
        _id: "tears-6",
        title: "Deploy a Fullstack MERN App Cleanly",
        description:
            "A deployment checklist for frontend, backend, media files, and production environment variables.",
        videoFile:
            "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        thumbnail:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
        duration: 734,
        views: 128550,
        createdAt: "2026-02-28T17:10:00.000Z",
        owner: {
            _id: "creator-6",
            fullName: "Deploy Hub",
            username: "deployhub",
            email: "help@deployhub.dev",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=DH",
        },
    },
];

export const defaultUser = {
    fullName: "Guest Creator",
    username: "guestcreator",
    email: "guest@example.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=GC",
    coverImage:
        "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1400&q=80",
};
