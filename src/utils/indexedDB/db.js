import { nanoid } from 'nanoid';

function withDB(storeName, callback) {
  let request = indexedDB.open("entagk-1", 1); // Request v1 of the database

  request.onerror = () => {
    throw new Error("unexpected error while saveing the data");
  };

  request.onsuccess = () => { // Or call this when done
    let db = request.result; // The result of the request is the database
    callback(db); // Invoke the callback with the database
  };

  request.onupgradeneeded = () => {
    initdb(request.result, storeName);
  };
}

function initdb(db) {
  if (!db.objectStoreNames.contains("notes"))
    db.createObjectStore("notes", { keyPath: "_id" });

  if (!db.objectStoreNames.contains("tasks"))
    db.createObjectStore("tasks", { keyPath: "_id" });
}

export const getAll = (storeName) => {
  return new Promise((resolve, reject) => {
    let data;
    withDB(storeName, db => {
      let transaction = db.transaction(storeName);

      let objectstore = transaction.objectStore(storeName);

      let request = objectstore.getAll();
      console.log('req', request);

      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        data = request.result; // This is the query result
        resolve(data)
      };
    });
  })
}

export const addNew = (storeName, data) => {
  return new Promise((resolve, reject) => {
    withDB(storeName, db => {
      const transaction = db.transaction(storeName, 'readwrite');

      const objectstore = transaction.objectStore(storeName);

      let newData = { ...data, _id: nanoid() };
      delete newData.id;

      const request = objectstore.add(newData);

      console.log('req', request);
      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        resolve({ data: newData, oldId: data.id })
      };
    });
  })
}

export const getOne = (id, storeName) => {
  return new Promise((resolve, reject) => {
    withDB(storeName, (db) => {
      const transaction = db.transaction(storeName, 'readwrite');

      const objectstore = transaction.objectStore(storeName);

      const request = objectstore.get(id);

      console.log('req', request);
      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        resolve(request.result);
      };
    });
  })
}

export const deleteOne = (id, storeName) => {
  return new Promise((resolve, reject) => {
    withDB(storeName, (db) => {
      const transaction = db.transaction(storeName, 'readwrite');

      const objectstore = transaction.objectStore(storeName);

      const request = objectstore.delete(id);

      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        resolve({ id });
      };
    });
  })
}

export const updateOne = (data, storeName) => {
  return new Promise((resolve, reject) => {
    withDB(storeName, (db) => {
      const objectstore = db.transaction([storeName], 'readwrite').objectStore(storeName);

      delete data.oldId;
      delete data.id;

      const request = objectstore.put(data);

      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        resolve(data);
      };
    });
  })
}

export const clearStore = (storeName) => {
  return new Promise((resolve, reject) => {
    withDB(storeName, (db) => {
      console.log('clear store: ', storeName);
      const objectstore = db.transaction([storeName], 'readwrite').objectStore(storeName);

      const request = objectstore.clear();

      request.onerror = () => {
        reject("unexpected error while saveing the data");
      };

      request.onsuccess = () => { // Or call this function on success
        resolve({ message: "Deleteded successfully" });
      };
    });
  })
}
