const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
const sqlite3 = require('sqlite3').verbose();

if (!isMainThread) {
  const { port } = workerData;
  let db = new sqlite3.Database(`${port}.db`);

  function updateDB(cart) {
    const cartLists = cart.info();

    cartLists.forEach((list) => {
      const listExistsQuery = 'SELECT 1 FROM list WHERE url = ?';
      const listExistsParams = [list.url];

      db.get(listExistsQuery, listExistsParams, function (err, row) {
        if (err) {
          console.error('Error checking if list exists:', err);
          return;
        }

        if (!row && list.deleted) {
          // List is marked as deleted and not found in the database, skip to the next list
          console.log(`List ${list.name} marked as deleted, but not found in the database.`);
          return;
        }

        // List exists or is not marked as deleted, proceed with the update/insert
        db.run(
          'INSERT OR REPLACE INTO list (name, url, changed, deleted) VALUES (?, ?, ?, ?)',
          [list.name, list.url, true, list.deleted],
          (err) => {
            if (err) {
              console.error('Error updating shopping list:', err);
            }
          }
        );

        // Update or insert items for the current list
        list.items.forEach((item) => {
          db.run(
            'INSERT OR REPLACE INTO item (name, list_url, current, quantity, deleted, changed) VALUES (?, ?, ?, ?, ?, ?)',
            [item.name, list.url, 0, item.quantity, item.deleted, true],
            (err) => {
              if (err) {
                console.error('Error updating item:', err);
              }
            }
          );
        });
      });
    });

    db.close();

    parentPort.postMessage({ type: 'dbUpdateComplete' });
  }

  parentPort.on('message', (message) => {
    if (message.type === 'updateDB') {
      updateDB(message.cart);
    }
  });
}
