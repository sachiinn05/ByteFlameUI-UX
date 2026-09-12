import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { appendFeed, resetFeed, setFeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const emptyFilters = { interest: "", gender: "", minAge: "", maxAge: "" };

const Feed = () => {
  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();
  const [filters, setFilters] = useState(emptyFilters);
  const [applied, setApplied] = useState(emptyFilters);
  const [loading, setLoading] = useState(false);

  const buildQuery = (page, activeFilters) => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", "10");
    if (activeFilters.interest.trim()) params.set("interest", activeFilters.interest.trim());
    if (activeFilters.gender) params.set("gender", activeFilters.gender);
    if (activeFilters.minAge) params.set("minAge", activeFilters.minAge);
    if (activeFilters.maxAge) params.set("maxAge", activeFilters.maxAge);
    return params.toString();
  };

  const fetchFeed = useCallback(
    async ({ page, replace, activeFilters }) => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/feed?${buildQuery(page, activeFilters)}`, {
          withCredentials: true,
        });
        const payload = {
          data: res.data.data || [],
          page: res.data.page,
          hasMore: res.data.hasMore,
          total: res.data.total,
        };
        if (replace) dispatch(setFeed(payload));
        else dispatch(appendFeed(payload));
      } catch (err) {
        console.log("Feed Error:", err);
      } finally {
        setLoading(false);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    if (feed.page === 0) {
      fetchFeed({ page: 1, replace: true, activeFilters: applied });
    }
  }, [feed.page, applied, fetchFeed]);

  useEffect(() => {
    if (feed.page > 0 && feed.users.length === 0 && feed.hasMore && !loading) {
      fetchFeed({ page: feed.page + 1, replace: false, activeFilters: applied });
    }
  }, [feed.users.length, feed.hasMore, feed.page, loading, applied, fetchFeed]);

  const applyFilters = (e) => {
    e.preventDefault();
    dispatch(resetFeed());
    setApplied({ ...filters });
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    setApplied(emptyFilters);
    dispatch(resetFeed());
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center max-w-lg">
        <h1 className="page-title">Discover</h1>
        <p className="page-sub">People ranked by overlapping interests</p>
      </div>

      <form
        onSubmit={applyFilters}
        className="w-full surface-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        <input
          type="text"
          placeholder="Interest (e.g. music)"
          value={filters.interest}
          onChange={(e) => setFilters((f) => ({ ...f, interest: e.target.value }))}
          className="input-field"
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters((f) => ({ ...f, gender: e.target.value }))}
          className="input-field"
        >
          <option value="">Any gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="others">Others</option>
        </select>
        <input
          type="number"
          min="18"
          placeholder="Min age"
          value={filters.minAge}
          onChange={(e) => setFilters((f) => ({ ...f, minAge: e.target.value }))}
          className="input-field"
        />
        <input
          type="number"
          min="18"
          placeholder="Max age"
          value={filters.maxAge}
          onChange={(e) => setFilters((f) => ({ ...f, maxAge: e.target.value }))}
          className="input-field"
        />
        <div className="flex gap-2">
          <button type="submit" className="btn-primary flex-1">
            Filter
          </button>
          <button type="button" onClick={clearFilters} className="btn-secondary">
            Reset
          </button>
        </div>
      </form>

      {feed.total > 0 && (
        <p className="text-sm text-zinc-500">{feed.total} people</p>
      )}

      {loading && feed.users.length === 0 && (
        <div className="w-full max-w-md">
          <div className="h-[28rem] rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
          <p className="text-zinc-500 mt-4 text-sm text-center">Finding people…</p>
        </div>
      )}

      {!loading && feed.users.length === 0 && (
        <div className="w-full max-w-md surface-card p-8 text-center">
          <h2 className="text-lg font-semibold">No one new right now</h2>
          <p className="page-sub">
            Clear filters, add more interests on your profile, or check back later.
          </p>
        </div>
      )}

      {feed.users[0] && (
        <div className="w-full flex justify-center">
          <UserCard user={feed.users[0]} />
        </div>
      )}
    </div>
  );
};

export default Feed;
