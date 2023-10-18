import cv2
from scipy.spatial import Voronoi, cKDTree
import numpy as np


# # Load the image in color (default)
# image = cv2.imread("processed-assets/world-topo-bathy-5400x2700.png")

# # Colours rgb
# # dark blue rgb(1, 5, 20)
# # light blue rgb(26, 69, 126)
# # white rgb(240, 240, 240)
# # dark green rgb(24, 37, 10)
# # light green rgb(44, 67, 21)
# # brown rgb(201, 168, 125)

# import cv2
# import numpy as np


# # Function to calculate Euclidean distance
# def euclidean_distance(color1, color2):
#     return np.sqrt(np.sum((np.array(color1) - np.array(color2)) ** 2))


# # Your target colors (BGR)
# target_colors = [
#     [20, 5, 1],
#     [126, 69, 26],
#     [240, 240, 240],
#     [10, 37, 24],
#     [21, 67, 44],
#     [125, 168, 201]
# ]

# # Resize the image (for quicker processing)
# scale_percent = 30  # percentage of original size
# width = int(image.shape[1] * scale_percent / 100)
# height = int(image.shape[0] * scale_percent / 100)
# image = cv2.resize(image, (width, height))

# # Loop through each pixel in the image
# for x in range(image.shape[0]):
#     print(f"row {x} of {image.shape[0]}")
#     for y in range(image.shape[1]):
#         pixel_color = image[x, y]
#         # print(pixel_color)

#         # Calculate distances from this pixel color to each target color
#         distances = [
#             euclidean_distance(pixel_color, target) for target in target_colors
#         ]

#         # Find the closest target color
#         closest_color = target_colors[np.argmin(distances)]

#         # Update the pixel color
#         image[x, y] = closest_color

# # Display the image
# cv2.imshow("Image", image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

# Your target colors (in BGR format)
target_colors = np.array([
    [20, 5, 1],
    [126, 69, 26],
    [240, 240, 240],
    [10, 37, 24],
    [21, 67, 44],
    [125, 168, 201]
])

# Build a KDTree for faster query
tree = cKDTree(target_colors)

# Load the image
image = cv2.imread('processed-assets/world-topo-bathy-5400x2700.png')

# Resize the image (for quicker processing)
scale_percent = 50  # percentage of original size
width = int(image.shape[1] * scale_percent / 100)
height = int(image.shape[0] * scale_percent / 100)
image = cv2.resize(image, (width, height))

# Flatten the image array and find the closest target color for each pixel
flattened_image_array = image.reshape(-1, 3)
distances, indices = tree.query(flattened_image_array)

# Map the closest target color back to each pixel and reshape the image array
flattened_image_array = target_colors[indices]
image = flattened_image_array.reshape((height, width, 3)).astype(np.uint8)

# # Display the modified image
# cv2.imshow('Modified Image', image)
# cv2.waitKey(0)
# cv2.destroyAllWindows()

cv2.imwrite('processed-assets/draft.png', image)