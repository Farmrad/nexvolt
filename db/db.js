let db;

function initDB() {
  const req = indexedDB.open("NexvoltDB", 1);

  req.onupgradeneeded = e => {
    db = e.target.result;

    db.createObjectStore("clients", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("jobs", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
    db.createObjectStore("invoices", { keyPath: "id", autoIncrement: true });
  };

  req.onsuccess = e => db = e.target.result;
}
