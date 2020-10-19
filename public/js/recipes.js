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
const recipes = document.querySelector('.recipes');
const renderRecipe = (data, id) => {
  const html = `
    <div class="content" data-id="${id}">
      <h2>${data.title}</h2>
      <p>${data.ingredients}</p>
      <button type="button" name="button" data-id="${id}" class="done">Delete</button>
    </div>
  `
  recipes.innerHTML += html;
};

// real-time listener
db.collection('recipes').onSnapshot((snapshot) =>{
  //console.log(snapshot.docChanges());
  snapshot.docChanges().forEach(change =>{
    if (change.type === 'added') {
      // add the document data to the web page
      renderRecipe(change.doc.data(), change.doc.id)
    }
    if (change.type === 'removed') {
      // remove the document data from the web page
      removeRecipe(change.doc.id);
    }
  })
});

// add new recipe to db
const form = document.querySelector(".add-recipe");
form.addEventListener('submit', evt =>{
  evt.preventDefault();
  
  const recipe = {
    title: form.title.value,
    ingredients: form.ingredients.value
  };
  
  db.collection('recipes').add(recipe)
    .catch(err => console.log(err));
    
  form.title.value= '';
  form.ingredients.value = '';
})

// delete recipes
const removeRecipe = (id) =>{
  const recipe = document.querySelector(`.content[data-id=${id}]`);
  recipe.remove();
};
// delete from db
const recipeContainer = document.querySelector('.recipes');
recipeContainer.addEventListener('click', evt =>{
  if(evt.target.innerText === "Delete"){
    const id = evt.target.getAttribute('data-id');
    db.collection('recipes').doc(id).delete();
  }
});