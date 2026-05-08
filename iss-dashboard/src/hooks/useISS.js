import { useState, useEffect, useCallback, useRef } from 'react';
import { getISSLocation, getAstronauts, getNearestLocation } from '../services/issService';
import { calculateDistance, calculateSpeed } from '../utils/haversine';
import toast from 'react-hot-toast';

export const useISS = (autoRefresh = true) => {
  const [location, setLocation] = useState(null);
  const [history, setHistory] = useState([]);
  const [astronauts, setAstronauts] = useState([]);
  const [speed, setSpeed] = useState(0);
  const [nearestPlace, setNearestPlace] = useState('Checking...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const lastLocationRef = useRef(null);
  const lastTimestampRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const newPos = await getISSLocation();
      
      // Update coordinates and speed immediately
      const currentSpeed = newPos.velocity || 27600;
      setSpeed(currentSpeed);
      setLocation(newPos);
      setLoading(false);
      
      setHistory(prev => {
        const newHistory = [...prev, { ...newPos, speed: currentSpeed }];
        return newHistory.slice(-50);
      });

      lastLocationRef.current = newPos;
      lastTimestampRef.current = newPos.timestamp;

      // Fetch nearest location in background or after UI update
      const place = await getNearestLocation(newPos.lat, newPos.lng);
      setNearestPlace(place);
      
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAstroData = async () => {
    try {
      const people = await getAstronauts();
      setAstronauts(people);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchAstroData();
  }, []);

  useEffect(() => {
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchData, 15000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, fetchData]);

  return { location, history, astronauts, speed, nearestPlace, loading, error, refresh: fetchData };
};
