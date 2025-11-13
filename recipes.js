// Grandma Pauline's Recipe Collection
const recipes = [
    // MEATS
    {
        id: 1,
        title: "Pampered Beef Filets with Royal Mushroom Sauce",
        category: "meats",
        source: "",
        ingredients: [
            "6 large mushroom crowns",
            "2 tablespoons butter or margarine",
            "6 beef filets"
        ],
        instructions: "Trim and chip-carve six large mushroom crowns (you'll use chopped stems in sauce). Holding sharp paring knife on slant, cut V-shaped piece, not too deep, out of center tops of mushrooms. Make second cut at right angle to first. Heat 2 tablespoons butter or margarine in heavy skillet till golden brown and bubbling. Quickly brown steaks on both sides over moderately high heat. Place filets on squares of heavy foil on baking sheet. Make royal mushroom sauce according to recipe on page 95. Spoon 2 tablespoons sauce over each filet; top each with a mushroom crown. Bring corners of each foil square up over steak, and twist gently, leaving top slightly open. Complete cooking in extremely hot oven (500 degrees) 12 min for rare, 15 min for medium, and 18 min for well done. Or, refrigerate meat before finishing off in oven and allow those chilly steaks to cook 10 minutes longer at party time.",
        servings: "6"
    },
    {
        id: 2,
        title: "Pork Tenderloin with Honey Mustard",
        category: "meats",
        source: "Reynolds",
        ingredients: [
            "1 Reynolds Oven Bag, large size (14\"X 20\")",
            "1 tablespoon flour",
            "1/3 cup orange juice",
            "2 tablespoons honey",
            "2 tablespoons Dijon mustard",
            "2 pork tenderloins (3/4 lb each)",
            "Dried Basil",
            "Seasoned Salt",
            "4 medium carrots, sliced",
            "2 medium apples, cored, cut in eights"
        ],
        instructions: "PREHEAT oven to 350 degrees. SHAKE flour in Reynolds oven bag; place in 13X9X2 in baking pan. ADD orange juice, honey, and mustard to oven bag. Squeeze oven bag to blend in flour. Sprinkle tenderloins with basil and seasoned salt. Place in oven bag, tucking the narrow end of each tenderloin under for even cooking. Place carrot and apple slices in oven bag around tenderloins. CLOSE oven bag with nylon tie; cut six ½ in slits in top. BAKE 40-45 min or until meat thermometer reads 160 degrees.",
        servings: "4"
    },
    {
        id: 3,
        title: "Quick Swedish Meatballs",
        category: "meats",
        source: "",
        ingredients: [
            "2 lbs ground beef",
            "2 X 3-oz packages cream cheese",
            "¼ cup dry onion soup mix",
            "½ tsp salt",
            "½ tsp nutmeg",
            "2 cups soft bread crumbs",
            "½ cup milk",
            "2 tablespoons all-purpose flour",
            "2 cups milk"
        ],
        instructions: "Thoroughly combine the meat, cheese, soup mix, salt, nutmeg, bread crumbs, and the ½ cup milk. Shape into about 40 small balls. Brown lightly in large skillet, shaking the skillet to keep the balls round. Cover and cook 20-25 min or till done. Remove meat; drain off excess fat, leaving ¼ cup in skillet. Blend flour into fat; stir in the 2 cups milk. Cook and stir till gravy thickens. Return meatballs to gravy.",
        servings: "6-8"
    },
    {
        id: 4,
        title: "Roast Brisket with Barbeque Sauce",
        category: "meats",
        source: "",
        ingredients: [
            "1 beef brisket, about 3-4 lbs",
            "2 cloves fresh garlic, diced or garlic salt to taste",
            "3 large onions, quartered",
            "1 green pepper, cut in squares",
            "4 thick carrots, scraped, cut into 1 ½ in pieces",
            "3-4 potatoes, peeled, halved",
            "1 ½ cups water",
            "¾ cup barbecue sauce",
            "¾ cup chili sauce",
            "Salt, pepper to taste"
        ],
        instructions: "Rinse brisket in cold water. Season with garlic or garlic salt and put in roasting pan. Leave enough room around meat for carrots and potatoes. Let meat brown-fat side up-for about 30 min in oven set at 425 degrees. Add quartered onions and green pepper to pan, continue to brown until onion edges start to turn brown. If too brown, add ½ cup of water. Turn meat and brown for about 20 min on flip side. After browning, add carrots, potato halves, water, barbeque sauce, and chili sauce. Let cook, uncovered, for about 2 hrs, basting occasionally. Do not hurry process. If it takes a little longer to brown, it's ok. After at least 2 hrs (or when it looks brown), lower heat to 350 degrees and cover with foil or a roaster cover.",
        servings: "8-10"
    },
    {
        id: 5,
        title: "Roast Pork Tenderloin",
        category: "meats",
        source: "",
        ingredients: [
            "1 teaspoon dried whole rosemary, crushed",
            "1 teaspoon dried whole thyme",
            "1 large garlic clove, minced",
            "3 X 11 oz. each pork tenderloins",
            "¼ cup butter or margarine, melted"
        ],
        instructions: "Combine herbs and garlic; set aside. Brush tenderloins with butter, and roll in herb mixture, coating evenly. Place tenderloins, fat side up, on a rack in shallow roasting pan. Drizzle any remaining butter over meat. Bake tenderloins at 350 degrees for 1 ½ hours.",
        servings: "6"
    },
    {
        id: 6,
        title: "Sirloin Steak Au Roquefort",
        category: "meats",
        source: "",
        ingredients: [
            "1 envelope dry blue-cheese salad dressing mix",
            "3 lb sirloin steak about 1 ¼ inches thick",
            "¼ cup crumbled Roquefort or blue cheese"
        ],
        instructions: "Prepare blue-cheese salad dressing mix as the package label directs. Marinate steak in salad dressing in large dish for 1 hour; turn once. Adjust grill 5 inches from prepared coals. For medium rare, grill the steak 8 min on one side. Then carefully turn steak with tongs. Sprinkle top evenly with cheese. Grill 8 minutes. To Cook Indoors: Marinate steak as directed above. Broil, on rack in broiler pan, 3 inches from heat, 5 min. Turn; broil 5 min. Sprinkle top with cheese, and let cheese melt slightly before serving.",
        servings: "6"
    },
    {
        id: 7,
        title: "Mrs. Appleyard's Meat Pie",
        category: "meats",
        source: "Mrs. Appleyard",
        ingredients: [
            "4 lbs chuck steak, cut into 1 ½ cubes",
            "5 tablespoons flour",
            "1 teaspoon poultry seasoning",
            "½ teaspoon pepper",
            "¼ teaspoon nutmeg",
            "¼ teaspoon cinnamon",
            "¼ teaspoon ginger",
            "5 tablespoons butter",
            "2 cups tomato juice",
            "1 cup beef bouillon or consommé",
            "2 teaspoons salt",
            "½ teaspoon thyme",
            "½ teaspoon oregano",
            "2 cups tender carrots, sliced",
            "16 small white onions",
            "2 packages frozen green peas",
            "1 tablespoon sugar",
            "2 tablespoons flour for roux",
            "Buttermilk biscuits"
        ],
        instructions: "Mix flour with poultry seasoning, pepper, nutmeg, cinnamon, and ginger in a paper bag. Shake the cubes of beef in seasoned flour until thoroughly coated. In a large frying pan, melt butter. Reduce heat and brown the beef slowly, turning occasionally. Cover meat with tomato juice and beef bouillon. Season with salt, thyme, and oregano. Cover and let meat simmer gently-never let it boil-for 2 hrs. Meanwhile, peel and slice carrots, and peel onions. About 45 min before meat is done, cook the carrots and onions in beef bouillon and tomato juice. After 40 min of cooking, add frozen green peas. Cook for 5 min. Transfer meat to a large pan or casserole. Stir in vegetables and sugar. Set over medium heat on top of range. Make a roux of flour. Stir into sauce until well blended. Let sauce come to boil and arrange buttermilk biscuits on top.",
        servings: "8-10"
    },
    {
        id: 8,
        title: "Velveeta Frankfurter Roll",
        category: "meats",
        source: "",
        ingredients: [
            "½ lb Velveeta cheese",
            "½ small onion",
            "1 medium-sized green pepper",
            "6 slices bacon, cooked",
            "½ cup condensed tomato soup (undiluted)",
            "½ tsp salt",
            "Dash of cayenne",
            "Dash of Worcestershire sauce",
            "4 frankfurter buns"
        ],
        instructions: "Grind Velveeta, onion, green pepper, and cooked bacon. Add tomato soup, salt, cayenne, and Worcestershire sauce, and blend well. Split frankfurter buns, spread bottom halves with filling; cover with tops. Place in 400 degree oven until filling melts. Serve hot, garnished with radish roses.",
        servings: "4"
    },

    // ORIENTAL COOKING
    {
        id: 100,
        title: "Egg Rolls",
        category: "oriental",
        source: "Janie",
        ingredients: [
            "1 lb ground pork",
            "1 cup finely chopped cabbage",
            "½ cup chopped onion",
            "½ cup bean sprouts",
            "2 tablespoons soy sauce",
            "Egg roll wrappers",
            "Oil for frying"
        ],
        instructions: "Cook ground pork until browned. Add vegetables and soy sauce. Cook until tender. Place mixture on egg roll wrappers, roll up and seal edges. Deep fry until golden brown.",
        servings: "6-8"
    },
    {
        id: 101,
        title: "Chinese Beef and Rice",
        category: "oriental",
        source: "",
        ingredients: [
            "2 lbs beef, cubed",
            "2 tablespoons oil",
            "1 onion, sliced",
            "2 cups beef broth",
            "3 tablespoons soy sauce",
            "2 cups rice",
            "Vegetables as desired"
        ],
        instructions: "Brown beef in oil. Add onion and cook until tender. Add broth and soy sauce. Simmer until beef is tender. Serve over cooked rice with vegetables.",
        servings: "6"
    },
    {
        id: 102,
        title: "Chinese Walnut Chicken",
        category: "oriental",
        source: "",
        ingredients: [
            "2 lbs chicken, cubed",
            "1 cup walnuts",
            "2 tablespoons soy sauce",
            "1 tablespoon cornstarch",
            "½ cup chicken broth",
            "Oil for cooking"
        ],
        instructions: "Stir-fry chicken in hot oil until cooked. Add walnuts. Mix soy sauce, cornstarch and broth. Add to chicken and cook until thickened.",
        servings: "4-6"
    },
    {
        id: 103,
        title: "Sukiyaki",
        category: "oriental",
        source: "",
        ingredients: [
            "1 lb beef, thinly sliced",
            "½ cup soy sauce",
            "¼ cup sugar",
            "1 cup beef broth",
            "Vegetables (cabbage, onions, mushrooms, bamboo shoots)",
            "Tofu cubes"
        ],
        instructions: "Cook at table in electric skillet. Brown beef quickly. Add vegetables, soy sauce, sugar, and broth. Simmer until vegetables are tender-crisp. Add tofu cubes. Serve over rice.",
        servings: "4-6"
    },

    // PASTA
    {
        id: 200,
        title: "One Pot Pasta",
        category: "pasta",
        source: "",
        ingredients: [
            "1 lb pasta",
            "2 cups tomato sauce",
            "2 cups water",
            "1 onion, diced",
            "2 cloves garlic, minced",
            "Italian seasonings"
        ],
        instructions: "Combine all ingredients in large pot. Bring to boil, then reduce heat and simmer until pasta is cooked and liquid is absorbed, stirring occasionally.",
        servings: "6"
    },
    {
        id: 201,
        title: "Pasta with Fontina Cheese",
        category: "pasta",
        source: "",
        ingredients: [
            "1 lb pasta",
            "8 oz Fontina cheese, cubed",
            "½ cup butter",
            "½ cup cream",
            "Freshly ground pepper"
        ],
        instructions: "Cook pasta according to package directions. Drain and return to pot. Add cheese, butter, and cream. Toss until cheese melts. Season with pepper.",
        servings: "4-6"
    },
    {
        id: 202,
        title: "Zucchini Pizza",
        category: "pasta",
        source: "",
        ingredients: [
            "3 cups grated zucchini",
            "3 eggs",
            "1 cup flour",
            "Pizza sauce",
            "Mozzarella cheese",
            "Toppings as desired"
        ],
        instructions: "Mix zucchini, eggs, and flour. Spread in greased pan. Bake at 400°F for 20 minutes. Top with sauce, cheese, and toppings. Bake until cheese melts.",
        servings: "6"
    },

    // PASTRY & PIES
    {
        id: 300,
        title: "Lemon Pie",
        category: "pastry",
        source: "Staley's",
        ingredients: [
            "1 cup sugar",
            "3 tablespoons cornstarch",
            "1 ½ cups water",
            "3 egg yolks, beaten",
            "2 tablespoons butter",
            "Juice and rind of 1 lemon",
            "1 baked pie shell"
        ],
        instructions: "Mix sugar and cornstarch in saucepan. Add water gradually. Cook over medium heat, stirring constantly until thick. Add small amount to egg yolks, then return to pan. Cook 2 minutes more. Remove from heat, add butter, lemon juice and rind. Pour into baked shell. Top with meringue and brown.",
        servings: "8"
    },
    {
        id: 301,
        title: "Blueberry Pie",
        category: "pastry",
        source: "Carrie H.",
        ingredients: [
            "4 cups fresh blueberries",
            "1 cup sugar",
            "3 tablespoons cornstarch",
            "¼ teaspoon salt",
            "1 tablespoon lemon juice",
            "2 tablespoons butter",
            "Pastry for 2-crust pie"
        ],
        instructions: "Mix sugar, cornstarch, and salt. Add to blueberries with lemon juice. Pour into pastry-lined pie pan. Dot with butter. Cover with top crust. Bake at 425°F for 35-40 minutes.",
        servings: "8"
    },
    {
        id: 302,
        title: "Toll House Pie",
        category: "pastry",
        source: "",
        ingredients: [
            "2 eggs",
            "½ cup flour",
            "½ cup sugar",
            "½ cup brown sugar, packed",
            "1 cup butter, melted and cooled",
            "1 cup chocolate chips",
            "1 cup chopped walnuts",
            "1 unbaked 9-inch pie shell"
        ],
        instructions: "Beat eggs until foamy. Beat in flour and sugars. Blend in melted butter. Stir in chocolate chips and nuts. Pour into pie shell. Bake at 325°F for 1 hour.",
        servings: "8"
    },
    {
        id: 303,
        title: "Pecan Pie",
        category: "pastry",
        source: "",
        ingredients: [
            "3 eggs",
            "1 cup sugar",
            "1 cup dark corn syrup",
            "2 tablespoons butter, melted",
            "1 teaspoon vanilla",
            "1 ½ cups pecans",
            "1 unbaked 9-inch pie shell"
        ],
        instructions: "Beat eggs lightly. Add sugar, corn syrup, butter, and vanilla. Mix well. Stir in pecans. Pour into pie shell. Bake at 350°F for 50-55 minutes until set.",
        servings: "8"
    },
    {
        id: 304,
        title: "Rhubarb Pie",
        category: "pastry",
        source: "",
        ingredients: [
            "4 cups diced rhubarb",
            "1 ½ cups sugar",
            "¼ cup flour",
            "¼ teaspoon salt",
            "2 tablespoons butter",
            "Pastry for 2-crust pie"
        ],
        instructions: "Mix sugar, flour, and salt. Add to rhubarb and let stand 15 minutes. Pour into pastry-lined pie pan. Dot with butter. Cover with top crust. Bake at 425°F for 10 minutes, then 350°F for 30 minutes.",
        servings: "8"
    },
    {
        id: 305,
        title: "Impossible Pie",
        category: "pastry",
        source: "Aunt Emma",
        ingredients: [
            "4 eggs",
            "2 cups milk",
            "½ cup flour",
            "1 cup sugar",
            "½ cup butter, melted",
            "1 teaspoon vanilla",
            "1 cup coconut"
        ],
        instructions: "Beat all ingredients together. Pour into greased 10-inch pie pan. Bake at 350°F for 45-50 minutes. Makes its own crust!",
        servings: "8"
    },

    // PRESERVES & CANNING
    {
        id: 400,
        title: "Rhubarb Jam",
        category: "preserves",
        source: "",
        ingredients: [
            "4 cups diced rhubarb",
            "4 cups sugar",
            "1 package strawberry Jell-O"
        ],
        instructions: "Mix rhubarb and sugar. Let stand overnight. Cook until thick, about 30 minutes. Remove from heat and stir in Jell-O. Pour into jars and seal.",
        servings: "Makes 4-5 cups"
    },
    {
        id: 401,
        title: "Sweet Dill Pickles",
        category: "preserves",
        source: "Grandma McKee",
        ingredients: [
            "Dill pickles, sliced",
            "2 cups sugar",
            "1 cup vinegar",
            "Pickling spices"
        ],
        instructions: "Drain pickles. Mix sugar and vinegar. Pour over pickles. Add pickling spices. Let stand 24 hours before using.",
        servings: "Varies"
    },
    {
        id: 402,
        title: "Uncooked Jam",
        category: "preserves",
        source: "",
        ingredients: [
            "2 cups crushed strawberries",
            "4 cups sugar",
            "1 package fruit pectin",
            "¾ cup water"
        ],
        instructions: "Mix berries with sugar. Let stand 20 minutes. Boil pectin and water for 1 minute. Pour over fruit mixture and stir 2 minutes. Pour into jars. Let stand at room temperature 24 hours, then freeze.",
        servings: "Makes 5 cups"
    },

    // POULTRY
    {
        id: 500,
        title: "Quick Turkey Curry",
        category: "poultry",
        source: "",
        ingredients: [
            "3 cups cooked turkey, diced",
            "2 tablespoons butter",
            "1 onion, chopped",
            "2 tablespoons flour",
            "1-2 teaspoons curry powder",
            "2 cups chicken broth",
            "½ cup cream"
        ],
        instructions: "Sauté onion in butter. Stir in flour and curry powder. Gradually add broth, stirring constantly. Add turkey and cream. Heat through. Serve over rice.",
        servings: "6"
    },
    {
        id: 501,
        title: "Roast Chicken with Lemon and Rosemary",
        category: "poultry",
        source: "",
        ingredients: [
            "1 whole chicken (3-4 lbs)",
            "2 lemons",
            "4 sprigs fresh rosemary",
            "4 tablespoons butter, softened",
            "Salt and pepper"
        ],
        instructions: "Preheat oven to 425°F. Rub chicken with butter, salt, and pepper. Place lemon halves and rosemary in cavity. Roast for 1 hour or until juices run clear.",
        servings: "4-6"
    },
    {
        id: 502,
        title: "Party Chicken",
        category: "poultry",
        source: "",
        ingredients: [
            "6 chicken breast halves",
            "1 cup sour cream",
            "2 tablespoons lemon juice",
            "2 teaspoons Worcestershire sauce",
            "1 teaspoon paprika",
            "1 cup bread crumbs",
            "½ cup butter, melted"
        ],
        instructions: "Mix sour cream, lemon juice, Worcestershire, and paprika. Coat chicken and refrigerate overnight. Roll in crumbs and place in baking dish. Drizzle with butter. Bake at 350°F for 45 minutes.",
        servings: "6"
    },
    {
        id: 503,
        title: "Butter-Crisp Chicken",
        category: "poultry",
        source: "Beatrice Cooke",
        ingredients: [
            "2 lbs chicken pieces",
            "1 cup flour",
            "1 teaspoon salt",
            "½ teaspoon pepper",
            "½ cup butter, melted"
        ],
        instructions: "Mix flour, salt, and pepper. Coat chicken pieces. Place in baking dish and pour melted butter over top. Bake at 375°F for 1 hour until golden and crispy.",
        servings: "4-6"
    },

    // SALADS & DRESSINGS
    {
        id: 600,
        title: "Cranberry Salad",
        category: "salads",
        source: "Pauline Jurgens",
        ingredients: [
            "1 package cranberries",
            "2 cups sugar",
            "1 package lemon Jell-O",
            "1 cup hot water",
            "1 cup chopped celery",
            "1 cup chopped apples",
            "½ cup chopped nuts"
        ],
        instructions: "Grind cranberries and mix with sugar. Let stand. Dissolve Jell-O in hot water. Add cranberry mixture, celery, apples, and nuts. Chill until set.",
        servings: "8-10"
    },
    {
        id: 601,
        title: "Spinach Salad",
        category: "salads",
        source: "PEO Luncheon",
        ingredients: [
            "Fresh spinach, torn",
            "6 slices bacon, cooked and crumbled",
            "2 hard-boiled eggs, chopped",
            "1 cup sliced mushrooms",
            "¼ cup sugar",
            "¼ cup vinegar",
            "½ cup oil",
            "1 teaspoon salt"
        ],
        instructions: "Mix sugar, vinegar, oil, and salt for dressing. Toss spinach with bacon, eggs, and mushrooms. Pour dressing over just before serving.",
        servings: "6-8"
    },
    {
        id: 602,
        title: "Caesar Salad",
        category: "salads",
        source: "Janie",
        ingredients: [
            "1 head romaine lettuce",
            "½ cup olive oil",
            "2 cloves garlic, crushed",
            "1 egg",
            "Juice of 1 lemon",
            "Worcestershire sauce",
            "Parmesan cheese",
            "Croutons"
        ],
        instructions: "Tear lettuce into bowl. Mix oil with garlic. Add egg, lemon juice, and Worcestershire. Toss with lettuce. Top with cheese and croutons.",
        servings: "4-6"
    },

    // SANDWICHES
    {
        id: 700,
        title: "Barbecue Chicken Sandwich",
        category: "sandwiches",
        source: "",
        ingredients: [
            "3 cups cooked chicken, shredded",
            "1 cup barbecue sauce",
            "½ cup chopped onion",
            "Hamburger buns"
        ],
        instructions: "Mix chicken with barbecue sauce and onion. Heat through. Serve on buns.",
        servings: "6"
    },
    {
        id: 701,
        title: "Hot Ham & Cheese Sandwiches",
        category: "sandwiches",
        source: "Charlotte Dipper",
        ingredients: [
            "8 dinner rolls",
            "½ lb ham, sliced",
            "8 slices Swiss cheese",
            "½ cup butter, melted",
            "2 tablespoons poppy seeds",
            "1 tablespoon mustard"
        ],
        instructions: "Split rolls and fill with ham and cheese. Mix butter, poppy seeds, and mustard. Brush over tops. Wrap in foil and bake at 350°F for 15 minutes.",
        servings: "8"
    },

    // SAUCES & GRAVIES
    {
        id: 800,
        title: "Chocolate Honey Sauce",
        category: "sauces",
        source: "",
        ingredients: [
            "½ cup honey",
            "¼ cup cocoa",
            "¼ cup butter",
            "¼ cup cream"
        ],
        instructions: "Combine all ingredients in saucepan. Heat, stirring until smooth. Serve warm over ice cream or cake.",
        servings: "Makes 1 cup"
    },
    {
        id: 801,
        title: "Bearnaise Sauce",
        category: "sauces",
        source: "",
        ingredients: [
            "3 egg yolks",
            "1 tablespoon lemon juice",
            "½ cup butter",
            "1 tablespoon tarragon vinegar",
            "1 tablespoon chopped tarragon"
        ],
        instructions: "Beat egg yolks with lemon juice in top of double boiler. Add butter gradually, beating constantly. Stir in vinegar and tarragon. Serve with beef or fish.",
        servings: "Makes ¾ cup"
    },

    // SOUPS
    {
        id: 900,
        title: "Vegetable Minestrone",
        category: "soups",
        source: "Grandma J.",
        ingredients: [
            "2 tablespoons olive oil",
            "1 onion, chopped",
            "2 cloves garlic, minced",
            "2 carrots, diced",
            "2 celery stalks, diced",
            "1 can tomatoes",
            "6 cups beef broth",
            "1 can kidney beans",
            "1 cup small pasta",
            "Italian seasonings"
        ],
        instructions: "Sauté onion and garlic in oil. Add carrots and celery. Cook 5 minutes. Add tomatoes, broth, and seasonings. Simmer 30 minutes. Add beans and pasta. Cook until pasta is tender.",
        servings: "8"
    },
    {
        id: 901,
        title: "Cream of Broccoli Soup",
        category: "soups",
        source: "",
        ingredients: [
            "2 cups chopped broccoli",
            "½ cup chopped onion",
            "2 cups chicken broth",
            "2 tablespoons butter",
            "2 tablespoons flour",
            "2 cups milk",
            "Salt and pepper"
        ],
        instructions: "Cook broccoli and onion in broth until tender. Make white sauce with butter, flour, and milk. Combine with broccoli mixture. Season to taste.",
        servings: "6"
    },
    {
        id: 902,
        title: "Wild Rice Soup",
        category: "soups",
        source: "Viola Reeder",
        ingredients: [
            "1 cup wild rice",
            "4 cups chicken broth",
            "1 onion, chopped",
            "2 cups cream",
            "½ cup butter",
            "½ cup flour",
            "Salt and pepper"
        ],
        instructions: "Cook wild rice in broth with onion until tender. Make roux with butter and flour. Add cream gradually. Combine with rice mixture. Season to taste.",
        servings: "8"
    },

    // VEGETABLES
    {
        id: 1000,
        title: "Swiss Broccoli Bake",
        category: "vegetables",
        source: "",
        ingredients: [
            "2 packages frozen broccoli",
            "1 can cream of mushroom soup",
            "1 cup shredded Swiss cheese",
            "½ cup sour cream",
            "¼ cup chopped onion",
            "1 cup bread crumbs",
            "2 tablespoons butter, melted"
        ],
        instructions: "Cook broccoli and drain. Mix soup, cheese, sour cream, and onion. Add broccoli. Pour into casserole. Top with crumbs mixed with butter. Bake at 350°F for 30 minutes.",
        servings: "6-8"
    },
    {
        id: 1001,
        title: "Green Beans with Cashews",
        category: "vegetables",
        source: "",
        ingredients: [
            "1 lb fresh green beans",
            "2 tablespoons butter",
            "½ cup cashews",
            "Salt and pepper"
        ],
        instructions: "Cook green beans until tender-crisp. Drain. Sauté cashews in butter until golden. Toss with beans. Season to taste.",
        servings: "4-6"
    },

    // APPETIZERS
    {
        id: 1100,
        title: "Artichoke Dip",
        category: "appetizers",
        source: "Doris Miller",
        ingredients: [
            "1 can artichoke hearts, drained and chopped",
            "1 cup mayonnaise",
            "1 cup Parmesan cheese",
            "1 clove garlic, minced"
        ],
        instructions: "Mix all ingredients. Spread in baking dish. Bake at 350°F for 20-25 minutes until bubbly. Serve with crackers.",
        servings: "8-10"
    },
    {
        id: 1101,
        title: "Cheese Ball",
        category: "appetizers",
        source: "",
        ingredients: [
            "2 packages (8 oz each) cream cheese, softened",
            "2 cups shredded cheddar cheese",
            "1 tablespoon chopped pimiento",
            "1 tablespoon chopped green pepper",
            "1 tablespoon chopped onion",
            "2 teaspoons Worcestershire sauce",
            "1 cup chopped pecans"
        ],
        instructions: "Beat cream cheese until smooth. Mix in cheddar, pimiento, pepper, onion, and Worcestershire. Chill. Form into ball and roll in pecans.",
        servings: "10-12"
    },
    {
        id: 1102,
        title: "Spicy Chex Mix",
        category: "appetizers",
        source: "Deb Turner Trump",
        ingredients: [
            "3 cups Chex cereal",
            "2 cups pretzels",
            "2 cups mixed nuts",
            "6 tablespoons butter",
            "2 tablespoons Worcestershire sauce",
            "1 teaspoon seasoned salt",
            "½ teaspoon garlic powder"
        ],
        instructions: "Mix cereals, pretzels, and nuts. Melt butter with seasonings. Pour over cereal mixture. Bake at 250°F for 1 hour, stirring every 15 minutes.",
        servings: "Makes 7 cups"
    },

    // BEVERAGES
    {
        id: 1200,
        title: "Kahlua",
        category: "beverages",
        source: "Henrietta Leighton",
        ingredients: [
            "4 cups sugar",
            "2 oz instant coffee",
            "2 cups boiling water",
            "1 fifth vodka",
            "1 vanilla bean"
        ],
        instructions: "Dissolve sugar and coffee in boiling water. Cool. Add vodka and vanilla bean. Store in covered jar for 30 days.",
        servings: "Makes 1.5 quarts"
    },
    {
        id: 1201,
        title: "Piña Coladas",
        category: "beverages",
        source: "",
        ingredients: [
            "1 can cream of coconut",
            "1 can pineapple juice",
            "2 cups rum",
            "Ice cubes"
        ],
        instructions: "Blend all ingredients until smooth and frothy. Serve immediately.",
        servings: "6-8"
    },

    // BREAD
    {
        id: 1300,
        title: "Banana Bread",
        category: "bread",
        source: "Joanne Bechtold",
        ingredients: [
            "½ cup butter",
            "1 cup sugar",
            "2 eggs",
            "3 ripe bananas, mashed",
            "2 cups flour",
            "1 teaspoon baking soda",
            "½ teaspoon salt",
            "½ cup chopped nuts"
        ],
        instructions: "Cream butter and sugar. Beat in eggs and bananas. Mix dry ingredients and add to banana mixture. Stir in nuts. Pour into greased loaf pan. Bake at 350°F for 60 minutes.",
        servings: "1 loaf"
    },
    {
        id: 1301,
        title: "Zucchini Bread",
        category: "bread",
        source: "Gourmet Magazine",
        ingredients: [
            "3 eggs",
            "2 cups sugar",
            "1 cup oil",
            "2 cups grated zucchini",
            "3 cups flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "3 teaspoons cinnamon",
            "1 cup chopped nuts"
        ],
        instructions: "Beat eggs until light. Beat in sugar, oil, and zucchini. Combine dry ingredients and add to zucchini mixture. Stir in nuts. Pour into 2 greased loaf pans. Bake at 350°F for 60 minutes.",
        servings: "2 loaves"
    },
    {
        id: 1302,
        title: "Cranberry Bread",
        category: "bread",
        source: "Mary Lynch",
        ingredients: [
            "2 cups flour",
            "1 cup sugar",
            "1 ½ teaspoons baking powder",
            "½ teaspoon baking soda",
            "1 teaspoon salt",
            "¾ cup orange juice",
            "1 tablespoon grated orange rind",
            "2 tablespoons melted butter",
            "1 egg, beaten",
            "½ cup chopped nuts",
            "2 cups chopped cranberries"
        ],
        instructions: "Mix dry ingredients. Combine juice, rind, butter, and egg. Add to dry ingredients, mixing just until moistened. Fold in nuts and cranberries. Pour into greased loaf pan. Bake at 350°F for 60 minutes.",
        servings: "1 loaf"
    },
    {
        id: 1303,
        title: "Pumpkin Bread",
        category: "bread",
        source: "",
        ingredients: [
            "3 cups sugar",
            "1 cup oil",
            "4 eggs",
            "2 cups pumpkin",
            "3 ½ cups flour",
            "2 teaspoons baking soda",
            "1 teaspoon salt",
            "1 teaspoon cinnamon",
            "1 teaspoon nutmeg"
        ],
        instructions: "Mix sugar, oil, eggs, and pumpkin. Combine dry ingredients and add to pumpkin mixture. Pour into 2 greased loaf pans. Bake at 350°F for 60-70 minutes.",
        servings: "2 loaves"
    },

    // SWEETS & CANDY
    {
        id: 1400,
        title: "Mamie's Fudge",
        category: "sweets",
        source: "",
        ingredients: [
            "2 cups sugar",
            "¾ cup milk",
            "2 oz unsweetened chocolate",
            "2 tablespoons light corn syrup",
            "2 tablespoons butter",
            "1 teaspoon vanilla",
            "½ cup chopped nuts"
        ],
        instructions: "Cook sugar, milk, chocolate, and corn syrup to soft ball stage (236°F). Remove from heat. Add butter and vanilla. Beat until thick. Stir in nuts. Pour into greased pan.",
        servings: "Makes 1 lb"
    },
    {
        id: 1401,
        title: "Pecan Pralines",
        category: "sweets",
        source: "",
        ingredients: [
            "1 cup brown sugar",
            "1 cup white sugar",
            "½ cup milk",
            "2 tablespoons butter",
            "1 ½ cups pecans"
        ],
        instructions: "Cook sugars and milk to soft ball stage. Remove from heat. Add butter and pecans. Beat until creamy. Drop by spoonfuls onto waxed paper.",
        servings: "Makes 2 dozen"
    },
    {
        id: 1402,
        title: "Caramels",
        category: "sweets",
        source: "Louise Smullen",
        ingredients: [
            "1 cup butter",
            "2 ¼ cups brown sugar",
            "Dash of salt",
            "1 cup light corn syrup",
            "1 can sweetened condensed milk",
            "1 teaspoon vanilla"
        ],
        instructions: "Melt butter in heavy saucepan. Add sugar and salt. Mix well. Stir in corn syrup. Gradually add milk, stirring constantly. Cook to firm ball stage (245°F). Remove from heat. Stir in vanilla. Pour into buttered pan. Cool and cut into squares.",
        servings: "Makes 2 lbs"
    },

    // CASSEROLES
    {
        id: 1500,
        title: "Chicken Casserole",
        category: "casseroles",
        source: "Jane Sturmon",
        ingredients: [
            "3 cups cooked chicken, cubed",
            "2 cups cooked rice",
            "1 can cream of mushroom soup",
            "1 can cream of chicken soup",
            "1 cup sour cream",
            "1 package dry onion soup mix",
            "1 cup crushed crackers",
            "¼ cup melted butter"
        ],
        instructions: "Mix chicken, rice, soups, sour cream, and onion soup mix. Pour into greased casserole. Top with crackers mixed with butter. Bake at 350°F for 45 minutes.",
        servings: "8"
    },
    {
        id: 1501,
        title: "Broccoli Chicken Divan",
        category: "casseroles",
        source: "Virginia A.",
        ingredients: [
            "2 packages frozen broccoli",
            "3 cups cooked chicken, sliced",
            "2 cans cream of chicken soup",
            "1 cup mayonnaise",
            "1 teaspoon lemon juice",
            "½ cup shredded cheese",
            "½ cup bread crumbs",
            "2 tablespoons butter, melted"
        ],
        instructions: "Cook broccoli and drain. Arrange in casserole. Top with chicken. Mix soup, mayonnaise, and lemon juice. Pour over chicken. Sprinkle with cheese. Top with crumbs mixed with butter. Bake at 350°F for 30 minutes.",
        servings: "6-8"
    },
    {
        id: 1502,
        title: "Cheese Strata",
        category: "casseroles",
        source: "Emmy Williams",
        ingredients: [
            "12 slices bread, cubed",
            "2 cups shredded cheese",
            "4 eggs",
            "3 cups milk",
            "1 teaspoon salt",
            "1 teaspoon dry mustard"
        ],
        instructions: "Layer bread and cheese in greased casserole. Beat eggs with milk, salt, and mustard. Pour over bread. Refrigerate overnight. Bake at 350°F for 60 minutes.",
        servings: "8"
    },

    // CAKES
    {
        id: 1600,
        title: "Carrot Cake",
        category: "cake",
        source: "",
        ingredients: [
            "2 cups flour",
            "2 cups sugar",
            "2 teaspoons baking soda",
            "2 teaspoons cinnamon",
            "1 teaspoon salt",
            "1 ½ cups oil",
            "4 eggs",
            "3 cups grated carrots",
            "1 cup chopped nuts",
            "Cream cheese frosting"
        ],
        instructions: "Mix dry ingredients. Add oil and eggs. Beat well. Stir in carrots and nuts. Pour into greased pans. Bake at 350°F for 30-35 minutes. Cool and frost.",
        servings: "12-16"
    },
    {
        id: 1601,
        title: "Chocolate Sheet Cake",
        category: "cake",
        source: "Sibyl Strole",
        ingredients: [
            "2 cups flour",
            "2 cups sugar",
            "½ cup butter",
            "½ cup shortening",
            "1 cup water",
            "4 tablespoons cocoa",
            "2 eggs",
            "½ cup buttermilk",
            "1 teaspoon baking soda",
            "1 teaspoon vanilla",
            "Chocolate frosting"
        ],
        instructions: "Mix flour and sugar. Bring butter, shortening, water, and cocoa to boil. Pour over flour mixture. Add eggs, buttermilk, soda, and vanilla. Mix well. Pour into greased sheet pan. Bake at 400°F for 20 minutes. Frost while hot.",
        servings: "24"
    },
    {
        id: 1602,
        title: "Angel Food Cake",
        category: "cake",
        source: "Betty Crocker",
        ingredients: [
            "1 cup cake flour",
            "1 ½ cups sugar",
            "1 ½ cups egg whites (about 12)",
            "1 ½ teaspoons cream of tartar",
            "1 teaspoon vanilla",
            "¼ teaspoon salt"
        ],
        instructions: "Sift flour with ½ cup sugar 4 times. Beat egg whites with cream of tartar, vanilla, and salt until foamy. Gradually add remaining sugar. Beat until stiff. Fold in flour mixture. Pour into ungreased tube pan. Bake at 375°F for 35-40 minutes. Invert to cool.",
        servings: "12"
    },
    {
        id: 1603,
        title: "Pineapple Sheet Cake",
        category: "cake",
        source: "",
        ingredients: [
            "2 cups flour",
            "2 cups sugar",
            "2 eggs",
            "1 can crushed pineapple with juice",
            "2 teaspoons baking soda",
            "1 teaspoon vanilla",
            "Cream cheese frosting"
        ],
        instructions: "Mix all ingredients. Pour into greased sheet pan. Bake at 350°F for 30-35 minutes. Cool and frost.",
        servings: "24"
    },

    // COOKIES
    {
        id: 1700,
        title: "Chocolate Chip Cookies",
        category: "cookies",
        source: "Junior Welfare",
        ingredients: [
            "1 cup butter, softened",
            "¾ cup sugar",
            "¾ cup brown sugar",
            "2 eggs",
            "1 teaspoon vanilla",
            "2 ¼ cups flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "2 cups chocolate chips",
            "1 cup chopped nuts"
        ],
        instructions: "Cream butter and sugars. Beat in eggs and vanilla. Mix dry ingredients and add to butter mixture. Stir in chips and nuts. Drop by spoonfuls onto baking sheets. Bake at 375°F for 9-11 minutes.",
        servings: "Makes 5 dozen"
    },
    {
        id: 1701,
        title: "Molasses Cookies",
        category: "cookies",
        source: "Grandma Jurgens",
        ingredients: [
            "¾ cup shortening",
            "1 cup sugar",
            "1 egg",
            "¼ cup molasses",
            "2 cups flour",
            "2 teaspoons baking soda",
            "1 teaspoon cinnamon",
            "½ teaspoon ginger",
            "½ teaspoon cloves",
            "½ teaspoon salt",
            "Sugar for rolling"
        ],
        instructions: "Cream shortening and sugar. Beat in egg and molasses. Mix dry ingredients and add to molasses mixture. Chill dough. Form into balls and roll in sugar. Place on baking sheets. Bake at 375°F for 8-10 minutes.",
        servings: "Makes 4 dozen"
    },
    {
        id: 1702,
        title: "Lemon Bars",
        category: "cookies",
        source: "Betty Crocker",
        ingredients: [
            "1 cup flour",
            "½ cup butter",
            "¼ cup powdered sugar",
            "2 eggs",
            "1 cup sugar",
            "2 tablespoons lemon juice",
            "2 tablespoons flour",
            "½ teaspoon baking powder"
        ],
        instructions: "Mix flour, butter, and powdered sugar. Press into 9x13 pan. Bake at 350°F for 15 minutes. Beat eggs, sugar, lemon juice, flour, and baking powder. Pour over crust. Bake 25 minutes more. Cool and dust with powdered sugar.",
        servings: "Makes 24"
    },
    {
        id: 1703,
        title: "Peanut Butter Cookies",
        category: "cookies",
        source: "",
        ingredients: [
            "1 cup butter, softened",
            "1 cup peanut butter",
            "1 cup sugar",
            "1 cup brown sugar",
            "2 eggs",
            "2 ½ cups flour",
            "1 teaspoon baking soda",
            "½ teaspoon salt"
        ],
        instructions: "Cream butter, peanut butter, and sugars. Beat in eggs. Mix dry ingredients and add to peanut butter mixture. Roll into balls and flatten with fork. Bake at 375°F for 10-12 minutes.",
        servings: "Makes 5 dozen"
    },
    {
        id: 1704,
        title: "Oatmeal Cookies",
        category: "cookies",
        source: "Grandma Nickerson",
        ingredients: [
            "1 cup butter",
            "1 cup sugar",
            "1 cup brown sugar",
            "2 eggs",
            "1 teaspoon vanilla",
            "2 cups flour",
            "1 teaspoon baking soda",
            "1 teaspoon salt",
            "3 cups oats",
            "1 cup raisins"
        ],
        instructions: "Cream butter and sugars. Beat in eggs and vanilla. Mix dry ingredients and add to butter mixture. Stir in oats and raisins. Drop by spoonfuls onto baking sheets. Bake at 350°F for 10-12 minutes.",
        servings: "Makes 6 dozen"
    },

    // DESSERTS
    {
        id: 1800,
        title: "Apple Crisp",
        category: "desserts",
        source: "",
        ingredients: [
            "6 cups sliced apples",
            "1 cup sugar",
            "1 cup flour",
            "1 teaspoon cinnamon",
            "½ cup butter, softened"
        ],
        instructions: "Place apples in greased baking dish. Mix sugar, flour, and cinnamon. Cut in butter until crumbly. Sprinkle over apples. Bake at 350°F for 45 minutes.",
        servings: "8"
    },
    {
        id: 1801,
        title: "Cream Puffs",
        category: "desserts",
        source: "Mom",
        ingredients: [
            "1 cup water",
            "½ cup butter",
            "1 cup flour",
            "4 eggs",
            "Whipped cream or custard for filling"
        ],
        instructions: "Bring water and butter to boil. Add flour all at once, stirring vigorously. Cook until mixture leaves sides of pan. Remove from heat. Beat in eggs one at a time. Drop by spoonfuls onto baking sheets. Bake at 400°F for 30 minutes. Cool and fill.",
        servings: "Makes 12"
    },
    {
        id: 1802,
        title: "Brownies",
        category: "desserts",
        source: "",
        ingredients: [
            "½ cup butter",
            "2 oz unsweetened chocolate",
            "1 cup sugar",
            "2 eggs",
            "¾ cup flour",
            "½ teaspoon baking powder",
            "½ teaspoon salt",
            "1 teaspoon vanilla",
            "½ cup chopped nuts"
        ],
        instructions: "Melt butter and chocolate together. Remove from heat. Stir in sugar. Beat in eggs one at a time. Mix dry ingredients and add to chocolate mixture. Stir in vanilla and nuts. Pour into greased 9x9 pan. Bake at 350°F for 25-30 minutes.",
        servings: "Makes 16"
    },
    {
        id: 1803,
        title: "Ozark Pudding",
        category: "desserts",
        source: "",
        ingredients: [
            "1 egg",
            "¾ cup sugar",
            "2 tablespoons flour",
            "1 ¼ teaspoons baking powder",
            "Pinch of salt",
            "1 cup chopped apples",
            "½ cup chopped nuts",
            "1 teaspoon vanilla"
        ],
        instructions: "Beat egg until light. Beat in sugar. Mix flour, baking powder, and salt. Add to egg mixture. Fold in apples, nuts, and vanilla. Pour into greased pie pan. Bake at 350°F for 30 minutes. Serve warm with whipped cream.",
        servings: "6-8"
    },

    // FROZEN DESSERTS
    {
        id: 1900,
        title: "Ice Cream Vanilla",
        category: "frozen",
        source: "",
        ingredients: [
            "4 eggs",
            "2 ½ cups sugar",
            "6 cups cream",
            "1 quart milk",
            "2 tablespoons vanilla"
        ],
        instructions: "Beat eggs until light. Gradually beat in sugar. Add cream, milk, and vanilla. Pour into ice cream freezer and freeze according to manufacturer's directions.",
        servings: "Makes 1 gallon"
    },
    {
        id: 1901,
        title: "Frozen Lemon Dessert",
        category: "frozen",
        source: "",
        ingredients: [
            "1 cup vanilla wafer crumbs",
            "¼ cup melted butter",
            "3 eggs, separated",
            "½ cup sugar",
            "¼ cup lemon juice",
            "1 cup cream, whipped"
        ],
        instructions: "Mix crumbs with butter. Press into 9x9 pan, reserving some for topping. Beat egg yolks with ¼ cup sugar and lemon juice. Cook until thick. Cool. Beat egg whites with remaining sugar until stiff. Fold into lemon mixture with whipped cream. Pour into pan. Top with reserved crumbs. Freeze.",
        servings: "9"
    },
    {
        id: 1902,
        title: "Ice Cream Crunch Squares",
        category: "frozen",
        source: "Peg Rottman",
        ingredients: [
            "1 cup flour",
            "¼ cup brown sugar",
            "½ cup butter",
            "½ cup chopped nuts",
            "½ gallon ice cream, softened"
        ],
        instructions: "Mix flour, brown sugar, butter, and nuts. Spread in pan and bake at 350°F for 15 minutes, stirring often. Cool. Press half into 9x13 pan. Spread with ice cream. Top with remaining crumbs. Freeze.",
        servings: "12"
    },

    // EGGS & CHEESE
    {
        id: 2000,
        title: "Swiss Eggs",
        category: "eggs",
        source: "",
        ingredients: [
            "6 eggs",
            "½ cup cream",
            "1 cup shredded Swiss cheese",
            "Salt and pepper"
        ],
        instructions: "Beat eggs with cream. Pour into greased baking dish. Sprinkle with cheese. Bake at 350°F for 15-20 minutes until set.",
        servings: "4-6"
    },
    {
        id: 2001,
        title: "Brunch Eggs",
        category: "eggs",
        source: "",
        ingredients: [
            "1 dozen eggs",
            "1 can mushroom soup",
            "2 cups shredded cheese",
            "1 cup cooked ham, diced",
            "½ cup milk",
            "Salt and pepper"
        ],
        instructions: "Beat eggs with milk. Stir in soup, cheese, and ham. Season to taste. Pour into greased casserole. Bake at 350°F for 45 minutes.",
        servings: "8"
    },

    // FISH & SEAFOOD
    {
        id: 2100,
        title: "Curried Shrimp in Avocado Halves",
        category: "fish",
        source: "",
        ingredients: [
            "1 lb cooked shrimp",
            "½ cup mayonnaise",
            "1 teaspoon curry powder",
            "1 tablespoon lemon juice",
            "3 avocados, halved",
            "Lettuce"
        ],
        instructions: "Mix shrimp with mayonnaise, curry powder, and lemon juice. Arrange avocado halves on lettuce. Fill with shrimp mixture.",
        servings: "6"
    },
    {
        id: 2101,
        title: "Crabmeat Cobbler",
        category: "fish",
        source: "Pillsbury Grand Champion",
        ingredients: [
            "2 cans crabmeat",
            "1 can cream of mushroom soup",
            "½ cup mayonnaise",
            "1 cup shredded cheese",
            "1 cup Bisquick",
            "½ cup milk",
            "1 egg"
        ],
        instructions: "Mix crabmeat, soup, mayonnaise, and cheese. Pour into casserole. Mix Bisquick, milk, and egg. Spoon over crab mixture. Bake at 400°F for 25-30 minutes.",
        servings: "6"
    },
    {
        id: 2102,
        title: "Oven Fried Fish",
        category: "fish",
        source: "Texas Hill Cookbook",
        ingredients: [
            "2 lbs fish fillets",
            "½ cup milk",
            "1 cup crushed crackers",
            "¼ cup melted butter",
            "Salt and pepper"
        ],
        instructions: "Dip fish in milk, then in crackers. Place in greased baking dish. Drizzle with butter. Season to taste. Bake at 500°F for 10-12 minutes until fish flakes.",
        servings: "6"
    },

    // FROSTINGS
    {
        id: 2200,
        title: "Fluffy White Icing",
        category: "frostings",
        source: "Mom",
        ingredients: [
            "1 cup sugar",
            "⅓ cup water",
            "¼ teaspoon cream of tartar",
            "2 egg whites",
            "1 teaspoon vanilla"
        ],
        instructions: "Cook sugar, water, and cream of tartar to soft ball stage (240°F). Beat egg whites until stiff. Gradually pour hot syrup over whites, beating constantly. Beat until thick. Add vanilla.",
        servings: "Frosts 2-layer cake"
    },
    {
        id: 2201,
        title: "Fudge Icing",
        category: "frostings",
        source: "Betty Crocker",
        ingredients: [
            "3 oz unsweetened chocolate",
            "½ cup butter",
            "1 lb powdered sugar",
            "⅓ cup milk",
            "1 teaspoon vanilla"
        ],
        instructions: "Melt chocolate and butter together. Remove from heat. Blend in sugar alternately with milk. Add vanilla. Beat until smooth.",
        servings: "Frosts 2-layer cake"
    },
    {
        id: 2202,
        title: "Cream Cheese Frosting",
        category: "frostings",
        source: "",
        ingredients: [
            "8 oz cream cheese, softened",
            "½ cup butter, softened",
            "1 lb powdered sugar",
            "2 teaspoons vanilla"
        ],
        instructions: "Beat cream cheese and butter until smooth. Gradually add sugar, beating until fluffy. Add vanilla.",
        servings: "Frosts 2-layer cake"
    },

    // FRUITS
    {
        id: 2300,
        title: "Curried Baked Fruit",
        category: "fruits",
        source: "Joyce Flora",
        ingredients: [
            "1 can peach halves",
            "1 can pear halves",
            "1 can pineapple chunks",
            "½ cup butter",
            "¾ cup brown sugar",
            "2 teaspoons curry powder"
        ],
        instructions: "Drain fruits and arrange in baking dish. Melt butter with brown sugar and curry powder. Pour over fruit. Bake at 350°F for 30 minutes.",
        servings: "8"
    },
    {
        id: 2301,
        title: "Fried Apple Rings",
        category: "fruits",
        source: "",
        ingredients: [
            "4 apples, cored and sliced in rings",
            "¼ cup butter",
            "½ cup sugar",
            "½ teaspoon cinnamon"
        ],
        instructions: "Melt butter in skillet. Add apple rings. Sprinkle with sugar and cinnamon. Cook until tender, turning once.",
        servings: "4-6"
    }
];
