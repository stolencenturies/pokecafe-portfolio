
/* ==========================================
   POKÉCAFÉ - PROJECT DATABASE
========================================== */

// Add your real GitHub and demo URLs when available.
// Leave them as empty strings until then.

const projects = [

    {
        id: 1,
        name: "PokéCafé",
        category: "Frontend",
        rarity: "rare",
        icon: "☕",

        description:
            "A creative personal developer portfolio inspired by a cozy Pokémon collection.",

        technologies: ["HTML", "CSS", "JavaScript"],

        status: "Currently Building",

        githubUrl: "",
        demoUrl: ""
    },

    {
        id: 2,
        name: "WalletFlow",
        category: "Web3",
        rarity: "epic",
        icon: "💎",

        description:
            "A modern simulated cryptocurrency wallet dashboard.",

        technologies: ["React", "TypeScript", "viem"],

        status: "Planning",

        githubUrl: "",
        demoUrl: ""
    },

    {
        id: 3,
        name: "HARU Tracker",
        category: "Python",
        rarity: "legendary",
        icon: "🌸",

        description:
            "A personal productivity and habit tracking application.",

        technologies: ["Python", "OOP", "JSON"],

        status: "In Progress",

        githubUrl: "",
        demoUrl: ""
    }

];


/* ==========================================
   POKÉCAFÉ - DOM ELEMENTS
========================================== */

// Collection elements

const projectGrid = document.querySelector("#projectGrid");

const searchInput = document.querySelector("#projectSearch");

const categoryFilter = document.querySelector("#categoryFilter");

const sortSelect = document.querySelector("#sortProjects");

const noResults = document.querySelector("#noResults");

const projectCount = document.querySelector("#projectCount");

const resultsSummary = document.querySelector("#resultsSummary");

const resetFiltersButton = document.querySelector("#resetFilters");


// Modal elements

const projectModal = document.querySelector("#projectModal");

const projectDialog = document.querySelector(".project-modal");

const closeModalButton = document.querySelector("#closeModal");

const modalIcon = document.querySelector("#modalIcon");

const modalTitle = document.querySelector("#modalTitle");

const modalCategory = document.querySelector("#modalCategory");

const modalRarity = document.querySelector("#modalRarity");

const modalDescription = document.querySelector("#modalDescription");

const modalTechnologies = document.querySelector("#modalTechnologies");

const modalStatus = document.querySelector("#modalStatus");

const githubLink = document.querySelector("#githubLink");

const demoLink = document.querySelector("#demoLink");

const linkMessage = document.querySelector("#linkMessage");


// Keep track of the previously focused card

let previouslyFocusedCard = null;


/* ==========================================
   POKÉCAFÉ - SAFE ELEMENT CREATION
========================================== */

// Create an element with text and an optional class

function createElement(tag, className, text) {

    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;

}


/* ==========================================
   POKÉCAFÉ - PROJECT CARD GENERATOR
========================================== */

function displayProjects(projectList) {

    // Clear previous project cards

    projectGrid.replaceChildren();


    // Generate a card for every project

    projectList.forEach((project) => {

        // Main card

        const card = createElement("article", "flip-card");

        card.tabIndex = 0;

        card.setAttribute(
            "aria-label",
            `${project.name}. Press Enter or Space to view project details.`
        );


        // Inner card

        const cardInner = createElement("div", "card-inner");


        // FRONT SIDE

        const cardFront = createElement("div", "card-front");

        const cardNumber = createElement(
            "span",
            "card-number",
            `NO. ${String(project.id).padStart(3, "0")}`
        );

        const cardArt = createElement(
            "div",
            "card-art",
            project.icon
        );

        const frontTitle = createElement("h3", "", project.name);

        const frontCategory = createElement(
            "p",
            "",
            `${project.category} Project`
        );

        const rarity = createElement(
            "span",
            `rarity ${project.rarity}`,
            `★ ${project.rarity.toUpperCase()}`
        );

        const frontHint = createElement(
            "p",
            "card-hint",
            "Click to explore"
        );


        cardFront.append(
            cardNumber,
            cardArt,
            frontTitle,
            frontCategory,
            rarity,
            frontHint
        );


        // BACK SIDE

        const cardBack = createElement("div", "card-back");

        const backTitle = createElement("h3", "", project.name);

        const description = createElement(
            "p",
            "",
            project.description
        );

        const techStack = createElement("div", "tech-stack");


        // Generate technology tags

        project.technologies.forEach((tech) => {

            const tag = createElement("span", "", tech);

            techStack.appendChild(tag);

        });


        const backHint = createElement(
            "p",
            "card-hint",
            project.status
        );


        cardBack.append(
            backTitle,
            description,
            techStack,
            backHint
        );


        // Assemble the card

        cardInner.append(cardFront, cardBack);

        card.appendChild(cardInner);


        // Click interaction

        card.addEventListener("click", () => {

            openProjectModal(project, card);

        });


        // Keyboard interaction

        card.addEventListener("keydown", (event) => {

            if (event.key === "Enter" || event.key === " ") {

                event.preventDefault();

                openProjectModal(project, card);

            }

        });


        // Add card to the page

        projectGrid.appendChild(card);

    });


    // Initialize tilt on newly created cards

    initializeCardTilt();

}


