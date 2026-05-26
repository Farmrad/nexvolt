let db;

function initDB() {
  const request = indexedDB.open("NexvoltDB", 1);

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    if (!db.objectStoreNames.contains("clients")) {
      db.createObjectStore("clients", { keyPath: "id", autoIncrement: true });
    }

    if (!db.objectStoreNames.contains("jobs")) {
      db.createObjectStore("jobs", { keyPath: "id", autoIncrement: true });
    }

    if (!db.objectStoreNames.contains("expenses")) {
      db.createObjectStore("expenses", { keyPath: "id", autoIncrement: true });
    }

    if (!db.objectStoreNames.contains("invoices")) {
      db.createObjectStore("invoices", { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Nexvolt DB ready");
  };

  request.onerror = function () {
    console.error("DB failed to open");
  };
}
