import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

const database = getDatabase();

export const useDatabaseValue = (path: string, initialValue: any) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const dbRef = ref(database, path);
    get(dbRef)
      .then((snapshot) => {
        setValue(snapshot.val());
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        // You can handle the error here, e.g., show an error message
      })
      .finally(() => {
        setLoading(false);
      });
  }, [path]);

  return [value, loading];
};