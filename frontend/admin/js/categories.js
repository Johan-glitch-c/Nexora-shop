console.log("CATEGORIES.JS LOADED");


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log("CATEGORIES DOM LOADED");

        initCategoryEvents();
        loadCategoriesAdmin();

    }
);


/* =========================================================
   INITIALIZATION
========================================================= */

function initCategoryEvents() {

    const addCategoryButton =
        document.getElementById(
            "add-category-button"
        );

    const categoryForm =
        document.getElementById(
            "category-form"
        );

    const closeModalButton =
        document.getElementById(
            "close-modal"
        );

    const cancelCategoryButton =
        document.getElementById(
            "cancel-category"
        );


    if (addCategoryButton) {

        addCategoryButton.addEventListener(
            "click",
            openCreateModal
        );

    }


    if (categoryForm) {

        categoryForm.addEventListener(
            "submit",
            saveCategory
        );

    }


    if (closeModalButton) {

        closeModalButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelCategoryButton) {

        cancelCategoryButton.addEventListener(
            "click",
            closeModal
        );

    }

}


/* =========================================================
   LOAD CATEGORIES
========================================================= */

async function loadCategoriesAdmin() {

    console.log(
        "LOAD CATEGORIES ADMIN START"
    );


    const container =
        document.getElementById(
            "categories-list"
        );


    if (!container) {

        console.error(
            "CATEGORIES LIST CONTAINER NOT FOUND"
        );

        return;
    }


    try {

        console.log(
            "CALLING GET CATEGORIES"
        );


        const response =
            await getCategories();


        console.log(
            "GET CATEGORIES RESPONSE:",
            response
        );


        /*
         * Backend can return:
         *
         * 1. Array
         * 2. { category: [...] }
         * 3. { categories: [...] }
         */

        const categories =
            Array.isArray(response)
                ? response
                : response?.category
                    ?? response?.categories
                    ?? [];


        console.log(
            "CATEGORIES ARRAY:",
            categories
        );


        if (
            !Array.isArray(categories) ||
            !categories.length
        ) {

            container.innerHTML = `
                <div class="admin-empty">
                    No categories found.
                </div>
            `;

            return;
        }


        container.innerHTML =
            categories
                .map(renderCategoryRow)
                .join("");


        attachCategoryEvents();

    } catch (error) {

        console.error(
            "LOAD CATEGORIES ERROR:",
            error
        );


        container.innerHTML = `
            <div class="admin-error">
                ${escapeHtml(
                    error?.message ||
                    "Failed to load categories."
                )}
            </div>
        `;
    }

}


/* =========================================================
   RENDER CATEGORY
========================================================= */

function renderCategoryRow(category) {

    return `
        <article
            class="admin-product-row"
            data-id="${escapeHtml(category.id)}"
        >

            <div class="admin-product-main">

                <div class="admin-product-image">

                    <div class="admin-product-no-image">
                        C
                    </div>

                </div>


                <div class="admin-product-info">

                    <h3>
                        ${escapeHtml(
                            category.name ||
                            "Unnamed category"
                        )}
                    </h3>

                    <span>
                        ID: ${escapeHtml(category.id)}
                    </span>

                </div>

            </div>


            <div class="admin-product-category">

                ${escapeHtml(
                    category.slug ||
                    "No slug"
                )}

            </div>


            <div class="admin-product-price">

                Category

            </div>


            <div class="admin-product-actions">

                <button
                    type="button"
                    class="admin-edit-button"
                    data-id="${escapeHtml(category.id)}"
                >
                    Edit
                </button>


                <button
                    type="button"
                    class="admin-delete-button"
                    data-id="${escapeHtml(category.id)}"
                >
                    Delete
                </button>

            </div>

        </article>
    `;
}


/* =========================================================
   CATEGORY EVENTS
========================================================= */

function attachCategoryEvents() {

    document
        .querySelectorAll(
            ".admin-edit-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    if (
                        !Number.isInteger(id) ||
                        id < 0
                    ) {

                        console.error(
                            "INVALID CATEGORY ID:",
                            button.dataset.id
                        );

                        return;
                    }


                    editCategory(id);

                }
            );

        });


    document
        .querySelectorAll(
            ".admin-delete-button"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );


                    if (
                        !Number.isInteger(id) ||
                        id < 0
                    ) {

                        console.error(
                            "INVALID CATEGORY ID:",
                            button.dataset.id
                        );

                        return;
                    }


                    deleteCategoryAdmin(id);

                }
            );

        });

}


/* =========================================================
   CREATE CATEGORY
========================================================= */

function openCreateModal() {

    const form =
        document.getElementById(
            "category-form"
        );


    if (!form) {

        console.error(
            "CATEGORY FORM NOT FOUND"
        );

        return;
    }


    form.reset();


    const categoryId =
        document.getElementById(
            "category-id"
        );


    if (categoryId) {

        categoryId.value = "";

    }


    const modalLabel =
        document.getElementById(
            "modal-label"
        );


    if (modalLabel) {

        modalLabel.textContent =
            "NEW CATEGORY";

    }


    const modalTitle =
        document.getElementById(
            "modal-title"
        );


    if (modalTitle) {

        modalTitle.textContent =
            "Add category";

    }


    const errorElement =
        document.getElementById(
            "category-form-error"
        );


    if (errorElement) {

        errorElement.textContent = "";

    }


    const modal =
        document.getElementById(
            "category-modal"
        );


    if (modal) {

        modal.classList.remove(
            "hidden"
        );

    }

}


