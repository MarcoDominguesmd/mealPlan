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
const plan = document.querySelector('.weekDay');
const renderPlan = (data, id) => {
  const htmlweek = `
    <div class="content" data-id="${id}">
      <h2>${data.day}</h2>
      <p>Lunch: <span data-id="${id}" class="lunch">${data.lunch}</span></p>
      <p>Dinner: <span data-id="${id}"class="dinner">${data.dinner}</span></p>
    </div>
  `
  plan.innerHTML += htmlweek;
};

// real-time listener
db.collection('weekPlan').orderBy("order", "asc").onSnapshot((snapshot) =>{
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change =>{
    if (change.type === 'added') {
      // add the document data to the web page
      renderPlan(change.doc.data(), change.doc.id)
    }
  })
});


// delete from db
const menuContainer = document.querySelector('.weekDay');
menuContainer.addEventListener('click', evt =>{
  if(evt.target.tagName === "SPAN"){
    const input = document.createElement('input');
    const form = document.createElement('form');
    const id = evt.target.getAttribute('data-id');
    const meal = evt.target.className;
    const val = evt.target.value; 
    form.appendChild(input);
    evt.target.appendChild(form);
    input.focus();
    input.addEventListener('blur', e =>{
      form.remove();
    })
    form.addEventListener('submit', e =>{
      e.preventDefault();
      if (meal === "lunch" && input.value !== "") {
        db.collection('weekPlan').doc(id).update({
          lunch: input.value
        })
        evt.target.innerText = input.value;
      };
      if (meal == "dinner" && input.value !== "") {
        db.collection('weekPlan').doc(id).update({
          dinner: input.value
        })  
        evt.target.innerText = input.value;
      };
      form.remove();
    });
  }
});
