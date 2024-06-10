import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
  databaseURL: "https://playground-7c11e-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")
const inputField = document.getElementById('input-field')
const addBtn = document.getElementById('add-button')
const shoppingListEL = document.getElementById("shopping-list")

inputField.addEventListener('keypress', function(e){
  if(e.key === "Enter"){
    addItemToDB()
  }
})

addBtn.addEventListener('click', function(){
  addItemToDB()
})

function addItemToDB(){
  const inputValue = inputField.value
  
  if(inputValue){
    push(shoppingListInDB, inputValue)
    clearInputField()
  }
}
  
onValue(shoppingListInDB, function(snapshot){

  if(snapshot.exists()){
    let itemsArr = Object.entries(snapshot.val())
    
    shoppingListEL.innerHTML = ""
  
    for(let i = 0; i < itemsArr.length; i++){
      let currentItem = itemsArr[i]
      appendItemToShoppingListEl(currentItem)
    }
  }
  else{
    shoppingListEL.innerHTML = "No items in cart...yet"
  }

})


function clearInputField(){    
    inputField.value = ""
}
  
function appendItemToShoppingListEl(item){
  let itemID = item[0]
  let itemValue = item[1]

  let newEl = document.createElement("li")
  newEl.textContent = itemValue
  shoppingListEL.append(newEl)

  newEl.addEventListener("dblclick", function(){
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)

    remove(exactLocationOfItemInDB)
  })
}