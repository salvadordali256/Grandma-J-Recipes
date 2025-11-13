document.addEventListener('DOMContentLoaded', () => {
    if (!Array.isArray(window.blueRecipes) || window.blueRecipes.length === 0) {
        return;
    }

    const searchInput = document.getElementById('blueSearch');
    const clearBtn = document.getElementById('blueClear');
    const sectionListEl = document.getElementById('blueSectionList');
    const statsEl = document.getElementById('blueStats');
    const noResultsEl = document.getElementById('blueNoResults');
    const categoryIndexEl = document.getElementById('blueCategoryIndex');

    const totalRecipes = blueRecipes.reduce((sum, section) => sum + section.recipes.length, 0);
    const totalSections = blueRecipes.length;

    function recipeMatches(recipe, filter, sectionLabel) {
        if (!filter) return true;
        const haystack = [
            sectionLabel || '',
            recipe.title || '',
            ...(recipe.content || [])
        ]
            .join(' ')
            .toLowerCase();
        return haystack.includes(filter);
    }

    function renderIndex() {
        const fragment = document.createDocumentFragment();
        blueRecipes.forEach(section => {
            const link = document.createElement('a');
            link.href = `#section-${section.slug}`;
            link.textContent = section.section;
            fragment.appendChild(link);
        });
        categoryIndexEl.innerHTML = '';
        categoryIndexEl.appendChild(fragment);
    }

    function updateStats(sectionCount, recipeCount, isFiltered) {
        const prefix = isFiltered ? 'Filtered' : 'Showing';
        statsEl.textContent = `${prefix} ${sectionCount} section${sectionCount === 1 ? '' : 's'} • ${recipeCount} recipe${recipeCount === 1 ? '' : 's'}`;
    }

    function renderSections(filterValue = '') {
        const filter = filterValue.trim().toLowerCase();
        let visibleSections = 0;
        let visibleRecipes = 0;

        const fragment = document.createDocumentFragment();

        blueRecipes.forEach(section => {
            const matches = section.recipes.filter(recipe => recipeMatches(recipe, filter, section.section));

            if (matches.length === 0) {
                return;
            }

            visibleSections += 1;
            visibleRecipes += matches.length;

            const sectionEl = document.createElement('section');
            sectionEl.className = 'blue-section-card';
            sectionEl.id = `section-${section.slug}`;

            const header = document.createElement('div');
            header.className = 'blue-section-header';

            const title = document.createElement('h3');
            title.className = 'blue-section-title';
            title.textContent = section.section;

            const count = document.createElement('span');
            count.className = 'blue-section-count';
            count.textContent = `${matches.length} recipe${matches.length === 1 ? '' : 's'}`;

            header.appendChild(title);
            header.appendChild(count);

            const grid = document.createElement('div');
            grid.className = 'blue-recipe-grid';

            matches.forEach((recipe, idx) => {
                const card = document.createElement('article');
                card.className = 'blue-recipe-card';

                const headerRow = document.createElement('div');
                headerRow.className = 'blue-recipe-card-header';

                const numberBadge = document.createElement('span');
                numberBadge.className = 'blue-recipe-number';
                numberBadge.textContent = `${idx + 1}.`;

                const recipeTitle = document.createElement('h4');
                recipeTitle.className = 'blue-recipe-title';
                recipeTitle.textContent = recipe.title;

                headerRow.appendChild(numberBadge);
                headerRow.appendChild(recipeTitle);

                const body = document.createElement('div');
                body.className = 'blue-recipe-body';

                if (Array.isArray(recipe.content) && recipe.content.length) {
                    recipe.content.forEach(line => {
                        const p = document.createElement('p');
                        p.className = 'blue-recipe-line';
                        p.textContent = line;
                        body.appendChild(p);
                    });
                } else {
                    const p = document.createElement('p');
                    p.className = 'blue-recipe-placeholder';
                    p.textContent = 'No additional text was found for this recipe in the source document.';
                    body.appendChild(p);
                }

                card.appendChild(headerRow);
                card.appendChild(body);
                grid.appendChild(card);
            });

            sectionEl.appendChild(header);
            sectionEl.appendChild(grid);
            fragment.appendChild(sectionEl);
        });

        sectionListEl.innerHTML = '';
        sectionListEl.appendChild(fragment);

        const noMatches = visibleSections === 0;
        noResultsEl.style.display = noMatches ? 'block' : 'none';
        updateStats(noMatches ? 0 : visibleSections, noMatches ? 0 : visibleRecipes, Boolean(filter));
    }

    renderIndex();
    renderSections();
    updateStats(totalSections, totalRecipes, false);

    searchInput.addEventListener('input', () => {
        renderSections(searchInput.value);
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        renderSections('');
    });
});
