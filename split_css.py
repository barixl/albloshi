import os
import re

# Read styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# --- 1. Global Centering Modifications ---

# Center .section-title
content = re.sub(
    r"(\.section-title\s*\{[^}]*?)display:\s*inline-block;([^}]*?\})",
    r"\1display: block;\n    text-align: center;\2",
    content,
    flags=re.DOTALL
)

# Center the pseudo-element underline for .section-title
content = re.sub(
    r"(h2\.section-title::after\s*\{[^}]*?)left:\s*0;([^}]*?\})",
    r"\1left: 50%;\n    transform: translateX(-50%);\2",
    content,
    flags=re.DOTALL
)

# Center .focus-title
content = re.sub(
    r"(\.focus-title\s*\{[^}]*?)margin-bottom:\s*1rem;\s*\}",
    r"\1margin-bottom: 1rem;\n    text-align: center;\n    display: block;\n}",
    content,
    flags=re.DOTALL
)

# Center the header wrapper for Intelligent chemicals (so the subtitle centers too)
content = re.sub(
    r"(\.intelligent-focus-header\s*\{[^}]*?)margin-bottom:\s*3rem;\s*\}",
    r"\1margin-bottom: 3rem;\n    text-align: center;\n}",
    content,
    flags=re.DOTALL
)

# Center paragraphs inside intelligent-focus-header if any (like focus-desc)
# .focus-desc has max-width: 450px, to center it we need margin: 0 auto;
content = re.sub(
    r"(\.focus-desc\s*\{[^}]*?max-width:\s*450px;)",
    r"\1\n    margin-left: auto;\n    margin-right: auto;",
    content,
    flags=re.DOTALL
)


# --- 2. Splitting the CSS ---

# Find all section headers
# The headers look like:
# /* ==========================================================================
#    SECTION NAME
#    ========================================================================== */

sections_pattern = re.compile(
    r"(/\* ==========================================================================\n\s*(.*?)\s*\n\s*========================================================================== \*/\n)(.*?)(?=(/\* ==========================================================================)|$)",
    re.DOTALL
)

matches = sections_pattern.findall(content)

os.makedirs('css', exist_ok=True)

# Keep track of generated files
generated_files = []

# Mapping heuristic to filenames
def get_filename(name):
    name = name.lower()
    if 'variables' in name: return 'variables.css'
    if 'reset' in name: return 'base.css'
    if 'utility' in name: return 'utilities.css'
    if 'top bar' in name or 'navbar' in name: return 'header.css'
    if 'hero' in name: return 'hero.css'
    if 'trust features' in name: return 'features.css'
    if 'about us' in name: return 'about.css'
    if 'statistics' in name: return 'statistics.css'
    if 'business segments' in name: return 'segments.css'
    if 'industries' in name: return 'industries.css'
    if 'tellabs' in name: return 'partners.css'
    if 'product showcase' in name: return 'products.css'
    if 'why choose us' in name: return 'why-choose-us.css'
    if 'distribution network' in name: return 'network.css'
    if 'testimonials' in name or 'reviews' in name: return 'testimonials.css'
    if 'customers' in name: return 'customers.css'
    if 'faq' in name: return 'faq.css'
    if 'contact' in name: return 'contact.css'
    if 'footer' in name: return 'footer.css'
    if 'intelligent chemicals' in name: return 'intelligent-chemicals.css'
    if 'mobile drawer' in name or 'responsiveness' in name and 'blog' not in name: return 'responsive.css'
    if 'blog styles' in name or 'corporate blog' in name: return 'blog.css'
    if 'blog cta' in name: return 'blog-cta.css'
    if 'blog responsiveness' in name: return 'blog-responsive.css'
    if 'mobile footer bar' in name: return 'mobile-footer-bar.css'
    
    # Fallback cleanup
    clean_name = re.sub(r'[^a-z0-9]+', '-', name.strip()).strip('-')
    return f"{clean_name}.css"

file_contents = {}

for match in matches:
    full_header = match[0]
    section_name = match[1]
    css_code = match[2]
    
    fname = get_filename(section_name)
    
    if fname not in file_contents:
        file_contents[fname] = ""
    
    file_contents[fname] += full_header + css_code

# Write files to css directory
for fname, code in file_contents.items():
    with open(f"css/{fname}", "w", encoding='utf-8') as f:
        f.write(code.strip() + "\n\n")
    if fname not in generated_files:
        generated_files.append(fname)

# Ensure base imports are first
imports_order = ['variables.css', 'base.css', 'utilities.css', 'header.css', 'footer.css']
ordered_files = []
for f in imports_order:
    if f in generated_files:
        ordered_files.append(f)
        generated_files.remove(f)

ordered_files.extend(generated_files)

# Move responsive.css to the very end
if 'responsive.css' in ordered_files:
    ordered_files.remove('responsive.css')
    ordered_files.append('responsive.css')

# Move blog-responsive.css to the very end
if 'blog-responsive.css' in ordered_files:
    ordered_files.remove('blog-responsive.css')
    ordered_files.append('blog-responsive.css')


# Rewrite styles.css
with open('styles.css', 'w', encoding='utf-8') as f:
    # Keep the initial font import if any
    font_import = re.search(r"@import url\([^)]+\);", content)
    if font_import:
        f.write(font_import.group(0) + "\n\n")
    
    for fname in ordered_files:
        f.write(f"@import url('css/{fname}');\n")

print(f"Successfully split styles.css into {len(ordered_files)} files in css/ directory.")
