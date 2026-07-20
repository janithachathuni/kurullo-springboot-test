import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaTrash, FaEllipsisV } from 'react-icons/fa';
import profileimg from "../../assets/default_profile_pic.png";
import { getFeed, getPostsByUser, togglePostLike, getComments, addComment, toggleCommentLike, deletePost } from '../../utils/api';
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
import CreateReport from './CreateReport';

const Post = ({ userId }) => {
  const [currentUser, setCurrentUser] = useState(() =>
    JSON.parse(localStorage.getItem("user") || "null")
  );

  useEffect(() => {
    const syncUser = () => setCurrentUser(JSON.parse(localStorage.getItem("user") || "null"));
    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const isOwnBlog = userId && currentUser && String(currentUser.id) === String(userId);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentsLoaded, setCommentsLoaded] = useState({});

  const [replyInputs, setReplyInputs] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showComments, setShowComments] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showDeletePopup, setShowDeletePopup] = useState(null);
  const [showMenu, setShowMenu] = useState(null);
  const [showReport, setShowReport] = useState(false);

  const fetchPosts = async () => {
  setLoading(true);
  try {
    const page = userId
      ? await getPostsByUser(userId, 0, 10)
      : await getFeed(0, 10);
    setPosts(page.content || []);
  } catch (err) {
    console.error("Failed to fetch posts:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPosts();
}, [userId]);

useEffect(() => {
  window.addEventListener('post-created', fetchPosts);
  return () => window.removeEventListener('post-created', fetchPosts);
}, [userId]);

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likedByCurrentUser: !post.likedByCurrentUser,
          likesCount: post.likedByCurrentUser ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));

    try {
      await togglePostLike(postId);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            likedByCurrentUser: !post.likedByCurrentUser,
            likesCount: post.likedByCurrentUser ? post.likesCount - 1 : post.likesCount + 1
          };
        }
        return post;
      }));
    }
  };

  const loadComments = async (postId) => {
    try {
      const comments = await getComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: comments }));
      setCommentsLoaded(prev => ({ ...prev, [postId]: true }));
    } catch (err) {
      console.error("Failed to load comments:", err);
    }
  };

  const toggleComments = (postId) => {
    const opening = !showComments[postId];
    setShowComments(prev => ({ ...prev, [postId]: opening }));
    if (opening && !commentsLoaded[postId]) {
      loadComments(postId);
    }
  };

  const handleAddComment = async (postId) => {
    const input = commentInputs[postId];
    if (!input || !input.trim()) return;

    try {
      await addComment(postId, input);
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      await loadComments(postId);
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      ));
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleAddReply = async (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    const input = replyInputs[key];
    if (!input || !input.trim()) return;

    try {
      await addComment(postId, input, commentId);
      setReplyInputs(prev => ({ ...prev, [key]: '' }));
      setShowReplies(prev => ({ ...prev, [key]: true }));
      await loadComments(postId);
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      ));
    } catch (err) {
      console.error("Failed to add reply:", err);
    }
  };

  const handleAddNestedReply = async (postId, commentId, parentReplyId) => {
    const key = `${postId}-${commentId}-${parentReplyId}`;
    const input = replyInputs[key];
    if (!input || !input.trim()) return;

    try {
      await addComment(postId, input, parentReplyId);
      setReplyInputs(prev => ({ ...prev, [key]: '' }));
      await loadComments(postId);
      setPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, commentsCount: post.commentsCount + 1 } : post
      ));
    } catch (err) {
      console.error("Failed to add nested reply:", err);
    }
  };

  const handleCommentLike = async (postId, commentId) => {
    try {
      await toggleCommentLike(postId, commentId);
      await loadComments(postId);
    } catch (err) {
      console.error("Failed to toggle comment like:", err);
    }
  };

  const handleReplyLike = async (postId, commentId, replyId) => {
    try {
      await toggleCommentLike(postId, replyId);
      await loadComments(postId);
    } catch (err) {
      console.error("Failed to toggle reply like:", err);
    }
  };

  const handleDelete = (postId) => {
    setShowDeletePopup(postId);
    setShowMenu(null);
  };

  const handleReportComplete = () => {
    setShowReport(false);
    // Optionally show a success message
    alert('Report submitted successfully. We will review it shortly.');
  };

  const confirmDelete = async (postId) => {
    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setShowDeletePopup(null);
    }
  };

  const toggleReplies = (commentKey) => {
    setShowReplies(prev => ({ ...prev, [commentKey]: !prev[commentKey] }));
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

    return (
      <div className={`${depth === 1 ? 'ml-6' : 'ml-4'} mt-3`}>
        <div className="flex items-start gap-2">
          <img
            src={reply.author?.profilePic || profileimg}
            alt="Profile"
            className="w-6 h-6 rounded-full object-cover border border-[var(--border)]"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {reply.author?.displayName}
              </span>
              <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                @{reply.author?.username}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--text-primary)" }}>
              {reply.content}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <button
                onClick={() => handleReplyLike(postId, commentId, reply.id)}
                className={`flex items-center gap-1 text-xs transition ${
                  reply.likedByCurrentUser ? "text-red-500" : "text-[var(--text-secondary)]"
                }`}
              >
                {reply.likedByCurrentUser ? <FaHeart size={12} className="text-red-500" /> : <FaRegHeart size={12} />}
                {reply.likesCount > 0 && reply.likesCount}
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
                      placeholder={`Reply to @${reply.author?.username}...`}
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
              <div className={depth > 1 ? "ml-4" : ""}>
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

 if (loading) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-4 border-t-[var(--accent)] border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
}

