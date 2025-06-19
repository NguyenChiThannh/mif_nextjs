"use client";
import { MentionsInput, Mention } from "react-mentions";
import { useTranslations } from "next-intl";
import { movieApi } from "@/services/movieApi";
import { groupsApi } from "@/services/groupsApi";
import { useState, useEffect } from "react";

export default function MovieMentionInput({
  value,
  setMentions,
  cleanMentions,
  onChange,
  placeholder,
  enableDropZone = false,
  minHeight = 100,
}) {
  const t = useTranslations("Groups");
  const [movieSearchQuery, setMovieSearchQuery] = useState("");
  const [groupSearchQuery, setGroupSearchQuery] = useState("");
  const [movieSuggestions, setMovieSuggestions] = useState([]);
  const [groupSuggestions, setGroupSuggestions] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const { data: movieSearchResults, isLoading: isLoadingMovies } =
    movieApi.query.useSearchMoviesByTitle(0, 5, movieSearchQuery);

  const { data: groupSearchResults, isLoading: isLoadingGroups } =
    groupsApi.query.useSearchGroupByGroupName(groupSearchQuery);

  useEffect(() => {
    console.log("Movie Search Query:", movieSearchQuery);
    console.log("Movie Search Results:", movieSearchResults);
    if (movieSearchResults?.content) {
      setMovieSuggestions(movieSearchResults.content);
    }
  }, [movieSearchQuery, movieSearchResults]);

  useEffect(() => {
    console.log("Group Search Query:", groupSearchQuery);
    console.log("Group Search Results:", groupSearchResults);
    if (groupSearchResults?.content) {
      setGroupSuggestions(groupSearchResults.content);
    }
  }, [groupSearchQuery, groupSearchResults]);

  const handleChange = (event, markupText, plainText, mentionsParam) => {
    console.log("Current mentions param:", mentionsParam);

    if (setMentions !== undefined) {
        setMentions((prev) => {
        const newOnes = mentionsParam
          .filter((m) => !prev.some((p) => p.id === m.id))
          .map((m) => {
            // Cách lấy trigger: nhìn ký tự ngay trước vị trí m.index
            const triggerChar = markupText[m.index];
            const type = triggerChar === '@' ? 'movie' : triggerChar === '#' ? 'group' : 'unknown';

            return {
              id: m.id,
              name: m.display,
              type: type,
              count: 1,
            };
          });

        if (newOnes.length > 0) {
          const updated = cleanMentions([...prev, ...newOnes]);
          return updated;
        }

        // Nếu không có gì mới, giữ nguyên
        return prev;
      });
    }
    onChange(markupText);
  };

  const handleMovieSearch = (query) => {
    console.log("Handle Movie Search:", query);
    setMovieSearchQuery(query);
  };

  const handleGroupSearch = (query) => {
    console.log("Handle Group Search:", query);
    setGroupSearchQuery(query);
  };

  // Drop zone handlers
  const handleDragOver = (e) => {
    if (!enableDropZone) return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!enableDropZone) return;
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    if (!enableDropZone) return;
    e.preventDefault();
    setIsDragOver(false);

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
      console.log("Dropped data:", dragData);

      let mentionText = "";
      if (dragData.type === "movie") {
        mentionText = `@[${dragData.name}](${dragData.id})`;
      } else if (dragData.type === "group") {
        mentionText = `#[${dragData.name}](${dragData.id})`;
      }

      if (mentionText) {
        const newValue = value ? `${value} ${mentionText}` : mentionText;
        onChange(newValue);
      }
    } catch (error) {
      console.error("Error parsing drag data:", error);
    }
  };

  const renderMovieSuggestion = (
    entry,
    search,
    highlightedDisplay,
    index,
    focused
  ) => {
    console.log("Render Movie Suggestion:", {
      entry,
      search,
      highlightedDisplay,
      index,
      focused,
    });
    const movie = movieSuggestions.find((m) => m.id === entry.id);
    console.log("Found Movie:", movie);
    if (!movie) return null;

    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-150 ${
          focused ? "bg-blue-100" : "bg-white"
        }`}
        style={{
          minWidth: 220,
          boxShadow: focused ? "0 2px 8px rgba(0,0,0,0.08)" : undefined,
        }}
      >
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-10 h-14 object-cover rounded shadow border border-gray-200 bg-gray-50"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/default-movie.png";
          }}
        />
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-base text-gray-800">
            {movie.title}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(movie.releaseDate).getFullYear()}
          </span>
        </div>
      </div>
    );
  };

  const renderGroupSuggestion = (
    entry,
    search,
    highlightedDisplay,
    index,
    focused
  ) => {
    console.log("Render Group Suggestion:", {
      entry,
      search,
      highlightedDisplay,
      index,
      focused,
    });
    const group = groupSuggestions.find((g) => g.id === entry.id);
    console.log("Found Group:", group);
    if (!group) return null;

    return (
      <div
        className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-150 ${
          focused ? "bg-green-100" : "bg-white"
        }`}
        style={{
          minWidth: 220,
          boxShadow: focused ? "0 2px 8px rgba(0,0,0,0.08)" : undefined,
        }}
      >
        <img
          src={group.avatarUrl || "/group_default.jpg"}
          alt={group.groupName}
          className="w-10 h-10 object-cover rounded-full shadow border border-gray-200 bg-gray-50"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/group_default.jpg";
          }}
        />
        <div className="flex flex-col justify-center">
          <span className="font-semibold text-base text-gray-800">
            {group.groupName}
          </span>
          <span className="text-xs text-gray-500">
            {group.memberCount} thành viên
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative ${enableDropZone ? "drop-zone" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {enableDropZone && isDragOver && (
        <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg shadow-lg">
            <span className="font-medium">Thả để mention</span>
          </div>
        </div>
      )}

      <MentionsInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="mentions"
        style={{
          control: {
            backgroundColor: "transparent",
            fontSize: 14,
            fontWeight: "normal",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
          },
          input: {
            padding: 9,
            border: "none",
            outline: "none",
            "&focused": {
              border: "1px solid #d41c0f",
            },
          },
          "&multiLine": {
            control: {
              minHeight: minHeight,
            },
            highlighter: {
              padding: 9,
              border: "1px solid transparent",
            },
            input: {
              padding: 9,
              border: "1px solid transparent",
              "&focused": {
                border: "1px solid #d41c0f",
                boxShadow: "0 0 0 3px rgba(225, 29, 72, 0.2)",
              },
            },
          },
          suggestions: {
            list: {
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
              marginTop: 4,
              padding: 0,
              minWidth: 240,
              maxWidth: 340,
              maxHeight: 320,
              overflowY: "auto",
              zIndex: 100,
            },
            item: {
              padding: 0,
              margin: 0,
              border: 0,
              background: "none",
              "&focused": {
                backgroundColor: "#e0f2fe",
              },
            },
          },
        }}
      >
        {/* Movie Mentions - Trigger: @ */}
        <Mention
          trigger="@"
          data={(query, callback) => {
            console.log("Movie Mention Data Query:", query);
            handleMovieSearch(query);
            if (movieSuggestions.length > 0) {
              const formattedData = movieSuggestions.map((movie) => ({
                id: movie.id,
                display: movie.title,
              }));
              console.log("Formatted Movie Data for Callback:", formattedData);
              callback(formattedData);
            } else {
              callback([]);
            }
          }}
          renderSuggestion={renderMovieSuggestion}
          markup="@[__display__](__id__)"
          style={{
            backgroundColor: "rgba(248, 101, 128, 0.87)",
            borderRadius: "5px",
          }}
        />

        {/* Group Mentions - Trigger: # */}
        <Mention
          trigger="#"
          data={(query, callback) => {
            console.log("Group Mention Data Query:", query);
            handleGroupSearch(query);
            if (groupSuggestions.length > 0) {
              const formattedData = groupSuggestions.map((group) => ({
                id: group.id,
                display: group.groupName,
              }));
              console.log("Formatted Group Data for Callback:", formattedData);
              callback(formattedData);
            } else {
              callback([]);
            }
          }}
          renderSuggestion={renderGroupSuggestion}
          markup="#[__display__](__id__)"
          style={{
            backgroundColor: "rgba(134, 242, 174, 0.80)",
            borderRadius: "5px",
          }}
        />
      </MentionsInput>
    </div>
  );
}
