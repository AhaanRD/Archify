import cv2
import json
import math

# Load image to proces
img = cv2.imread("floorplan.jpeg")
if img is None:
    raise FileNotFoundError(f"Could not load image: {image_path}")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 50, 150)

# Hough transform to detect lines
lines = cv2.HoughLinesP(edges, 1, math.pi / 180, threshold=100, minLineLength=10, maxLineGap=10)


wall_segments = []
#Store the wall coords into array
for line in lines:
    x1, y1, x2, y2 = line[0]
    wall_segments.append({"start_x": int(x1), "start_y": int(y1), "end_x": int(x2), "end_y": int(y2)})


# Save wall data to JSON
with open("walls.json", "w") as f:
    json.dump(wall_segments, f)

#Print once walls are done being stored
print(f"Saved {len(wall_segments)} wall segments to walls.json")
