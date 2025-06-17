"use client";

import { MentionsInput, Mention } from "react-mentions";
import { useTranslations } from "next-intl";
import { movieApi } from "@/services/movieApi";
import { useState, useEffect } from "react";

export default function MovieMentionInput({ value, onChange, placeholder }) {
  const t = useTranslations("Groups");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const { data: searchResults, isLoading } =
    movieApi.query.useSearchMoviesByTitle(0, 5, searchQuery);

  useEffect(() => {
    console.log("Search Query:", searchQuery);
    console.log("Search Results:", searchResults);
    if (searchResults?.content) {
      setSuggestions(searchResults.content);
    }
  }, [searchQuery, searchResults]);

  const handleChange = (event, newValue, newPlainTextValue, mentions) => {
    console.log("Handle Change:", { newValue, newPlainTextValue, mentions });
    onChange(newValue);
  };

  const handleSearch = (query) => {
    console.log("Handle Search:", query);
    setSearchQuery(query);
  };

  const renderSuggestion = (
    entry,
    search,
    highlightedDisplay,
    index,
    focused
  ) => {
    console.log("Render Suggestion:", {
      entry,
      search,
      highlightedDisplay,
      index,
      focused,
    });
    const movie = suggestions.find((m) => m.id === entry.id);
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

  return (
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
        },
        "&multiLine": {
          control: {
            minHeight: 100,
          },
          highlighter: {
            padding: 9,
            border: "1px solid transparent",
          },
          input: {
            padding: 9,
            border: "1px solid transparent",
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
      <Mention
        trigger="@"
        data={(query, callback) => {
          console.log("Mention Data Query:", query);
          handleSearch(query);
          if (suggestions.length > 0) {
            const formattedData = suggestions.map((movie) => ({
              id: movie.id,
              display: movie.title,
            }));
            console.log("Formatted Data for Callback:", formattedData);
            callback(formattedData);
          } else {
            callback([]);
          }
        }}
        renderSuggestion={renderSuggestion}
        markup="@[__display__](__id__)"
        style={{
          backgroundColor: "rgba(248, 101, 128, 0.87)",
          borderRadius: "5px",
        }}
      />
    </MentionsInput>
  );
}
