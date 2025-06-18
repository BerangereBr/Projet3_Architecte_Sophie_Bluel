import { fetchUrl } from "./config.js";

const response = await fetch(fetchUrl + '/api/works');
let workList = await response.json();

async function displayWorkList() {
    const figures = document.querySelector('.figures');
    for (let work of workList) {
        const figure = document.createElement('figure');
        figure.className = 'figure';
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.id = work.id;
        const image = document.createElement('img');
        image.src = work.imageUrl;
        image.alt = work.title;
        const imageTitle = document.createElement('figcaption');
        imageTitle.innerText = work.title;

        figure.appendChild(image);
        figure.appendChild(imageTitle);
        figures.appendChild(figure)
    }
}

function getCategoryList(workList) {
    let categoryList = [];
    categoryList[0] = { id: 0, name: 'Tous' };
    for (let work of workList) {
        categoryList[work.categoryId] = work.category;
    }
    return categoryList
}

function displayButtonFilterList(categoryList) {
    const filters = document.querySelector('.filters');
    for (let i = 0; i < categoryList.length; i++) {
        if (!categoryList[i]) continue;
        const button = document.createElement('button');
        button.innerText = categoryList[i].name;
        button.dataset.categoryId = categoryList[i].id;
        filters.appendChild(button);
        if (button.dataset.categoryId == '0') {
            button.classList.add('active')
        }
        button.addEventListener("click", function () {
            filterWorks(button.dataset.categoryId);
            clickChangeColorButtonFilters()
        })
    }
}

function clickChangeColorButtonFilters() {
    let buttons = document.querySelectorAll('.filters button');
    for (let btn of buttons) {
        btn.classList.remove('active');
        btn.addEventListener('click', function () {
            btn.classList.add('active')
        })
    }
}

function filterWorks(filterCategoryId) {
    const figures = document.querySelector('.figures');
    let htmlWorks = figures.children;
    for (let work of htmlWorks) {
        let workCategoryId = work.dataset.categoryId;
        if (filterCategoryId == 0) {
            work.classList.remove("hidden")
        } else if (filterCategoryId != workCategoryId) {
            work.classList.add("hidden")
        } else {
            work.classList.remove("hidden")
        }
    }
}

function editPage() {
    const edition = document.querySelector('.edition');
    const tagEdit = document.querySelector('.tagEdit');
    if (localStorage.getItem('token')) {
        const logout = document.querySelector(".logout");
        logout.innerText = 'logout';
    } else {
        edition.classList.add('hidden');
        tagEdit.classList.add('hidden');
        displayButtonFilterList(categoryList)
    }
}

function openModalDelete() {
    const modalDelete = document.getElementById('modalDelete');
    modalDelete.style.display = null
    modalDelete.removeAttribute('aria-hidden');
    modalDelete.setAttribute('aria-modal', 'true');
    modalDelete.addEventListener('click', closeModalDelete);
    displayWorksModal(workList)

    const buttonAddModal = document.querySelector('.buttonAddModal');
    buttonAddModal.addEventListener('click', openModalAdd)
}

async function displayWorksModal(workList) {
    const divModal = document.querySelector('.pictures');
    if (divModal.innerHTML == "") {
        for (let i = 0; i < workList.length; i++) {
            const work = workList[i];
            const divImage = document.createElement('div');
            divImage.className = 'divImage';
            divImage.dataset.id = work.id
            const image = document.createElement('img');
            const imageBin = document.createElement('i');
            imageBin.dataset.id = work.id
            image.src = work.imageUrl;
            image.alt = work.title;
            imageBin.className = 'fa-solid fa-trash-can';
            divImage.appendChild(image);
            divImage.appendChild(imageBin);
            divModal.appendChild(divImage)
        }
    }
    deleteWorks()
}

