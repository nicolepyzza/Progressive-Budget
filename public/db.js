var db;
const request = indexedDB.open('budget', 1);

// db request
request.onupgradeneeded = (event) => {
    const db = event.target.result;
    db.CreateObjectStore('pending', {
        autoincrement: true,
    })
};

