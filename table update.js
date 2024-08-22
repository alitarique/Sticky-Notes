document.addEventListener('DOMContentLoaded', () => {
    const stickyNotesContainer = document.querySelector('#sticky-notes-container');
    const tableBody = document.querySelector('#table-body');
    const tableHeaderRow = document.querySelector('#table-header-row');

    function fetchNotes() {
        return fetch('/data.json') // Replace with your API endpoint
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching notes data:', error);
            });
    }

    function fetchDriverData() {
        return fetch('/list-drivers.json') // Replace with your driver's API endpoint
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching driver data:', error);
            });
    }

    function fetchAdditionalData() {
        return fetch('/clients.json') // Replace with your new API endpoint
            .then(response => response.json())
            .catch(error => {
                console.error('Error fetching additional data:', error);
            });
    }

    /*function waybillCreation(value, length, padChar) {
        const str = String(value); // Convert the value to a string if it's not already
        return str.padStart(length, padChar); // Use String.prototype.padStart
    }*/

    function waybillCreation(value, length, padChar, prefix) {
        const str = String(value); // Convert the value to a string if it's not already
        const paddedValue = str.padStart(length, padChar); // Pad the value
        return prefix + paddedValue; // Add the prefix and return the result
    }
    function generateStickyNotes(notes, additionalData) {
        stickyNotesContainer.innerHTML = '';
        notes.forEach(note => {
            var dispacherId = note.shipper_id;
                // var dispacherId = note.recipient_id;
            var description = note.description;
            var sortDescription = description.substring(0, 10);
            // var clientID = note.
            // console.log("dispacher ID(soft_ID): ")
            console.log(dispacherId);
            // console.log(additionalData[0]);
            const additionalInfo = additionalData.find(data => data.id === dispacherId); // Replace `key` with the actual key name
            console.log('additional Info: ');
            console.log(additionalInfo);
            // if(additionalData.find(data => data.id == dispacherId))
                // {
                    var dispacherIndexNumber = additionalData.findIndex(data => data.id == dispacherId)
                    // var prefix = additionalData[dispacherIndexNumber].prefix;
                    // console.log('prefix: ' +prefix);
                    var waybillSoftId = note.soft_id;
                    
                    // console.log('waybill: ' + waybill);
            
                    var dispacherName = additionalData[dispacherIndexNumber].name;
                    var dispacherPhone = additionalData[dispacherIndexNumber].phone;
                    var dispacherPostalCode = additionalData[dispacherIndexNumber].postal_code;
                    var dispacherStreetAddress = additionalData[dispacherIndexNumber].address;
                    
                    console.log(dispacherName);
                    console.log(dispacherPhone);
                    


                    // receiver details:

                    var receiverID = note.recipient_id


                    var receiverIndexNumber = additionalData.findIndex(data => data.id == receiverID)
                    
                    var prefix = additionalData[receiverIndexNumber].prefix;
                    var waybill = waybillCreation(waybillSoftId,6,0,prefix) ;
                    var receiverName = additionalData[receiverIndexNumber].name;
                    var receiverPhone = additionalData[receiverIndexNumber].phone;
                    var receiverPostalCode = additionalData[receiverIndexNumber].postal_code;
                    var receiverStreetAddress = additionalData[receiverIndexNumber].address;
                    console.log(dispacherName);
                    console.log(dispacherPhone);
                    
                    // <p class="address">${dispacherStreetAddress}</p>
                    // <p class="address">${receiverStreetAddress}</p>

                // <div class="bottom-sticky-note">
            const noteDiv = document.createElement('div');
            noteDiv.className = 'bottom-sticky-note';
            noteDiv.draggable = true;
            noteDiv.dataset.id = note.id;
            noteDiv.innerHTML = `
            
                <table class="bottom-note-table bottom-table">
                            <tbody>
                                <tr>
                                    <th>HEURE</th>
                                    <th>SERVICE</th>
                                    <th>CHAUFFEUR</th>
                                </tr>
                                <tr>
                                    <td>8.00</td>
                                    <td>${note.status}</td>
                                    <td>Driver name</td>
                                </tr>
                                <tr>
                                    <td>N° CLIENT</td>
                                    <td>DIVERS</td>
                                    <td>PRIX</td>
                                </tr>
                                <tr>
                                    <td>${waybill}</td>
                                    <td>${note.id}</td>
                                    <td>price</td>
                                </tr>
                                <tr>
                                    <td>Marchandise</td>
                                    <td>Poids</td>
                                    <td>Grandeur Camion</td>
                                </tr>
                                <tr>
                                    <td>merchandise</td>
                                    <td>weight</td>
                                    <td>truck size</td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="bottom-note-section">
                            <p id="bottom-special-Note">${note.note || 'Endroit où on peut'}</p>
                        </div>
                        <div class="bottom-note-body">
                            <div class="bottom-from-to-section">
                                <div class="bottom-from-section">
                                    <div class="bottom-section-title">DE:</div>
                                    <p class="company">${dispacherName}</p>
                                    <p class="contact">${dispacherPhone}</p>
                                    <p class="address">${dispacherStreetAddress}</p>
                                    <p class="city">${dispacherPostalCode}</p>
                                </div>
                                <div class="bottom-to-section">
                                    <div class="section-title">À:</div>
                                    <p class="company">${receiverName}</p>
                                    <p class="contact">${receiverPhone}</p>
                                    <p class="address">${receiverStreetAddress}</p>
                                    <p class="city">${receiverPostalCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;

                // <strong>Additional Info:</strong> ${additionalInfo ? additionalInfo.value : 'N/A'}<br>
                // <strong>Recipient_Name:</strong> ${note.recipient_contact}<br></br>
            if (note.status === 'tomorrow') {
                noteDiv.classList.add('status-tomorrow');
            } else {
                noteDiv.classList.add('status-default');
            }

            const savedPosition = getSavedPosition(note.id);
        if (savedPosition) {
            // If there is a saved position, place it in the corresponding cell
            document.querySelector(`#${savedPosition.cellId}`).appendChild(noteDiv);
        } else {
            // Otherwise, place it in the sticky notes container
            stickyNotesContainer.appendChild(noteDiv);
        }

        // Add event listeners for drag and drop
        noteDiv.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.dataset.id);
            e.dataTransfer.effectAllowed = 'move';
            e.target.style.zIndex = 1000;
        });

        noteDiv.addEventListener('dragend', (e) => {
            e.target.style.zIndex = '';
        });
    });

        addDragAndDropToCells();
    }

    function fetchAndGenerateNotes() {
        Promise.all([fetchNotes(), fetchDriverData(), fetchAdditionalData()])
            .then(([notes, drivers, additionalData]) => {
                if (notes && drivers && additionalData) {
                    generateTable(drivers);
                    generateStickyNotes(notes, additionalData);
                    
                }
                else{
                    console.log("fetch error");
                }
            });
    }

    function generateTable(drivers) {
        tableHeaderRow.innerHTML = '';
        tableBody.innerHTML = '';

        drivers.forEach((driver, index) => {
            const th = document.createElement('th');
            th.textContent = `${driver.full_name}\n (${driver.phone})`;
            th.classList.add('table-header');
            tableHeaderRow.appendChild(th);
        });

        const rows = 5; // 5 rows in the table
        const columns = drivers.length;

        for (let i = 0; i < rows; i++) {
            const tr = document.createElement('tr');
            for (let j = 0; j < columns; j++) {
                const td = document.createElement('td');
                td.id = `cell${i * columns + j + 1}`;
                td.className = 'note-container';
                tr.appendChild(td);
            }
            tableBody.appendChild(tr);
        }
    }

    function addDragAndDropToCells() {
        const tableCells = document.querySelectorAll('.note-container');
    
        tableCells.forEach(cell => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.target.classList.add('drag-over');
            });
    
            cell.addEventListener('dragleave', (e) => {
                e.target.classList.remove('drag-over');
            });
    
            cell.addEventListener('drop', (e) => {
                e.preventDefault();
                e.target.classList.remove('drag-over');
    
                const noteId = e.dataTransfer.getData('text/plain');
                const note = document.querySelector(`.bottom-sticky-note[data-id="${noteId}"]`);
    
                if (note) {
                    note.style.position = 'relative';
                    note.style.left = '0';
                    note.style.top = '0';
                    note.style.width = '100%';
                    note.style.height = '100%';
    
                    e.target.innerHTML = ''; // Clear existing note in cell if any
                    e.target.appendChild(note);
    
                    saveNotePosition(noteId, e.target.id);
                }
            });
        });
    
        stickyNotesContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.target.classList.add('drag-over');
        });
    
        stickyNotesContainer.addEventListener('dragleave', (e) => {
            e.target.classList.remove('drag-over');
        });
    
        stickyNotesContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            e.target.classList.remove('drag-over');
    
            const noteId = e.dataTransfer.getData('text/plain');
            const note = document.querySelector(`.bottom-sticky-note[data-id="${noteId}"]`);
    
            if (note) {
                note.style.position = 'relative';
                note.style.left = '0';
                note.style.top = '0';
                // note.style.width = '200px';
                // note.style.height = '200px';
    
                stickyNotesContainer.appendChild(note);
                removeNotePosition(noteId);
            }
        });
    }

    function saveNotePosition(noteId, cellId) {
        let positions = JSON.parse(localStorage.getItem('notePositions')) || {};
        const rect = document.querySelector(`#${cellId}`).getBoundingClientRect();
        positions[noteId] = {
            cellId: cellId,
            top: rect.top,
            left: rect.left
        };
        localStorage.setItem('notePositions', JSON.stringify(positions));
    }
    
    function getSavedPosition(noteId) {
        const positions = JSON.parse(localStorage.getItem('notePositions')) || {};
        return positions[noteId] ? positions[noteId] : null;
    }
    
    function removeNotePosition(noteId) {
        let positions = JSON.parse(localStorage.getItem('notePositions')) || {};
        delete positions[noteId];
        localStorage.setItem('notePositions', JSON.stringify(positions));
    }
    
    

    fetchAndGenerateNotes();
    



});
