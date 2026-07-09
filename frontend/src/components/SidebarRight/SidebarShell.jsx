import React from "react";
import { useLocation } from "react-router-dom";
import DefaultSidebar from "./DefaultSidebar";
import ForumSidebar from "./ForumSidebar";

// Paths that get the forum-style sidebar (search topics + popular discussions)
const FORUM_PATHS = ["/forum", "/discussion"];

// Paths that get no right sidebar at all (e.g. full-width pages)
const HIDDEN_PATHS = [];

const SidebarShell = () => {
  const { pathname } = useLocation();

  if (HIDDEN_PATHS.some((path) => pathname.startsWith(path))) {
    return null;
  }

  const isForumPage = FORUM_PATHS.some((path) => pathname.startsWith(path));

  return (
    <div
      className="hidden lg:flex flex-col sticky top-0 h-screen shrink-0 w-[30%]"
      style={{ backgroundColor: "var(--bg-card)", borderLeft: "1px solid var(--border)" }}
    >
      <div className="flex-1 overflow-y-auto p-4">
        {isForumPage ? <ForumSidebar /> : <DefaultSidebar />}
      </div>
      <div className="p-4" style={{ borderTop: "1px solid var(--border)" }}>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          © 2025 Kurullo
        </p>
      </div>
    </div>
  );
};

export default SidebarShell;