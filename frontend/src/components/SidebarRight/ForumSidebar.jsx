import React, { useState } from "react";
import { FaSearch, FaArrowUp, FaArrowDown, FaRegComment } from "react-icons/fa";
import { FiShare2 } from "react-icons/fi";

const searchTopics = [
  { id: 1, name: "Bird Identification", count: 245 },
  { id: 2, name: "Bird Photography", count: 189 },
  { id: 3, name: "Birdwatching Tips", count: 132 },
  { id: 4, name: "Birding Equipment", count: 76 },
];

const initialDiscussions = [
  {
    id: 1,
    title: "What type of Eagle is this?",
    author: "EagleWatcher",
    replies: 42,
    upvotes: 156,
    downvotes: 5,
    topic: "Bird Identification",
    timestamp: "3 hours ago",
  },
  {
    id: 2,
    title: "Best locations for birdwatching",
    author: "BirdLover",
    replies: 28,
    upvotes: 112,
    downvotes: 3,
    topic: "Bird Photography",
    timestamp: "5 hours ago",
  },
  {
    id: 3,
    title: "Unusual crow behavior - should I be concerned?",
    author: "UrbanBirdObserver",
    replies: 35,
    upvotes: 98,
    downvotes: 7,
    topic: "Birdwatching Tips",
    timestamp: "1 day ago",
  },
];

const ForumSidebar = () => {
  const [discussions, setDiscussions] = useState(initialDiscussions);

  const handleVote = (id, type) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              upvotes: type === "up" ? d.upvotes + 1 : d.upvotes,
              downvotes: type === "down" ? d.downvotes + 1 : d.downvotes,
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <FaSearch
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          type="text"
          placeholder="Search topics..."
          className="w-full py-2.5 pl-10 pr-4 rounded-full text-sm outline-none transition-shadow focus:ring-2"
          style={{
            backgroundColor: "var(--bg-secondary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        />
      </div>

      {/* Search Topics */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Search Topics
        </h3>
        <div className="space-y-2">
          {searchTopics.map((topic) => (
            <div
              key={topic.id}
              className="flex justify-between items-center p-2 rounded-lg cursor-pointer transition-colors hover:brightness-95"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {topic.name}
              </span>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
              >
                {topic.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Discussions */}
      <section>
        <h3
          className="text-xs font-semibold uppercase tracking-wide mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Popular Discussions
        </h3>
        <div className="space-y-3">
          {discussions.map((discussion) => (
            <div
              key={discussion.id}
              className="p-3 rounded-lg"
              style={{ backgroundColor: "var(--bg-secondary)" }}
            >
              <div className="flex justify-between">
                <div className="flex-1 min-w-0">
                  <h4
                    className="font-medium text-sm truncate hover:underline cursor-pointer"
                    style={{ color: "var(--accent)" }}
                  >
                    {discussion.title}
                  </h4>
                  <div
                    className="flex items-center mt-1 text-xs"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>by {discussion.author}</span>
                    <span className="mx-1">•</span>
                    <span>{discussion.timestamp}</span>
                  </div>
                  <div className="mt-2">
                    <span
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{ backgroundColor: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    >
                      {discussion.topic}
                    </span>
                  </div>
                </div>

                {/* Voting */}
                <div className="flex flex-col items-center ml-2 shrink-0">
                  <button
                    onClick={() => handleVote(discussion.id, "up")}
                    className="p-1 transition-colors hover:text-green-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <FaArrowUp size={12} />
                  </button>
                  <span
                    className="my-1 text-xs font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {discussion.upvotes - discussion.downvotes}
                  </span>
                  <button
                    onClick={() => handleVote(discussion.id, "down")}
                    className="p-1 transition-colors hover:text-red-500"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <FaArrowDown size={12} />
                  </button>
                </div>
              </div>

              <div
                className="flex items-center justify-between mt-2 pt-2 text-xs"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <div className="flex items-center" style={{ color: "var(--text-secondary)" }}>
                  <FaRegComment className="mr-1" size={11} />
                  <span>{discussion.replies} replies</span>
                </div>
                <button
                  className="flex items-center transition-colors"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FiShare2 className="mr-1" size={11} />
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ForumSidebar;