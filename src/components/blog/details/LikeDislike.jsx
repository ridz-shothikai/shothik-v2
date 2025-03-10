"use client";
import {
  ThumbDownAlt,
  ThumbDownOffAlt,
  ThumbUpAlt,
  ThumbUpOffAlt,
} from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSnackbar from "../../../hooks/useSnackbar";
import {
  useDisLikeContendMutation,
  useLikeContendMutation,
} from "../../../redux/api/blog/blogApiSlice";
import { setShowLoginModal } from "../../../redux/slice/auth";

export function LikeDislike({ id, api, like, dislike, size = "30px", data }) {
  const enqueueSnackbar = useSnackbar();
  const [disLikeContend] = useDisLikeContendMutation();
  const [likeContend] = useLikeContendMutation();
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const userId = user._id;

  const handleLike = async (e) => {
    try {
      e.stopPropagation();

      if (!userId) {
        return dispatch(setShowLoginModal(true));
      }

      setLoading(true);
      await likeContend({ api, id, body: { userId } }).unwrap();

      enqueueSnackbar("Liked successfylly", { variant: "success" });
      data.likes = [...data?.likes, userId];
      const isDislike = data?.dislikes?.includes(userId);
      if (isDislike) {
        const filter = data?.dislikes?.filter((item) => item !== userId);
        data.dislikes = [...filter];
      }
    } catch (error) {
      enqueueSnackbar("Unable to like", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };
  const handleDislike = async (e) => {
    try {
      e.stopPropagation();
      if (!userId) {
        return dispatch(setShowLoginModal(true));
      }

      setLoading(true);
      await disLikeContend({ api, id, body: { userId } }).unwrap();

      enqueueSnackbar("Dislike successfylly", { variant: "success" });
      data.dislikes = [...data?.dislikes, userId];
      const islike = data?.likes?.includes(userId);
      if (islike) {
        const filter = data?.likes?.filter((item) => item !== userId);
        data.likes = [...filter];
      }
    } catch (error) {
      enqueueSnackbar("Unable to Dislike", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack flexDirection='row' alignItems='center' gap={1}>
      <Stack flexDirection='row' alignItems='center' gap={0.5}>
        {like?.includes(userId) ? (
          <ThumbUpAlt
            sx={{
              height: size,
              width: size,
              color: "primary.main",
            }}
          />
        ) : (
          <ThumbUpOffAlt
            sx={{
              height: size,
              width: size,
              color: "primary.main",
              cursor: "pointer",
            }}
            disabled={loading}
            onClick={handleLike}
          />
        )}
        <Typography align='center' fontWeight={"700"} color='primary.main'>
          {like?.length || 0}
        </Typography>
      </Stack>
      <Stack flexDirection='row' alignItems='center' gap={0.5}>
        {dislike?.includes(userId) ? (
          <ThumbDownAlt
            sx={{
              height: size,
              width: size,
              color: "warning.main",
            }}
          />
        ) : (
          <ThumbDownOffAlt
            sx={{
              height: size,
              width: size,
              color: "warning.main",
              cursor: "pointer",
            }}
            disabled={loading}
            onClick={handleDislike}
          />
        )}
        <Typography align='center' fontWeight={"700"} color='warning.main'>
          {dislike?.length || 0}
        </Typography>
      </Stack>
    </Stack>
  );
}
