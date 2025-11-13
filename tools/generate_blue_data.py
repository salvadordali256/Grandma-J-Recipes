from zipfile import ZipFile
import xml.etree.ElementTree as ET
from collections import OrderedDict
import json

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}

SECTION_META = OrderedDict([
    ("I.) Meats", {"section": "Meats", "slug": "meats"}),
    ("II.) Oriental Cooking", {"section": "Oriental Cooking", "slug": "oriental"}),
    ("III.) Pasta", {"section": "Pasta", "slug": "pasta"}),
    ("IV.) Pastry", {"section": "Pastry & Pies", "slug": "pastry"}),
    ("V.) Preserves & Canning", {"section": "Preserves & Canning", "slug": "preserves"}),
    ("VI.) Poultry", {"section": "Poultry", "slug": "poultry"}),
    ("VII.) Salads & Dressings", {"section": "Salads & Dressings", "slug": "salads"}),
    ("VIII.) Sandwiches", {"section": "Sandwiches", "slug": "sandwiches"}),
    ("IX.) Sauces & Gravies", {"section": "Sauces & Gravies", "slug": "sauces"}),
    ("X.) Soups", {"section": "Soups", "slug": "soups"}),
    ("XI.) Vegetables", {"section": "Vegetables", "slug": "vegetables"}),
    ("XII.) Appetizers", {"section": "Appetizers", "slug": "appetizers"}),
    ("XII.) Beverages", {"section": "Beverages", "slug": "beverages"}),
    ("XIII.) Bread", {"section": "Bread", "slug": "bread"}),
    ("XIV.) Name torn off-calling this section \"Sweets\"", {"section": "Sweets & Candy", "slug": "sweets"}),
    ("XV.) Casseroles", {"section": "Casseroles", "slug": "casseroles"}),
    ("XVI.) Cake", {"section": "Cakes", "slug": "cake"}),
    ("XVII.) Cookies", {"section": "Cookies", "slug": "cookies"}),
    ("XVIII.) Desserts", {"section": "Desserts", "slug": "desserts"}),
    ("XVIX.) Desserts Frozen", {"section": "Frozen Desserts", "slug": "frozen"}),
    ("XX.) Diet Dishes", {"section": "Diet Dishes", "slug": "diet"}),
    ("XXI.) Eggs & Cheese", {"section": "Eggs & Cheese", "slug": "eggs"}),
    ("XXII.) Fish", {"section": "Fish & Seafood", "slug": "fish"}),
    ("XXIII.) Frostings", {"section": "Frostings", "slug": "frostings"}),
    ("XXIV.) Fruits", {"section": "Fruits", "slug": "fruits"}),
])

REPLACEMENTS = {
    "\u2019": "'",
    "\u2018": "'",
    "\u201c": '"',
    "\u201d": '"',
    "\u2014": "-",
    "\u2013": "-",
    "\u2010": "-",
    "\u00bd": "1/2",
    "\u00bc": "1/4",
    "\u00be": "3/4",
    "\u00b0": " deg",
    "\u00d7": "x",
    "\u2026": "...",
}


def clean(text: str) -> str:
    text = text.strip()
    for old, new in REPLACEMENTS.items():
        text = text.replace(old, new)
    text = " ".join(text.split())
    return text


def extract():
    with ZipFile("Grandma Pauline.docx") as zf:
        xml = zf.read("word/document.xml")

    root = ET.fromstring(xml)
    body = root.find("w:body", NS)
    paragraphs = body.findall("w:p", NS)
    key_attr = "{%s}val" % NS["w"]

    sections = OrderedDict((heading, {"recipes": []}) for heading in SECTION_META)
    current_section = None
    current_recipe = None

    for p in paragraphs:
        ps = p.find("w:pPr", NS)
        style = None
        if ps is not None:
            style_el = ps.find("w:pStyle", NS)
            if style_el is not None:
                style = style_el.get(key_attr)
        raw_text = "".join((t.text or "") for t in p.findall(".//w:t", NS))
        text = clean(raw_text)
        if not text:
            continue

        if style == "Heading1" and text in SECTION_META:
            if current_section is not None and current_recipe is not None:
                sections[current_section]["recipes"].append(current_recipe)
                current_recipe = None
            current_section = text
            current_recipe = None
            continue

        if current_section is None:
            continue

        if style == "Heading2":
            if current_recipe is not None:
                sections[current_section]["recipes"].append(current_recipe)
            current_recipe = {"title": text, "content": []}
            continue

        if current_recipe is not None:
            current_recipe["content"].append(text)

    if current_recipe is not None and current_section is not None:
        sections[current_section]["recipes"].append(current_recipe)

    output = []
    for heading, meta in SECTION_META.items():
        recipes = sections.get(heading, {}).get("recipes", [])
        output.append(
            {
                "heading": heading,
                "section": meta["section"],
                "slug": meta["slug"],
                "count": len(recipes),
                "recipes": recipes,
            }
        )

    js_content = (
        "const blueRecipes = "
        + json.dumps(output, indent=4, ensure_ascii=True)
        + ";\n\nif (typeof window !== 'undefined') { window.blueRecipes = blueRecipes; }\n\n"
          "if (typeof module !== 'undefined') { module.exports = { blueRecipes }; }\n"
    )

    with open("blue-recipes-data.js", "w", encoding="utf-8") as fh:
        fh.write(js_content)


if __name__ == "__main__":
    extract()