if (posts.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center px-4">
      {isOwnBlog ? (
        <>
          <p className="mb-2" style={{ color: "var(--text-secondary)" }}>
            You haven't posted anything yet.
          </p>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('request-create-post'))}
            className="font-medium underline hover:opacity-80 transition"
            style={{ color: "var(--accent)" }}
          >
            Make your first post!
          </button>
        </>
      ) : (
        <p style={{ color: "var(--text-secondary)" }}>No posts yet.</p>
        
      )}
    </div>
  );
}

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const imageIndex = currentImageIndex[post.id] || 0;
        const totalImages = post.photos?.length || 0;
        const showCommentsSection = showComments[post.id] || false;
        const comments = commentsByPost[post.id] || [];
        const isOwnPost = currentUser && post.author?.userId === currentUser.id;

        return (
          <div
            key={post.id}
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)"
            }}
          >
            {/* Post Header */}
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center space-x-3">
                <img
                  src={post.author?.profilePic || profileimg}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border"
                  style={{ borderColor: "var(--border)" }}
                />
                <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {post.author?.displayName}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  @{post.author?.username}
                </span>
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  · {formatTimestamp(post.createdAt)}
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
                        Boost photo to admin
                      </button>
                      <button
                        onClick={() => setShowReport(true)}
                        className="w-full text-left px-4 py-2.5 text-sm transition hover:opacity-70"
                        style={{ color: "var(--text-primary)", backgroundColor: "transparent", borderTop: "1px solid var(--border)" }}
                      >
                        Report Post
                      </button>
                      {showReport && (
                        <CreateReport
                          postId={post.id}
                          onComplete={handleReportComplete}
                          onClose={() => setShowReport(false)}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Image Carousel - Full width, auto height */}
            {totalImages > 0 && (
              <div className="relative w-full" style={{ backgroundColor: "var(--bg-secondary)" }}>
                <div className="relative w-full">
                  <img
                    src={post.photos[imageIndex].imageUrl}
                    alt={`Post image ${imageIndex + 1}`}
                    className="w-full h-auto object-contain"
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
                        {post.photos.map((_, idx) => (
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

            {/* Content */}
            <div className="p-4">
              {post.description && (
                <p style={{ color: "var(--text-primary)" }} className="mb-3">{post.description}</p>
              )}

              {post.photos?.[imageIndex]?.birdTags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.photos[imageIndex].birdTags.map((tag, idx) => (
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
                <span>{post.commentsCount}</span>
              </button>

              <button
                onClick={() => handleLike(post.id)}
                className="flex items-center space-x-1 transition"
              >
                {post.likedByCurrentUser ? (
                  <FaHeart className="w-5 h-5 text-red-500" />
                ) : (
                  <FaRegHeart className="w-5 h-5" style={{ color: "var(--text-secondary)" }} />
                )}
                <span style={{ 
                  color: post.likedByCurrentUser ? "#ef4444" : "var(--text-secondary)",
                  fontWeight: post.likedByCurrentUser ? "bold" : "normal"
                }}>
                  {post.likesCount}
                </span>
              </button>

              {isOwnPost && (
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex items-center space-x-1 transition hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Comments Section */}
            {showCommentsSection && (
              <div className="border-t-2" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-secondary)" }}>
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

                <div className="max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <img
                            src={comment.author?.profilePic || profileimg}
                            alt="Commenter"
                            className="w-6 h-6 rounded-full border"
                            style={{ borderColor: "var(--border)" }}
                          />
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {comment.author?.displayName}
                          </span>
                          <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            @{comment.author?.username}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCommentLike(post.id, comment.id)}
                          className={`text-xs transition ${
                            comment.likedByCurrentUser ? "text-red-500" : "text-[var(--text-secondary)]"
                          }`}
                        >
                          {comment.likedByCurrentUser ? (
                            <FaHeart className="inline w-3 h-3 text-red-500" />
                          ) : (
                            <FaRegHeart className="inline w-3 h-3" />
                          )}
                          {comment.likesCount > 0 && ` ${comment.likesCount}`}
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
                        {comment.replies?.length > 0 && `${comment.replies.length} `}
                        Reply
                      </button>

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
          <div className="p-6 rounded-lg w-full max-w-md" style={{ backgroundColor: "var(--bg-card)" }}>
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