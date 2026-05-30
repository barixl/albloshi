import re

with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update font import
content = re.sub(
    r"@import url\([^)]+\);", 
    "@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');", 
    content
)

# 2. Update CSS variables
content = re.sub(r"--font-heading:\s*'[^']+',\s*serif;", "--font-heading: 'Poppins', sans-serif;", content)
content = re.sub(r"--font-sans:\s*'[^']+',\s*sans-serif;", "--font-sans: 'Poppins', sans-serif;", content)

# 3. Update main text colors to true black
content = re.sub(r"--color-dark:\s*#[A-Fa-f0-9]{6};", "--color-dark: #000000;", content)
content = re.sub(r"--color-body:\s*#[A-Fa-f0-9]{6};", "--color-body: #000000;", content)

# 4. Replace specific light grays to pure white (these are used on dark backgrounds)
content = re.sub(r"color:\s*#(CBD5E1|94A3B8|E2E8F0)\s*;", "color: #FFFFFF;", content, flags=re.IGNORECASE)
content = re.sub(r"color:\s*rgba\(255,\s*255,\s*255,\s*0\.(82|75)\)\s*;", "color: #FFFFFF;", content)

# 5. Replace specific dark grays to pure black (these are used on light backgrounds)
content = re.sub(r"color:\s*#(64748B)\s*;", "color: #000000;", content, flags=re.IGNORECASE)

with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated styles.css successfully.")
