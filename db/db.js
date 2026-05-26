let db;

function initDB() {
  const request = indexedDB.open("NexvoltDB", 2);

  request.onupgradeneeded = function (event) {
    db = event.target.result;

    // CLIENTS
    if (!db.objectStoreNames.contains("clients")) {
      db.createObjectStore("clients", {
        keyPath: "id",
        autoIncrement: true
      });
    }

    // JOBS
    if (!db.objectStoreNames.contains("jobs")) {
      db.createObjectStore("jobs", {
        keyPath: "id",
        autoIncrement: true
      });
    }

    // EXPENSES
    if (!db.objectStoreNames.contains("expenses")) {
      db.createObjectStore("expenses", {
        keyPath: "id",
        autoIncrement: true
      });
    }

    // INVOICES
    if (!db.objectStoreNames.contains("invoices")) {
      db.createObjectStore("invoices", {
        keyPath: "id",
        autoIncrement: true
      });
    }
  };

  request.onsuccess = function (event) {
    db = event.target.result;
    console.log("Nexvolt DB Ready");
  };

  request.onerror = function () {
    console.error("Database failed");
  };
}
