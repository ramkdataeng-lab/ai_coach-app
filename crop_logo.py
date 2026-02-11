from PIL import Image

# Load the image
img_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\Final_Logo_to_be_used_across\Nirvan_App_Logo.png'
img = Image.open(img_path)

print(f"Original size: {img.size}")

# Manually crop the white space
# Based on visual inspection, crop about 20 pixels from each side
crop_amount = 20
width, height = img.size

# Crop box: (left, top, right, bottom)
crop_box = (crop_amount, crop_amount, width - crop_amount, height - crop_amount)

cropped = img.crop(crop_box)
print(f"Cropped size: {cropped.size}")

# Save the cropped version
output_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\Final_Logo_to_be_used_across\Nirvan_App_Logo_Cropped.png'
cropped.save(output_path)
print(f"Saved to: {output_path}")

# Update app icons
icon_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\images\icon.png'
splash_path = r'C:\Projects\AA\Hackathon\RevenueCat\better-creating-ai\assets\images\splash-icon.png'

cropped.save(icon_path)
cropped.save(splash_path)
print("Updated app icons")
