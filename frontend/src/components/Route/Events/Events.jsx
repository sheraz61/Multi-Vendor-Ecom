import React from 'react'
import { useSelector } from 'react-redux';
import styles from '../../../styles/style'
import EventCard from "./EventCard";

const Events = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);

  if (isLoading || !allEvents?.length) {
    return null;
  }

  return (
    <div className={`${styles.section}`}>
      <div className={`${styles.heading}`}>
        <h1>Popular Events</h1>
      </div>

      <div className="w-full grid">
        {allEvents.map((event) => (
          <EventCard key={event._id} data={event} />
        ))}
      </div>
    </div>
  );
}

export default Events