/* =========================================================
   EDIT CATEGORY
========================================================= */

async function editCategory(categoryId) {

    try {

        console.log(
            "EDIT CATEGORY:",
            categoryId
        );


        const category =
            await getCategory(
                categoryId
            );


        console.log(
            "CATEGORY TO EDIT:",
            category
        );


        if (!category) {

            throw new Error(
                "Category not found."
            );

        }


        const categoryIdInput =
            document.getElementById(
                "category-id"
            );


        const categoryName =
            document.getElementById(
                "category-name"
            );


        const categorySlug =
            document.getElementById(
                "category-slug"
            );


        if (categoryIdInput) {

            categoryIdInput.value =
                category.id;

        }


        if (categoryName) {

            categoryName.value =
                category.name || "";

        }


        if (categorySlug) {

            categorySlug.value =
                category.slug || "";

        }


        const modalLabel =
            document.getElementById(
                "modal-label"
            );


        if (modalLabel) {

            modalLabel.textContent =
                "EDIT CATEGORY";

        }


        const modalTitle =
            document.getElementById(
                "modal-title"
            );


        if (modalTitle) {

            modalTitle.textContent =
                "Edit category";

        }


        const errorElement =
            document.getElementById(
                "category-form-error"
            );


        if (errorElement) {

            errorElement.textContent = "";

        }


        const modal =
            document.getElementById(
                "category-modal"
            );


        if (modal) {

            modal.classList.remove(
                "hidden"
            );

        }

    } catch (error) {

        console.error(
            "EDIT CATEGORY ERROR:",
            error
        );


        alert(
            error?.message ||
            "Failed to load category."
        );

    }

}


/* =========================================================
   SAVE CATEGORY
========================================================= */

async function saveCategory(event) {

    event.preventDefault();


    console.log(
        "SAVE CATEGORY START"
    );


    const errorElement =
        document.getElementById(
            "category-form-error"
        );


    if (errorElement) {

        errorElement.textContent = "";

    }


    const categoryId =
        document.getElementById(
            "category-id"
        )?.value.trim();


    const name =
        document.getElementById(
            "category-name"
        )?.value.trim();


    const slug =
        document.getElementById(
            "category-slug"
        )?.value.trim();


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!name) {

        showFormError(
            errorElement,
            "Category name is required."
        );

        return;
    }


    if (name.length < 5) {

        showFormError(
            errorElement,
            "Category name must be at least 5 characters."
        );

        return;
    }


    if (name.length > 100) {

        showFormError(
            errorElement,
            "Category name cannot exceed 100 characters."
        );

        return;
    }


    if (!slug) {

        showFormError(
            errorElement,
            "Category slug is required."
        );

        return;
    }


    if (slug.length < 5) {

        showFormError(
            errorElement,
            "Category slug must be at least 5 characters."
        );

        return;
    }


    if (slug.length > 100) {

        showFormError(
            errorElement,
            "Category slug cannot exceed 100 characters."
        );

        return;
    }


    const categoryData = {

        name,

        slug

    };


    console.log(
        "CATEGORY DATA:",
        categoryData
    );


    /* =====================================================
       SAVE
    ===================================================== */

    try {

        /*
         * UPDATE
         */

        if (
            categoryId !== "" &&
            categoryId !== null &&
            categoryId !== undefined
        ) {

            const id =
                Number(categoryId);


            if (
                !Number.isInteger(id) ||
                id < 0
            ) {

                throw new Error(
                    "Invalid category ID."
                );

            }


            console.log(
                "UPDATING CATEGORY:",
                id
            );


            await updateCategory(
                id,
                {
                    id,
                    ...categoryData
                }
            );

        }

        /*
         * CREATE
         */

        else {

            console.log(
                "CREATING CATEGORY"
            );


            await createCategory(
                categoryData
            );

        }


        closeModal();


        await loadCategoriesAdmin();

    } catch (error) {

        console.error(
            "SAVE CATEGORY ERROR:",
            error
        );


        showFormError(
            errorElement,
            error?.message ||
            "Failed to save category."
        );

    }

}


/* =========================================================
   DELETE CATEGORY
========================================================= */

async function deleteCategoryAdmin(categoryId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this category?"
        );


    if (!confirmed) {

        return;

    }


    try {

        console.log(
            "DELETE CATEGORY:",
            categoryId
        );


        await deleteCategory(
            categoryId
        );


        await loadCategoriesAdmin();

    } catch (error) {

        console.error(
            "DELETE CATEGORY ERROR:",
            error
        );


        alert(
            error?.message ||
            "Failed to delete category."
        );

    }

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeModal() {

    const modal =
        document.getElementById(
            "category-modal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "hidden"
    );

}


/* =========================================================
   FORM ERROR
========================================================= */

function showFormError(
    errorElement,
    message
) {

    if (errorElement) {

        errorElement.textContent =
            message;

    }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}