/* ==========================================
   POKÉCAFÉ - SEARCH AND FILTER
========================================== */

function filterProjects() {

    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedCategory =
        categoryFilter.value;

    const selectedSort =
        sortSelect.value;


    // STEP 1: SEARCH AND FILTER

    let filteredProjects = projects.filter((project) => {

        const searchableText = [

            project.name,

            project.description,

            project.category,

            project.status,

            ...project.technologies

        ].join(" ").toLowerCase();


        const matchesSearch =
            searchableText.includes(searchText);


        const matchesCategory =
            selectedCategory === "all" ||
            project.category === selectedCategory;


        return matchesSearch && matchesCategory;

    });


    // STEP 2: SORT

    filteredProjects = [...filteredProjects];


    if (selectedSort === "name-asc") {

        filteredProjects.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    }

    else if (selectedSort === "name-desc") {

        filteredProjects.sort((a, b) =>
            b.name.localeCompare(a.name)
        );

    }

    else if (selectedSort === "newest") {

        filteredProjects.sort((a, b) =>
            b.id - a.id
        );

    }

    else if (selectedSort === "rarity") {

        const rarityOrder = {

            legendary: 3,
            epic: 2,
            rare: 1

        };

        filteredProjects.sort((a, b) => {

            return (
                (rarityOrder[b.rarity] ?? 0) -
                (rarityOrder[a.rarity] ?? 0)
            );

        });

    }


    // STEP 3: RENDER

    displayProjects(filteredProjects);


    // STEP 4: UPDATE RESULTS INFORMATION

    projectCount.textContent = projects.length;

    resultsSummary.textContent =
        `Showing ${filteredProjects.length} of ${projects.length} projects`;


    // STEP 5: EMPTY STATE

    noResults.hidden = filteredProjects.length !== 0;

}


/* ==========================================
   POKÉCAFÉ - PROJECT LINK MANAGEMENT
========================================== */

// Only accept HTTPS links for external project resources.

function configureProjectLink(element, url) {

    const validUrl =
        typeof url === "string" &&
        /^https:\/\//i.test(url);


    if (validUrl) {

        element.href = url;

        element.hidden = false;

    }

    else {

        element.removeAttribute("href");

        element.hidden = true;

    }

}


/* ==========================================
   POKÉCAFÉ - PROJECT DETAILS MODAL
========================================== */

function openProjectModal(project, card) {

    // Remember the card that opened the modal

    previouslyFocusedCard = card;


    // Populate project information

    modalIcon.textContent = project.icon;

    modalTitle.textContent = project.name;

    modalCategory.textContent = project.category;

    modalRarity.textContent =
        `★ ${project.rarity.toUpperCase()}`;

    modalRarity.className =
        `rarity ${project.rarity}`;

    modalDescription.textContent =
        project.description;

    modalStatus.textContent =
        project.status;


    // Clear old technology tags

    modalTechnologies.replaceChildren();


    // Generate new technology tags

    project.technologies.forEach((tech) => {

        const tag = createElement("span", "", tech);

        modalTechnologies.appendChild(tag);

    });


    // Configure project links

    configureProjectLink(githubLink, project.githubUrl);

    configureProjectLink(demoLink, project.demoUrl);


    // Show message if neither link is available

    const hasLinks =
        githubLink.hidden === false ||
        demoLink.hidden === false;

    linkMessage.hidden = hasLinks;


    // Open modal

    projectModal.hidden = false;

    projectModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";


    // Move focus into modal

    closeModalButton.focus();

}


