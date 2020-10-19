// offline data
db.enablePersistence()
  .catch(err =>{
    if(err.code == 'failed-precondition'){
      // probably miltiple tabs open at once
      console.log('persistence failed');
    }else if(err.code == 'unimplemented'){
      // lack of browser support
      console.log('persistence is not available');
    }
});

// render recipe data
const items = document.querySelector('#items');
const renderItem = (data, itemId) => {
  const htmlItem = `
    <div class="content list" data-id="${itemId}">
      <p>${data.item}</p>
      <button type="button" name="button" data-id="${itemId}" class="done">Done</button>
    </div>
  `
  items.innerHTML += htmlItem;
};

// real-time listener
db.collection('items').onSnapshot((snapshot) =>{
  console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change =>{
    if (change.type === 'added') {
      // add the document data to the web page
      renderItem(change.doc.data(), change.doc.id)
    }
    if (change.type === 'removed') {
      // remove the document data from the web page
      removeItem(change.doc.id);
    }
  })
});

// add new item to db
const addItem = document.querySelector(".add-item");
addItem.addEventListener('submit', evt =>{
  evt.preventDefault();
  
  const item = {
    item: addItem.item.value
  }
  db.collection('items').add(item)
    .catch(err => console.log(err));    
  addItem.item.value= '';
});

// delete item
const removeItem = (id) =>{
  const item = document.querySelector(`.content[data-id=${id}]`);
  item.remove();
};

// delete item from db
const itemsContainer = document.querySelector('#items');
itemsContainer.addEventListener('click', evt =>{
  //console.log(evt);
  if(evt.target.innerText === "Done"){
    const id = evt.target.getAttribute('data-id');
    db.collection('items').doc(id).delete();
  }
});

