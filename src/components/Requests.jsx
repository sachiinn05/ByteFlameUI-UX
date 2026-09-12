import axios from "axios";
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL, resolvePhotoUrl } from "../utils/constants";
import { addRequests } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/request/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.data));
    } catch (err) {
      console.log(err.message);
    }
  }, [dispatch]);

  const reviewRequests = async (status, _id) => {
    try {
      await axios.post(`${BASE_URL}/request/review/${status}/${_id}`, {}, { withCredentials: true });
      fetchRequests();
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (!requests) {
    return (
      <div>
        <h1 className="page-title">Requests</h1>
        <p className="page-sub">People who liked you</p>
        <div className="mt-8 h-36 rounded-2xl bg-zinc-900 border border-zinc-800 animate-pulse" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center surface-card p-8 mt-8">
        <h1 className="text-lg font-semibold">No requests yet</h1>
        <p className="page-sub">When someone likes you, you can accept or ignore them here.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Requests</h1>
      <p className="page-sub mb-8">People who liked you</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requests.map((req) => {
          const user = req.fromUserId;
          return (
            <article key={req._id} className="surface-card p-4 flex gap-4">
              <img
                src={resolvePhotoUrl(user.photoUrl)}
                alt=""
                className="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                {req.opener && (
                  <p className="text-sm text-zinc-200 mt-2 border border-zinc-800 rounded-xl px-3 py-2 leading-relaxed">
                    <span className="block text-[11px] text-zinc-500 mb-1">They opened with</span>
                    “{req.opener}”
                  </p>
                )}
                {user.about && (
                  <p className="text-sm text-zinc-400 line-clamp-2 mt-1">{user.about}</p>
                )}
                {user.age && (
                  <p className="text-xs text-zinc-500 mt-1">
                    {user.age} · {user.gender}
                  </p>
                )}
                {user.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {user.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 rounded-md border border-zinc-800 text-zinc-400">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <button type="button" onClick={() => reviewRequests("accepted", req._id)} className="btn-primary min-h-10 text-sm">
                    Accept
                  </button>
                  <button type="button" onClick={() => reviewRequests("rejected", req._id)} className="btn-secondary min-h-10 text-sm">
                    Ignore
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