/* ==========================================
   POKÉCAFÉ - CLOSE PROJECT MODAL
========================================== */

function closeProjectModal() {

    if (projectModal.hidden) return;


    // Hide modal

    projectModal.hidden = true;

    projectModal.setAttribute("aria-hidden", "true");


    // Restore page scrolling

    document.body.style.overflow = "";


    // Restore focus to original card if it still exists

    if (
        previouslyFocusedCard &&
        previouslyFocusedCard.isConnected
    ) {

        previouslyFocusedCard.focus();

    }

    previouslyFocusedCard = null;

}


/* ==========================================
   POKÉCAFÉ - MODAL FOCUS MANAGEMENT
========================================== */

function trapModalFocus(event) {

    if (
        event.key !== "Tab" ||
        projectModal.hidden
    ) {
        return;
    }


    const focusableElements = [

        closeModalButton,

        ...projectModal.querySelectorAll(
            'a[href]:not([hidden]), button:not([hidden]), [tabindex="0"]'
        )

    ].filter((element) => {

        return !element.disabled && element.offsetParent !== null;

    });


    if (focusableElements.length === 0) {

        event.preventDefault();

        projectDialog.focus();

        return;

    }


    const firstElement = focusableElements[0];

    const lastElement =
        focusableElements[focusableElements.length - 1];


    if (
        event.shiftKey &&
        document.activeElement === firstElement
    ) {

        event.preventDefault();

        lastElement.focus();

    }

    else if (
        !event.shiftKey &&
        document.activeElement === lastElement
    ) {

        event.preventDefault();

        firstElement.focus();

    }

}


/* ==========================================
   POKÉCAFÉ - MODAL EVENT LISTENERS
========================================== */

// Close button

closeModalButton.addEventListener(
    "click",
    closeProjectModal
);


// Close by clicking the background

projectModal.addEventListener("click", (event) => {

    if (event.target === projectModal) {

        closeProjectModal();

    }

});


// Keyboard interactions

document.addEventListener("keydown", (event) => {

    if (projectModal.hidden) return;


    if (event.key === "Escape") {

        closeProjectModal();

        return;

    }


    trapModalFocus(event);

});


/* ==========================================
   POKÉCAFÉ - 3D CARD TILT
========================================== */

function initializeCardTilt() {

    const cards =
        document.querySelectorAll(".flip-card");

    const maxTilt = 12;


    cards.forEach((card) => {

        card.addEventListener("pointermove", (event) => {

            if (event.pointerType === "touch") return;


            const rect =
                card.getBoundingClientRect();


            const mouseX =
                event.clientX - rect.left;

            const mouseY =
                event.clientY - rect.top;


            const x =
                (mouseX / rect.width) * 2 - 1;

            const y =
                (mouseY / rect.height) * 2 - 1;


            const rotateY = x * maxTilt;

            const rotateX = -y * maxTilt;


            card.style.transform =
                `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

        });


        card.addEventListener("pointerleave", () => {

            card.style.transform =
                "rotateX(0deg) rotateY(0deg)";

        });

    });

}


/* ==========================================
   POKÉCAFÉ - RESET FILTERS
========================================== */

function resetFilters() {

    searchInput.value = "";

    categoryFilter.value = "all";

    sortSelect.value = "default";


    filterProjects();

}


/* ==========================================
   POKÉCAFÉ - EVENT LISTENERS
========================================== */

// Search

searchInput.addEventListener(
    "input",
    filterProjects
);


// Category filter

categoryFilter.addEventListener(
    "change",
    filterProjects
);


// Sorting

sortSelect.addEventListener(
    "change",
    filterProjects
);


// Reset filters

resetFiltersButton.addEventListener(
    "click",
    resetFilters
);


/* ==========================================
   POKÉCAFÉ - INITIALIZATION
========================================== */

// Render projects when the page loads

filterProjects();

