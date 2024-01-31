//event listener 
function addDictionary(toAdd) {
    console.log(toAdd, "to add");
    let li = document.createElement("li");
    li.className = "flex justify-between items-center border-b border-gray-300 py-2";
    li.innerHTML = `<span>${toAdd}</span>` + `<div>` + `<button class="text-red-500 hover:text-red-700"  id="del_dic">Delete</button>` + `</div>`;
    // Assuming you have a parent element to append this list item to
    document.getElementById('dict_store').appendChild(li);

}

chrome.storage.local.get(['defaultDictionary'], function (result) { //dictionary
    if (result.defaultDictionary) {
        document.getElementById('dict_store').innerHTML = "";
        result.defaultDictionary.forEach(function (item) {
            let li = document.createElement("li");
            li.className = "flex justify-between items-center border-b border-gray-300 py-2";
            li.innerHTML = `<span>${item}</span>` + `<div>` + `<button class="text-red-500 hover:text-red-700"  id="del_dic">Delete</button>` + `</div>`;
            // Assuming you have a parent element to append this list item to
            document.getElementById('dict_store').appendChild(li);
        });
    } else {
        console.log("no dictionary found in storage"); // Replaced backgroundLogger.log with console.log
    }
});

// Add event listener to the parent element 'dict_store'
const dictStore = document.getElementById('pop-body');

dictStore.addEventListener('click', function (event) {
    const target = event.target;

    // Check if the clicked element has the 'del_dic' ID
    if (target.id === 'del_dic') {
        // Access the parent element and remove it
        target.parentNode.parentNode.remove();

        // Assuming you have a function removeFromDic in your dictionaryManager
        chrome.runtime.sendMessage(
            { type: "del_dict", value: target.parentNode.previousSibling.innerHTML},
            function (response) {
                console.log(response.result);
            });

    }
    else if (target.id === 'add_dic') {
        const toAdd = document.getElementById('new_dict').value;
        if (isGeezScript(toAdd)) {
            addDictionary(toAdd);
            chrome.runtime.sendMessage(
                { type: "addToDic", data: toAdd },
                function (response) {
                   console.log(response.result);
                });
            
            document.getElementById('new_dict').value = "";
        }
    }
});

// Check if the text is in Amharic Geez script
function isGeezScript(text) {
    const totalCharacters = text.replace(/\s/g, "").length; // Exclude whitespace characters
    let geezCharacters = 0;

    // Iterate through each character in the text
    for (let i = 0; i < text.length; i++) {
        // Check if the character is in the Amharic Geez script range
        if (/[\u1200-\u137F\u1380-\u139F\u2D80-\u2DDF]/.test(text[i])) {
            geezCharacters++;
        }
    }

    // Calculate the percentage of Amharic characters
    const percentage = (geezCharacters / totalCharacters) * 100;

    // Log the detection details

    // Return true if 70% or more of the text is in Amharic script
    return percentage >= 95;
}

