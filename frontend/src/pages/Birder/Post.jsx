import React, { useState, useRef } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaChevronLeft, FaChevronRight, FaEllipsisV } from 'react-icons/fa';
import profileimg from "../../assets/default_profile_pic.png";

const Post = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      userId: 'user1',
      displayName: 'John Doe',
      username: 'johndoe',
      profilePic: null,
      content: 'Just spotted a beautiful Blue Jay in my backyard! 🐦 #birdwatching #nature',
      images: [
        'https://picsum.photos/seed/bird1/600/400',
        'https://picsum.photos/seed/bird2/600/400',
        'https://picsum.photos/seed/bird3/600/400',
      ],
      tags: ['Blue Jay', 'Backyard'],
      likes: 12,
      liked: false,
      comments: [
        {
          id: 1,
          userId: 'user2',
          displayName: 'Jane Smith',
          username: 'janesmith',
          profilePic: null,
          content: 'Beautiful! Where did you spot it?',
          likes: 3,
          liked: false,
          replies: [
            {
              id: 1,
              userId: 'user1',
              displayName: 'John Doe',
              username: 'johndoe',
              profilePic: null,
              content: 'In my backyard actually! They come every morning.',
              likes: 1,
              liked: false,
              replies: [
                {
                  id: 1,
                  userId: 'user3',
                  displayName: 'Alice Johnson',
                  username: 'alicej',
                  profilePic: null,
                  content: '@johndoe That\'s amazing! We only get sparrows here.',
                  likes: 2,
                  liked: false,
                  replies: []
                }
              ]
            },
            {
              id: 2,
              userId: 'user3',
              displayName: 'Alice Johnson',
              username: 'alicej',
              profilePic: null,
              content: 'Blue Jays are so stunning! Great shot!',
              likes: 0,
              liked: false,
              replies: []
            }
          ]
        },
        {
          id: 2,
          userId: 'user4',
          displayName: 'Bob Wilson',
          username: 'bobw',
          profilePic: null,
          content: 'We have a pair that visits our feeder too!',
          likes: 2,
          liked: false,
          replies: []
        }
      ],
      timestamp: '2 hours ago',
    },

    {
      id: 2,
      userId: 'user4',
      displayName: 'Bob Wilson',
      username: 'bobw',
      profilePic: null,
      content: 'We have a pair that visits our feeder too!',
      images: [
        'https://picsum.photos/seed/bird1/600/400',
        'https://picsum.photos/seed/bird2/600/400',
        'https://picsum.photos/seed/bird3/600/400',
      ],
      tags: ['Blue Jay', 'Backyard'],
      likes: 12,
      liked: false,
      comments: [
        {
          id: 1,
          userId: 'user2',
          displayName: 'Jane Smith',
          username: 'janesmith',
          profilePic: null,
          content: 'Beautiful! Where did you spot it?',
          likes: 3,
          liked: false,
          replies: [
            {
              id: 1,
              userId: 'user1',
              displayName: 'John Doe',
              username: 'johndoe',
              profilePic: null,
              content: 'In my backyard actually! They come every morning.',
              likes: 1,
              liked: false,
              replies: [
                {
                  id: 1,
                  userId: 'user3',
                  displayName: 'Alice Johnson',
                  username: 'alicej',
                  profilePic: null,
                  content: '@johndoe That\'s amazing! We only get sparrows here.',
                  likes: 2,
                  liked: false,
                  replies: []
                }
              ]
            },
            {
              id: 2,
              userId: 'user3',
              displayName: 'Alice Johnson',
              username: 'alicej',
              profilePic: null,
              content: 'Blue Jays are so stunning! Great shot!',
              likes: 0,
              liked: false,
              replies: []
            }
          ]
        },
        {
          id: 2,
          userId: 'user4',
          displayName: 'Bob Wilson',
          username: 'bobw',
          profilePic: null,
          content: 'We have a pair that visits our feeder too!',
          likes: 2,
          liked: false,
          replies: []
        }
      ],
      timestamp: '2 hours ago',
    }
  ]);

  const [replyInputs, setReplyInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [showMenu, setShowMenu] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"}`;
    } else {
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    }
  };

  const handleLike = (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  const handleCommentLike = (postId, commentId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                liked: !comment.liked,
                likes: comment.liked ? comment.likes - 1 : comment.likes + 1
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handleReplyLike = (postId, commentId, replyId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === replyId) {
                    return {
                      ...reply,
                      liked: !reply.liked,
                      likes: reply.liked ? reply.likes - 1 : reply.likes + 1
                    };
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));
  };

  const handleAddComment = (postId) => {
    const input = commentInputs[postId];
    if (!input || !input.trim()) return;

    const newComment = {
      id: Date.now(),
      userId: 'currentUser',
      displayName: 'You',
      username: 'currentuser',
      profilePic: null,
      content: input,
      likes: 0,
      liked: false,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const handleAddReply = (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    const input = replyInputs[key];
    if (!input || !input.trim()) return;

    const newReply = {
      id: Date.now(),
      userId: 'currentUser',
      displayName: 'You',
      username: 'currentuser',
      profilePic: null,
      content: input,
      likes: 0,
      liked: false,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...comment.replies, newReply]
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));

    setReplyInputs(prev => ({ ...prev, [key]: '' }));
    setShowReplies(prev => ({ ...prev, [`${postId}-${commentId}`]: true }));
  };

  const handleAddNestedReply = (postId, commentId, parentReplyId) => {
    const key = `${postId}-${commentId}-${parentReplyId}`;
    const input = replyInputs[key];
    if (!input || !input.trim()) return;

    let parentUsername = '';
    setPosts(prev => {
      const post = prev.find(p => p.id === postId);
      const comment = post?.comments.find(c => c.id === commentId);
      const parentReply = comment?.replies.find(r => r.id === parentReplyId);
      parentUsername = parentReply?.username || '';
      return prev;
    });

    const newReply = {
      id: Date.now(),
      userId: 'currentUser',
      displayName: 'You',
      username: 'currentuser',
      profilePic: null,
      content: `@${parentUsername} ${input}`,
      likes: 0,
      liked: false,
      replies: []
    };

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: comment.replies.map(reply => {
                  if (reply.id === parentReplyId) {
                    return {
                      ...reply,
                      replies: [...reply.replies, newReply]
                    };
                  }
                  return reply;
                })
              };
            }
            return comment;
          })
        };
      }
      return post;
    }));

    setReplyInputs(prev => ({ ...prev, [key]: '' }));
  };

  const handleDelete = (postId) => {
    setShowDeletePopup(postId);
    setShowMenu(null);
  };

  const confirmDelete = (postId) => {
    setPosts(prev => prev.filter(post => post.id !== postId));
    setShowDeletePopup(null);
  };

  const toggleReplies = (commentKey) => {
    setShowReplies(prev => ({
      ...prev,
      [commentKey]: !prev[commentKey]
    }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleMenu = (postId) => {
    setShowMenu(prev => prev === postId ? null : postId);
  };

  const nextImage = (postId, total) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1 < total ? (prev[postId] || 0) + 1 : 0
    }));
  };

  const prevImage = (postId, total) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [postId]: (prev[postId] || 0) - 1 >= 0 ? (prev[postId] || 0) - 1 : total - 1
    }));
  };

  const ReplyComponent = ({ reply, postId, commentId, depth = 1 }) => {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const replyKey = `${postId}-${commentId}-${reply.id}`;

    if (depth > 2) {
      return (
        <div className="ml-6 mt-3">
          <div className="flex items-start gap-2">
            <img 
              src={reply.profilePic || profileimg} 
              alt="Profile" 
              className="w-6 h-6 rounded-full object-cover border border-[var(--border)]"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                  {reply.displayName}
                </span>
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  @{reply.username}
                </span>
              </div>
              <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                {reply.content}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <button 
                  onClick={() => handleReplyLike(postId, commentId, reply.id)}
                  className={`flex items-center gap-1 text-xs transition ${
                    reply.liked ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {reply.liked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                  {reply.likes > 0 && reply.likes}
                </button>
                <button 
                  onClick={() => setShowReplyInput(!showReplyInput)}
                  className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition"
                >
                  Reply
                </button>
              </div>
              {showReplyInput && (
                <div className="mt-2">
                  <div className="flex items-start gap-2">
                    <img 
                      src={profileimg} 
                      alt="You" 
                      className="w-6 h-6 rounded-full object-cover border border-[var(--border)]"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder={`Reply to @${reply.username}...`}
                        value={replyInputs[replyKey] || ''}
                        onChange={(e) => setReplyInputs(prev => ({ ...prev, [replyKey]: e.target.value }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddNestedReply(postId, commentId, reply.id);
                            setShowReplyInput(false);
                          }
                        }}
                        className="w-full border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        style={{ 
                          borderColor: "var(--border)",
                          backgroundColor: "var(--bg-primary)", 
                          color: "var(--text-primary)"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {reply.replies && reply.replies.length > 0 && (
                <div className="ml-4">
                  {reply.replies.map(nestedReply => (
                    <ReplyComponent 
                      key={nestedReply.id} 
                      reply={nestedReply} 
                      postId={postId} 
                      commentId={commentId}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className={`${depth === 1 ? 'ml-6' : 'ml-4'} mt-3`}>
        <div className="flex items-start gap-2">
          <img 
            src={reply.profilePic || profileimg} 
            alt="Profile" 
            className="w-6 h-6 rounded-full object-cover border border-[var(--border)]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {reply.displayName}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                @{reply.username}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {reply.content}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <button 
                onClick={() => handleReplyLike(postId, commentId, reply.id)}
                className={`flex items-center gap-1 text-xs transition ${
                  reply.liked ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {reply.liked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                {reply.likes > 0 && reply.likes}
              </button>
              <button 
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] transition"
              >
                Reply
              </button>
            </div>
            {showReplyInput && (
              <div className="mt-2">
                <div className="flex items-start gap-2">
                  <img 
                    src={profileimg} 
                    alt="You" 
                    className="w-6 h-6 rounded-full object-cover border border-[var(--border)]"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder={`Reply to @${reply.username}...`}
                      value={replyInputs[`${postId}-${commentId}-${reply.id}`] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [`${postId}-${commentId}-${reply.id}`]: e.target.value }))}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNestedReply(postId, commentId, reply.id);
                          setShowReplyInput(false);
                        }
                      }}
                      className="w-full border rounded px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[var(--accent)]"
                      style={{ 
                        borderColor: "var(--border)",
                        backgroundColor: "var(--bg-primary)", 
                        color: "var(--text-primary)"
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
            {reply.replies && reply.replies.length > 0 && (
              <div>
                {reply.replies.map(nestedReply => (
                  <ReplyComponent 
                    key={nestedReply.id} 
                    reply={nestedReply} 
                    postId={postId} 
                    commentId={commentId}
                    depth={depth + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const imageIndex = currentImageIndex[post.id] || 0;
        const totalImages = post.images?.length || 0;
        const showCommentsSection = showComments[post.id] || false;

        return (
          <div 
            key={post.id} 
            className="rounded-lg overflow-hidden"
            style={{ 
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)"
            }}
          >
            {/* Post Header - No gap to images */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center space-x-3">
                <img 
                  src={post.profilePic || profileimg} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full object-cover border" 
                  style={{ borderColor: "var(--border)" }}
                />
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {post.displayName}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  @{post.username}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  · {post.timestamp}
                </span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => toggleMenu(post.id)}
                  className="p-2 rounded-full transition hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FaEllipsisV size={18} />
                </button>
                
                {/* Dropdown Menu */}
                {showMenu === post.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(null)} />
                    <div 
                      className="absolute right-0 mt-1 w-48 rounded-xl shadow-lg z-20 overflow-hidden"
                      style={{ 
                        backgroundColor: "var(--bg-card)", 
                        border: "1px solid var(--border)"
                      }}
                    >
                      <button
                        onClick={() => setShowMenu(null)}
                        className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-70"
                        style={{ color: "var(--text-primary)", backgroundColor: "transparent" }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => setShowMenu(null)}
                        className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-70"
                        style={{ color: "var(--text-primary)", backgroundColor: "transparent", borderTop: "1px solid var(--border)" }}
                      >
                        Follow User
                      </button>
                      <button
                        onClick={() => setShowMenu(null)}
                        className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-70"
                        style={{ color: "var(--text-primary)", backgroundColor: "transparent", borderTop: "1px solid var(--border)" }}
                      >
                        Block User
                      </button>
                      <button
                        onClick={() => setShowMenu(null)}
                        className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-70"
                        style={{ color: "var(--text-primary)", backgroundColor: "transparent", borderTop: "1px solid var(--border)" }}
                      >
                        Report Post
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Carousel - Directly below header */}
            {totalImages > 0 && (
              <div className="relative" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="relative w-full">
                  <img 
                    src={post.images[imageIndex]} 
                    alt={`Post image ${imageIndex + 1}`}
                    className="w-full h-auto object-contain max-h-[400px]"
                  />
                  {totalImages > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(post.id, totalImages)}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => nextImage(post.id, totalImages)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/30 border border-white/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition"
                      >
                        ›
                      </button>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {post.images.map((_, idx) => (
                          <div 
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${
                              idx === imageIndex ? "bg-white" : "bg-white/50"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Content - Description and Tags below images */}
            <div className="p-4">
              {post.content && (
                <p style={{ color: "var(--text-primary)" }} className="mb-3">{post.content}</p>
              )}

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-sm underline font-medium hover:opacity-80 transition cursor-pointer"
                      style={{ color: "var(--accent)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Border */}
            <div className="border-t" style={{ borderColor: "var(--border)" }}></div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-6 p-4">
              <button 
                className="flex items-center space-x-1 transition hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <FaShare className="w-5 h-5" />
              </button>

              <button
                onClick={() => toggleComments(post.id)}
                className={`flex items-center space-x-1 transition ${
                  showCommentsSection ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                }`}
              >
                <FaComment className="w-5 h-5" />
                <span>{post.comments.length}</span>
              </button>

              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center space-x-1 transition ${
                  post.liked ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                }`}
              >
                {post.liked ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
                <span>{post.likes}</span>
              </button>

              {/* Delete button - moved to bottom */}
              <button 
                onClick={() => handleDelete(post.id)}
                className="flex items-center space-x-1 transition hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <FaTrash className="w-5 h-5" />
              </button>
            </div>

            {/* Comments Section - Only shown when toggled */}
            {showCommentsSection && (
              <div className="border-t-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
                {/* Comment Input */}
                <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex space-x-3">
                    <img
                      src={profileimg}
                      alt="Your profile"
                      className="w-8 h-8 rounded-full border" 
                      style={{ borderColor: "var(--border)" }}
                    />
                    <div className="flex-1">
                      <textarea
                        id={`comment-input-${post.id}`}
                        value={commentInputs[post.id] || ''}
                        onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                        placeholder="Write a comment..."
                        className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                        style={{ 
                          borderColor: "var(--border)",
                          backgroundColor: "var(--bg-primary)", 
                          color: "var(--text-primary)"
                        }}
                        rows="2"
                      />
                      <button
                        onClick={() => handleAddComment(post.id)}
                        className="mt-2 px-4 py-1 rounded transition text-sm"
                        style={{ 
                          backgroundColor: "var(--accent)", 
                          color: "var(--accent-text)",
                        }}
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                <div className="max-h-96 overflow-y-auto">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={comment.profilePic || profileimg}
                            alt="Commenter"
                            className="w-6 h-6 rounded-full border" 
                            style={{ borderColor: "var(--border)" }}
                          />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {comment.displayName}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            @{comment.username}
                          </span>
                        </div>
                        <button 
                          onClick={() => handleCommentLike(post.id, comment.id)}
                          className={`text-xs transition ${
                            comment.liked ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"
                          }`}
                        >
                          {comment.liked ? <FaHeart className="inline w-3 h-3" /> : <FaRegHeart className="inline w-3 h-3" />}
                          {comment.likes > 0 && ` ${comment.likes}`}
                        </button>
                      </div>

                      <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                        {comment.content}
                      </p>

                      <button
                        onClick={() => toggleReplies(`${post.id}-${comment.id}`)}
                        className="text-xs transition hover:opacity-70 mt-1"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {comment.replies.length > 0 && `${comment.replies.length} `}
                        Reply
                      </button>

                      {/* Reply Input */}
                      <div className="mt-2">
                        <div className="flex space-x-2">
                          <img
                            src={profileimg}
                            alt="Your profile"
                            className="w-6 h-6 rounded-full border" 
                            style={{ borderColor: "var(--border)" }}
                          />
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Write a reply..."
                              value={replyInputs[`${post.id}-${comment.id}`] || ''}
                              onChange={(e) => setReplyInputs(prev => ({ ...prev, [`${post.id}-${comment.id}`]: e.target.value }))}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleAddReply(post.id, comment.id);
                                }
                              }}
                              className="w-full p-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                              style={{ 
                                borderColor: "var(--border)",
                                backgroundColor: "var(--bg-primary)", 
                                color: "var(--text-primary)"
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {showReplies[`${post.id}-${comment.id}`] && comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                          {comment.replies.map((reply) => (
                            <ReplyComponent 
                              key={reply.id} 
                              reply={reply} 
                              postId={post.id} 
                              commentId={comment.id}
                              depth={1}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-card)" }}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
              Delete Post
            </h3>
            <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
              Are you sure you want to delete this post?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeletePopup(null)}
                className="px-4 py-2 border rounded-lg hover:opacity-80 transition"
                style={{ 
                  borderColor: "var(--border)",
                  color: "var(--text-primary)"
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(showDeletePopup)}
                className="px-4 py-2 text-white rounded-lg hover:opacity-80 transition"
                style={{ backgroundColor: "#dc2626" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;