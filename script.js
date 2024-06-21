const search = document.getElementById("search");
const mealContainer = document.getElementById('mealCardContainer');
const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const toggleList = document.getElementById('toggleList');
const fvrtList=document.getElementById('listContent');
const fvrtMeal=[];
search.addEventListener("input", () => {
    const value = search.value;
    findMeal(value);
});
toggleList.addEventListener('click', () => {
    listContainer.classList.toggle('open');
});


window.addEventListener('click', (event) => {
    const listContainer = document.getElementById('listContainer');
    if (event.target !== toggleList && !toggleList.contains(event.target) && listContainer.classList.contains('open')) {
        listContainer.classList.remove('open');
    }
});

async function findMeal(value) {
    const mealsData = await fetchMealsFromApi(value);
    mealContainer.innerHTML = '';
    for (let i = 0; i < mealsData.meals.length; i++) {
        const card = createCard(mealsData.meals[i]);
        mealContainer.appendChild(card);
    }
}

const fetchMealsFromApi = async (value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}

function createCard(meal) {
    const card = document.createElement('div');
    card.classList.add('mealcard');
    card.innerHTML = `
        <div class="meal-image">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        </div>
        <div class="meal-details">
            <h2>${meal.strMeal}</h2>
            <div class="actions">
                <button class="read-more">Read More</button>
                <i class="fa-regular fa-heart"></i>
            </div>
        </div>
    `;
    const heartIcon = card.querySelector('.fa-regular.fa-heart');
    heartIcon.addEventListener('click', () => {
        changeFvrt(heartIcon,card);
    });

    const readMore = card.querySelector('.read-more');
    readMore.addEventListener('click', () => {
        showMealDetails(meal);
    });

    return card;
}

function changeFvrt(icon,card) {
    if (icon.classList.contains('fa-regular')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid', 'fa-heart');
        addToFvrt(card);
    } else {
        icon.className = '';
        icon.classList.add('fa-regular', 'fa-heart');
        removeMealFromFvrt(card)
    }
}
function removeMealFromFvrt(card){
    const imageName = card.querySelector('.meal-image img').alt;

    console.log(fvrtList);
    for(let i=0;i<fvrtList.childNodes.length;i++){
        console.log(fvrtList.children[i]);
        const mealName = fvrtList.children[i].querySelector('.itemText');
        console.log(mealName.innerHTML);
        if(mealName.innerHTML==imageName){
            console.log("card found ");
            fvrtList.removeChild(fvrtList.children[i]);
        }
    }
}
function addToFvrt(card) {
    console.log(card);
    const imageUrl = card.querySelector('.meal-image img').src;
    const imageName = card.querySelector('.meal-image img').alt;
    for(let i=0;i<fvrtList.childNodes.length;i++){
        const mealName = fvrtList.children[i].querySelector('.itemText');
        console.log(mealName.innerHTML,imageName);
        if(mealName.innerHTML==imageName){
            console.log("already add");
            return;
        }
    }
    const fvrtDish = document.createElement('div');
    fvrtDish.classList.add('fvrtDish');
    fvrtDish.innerHTML = `
        <img src="${imageUrl}" alt="${imageName}">
        <div class="item">
            <strong>Name: </strong>
            <span class="itemText">${imageName}</span>
            <button class="remove" onclick="removeFromFvrt(this)">Remove</button>
        </div>
    `;

    fvrtList.appendChild(fvrtDish);
}

function removeFromFvrt(button) {
    const fvrtDish = button.closest('.fvrtDish');
    if (fvrtDish) {
        fvrtDish.remove();
    } else {
        console.error("Cannot find the .fvrtDish element to remove");
    }
}

function showMealDetails(meal) {
    const modal = document.getElementById("mealModal");
    const modalContent = document.getElementById("modalMealContent");
    const ingredients = [];
console.log("meal detail ",meal);
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(meal[`strIngredient${i}`]);
        } else {
            break;
        }
    }

    modalContent.innerHTML = `
        <div class="item-details-container">
            <div class="item-image">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            </div>
            <div class="item-details-right">
                <div class="item-name">
                    <strong>Name: </strong>
                    <span class="item-text">${meal.strMeal}</span>
                </div>
                <div class="item-category">
                    <strong>Category: </strong>
                    <span class="item-text">${meal.strCategory}</span>
                </div>
                <div class="item-ingredient">
                    <strong>Ingredients: </strong>
                    <span class="item-text">${ingredients.join(", ")}</span>
                </div>
                <div class="item-instruction">
                    <strong>Instructions: </strong>
                    <span class="item-text">${meal.strInstructions}</span>
                </div>
                <div class="item-video">
                    <strong>Video Link: </strong>
                    <span class="item-text">
                        <a href="${meal.strYoutube}" target="_blank">Watch Here</a>
                    </span>
                </div>
                <div id="like-button" onclick="showMEalDetails('${meal.strMealThumb}','${meal.strMeal}')">Add To Favourite</div>

            </div>
        </div>
    `;
    modal.style.display = "block";

    const closeBtn = document.querySelector(".close");
    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}
function showMEalDetails(imageUrl,imageName){
    for(let i=0;i<fvrtList.childNodes.length;i++){
        const mealName = fvrtList.children[i].querySelector('.itemText');
        console.log(mealName.innerHTML,imageName);
        if(mealName.innerHTML==imageName){
            console.log("already add");
            return;
        }
    }
    const fvrtDish = document.createElement('div');
    fvrtDish.classList.add('fvrtDish');
    fvrtDish.innerHTML = `
        <img src="${imageUrl}" alt="${imageName}">
        <div class="item">
            <strong>Name: </strong>
            <span class="itemText">${imageName}</span>
            <button class="remove" onclick="removeFromFvrt(this)">Remove</button>
        </div>
    `;

    fvrtList.appendChild(fvrtDish);
}