import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { server } from "../../../server";
import { getAllEvents } from "../../../redux/actions/event";

function initialTimeLeft(finishDate) {
  if (!finishDate) return {};
  const difference = +new Date(finishDate) - +new Date();
  if (difference <= 0) return {};
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

const CountDown = ({ data }) => {
  const dispatch = useDispatch();
  const deleteRequestedRef = useRef(false);
  const [timeLeft, setTimeLeft] = useState(() =>
    initialTimeLeft(data?.Finish_Date)
  );

  useEffect(() => {
    deleteRequestedRef.current = false;
  }, [data?._id]);

  useEffect(() => {
    if (!data?._id || !data?.Finish_Date) return;

    const tick = () => {
      const difference = +new Date(data.Finish_Date) - +new Date();
      if (difference <= 0) {
        setTimeLeft({});
        if (!deleteRequestedRef.current) {
          deleteRequestedRef.current = true;
          axios
            .delete(`${server}/event/delete-shop-event/${data._id}`)
            .then(() => {
              dispatch(getAllEvents());
            })
            .catch((err) => {
              deleteRequestedRef.current = false;
              if (err?.response?.status === 404) {
                dispatch(getAllEvents());
              }
            });
        }
        return;
      }
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [data?._id, data?.Finish_Date, dispatch]);

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;