async function deleteWorks() {
    const imageBin = document.querySelectorAll('.fa-trash-can');
    for (let bin of imageBin) {
        bin.addEventListener('click', async function () {
            const id = bin.dataset.id
            const response = await fetch(fetchUrl + `/api/works/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })
            if (response.ok) {
                bin.parentElement.remove();
                const figure = document.querySelector(`.figure[data-id='${id}']`);
                if (figure) {
                    figure.remove()
                }
            }
        })
    }
}

function closeModalDelete(event) {
    if (event.target.id == 'modalDelete' | event.target.className == 'x') {
        const modalDelete = document.getElementById('modalDelete');
        modalDelete.style.display = 'none';
        modalDelete.setAttribute('aria-hidden', 'true');
        modalDelete.removeAttribute('aria-modal');
    }
}

function closeModalAdd(event) {
    if (event.target.id == 'modalAdd' | event.target.className == 'x2') {
        const modalAdd = document.getElementById('modalAdd');
        modalAdd.style.display = 'none';
        modalAdd.setAttribute('aria-hidden', 'true');
    }
}
function clickForOpenModal() {
    const buttonModifier = document.querySelector('.button-modal');
    buttonModifier.addEventListener('click', openModalDelete)
}

function openModalAdd() {
    cleanModalAdd()
    const modalDelete = document.getElementById('modalDelete');
    modalDelete.style.display = 'none';
    const modalAdd = document.getElementById('modalAdd');
    modalAdd.style.display = null;
    modalAdd.removeAttribute('aria-hidden');
    modalAdd.setAttribute('aria-modal', 'true');
    modalAdd.addEventListener('click', closeModalAdd)
    modalAdd.querySelector('.fa-arrow-left').addEventListener('click', function () {
        modalAdd.style.display = 'none';
        openModalDelete();
    })
    modalAddDisplayPicture()
}

function cleanModalAdd() {
    document.getElementById('addTitle').value = "";
    document.getElementById('addCategory').value = "";
    const labelInuptFile = document.querySelector('.labelInuptFile');
    const imageI = document.querySelector('.fa-image');
    const fomratPicture = document.querySelector('.fomratPicture');
    const displayPicture = document.getElementById('displayPicture');
    if (displayPicture != "") {
        displayPicture.src = "";
        displayPicture.alt = "";
        labelInuptFile.style.display = 'block';
        imageI.style.display = 'block';
        fomratPicture.style.display = 'block';
    }
    colorButtonModallAdd()
}

function modalAddDisplayPicture() {
    const labelInuptFile = document.querySelector('.labelInuptFile');
    const imageI = document.querySelector('.fa-image');
    const fomratPicture = document.querySelector('.fomratPicture');
    const picture = document.getElementById('picture');
    const displayPicture = document.getElementById('displayPicture');
    picture.addEventListener('change', function () {
        displayPicture.src = window.URL.createObjectURL(this.files[0]);
        displayPicture.alt = "Nouvelle photo";
        labelInuptFile.style.display = 'none';
        imageI.style.display = 'none';
        fomratPicture.style.display = 'none';
    })
}

function colorButtonModallAdd() {
    const picture = document.getElementById('picture');
    const titre = document.getElementById('addTitle');
    const category = document.getElementById('addCategory');
    if (picture.value && titre.value && category.value) {
        const validation = document.querySelector('.validation');
        validation.style.background = '#1D6154'
    } else {
        const validation = document.querySelector('.validation');
        validation.style.background = '#A7A7A7'
    }
}

async function addWork() {
    selectCategories();
    const formAddPicture = document.querySelector('.formAddPicture');
    const picture = document.getElementById('picture');
    const titre = document.getElementById('addTitle');
    const category = document.getElementById('addCategory');
    picture.addEventListener('input', colorButtonModallAdd)
    titre.addEventListener('input', colorButtonModallAdd)
    category.addEventListener('input', colorButtonModallAdd)

    formAddPicture.addEventListener('submit', async function (event) {
        event.preventDefault();
        const picture = document.getElementById('picture').files[0];
        const titre = document.getElementById('addTitle').value;
        const category = document.getElementById('addCategory').value;

        const formAddPicture = document.querySelector('.formAddPicture')
        formAddPicture.addEventListener('click', function () {
            const errorMessage = document.querySelector('.errorMessage p');
            errorMessage.style.display = 'none';
        })

        const formData = new FormData()
        formData.append("image", picture);
        formData.append("title", titre);
        formData.append("category", category);

        const addPictureFetch = await fetch(fetchUrl + '/api/works', {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const response = await addPictureFetch.json()
        if (addPictureFetch.ok) {
            const figures = document.querySelector('.figures');
            const figure = document.createElement('figure');
            figure.className = 'figure';
            const image = document.createElement('img');
            figure.dataset.categoryId = response.categoryId;
            figure.dataset.id = response.id;
            image.src = response.imageUrl;
            image.alt = titre;
            const imageTitle = document.createElement('figcaption');
            imageTitle.innerText = titre;
            figure.appendChild(image);
            figure.appendChild(imageTitle);
            figures.appendChild(figure);

            const divModal = document.querySelector('.pictures');
            const divImage = document.createElement('div');
            divImage.className = 'divImage';
            const imageModal = document.createElement('img');
            const imageBin = document.createElement('i');
            imageBin.dataset.id = response.id;
            imageModal.src = response.imageUrl;
            imageModal.alt = titre;
            imageBin.className = 'fa-solid fa-trash-can';
            divImage.appendChild(imageModal);
            divImage.appendChild(imageBin);
            divModal.appendChild(divImage);

            const modalAdd = document.getElementById('modalAdd');
            modalAdd.style.display = 'none';
        } else if (!addPictureFetch.ok) {
            const errorMessage = document.querySelector('.errorMessage p');
            errorMessage.style.display = 'block'
        }
    })
}

async function selectCategories() {
    const selectCategory = document.getElementById('addCategory');
    const fetchCategory = await fetch(fetchUrl + '/api/categories');
    let categoryList = await fetchCategory.json();

    for (let i = 0; i < categoryList.length; i++) {
        let listCategory = categoryList[i];
        let optionCategory = document.createElement('option');
        optionCategory.innerText = listCategory.name;
        optionCategory.value = listCategory.id;
        selectCategory.appendChild(optionCategory)
    }
}

const categoryList = getCategoryList(workList);
displayWorkList(workList);
const token = localStorage.getItem('token');
editPage();
clickForOpenModal();
addWork()
