import cv2
import json
import math
# Load image
img = cv2.imread("floorplan.jpeg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 50, 150)

# Hough transform to detect lines
lines = cv2.HoughLinesP(edges, 1, math.pi / 180, threshold=150,
                        minLineLength=0, maxLineGap=80)


walls = []

for line in lines:
    x1, y1, x2, y2 = line[0]
    walls.append({"x1": int(x1), "y1": int(y1), "x2": int(x2), "y2": int(y2)})

# Save wall data to JSON
with open("walls.json", "w") as f:
    json.dump(walls, f)

print(f"Saved {len(walls)} wall segments to walls.json")
