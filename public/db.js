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
};

// Error msg 
request.onerror = (event) => {
    console.log('Error!');
}

// save transactions
function saveRecord(record) {
    const transaction = db.transaction(['pending'], 'readWrite');
    const store = transaction.objectStore('pending');

    store.add(record);
}


// check db
function checkDB() {
    const transaction = db.transaction(['pending'], 'readWrite');
    const store = transaction.objectStore('pending');
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if (getAll.result.length > 0) {
            fetch('/api/transaction/bulk', {
                method: "POST", 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json())
            // Delete if successful
            .then(() => {
                const transaction = db.transaction(['pending'], 'readWrite');
                const store = transaction.objectStore('pending');
                store.clear();
            })
        }
    }
}

// Keep listening for if app goes back online
window.addEventListener('online', checkDB);