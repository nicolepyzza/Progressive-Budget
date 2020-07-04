const request = indexedDB.open('budget', 1);

// db request
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.CreateObjectStore('pending', {
        autoincrement: true,
    })
};

// on success + check if app online or offline
request.onsuccess = (event) => {
    const db = event.target.result;

    if (navigator.onLine) {
        checkDB();
    }

}