const search=document.getElementById("search");
const mealContainer = document.getElementById('mealCardContainer');
const url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
search.addEventListener("input", ()=>{
    const value=search.value;
    console.log("e");
    findMeal(value);
} );


async function findMeal(value){
    const mealsData = await fetchMealsFromApi( value);
    console.log(mealsData,mealsData.meals.length);
    mealContainer.innerHTML='';
    for(let i=0;i<mealsData.meals.length;i++){
        const card=createCard(mealsData.meals[i]);
        console.log(card);
        mealContainer.appendChild(card);
    }
}
const fetchMealsFromApi = async ( value) => {
    const response = await fetch(`${url + value}`);
    const meals = await response.json();
    return meals;
}
function createCard(meal){
    const card=document.createElement('div');
    card.classList.add('mealcard');
    card.innerHTML=`
        <div class="meal-image">
            <img src="${meal.strMealThumb}" alt="${meal.name}">
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
    heartIcon.addEventListener('click', ()=> {
        changeFvrt(heartIcon);
    })
    
    return card;
}
function changeFvrt(icon){
    console.log("hello");
    icon.classList.remove('fa-regular');
    icon.classList.add('fa-solid', 'fa-heart');
}
