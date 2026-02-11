from PIL import Image

# Load the JPG logo
jpg_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\Final_Logo_to_be_used_across\logo_210.jpg'
img = Image.open(jpg_path)

print(f"Original size: {img.size}")
print(f"Format: {img.format}")

# Convert to PNG and save to images folder
png_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\images\Final_Logo.png'
img.save(png_path, 'PNG')
print(f"Saved PNG to: {png_path}")

# Also update app icons
icon_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\images\icon.png'
splash_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\images\splash-icon.png'

img.save(icon_path, 'PNG')
img.save(splash_path, 'PNG')
print("Updated app icons")
