import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Route/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import styles from "../styles/style";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  const hasEvents = Array.isArray(allEvents) && allEvents.length > 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <div className={`${styles.section}`}>
            {hasEvents ? (
              <div className="w-full grid">
                {allEvents.map((event) => (
                  <EventCard key={event._id} active={true} data={event} />
                ))}
              </div>
            ) : (
              <div className={`${styles.heading}`}>
                <h4 className="text-[#777]">No events at the moment.</h4>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;